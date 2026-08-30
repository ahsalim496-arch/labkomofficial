from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
import asyncio
from datetime import datetime, timezone
from io import BytesIO
from typing import Literal, Optional
import logging
import os
import resend
import uuid

load_dotenv()
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]
logger = logging.getLogger(__name__)
app = FastAPI(title="LABKOM OFFICIAL API")
api_router = APIRouter(prefix="/api")

NOTIFY_RECIPIENT = os.environ.get("NOTIFY_RECIPIENT", "labkomlangitan25@gmail.com")
ADMIN_KEY = os.environ.get("ADMIN_KEY", "")


def verify_admin(request: Request, key: Optional[str] = Query(default=None)):
    provided = key or request.headers.get("x-admin-key")
    if not ADMIN_KEY or not provided or provided != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Kunci admin tidak valid")
    return True


class Registration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr | None = None
    whatsapp: str
    course_name: str
    note: str = ""
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RegistrationResponse(Registration):
    notification_sent: bool = False
    notification_error: str | None = None


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr | None = None
    message: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GalleryItemIn(BaseModel):
    title: str
    type: Literal["foto", "video"]
    url: str
    description: str = ""
    category: str = "Umum"


class GalleryItem(GalleryItemIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


async def notify_registration(registration: Registration) -> tuple[bool, str | None]:
    api_key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    if not api_key:
        return False, "RESEND_API_KEY is not configured"
    resend.api_key = api_key
    params = {
        "from": sender,
        "to": [NOTIFY_RECIPIENT],
        "subject": f"[LABKOM] Pendaftar baru: {registration.course_name}",
        "html": (
            "<h2>Pendaftaran Kursus Baru - LABKOM OFFICIAL</h2>"
            f"<p><b>Nama:</b> {registration.name}</p>"
            f"<p><b>WhatsApp:</b> {registration.whatsapp}</p>"
            f"<p><b>Email:</b> {registration.email or '-'}</p>"
            f"<p><b>Kursus:</b> {registration.course_name}</p>"
            f"<p><b>Catatan:</b> {registration.note or '-'}</p>"
            f"<p style='color:#64748b'><small>Waktu: {registration.submitted_at.isoformat()}</small></p>"
            "<hr><p style='color:#64748b;font-size:12px'>Notifikasi otomatis dari www.labkomofficial.com.</p>"
        ),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        if isinstance(result, dict) and result.get("error"):
            return False, str(result["error"])
        return True, None
    except Exception as exc:
        logger.exception("Resend send failed")
        return False, str(exc)


def _clean_doc(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


def _parse_date_range(from_: Optional[str], to: Optional[str]):
    query = {}
    if from_:
        query["$gte"] = from_
    if to:
        query["$lte"] = to + "T23:59:59.999999+00:00" if len(to) == 10 else to
    return query


@api_router.get("/")
async def root():
    return {"message": "LABKOM OFFICIAL API aktif"}


@api_router.post("/registrations", response_model=RegistrationResponse)
async def create_registration(registration: Registration):
    sent, err = await notify_registration(registration)
    document = registration.model_dump()
    document["submitted_at"] = registration.submitted_at.isoformat()
    document["notification_sent"] = sent
    document["notification_error"] = err
    await db.registrations.insert_one(document)
    return RegistrationResponse(**registration.model_dump(), notification_sent=sent, notification_error=err)


@api_router.post("/contacts", response_model=ContactMessage)
async def create_contact(message: ContactMessage):
    document = message.model_dump()
    document["submitted_at"] = message.submitted_at.isoformat()
    await db.contacts.insert_one(document)
    return message


# ================ ADMIN ENDPOINTS ================
@api_router.get("/admin/registrations", dependencies=[Depends(verify_admin)])
async def admin_list_registrations(from_: Optional[str] = Query(default=None, alias="from"), to: Optional[str] = Query(default=None)):
    query = {}
    dr = _parse_date_range(from_, to)
    if dr:
        query["submitted_at"] = dr
    docs = await db.registrations.find(query).sort("submitted_at", -1).to_list(length=1000)
    return [_clean_doc(d) for d in docs]


@api_router.get("/admin/contacts", dependencies=[Depends(verify_admin)])
async def admin_list_contacts(from_: Optional[str] = Query(default=None, alias="from"), to: Optional[str] = Query(default=None)):
    query = {}
    dr = _parse_date_range(from_, to)
    if dr:
        query["submitted_at"] = dr
    docs = await db.contacts.find(query).sort("submitted_at", -1).to_list(length=1000)
    return [_clean_doc(d) for d in docs]


@api_router.get("/admin/stats", dependencies=[Depends(verify_admin)])
async def admin_stats():
    reg_count = await db.registrations.count_documents({})
    contact_count = await db.contacts.count_documents({})
    gallery_count = await db.gallery.count_documents({})
    return {"registrations": reg_count, "contacts": contact_count, "gallery": gallery_count}


@api_router.get("/admin/verify")
async def admin_verify(_: bool = Depends(verify_admin)):
    return {"ok": True}


# ================ GALLERY (public read, admin write) ================
@api_router.get("/gallery")
async def list_gallery(type: Optional[Literal["foto", "video"]] = None):
    query = {}
    if type:
        query["type"] = type
    docs = await db.gallery.find(query).sort("created_at", -1).to_list(length=200)
    return [_clean_doc(d) for d in docs]


@api_router.post("/admin/gallery", response_model=GalleryItem, dependencies=[Depends(verify_admin)])
async def create_gallery_item(item: GalleryItemIn):
    entry = GalleryItem(**item.model_dump())
    doc = entry.model_dump()
    doc["created_at"] = entry.created_at.isoformat()
    await db.gallery.insert_one(doc)
    return entry


@api_router.delete("/admin/gallery/{item_id}", dependencies=[Depends(verify_admin)])
async def delete_gallery_item(item_id: str):
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item galeri tidak ditemukan")
    return {"deleted": item_id}


MATERIALS = {
    1: ("Cheat Sheet Rumus Excel", ["VLOOKUP: =VLOOKUP(nilai, tabel, kolom, FALSE)", "XLOOKUP: =XLOOKUP(nilai, kolom_cari, kolom_hasil)", "Pivot Table: pilih data > Insert > PivotTable", "Gunakan IFERROR untuk hasil yang lebih rapi"]),
    2: ("Modul Dasar Pemrograman Python", ["Variabel menyimpan data: nama = 'LABKOM'", "Gunakan if/else untuk keputusan", "Gunakan for untuk perulangan", "Pecah program menjadi fungsi kecil yang mudah diuji"]),
    3: ("Template Presentasi Profesional", ["Slide 1: Judul dan nama presenter", "Slide 2: Masalah dan tujuan", "Slide 3-5: Data, proses, dan temuan", "Slide terakhir: Kesimpulan dan ajakan bertindak"]),
    4: ("Checklist Troubleshooting Komputer", ["Restart dan catat pesan error", "Periksa kabel, daya, dan koneksi", "Cek ruang penyimpanan dan aplikasi startup", "Cadangkan data sebelum perbaikan lanjutan"]),
}


@api_router.get("/materials/{material_id}/download")
async def download_material(material_id: int):
    if material_id not in MATERIALS:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    title, points = MATERIALS[material_id]
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2 * cm, leftMargin=2 * cm, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()
    story = [Paragraph("LABKOM OFFICIAL", styles["Title"]), Paragraph(title, styles["Heading2"]), Spacer(1, 0.5 * cm), Paragraph("Materi ringkas orisinal untuk membantu Anda belajar komputer secara praktis.", styles["BodyText"]), Spacer(1, 0.4 * cm)]
    story += [Paragraph(f"{index}. {point}", styles["BodyText"]) for index, point in enumerate(points, 1)]
    story += [Spacer(1, 1 * cm), Paragraph("www.labkomofficial.com | labkomlangitan25@gmail.com", styles["Italic"])]
    doc.build(story)
    buffer.seek(0)
    safe_name = title.lower().replace(" ", "-") + ".pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{safe_name}"'})


app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
