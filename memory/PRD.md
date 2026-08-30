# LABKOM OFFICIAL - PRD

## Original Problem Statement
Website edukasi teknologi profesional Indonesia (www.labkomofficial.com) untuk belajar komputer, teknologi, dan keterampilan digital.

## User Personas
Pelajar, mahasiswa, guru, masyarakat umum, pemula. Ditambah: admin internal LABKOM untuk kelola konten & pantau pendaftaran.

## Implementation Log
- Iteration 1 (MVP): Landing, navigasi, kursus, materi, artikel/tutorial, form, WhatsApp, responsif (DONE)
- Iteration 2 (Fase Lanjutan): MongoDB registrations/contacts, 4 PDF materials, Resend email, artikel share modal (DONE)
- Iteration 3 (Bugs + Logo): Share button clipboard fallback, email transparency, logo baru monitor merah (DONE)
- Iteration 4 (Fitur Baru):
  - Admin Dashboard `/admin?key=labkom-admin-2026-secret` dengan tabel pendaftaran + kontak + filter tanggal (DONE)
  - Gallery CRUD admin (foto URL / video YouTube) + halaman publik `/galeri` (DONE)
  - React Router: `/artikel/:slug`, `/tutorial/:slug` dengan meta title/description dinamis (DONE)
  - Section Testimoni Alumni (6 fiktif) di halaman Kursus (DONE)

## Tech Stack
- Frontend: React 19 + CRA + CRACO + TailwindCSS + Shadcn UI + Sonner + react-router-dom v7
- Backend: FastAPI + Motor (async MongoDB)
- Documents: ReportLab
- Email: Resend SDK (testing mode - deliver ke account owner ahsalim496@gmail.com)

## Prioritized Backlog
- P1: Fix Materi Download labels (PPTX/ZIP tidak match backend PDF)
- P1: Verifikasi domain di Resend agar email bisa ke labkomlangitan25@gmail.com
- P1: Split App.js monolitik (~1500+ lines) jadi komponen kecil
- P2: Rate limiting + honeypot untuk endpoints public write
- P2: Header-only admin key (X-Admin-Key), stop pass di query param
- P2: Meta description untuk halaman /galeri (SEO gap kecil)
- P2: Move Resend send ke BackgroundTasks
- P2: File upload real (Emergent Object Storage) untuk galeri (saat ini URL only)

## Environment Variables
- Backend: MONGO_URL, DB_NAME, RESEND_API_KEY, SENDER_EMAIL, NOTIFY_RECIPIENT, ADMIN_KEY, CORS_ORIGINS
- Frontend: REACT_APP_BACKEND_URL

## Routes
- `/` - Landing page (tabs: home/tentang/materi/kursus/tutorial/artikel/download/kontak)
- `/artikel/:slug` - Detail artikel dengan meta title/description dinamis
- `/tutorial/:slug` - Detail tutorial
- `/galeri` - Public gallery foto/video kursus
- `/admin?key=xxx` - Admin dashboard (verifikasi key backend)
