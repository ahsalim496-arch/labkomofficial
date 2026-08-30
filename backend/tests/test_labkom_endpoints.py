"""Regression tests for LABKOM OFFICIAL public API (registrations, contacts, materials)."""
import asyncio
import os
import uuid

import pytest
import requests
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")


def _db_lookup(collection, query):
    async def _run():
        client = AsyncIOMotorClient(backend_env["MONGO_URL"])
        try:
            db = client[backend_env["DB_NAME"]]
            return await db[collection].find_one(query, {"_id": 0})
        finally:
            client.close()

    return asyncio.run(_run())


# --- root health ---
def test_root_endpoint():
    response = requests.get(f"{BASE_URL}/api/", timeout=20)
    assert response.status_code == 200
    assert "message" in response.json()


# --- registrations: response transparency + persistence ---
class TestRegistrations:
    def test_registration_notification_fields_and_persistence(self):
        suffix = uuid.uuid4().hex[:10]
        payload = {
            "name": f"TEST_{suffix}",
            "whatsapp": "081234567890",
            "course_name": "TEST Kursus Python",
        }
        response = requests.post(f"{BASE_URL}/api/registrations", json=payload, timeout=60)
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["name"] == payload["name"]
        assert body["course_name"] == payload["course_name"]
        assert body["whatsapp"] == payload["whatsapp"]
        assert isinstance(body["id"], str) and body["id"]
        assert "notification_sent" in body
        assert isinstance(body["notification_sent"], bool)
        assert "notification_error" in body
        assert body["notification_error"] is None or isinstance(body["notification_error"], str)
        if body["notification_sent"]:
            assert body["notification_error"] is None
        print("notification_sent=", body["notification_sent"], "error=", body["notification_error"])

        doc = _db_lookup("registrations", {"id": body["id"]})
        assert doc is not None, "registration not persisted in MongoDB"
        assert doc["name"] == payload["name"]
        assert doc["notification_sent"] == body["notification_sent"]
        assert "notification_error" in doc
        assert "_id" not in doc

    def test_registration_with_email_and_note(self):
        suffix = uuid.uuid4().hex[:10]
        payload = {
            "name": f"TEST_{suffix}",
            "email": f"test_{suffix}@example.com",
            "whatsapp": "087741844019",
            "course_name": "TEST Kursus Excel",
            "note": "Regression test",
        }
        response = requests.post(f"{BASE_URL}/api/registrations", json=payload, timeout=60)
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["email"] == payload["email"]
        assert body["note"] == payload["note"]
        doc = _db_lookup("registrations", {"id": body["id"]})
        assert doc is not None and doc["email"] == payload["email"]

    def test_registration_validation_errors(self):
        response = requests.post(f"{BASE_URL}/api/registrations", json={"name": "TEST_only"}, timeout=20)
        assert response.status_code == 422
        response = requests.post(
            f"{BASE_URL}/api/registrations",
            json={"name": "TEST_x", "whatsapp": "081", "course_name": "c", "email": "not-an-email"},
            timeout=20,
        )
        assert response.status_code == 422


# --- contacts ---
class TestContacts:
    def test_contact_persistence(self):
        suffix = uuid.uuid4().hex[:10]
        payload = {"name": f"TEST_{suffix}", "message": "TEST contact message"}
        response = requests.post(f"{BASE_URL}/api/contacts", json=payload, timeout=30)
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["message"] == payload["message"]
        assert body["name"] == payload["name"]
        assert isinstance(body["id"], str)
        doc = _db_lookup("contacts", {"id": body["id"]})
        assert doc is not None, "contact not persisted"
        assert doc["message"] == payload["message"]
        assert "_id" not in doc

    def test_contact_validation_error(self):
        response = requests.post(f"{BASE_URL}/api/contacts", json={"name": "TEST_x"}, timeout=20)
        assert response.status_code == 422


# --- material PDF downloads ---
@pytest.mark.parametrize("material_id", [1, 2, 3, 4])
def test_material_downloads_are_pdf_attachments(material_id):
    response = requests.get(f"{BASE_URL}/api/materials/{material_id}/download", timeout=30)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/pdf")
    assert "attachment" in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")
    assert len(response.content) > 500


def test_material_download_not_found():
    response = requests.get(f"{BASE_URL}/api/materials/99/download", timeout=20)
    assert response.status_code == 404
    assert "detail" in response.json()
