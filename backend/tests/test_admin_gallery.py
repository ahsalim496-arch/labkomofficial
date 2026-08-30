"""Tests for LABKOM admin endpoints (auth, registrations, contacts, stats) and gallery CRUD."""
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
ADMIN_KEY = backend_env.get("ADMIN_KEY")
if not ADMIN_KEY:
    raise RuntimeError("ADMIN_KEY missing from /app/backend/.env")

ADMIN_GET_ENDPOINTS = [
    "/api/admin/verify",
    "/api/admin/registrations",
    "/api/admin/contacts",
    "/api/admin/stats",
]


# --- admin auth: valid key via query param and header ---
@pytest.mark.parametrize("endpoint", ADMIN_GET_ENDPOINTS)
def test_admin_get_with_valid_query_key(endpoint):
    response = requests.get(f"{BASE_URL}{endpoint}?key={ADMIN_KEY}", timeout=30)
    assert response.status_code == 200, response.text


@pytest.mark.parametrize("endpoint", ADMIN_GET_ENDPOINTS)
def test_admin_get_with_valid_header_key(endpoint):
    response = requests.get(f"{BASE_URL}{endpoint}", headers={"X-Admin-Key": ADMIN_KEY}, timeout=30)
    assert response.status_code == 200, response.text


@pytest.mark.parametrize("endpoint", ADMIN_GET_ENDPOINTS)
def test_admin_get_rejects_wrong_key(endpoint):
    response = requests.get(f"{BASE_URL}{endpoint}?key=wrong-key", timeout=30)
    assert response.status_code == 401, response.text
    assert "detail" in response.json()


@pytest.mark.parametrize("endpoint", ADMIN_GET_ENDPOINTS)
def test_admin_get_rejects_missing_key(endpoint):
    response = requests.get(f"{BASE_URL}{endpoint}", timeout=30)
    assert response.status_code == 401, response.text


def test_admin_verify_payload():
    response = requests.get(f"{BASE_URL}/api/admin/verify?key={ADMIN_KEY}", timeout=30)
    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_admin_gallery_write_endpoints_require_key():
    payload = {"title": "TEST_unauth", "type": "foto", "url": "https://example.com/a.jpg"}
    post = requests.post(f"{BASE_URL}/api/admin/gallery", json=payload, timeout=30)
    assert post.status_code == 401, post.text
    delete = requests.delete(f"{BASE_URL}/api/admin/gallery/{uuid.uuid4()}", timeout=30)
    assert delete.status_code == 401, delete.text


# --- admin data listing: shape, no _id leaks, date filtering ---
class TestAdminListings:
    def test_registrations_list_shape_and_no_object_id(self):
        suffix = uuid.uuid4().hex[:8]
        created = requests.post(
            f"{BASE_URL}/api/registrations",
            json={"name": f"TEST_{suffix}", "whatsapp": "081234567890", "course_name": "TEST Admin List"},
            timeout=60,
        )
        assert created.status_code == 200, created.text
        new_id = created.json()["id"]

        response = requests.get(f"{BASE_URL}/api/admin/registrations?key={ADMIN_KEY}", timeout=30)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) and data
        assert all("_id" not in row for row in data)
        row = next((r for r in data if r["id"] == new_id), None)
        assert row is not None, "new registration missing from admin listing"
        for field in ("name", "whatsapp", "course_name", "submitted_at", "notification_sent"):
            assert field in row
        # sorted descending by submitted_at
        stamps = [r["submitted_at"] for r in data]
        assert stamps == sorted(stamps, reverse=True)

    def test_contacts_list_shape_and_no_object_id(self):
        suffix = uuid.uuid4().hex[:8]
        created = requests.post(
            f"{BASE_URL}/api/contacts",
            json={"name": f"TEST_{suffix}", "message": "TEST admin listing"},
            timeout=30,
        )
        assert created.status_code == 200, created.text
        new_id = created.json()["id"]

        response = requests.get(f"{BASE_URL}/api/admin/contacts", headers={"X-Admin-Key": ADMIN_KEY}, timeout=30)
        assert response.status_code == 200
        data = response.json()
        assert all("_id" not in row for row in data)
        row = next((r for r in data if r["id"] == new_id), None)
        assert row is not None
        assert row["message"] == "TEST admin listing"

    def test_date_filter_includes_today_and_excludes_past_window(self):
        today = datetime.now(timezone.utc).date()
        created = requests.post(
            f"{BASE_URL}/api/registrations",
            json={"name": f"TEST_{uuid.uuid4().hex[:8]}", "whatsapp": "081234567890", "course_name": "TEST Filter"},
            timeout=60,
        )
        assert created.status_code == 200, created.text
        new_id = created.json()["id"]

        inclusive = requests.get(
            f"{BASE_URL}/api/admin/registrations?key={ADMIN_KEY}&from={today}&to={today}", timeout=30
        )
        assert inclusive.status_code == 200
        assert any(r["id"] == new_id for r in inclusive.json()), "today's record excluded by same-day filter"

        past = today - timedelta(days=30)
        past_end = today - timedelta(days=20)
        exclusive = requests.get(
            f"{BASE_URL}/api/admin/registrations?key={ADMIN_KEY}&from={past}&to={past_end}", timeout=30
        )
        assert exclusive.status_code == 200
        assert all(r["id"] != new_id for r in exclusive.json()), "record leaked into past-only date window"

    def test_stats_counts_are_ints_and_match_listings(self):
        response = requests.get(f"{BASE_URL}/api/admin/stats?key={ADMIN_KEY}", timeout=30)
        assert response.status_code == 200
        data = response.json()
        for field in ("registrations", "contacts", "gallery"):
            assert field in data and isinstance(data[field], int) and data[field] >= 0

        gallery = requests.get(f"{BASE_URL}/api/gallery", timeout=30)
        assert gallery.status_code == 200
        assert len(gallery.json()) == data["gallery"]


