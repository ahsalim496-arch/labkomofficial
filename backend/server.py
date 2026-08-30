from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
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


async def notify_registration(registration: Registration) -> tuple[bool, str | None]:
    """Try to send email notification. Returns (sent, error_message)."""
    api_key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    if not api_key:
        msg = "RESEND_API_KEY is not configured"
        logger.warning(msg)
        return False, msg
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
        if isinstance(result, dict) and result.get("id"):
            return True, None
        # Resend SDK may return dict with error info
        if isinstance(result, dict) and result.get("error"):
            err = str(result.get("error"))
            logger.warning("Resend returned error: %s", err)
            return False, err
        return True, None
    except Exception as exc:
        logger.exception("Registration email could not be sent")
        return False, str(exc)


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
