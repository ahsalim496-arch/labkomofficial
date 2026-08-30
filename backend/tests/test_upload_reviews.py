"""Phase 5 tests: Emergent Object Storage gallery upload + public reviews CRUD."""
import io
import os
import struct
import zlib

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
ADMIN_KEY = dotenv_values("/app/backend/.env").get("ADMIN_KEY")


def make_png(width=4, height=4) -> bytes:
    """Build a minimal valid PNG in-memory."""
    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    raw = b"".join(b"\x00" + b"\xff\x00\x00" * width for _ in range(height))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    return s


@pytest.fixture(scope="session")
def admin_headers():
    assert ADMIN_KEY, "ADMIN_KEY not present in /app/backend/.env"
    return {"X-Admin-Key": ADMIN_KEY}


# ============ GALLERY UPLOAD (Emergent Object Storage) ============
class TestGalleryUpload:
    created_ids = []
    uploaded_url = None

    def test_upload_requires_admin_key(self, api):
        files = {"file": ("TEST_noauth.png", make_png(), "image/png")}
        r = api.post(f"{BASE_URL}/api/admin/gallery/upload?title=TEST_NoAuth", files=files)
        assert r.status_code == 401, r.text
        assert "detail" in r.json()

    def test_upload_rejects_unsupported_extension(self, api):
        files = {"file": ("TEST_bad.txt", b"hello world", "text/plain")}
        r = api.post(
            f"{BASE_URL}/api/admin/gallery/upload?key={ADMIN_KEY}&title=TEST_Bad&category=TEST",
            files=files,
        )
        assert r.status_code == 400, r.text
        assert "didukung" in r.json()["detail"]

    def test_upload_png_success_and_persistence(self, api, admin_headers):
        payload = make_png(8, 8)
        files = {"file": ("TEST_upload.png", payload, "image/png")}
        r = api.post(
            f"{BASE_URL}/api/admin/gallery/upload?title=TEST_Upload_Foto&category=TEST_Kategori&description=TEST_desc",
            files=files,
            headers=admin_headers,
            timeout=120,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["type"] == "foto"
        assert data["title"] == "TEST_Upload_Foto"
        assert data["category"] == "TEST_Kategori"
        assert data["description"] == "TEST_desc"
        assert isinstance(data["id"], str) and len(data["id"]) > 10
        assert data["url"].startswith("/api/files/labkom-official/gallery/")
        assert data["url"].endswith(".png")
        TestGalleryUpload.created_ids.append(data["id"])
        TestGalleryUpload.uploaded_url = data["url"]

        # verify in public gallery listing (persisted with storage_path, no _id)
        g = api.get(f"{BASE_URL}/api/gallery?type=foto")
        assert g.status_code == 200
        item = next((i for i in g.json() if i["id"] == data["id"]), None)
        assert item is not None, "uploaded item not returned by GET /api/gallery"
        assert "_id" not in item
        assert item["storage_path"] == data["url"].replace("/api/files/", "")
        assert item["original_filename"] == "TEST_upload.png"
        assert item["size"] > 0

    def test_uploaded_file_is_publicly_served(self, api):
        assert TestGalleryUpload.uploaded_url, "upload test must run first"
        r = api.get(f"{BASE_URL}{TestGalleryUpload.uploaded_url}", timeout=60)
        assert r.status_code == 200, r.text
        assert r.headers["Content-Type"].startswith("image/png")
        assert r.content[:8] == b"\x89PNG\r\n\x1a\n"
        assert len(r.content) > 0

    def test_upload_jpg_extension_supported(self, api, admin_headers):
        files = {"file": ("TEST_photo.JPG", make_png(), "image/jpeg")}
        r = api.post(
            f"{BASE_URL}/api/admin/gallery/upload?title=TEST_Upload_Jpg",
            files=files,
            headers=admin_headers,
            timeout=120,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["url"].endswith(".jpg")
        assert data["category"] == "Kegiatan Kursus"  # default
        TestGalleryUpload.created_ids.append(data["id"])
        served = api.get(f"{BASE_URL}{data['url']}", timeout=60)
        assert served.status_code == 200
        assert served.headers["Content-Type"].startswith("image/jpeg")

    def test_upload_missing_title_returns_422(self, api, admin_headers):
        files = {"file": ("TEST_notitle.png", make_png(), "image/png")}
        r = api.post(f"{BASE_URL}/api/admin/gallery/upload", files=files, headers=admin_headers)
        assert r.status_code == 422, r.text

    def test_upload_oversize_returns_413(self, api, admin_headers):
        big = make_png() + b"\x00" * (8 * 1024 * 1024 + 10)
        files = {"file": ("TEST_big.png", io.BytesIO(big), "image/png")}
        r = api.post(
            f"{BASE_URL}/api/admin/gallery/upload?title=TEST_Big",
            files=files,
            headers=admin_headers,
            timeout=180,
        )
        assert r.status_code == 413, f"expected 413 got {r.status_code}: {r.text[:300]}"

    def test_serve_unknown_file_returns_404(self, api):
        r = api.get(f"{BASE_URL}/api/files/labkom-official/gallery/does-not-exist.png")
        assert r.status_code == 404

    def test_cleanup_uploaded_items(self, api, admin_headers):
        assert TestGalleryUpload.created_ids, "nothing uploaded"
        for item_id in TestGalleryUpload.created_ids:
            d = api.delete(f"{BASE_URL}/api/admin/gallery/{item_id}", headers=admin_headers)
            assert d.status_code == 200, d.text
            assert d.json()["deleted"] == item_id
        g = api.get(f"{BASE_URL}/api/gallery")
        remaining = [i["id"] for i in g.json()]
        for item_id in TestGalleryUpload.created_ids:
            assert item_id not in remaining


# ============ REVIEWS ============
class TestReviews:
    ids = []

    @pytest.fixture(autouse=True, scope="class")
    def cleanup(self, admin_headers):
        yield
        s = requests.Session()
        for rid in TestReviews.ids:
            s.delete(f"{BASE_URL}/api/admin/reviews/{rid}", headers=admin_headers)

    def test_create_review_defaults_to_approved(self, api):
        payload = {
            "name": "TEST_Alumni",
            "course_name": "TEST_Kursus Excel",
            "rating": 5,
            "comment": "TEST komentar ulasan yang cukup panjang untuk validasi.",
            "role": "TEST Alumni",
        }
        r = api.post(f"{BASE_URL}/api/reviews", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["approved"] is True
        assert data["rating"] == 5
        assert data["name"] == payload["name"]
        assert data["course_name"] == payload["course_name"]
        assert data["comment"] == payload["comment"]
        assert "submitted_at" in data
        TestReviews.ids.append(data["id"])

        # GET public verify persistence
        pub = api.get(f"{BASE_URL}/api/reviews?min_rating=5")
        assert pub.status_code == 200
        found = next((i for i in pub.json() if i["id"] == data["id"]), None)
        assert found is not None
        assert "_id" not in found

    @pytest.mark.parametrize(
        "field,value",
        [
            ("rating", 0),
            ("rating", 6),
            ("comment", "short"),
            ("name", "A"),
            ("course_name", "X"),
        ],
    )
    def test_create_review_validation(self, api, field, value):
        payload = {
            "name": "TEST_Valid Name",
            "course_name": "TEST_Kursus",
            "rating": 4,
            "comment": "TEST komentar valid yang panjang.",
            "role": "",
        }
        payload[field] = value
        r = api.post(f"{BASE_URL}/api/reviews", json=payload)
        assert r.status_code == 422, f"{field}={value} -> {r.status_code}"

    def test_min_rating_filter_excludes_lower_rating(self, api):
        low = {
            "name": "TEST_LowRater",
            "course_name": "TEST_Kursus Python",
            "rating": 3,
            "comment": "TEST ulasan dengan rating rendah untuk filter.",
            "role": "",
        }
        r = api.post(f"{BASE_URL}/api/reviews", json=low)
        assert r.status_code == 200
        low_id = r.json()["id"]
        TestReviews.ids.append(low_id)

        five = api.get(f"{BASE_URL}/api/reviews?min_rating=5").json()
        assert all(i["rating"] >= 5 for i in five)
        assert low_id not in [i["id"] for i in five]

        three = api.get(f"{BASE_URL}/api/reviews?min_rating=3").json()
        assert low_id in [i["id"] for i in three]
        assert all(i["approved"] is True for i in three)

    def test_reviews_limit_param_validation(self, api):
        assert api.get(f"{BASE_URL}/api/reviews?limit=0").status_code == 422
        assert api.get(f"{BASE_URL}/api/reviews?min_rating=9").status_code == 422
        ok = api.get(f"{BASE_URL}/api/reviews?limit=1&min_rating=1")
        assert ok.status_code == 200
        assert len(ok.json()) <= 1

    def test_admin_list_requires_key(self, api, admin_headers):
        assert api.get(f"{BASE_URL}/api/admin/reviews").status_code == 401
        r = api.get(f"{BASE_URL}/api/admin/reviews", headers=admin_headers)
        assert r.status_code == 200
        ids = [i["id"] for i in r.json()]
        for rid in TestReviews.ids:
            assert rid in ids, "admin list should include all reviews"

    def test_patch_hide_removes_from_public(self, api, admin_headers):
        payload = {
            "name": "TEST_HideMe",
            "course_name": "TEST_Kursus Desain",
            "rating": 5,
            "comment": "TEST ulasan yang akan disembunyikan oleh admin.",
            "role": "",
        }
        rid = api.post(f"{BASE_URL}/api/reviews", json=payload).json()["id"]
        TestReviews.ids.append(rid)
        assert rid in [i["id"] for i in api.get(f"{BASE_URL}/api/reviews?min_rating=5").json()]

        p = api.patch(f"{BASE_URL}/api/admin/reviews/{rid}", json={"approved": False}, headers=admin_headers)
        assert p.status_code == 200, p.text
        assert p.json()["approved"] is False
        assert rid not in [i["id"] for i in api.get(f"{BASE_URL}/api/reviews?min_rating=5").json()]

        admin_item = next(i for i in api.get(f"{BASE_URL}/api/admin/reviews", headers=admin_headers).json() if i["id"] == rid)
        assert admin_item["approved"] is False

        # re-approve
        p2 = api.patch(f"{BASE_URL}/api/admin/reviews/{rid}", json={"approved": True}, headers=admin_headers)
        assert p2.status_code == 200
        assert rid in [i["id"] for i in api.get(f"{BASE_URL}/api/reviews?min_rating=5").json()]

    def test_patch_empty_payload_400(self, api, admin_headers):
        rid = TestReviews.ids[0]
        r = api.patch(f"{BASE_URL}/api/admin/reviews/{rid}", json={}, headers=admin_headers)
        assert r.status_code == 400, r.text

    def test_patch_unknown_id_404(self, api, admin_headers):
        r = api.patch(f"{BASE_URL}/api/admin/reviews/nope-123", json={"approved": False}, headers=admin_headers)
        assert r.status_code == 404

    def test_delete_review_then_404(self, api, admin_headers):
        payload = {
            "name": "TEST_DeleteMe",
            "course_name": "TEST_Kursus Hapus",
            "rating": 5,
            "comment": "TEST ulasan yang akan dihapus oleh admin nanti.",
            "role": "",
        }
        rid = api.post(f"{BASE_URL}/api/reviews", json=payload).json()["id"]
        d = api.delete(f"{BASE_URL}/api/admin/reviews/{rid}", headers=admin_headers)
        assert d.status_code == 200, d.text
        assert d.json()["deleted"] == rid
        assert api.delete(f"{BASE_URL}/api/admin/reviews/{rid}", headers=admin_headers).status_code == 404
        assert rid not in [i["id"] for i in api.get(f"{BASE_URL}/api/admin/reviews", headers=admin_headers).json()]


# ============ REGRESSION ============
class TestRegression:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200 and "aktif" in r.json()["message"]

    def test_registration_and_contact(self, api):
        reg = api.post(f"{BASE_URL}/api/registrations", json={
            "name": "TEST_Regresi", "whatsapp": "08123456789",
            "course_name": "TEST_Kursus", "email": "test_regresi@example.com", "note": "TEST"
        }, timeout=90)
        assert reg.status_code == 200, reg.text
        assert reg.json()["name"] == "TEST_Regresi"

        c = api.post(f"{BASE_URL}/api/contacts", json={
            "name": "TEST_Kontak", "message": "TEST pesan kontak", "email": "test_kontak@example.com"
        })
        assert c.status_code == 200, c.text
        assert c.json()["message"] == "TEST pesan kontak"

    def test_admin_stats_and_verify(self, api, admin_headers):
        v = api.get(f"{BASE_URL}/api/admin/verify", headers=admin_headers)
        assert v.status_code == 200 and v.json()["ok"] is True
        assert api.get(f"{BASE_URL}/api/admin/verify").status_code == 401
        s = api.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
        assert s.status_code == 200
        for k in ("registrations", "contacts", "gallery"):
            assert isinstance(s.json()[k], int)

    def test_admin_date_filter(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/admin/registrations?from=2020-01-01&to=2030-12-31", headers=admin_headers)
        assert r.status_code == 200 and isinstance(r.json(), list)
        empty = api.get(f"{BASE_URL}/api/admin/registrations?from=2019-01-01&to=2019-01-02", headers=admin_headers)
        assert empty.status_code == 200 and empty.json() == []

    def test_material_pdf_download(self, api):
        r = api.get(f"{BASE_URL}/api/materials/1/download")
        assert r.status_code == 200
        assert r.headers["Content-Type"] == "application/pdf"
        assert r.content[:4] == b"%PDF"
        assert api.get(f"{BASE_URL}/api/materials/99/download").status_code == 404