# --- gallery CRUD ---
class TestGalleryCRUD:
    created_ids = []

    @classmethod
    def teardown_class(cls):
        for item_id in cls.created_ids:
            requests.delete(f"{BASE_URL}/api/admin/gallery/{item_id}?key={ADMIN_KEY}", timeout=30)

    def test_create_video_item_and_verify_public_read(self):
        payload = {
            "title": f"TEST_Video_{uuid.uuid4().hex[:6]}",
            "type": "video",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "category": "TEST",
            "description": "TEST video item",
        }
        response = requests.post(f"{BASE_URL}/api/admin/gallery?key={ADMIN_KEY}", json=payload, timeout=30)
        assert response.status_code == 200, response.text
        body = response.json()
        self.__class__.created_ids.append(body["id"])
        assert isinstance(body["id"], str) and body["id"]
        assert body["title"] == payload["title"]
        assert body["type"] == "video"
        assert body["url"] == payload["url"]
        assert body["category"] == "TEST"
        assert "created_at" in body

        public = requests.get(f"{BASE_URL}/api/gallery", timeout=30)
        assert public.status_code == 200
        rows = public.json()
        assert all("_id" not in r for r in rows)
        row = next((r for r in rows if r["id"] == body["id"]), None)
        assert row is not None, "created item not returned by public GET /api/gallery"
        assert row["title"] == payload["title"]

    def test_create_photo_and_type_filter(self):
        photo = {
            "title": f"TEST_Foto_{uuid.uuid4().hex[:6]}",
            "type": "foto",
            "url": "https://images.unsplash.com/photo-1517245386807-bb43389ff70a",
            "category": "TEST",
        }
        response = requests.post(f"{BASE_URL}/api/admin/gallery?key={ADMIN_KEY}", json=photo, timeout=30)
        assert response.status_code == 200, response.text
        photo_id = response.json()["id"]
        self.__class__.created_ids.append(photo_id)

        fotos = requests.get(f"{BASE_URL}/api/gallery?type=foto", timeout=30)
        assert fotos.status_code == 200
        assert all(r["type"] == "foto" for r in fotos.json())
        assert any(r["id"] == photo_id for r in fotos.json())

        videos = requests.get(f"{BASE_URL}/api/gallery?type=video", timeout=30)
        assert videos.status_code == 200
        assert all(r["type"] == "video" for r in videos.json())
        assert all(r["id"] != photo_id for r in videos.json())

    def test_invalid_type_rejected(self):
        response = requests.post(
            f"{BASE_URL}/api/admin/gallery?key={ADMIN_KEY}",
            json={"title": "TEST_bad", "type": "audio", "url": "https://example.com/a.mp3"},
            timeout=30,
        )
        assert response.status_code == 422, response.text

    def test_missing_required_fields_rejected(self):
        response = requests.post(
            f"{BASE_URL}/api/admin/gallery?key={ADMIN_KEY}", json={"title": "TEST_no_url"}, timeout=30
        )
        assert response.status_code == 422, response.text

    def test_delete_item_and_verify_removal(self):
        payload = {
            "title": f"TEST_Delete_{uuid.uuid4().hex[:6]}",
            "type": "foto",
            "url": "https://example.com/delete.jpg",
            "category": "TEST",
        }
        created = requests.post(f"{BASE_URL}/api/admin/gallery?key={ADMIN_KEY}", json=payload, timeout=30)
        assert created.status_code == 200, created.text
        item_id = created.json()["id"]

        deleted = requests.delete(f"{BASE_URL}/api/admin/gallery/{item_id}?key={ADMIN_KEY}", timeout=30)
        assert deleted.status_code == 200, deleted.text
        assert deleted.json() == {"deleted": item_id}

        public = requests.get(f"{BASE_URL}/api/gallery", timeout=30)
        assert all(r["id"] != item_id for r in public.json())

        again = requests.delete(f"{BASE_URL}/api/admin/gallery/{item_id}?key={ADMIN_KEY}", timeout=30)
        assert again.status_code == 404, again.text
