# LABKOM OFFICIAL - PRD

## Original Problem Statement
Website edukasi teknologi profesional Indonesia (www.labkomofficial.com) untuk belajar komputer, teknologi, dan keterampilan digital.

## User Personas
Pelajar, mahasiswa, guru, masyarakat umum, pemula yang ingin menguasai komputer.

## Core Requirements (Static)
- Landing page dengan hero + CTA (Mulai Belajar, Lihat Kursus)
- Navigasi: Home, Tentang Kami, Belajar Komputer, Kursus, Tutorial, Artikel, Materi Download, Kontak
- Kartu kursus (nama, deskripsi, level, durasi, harga, tombol daftar)
- Kategori materi (13 kategori)
- Pencarian, filter, form pendaftaran & kontak, tombol WhatsApp
- Responsive, SEO-friendly, Bahasa Indonesia
- Palet biru/putih/slate, modern & bersih

## Implementation Log
- 2026-08 Initial MVP: Landing, navigasi, kursus, materi, artikel/tutorial, form, WhatsApp, responsif (DONE)
- 2026-08 Fase Lanjutan: 
  - Persistensi MongoDB untuk pendaftaran & kontak (DONE)
  - 4 PDF materi asli via ReportLab (DONE)
  - Detail artikel/tutorial shareable dengan hash URL (DONE)
  - Notifikasi email via Resend (DONE - delivered to Resend account owner)
- 2026-08 Iteration 3 fixes:
  - Share button clipboard rejection handled dengan try/catch + fallback execCommand/manual (DONE)
  - Email notification transparency: response API kini expose notification_sent & notification_error, tersimpan di DB (DONE)
  - Logo baru custom (monitor merah dengan simbol tradisional) diintegrasikan di navbar + footer + favicon (DONE)

## Tech Stack
- Frontend: React (CRA + CRACO), TailwindCSS, Shadcn UI, Sonner
- Backend: FastAPI + Motor async MongoDB
- Documents: ReportLab (PDF asli)
- Email: Resend SDK

## Prioritized Backlog
- P1: Split /app/frontend/src/App.js (1625 lines) menjadi komponen kecil
- P1: Verifikasi domain di Resend agar email bisa dikirim ke labkomlangitan25@gmail.com (bukan hanya account owner)
- P2: Move Resend send ke FastAPI BackgroundTasks untuk mengurangi latency response
- P2: Rate limiting + honeypot pada endpoint public write (anti-spam)
- P2: Halaman admin sederhana untuk melihat semua pendaftaran/kontak
- P2: URL routing (react-router) dengan slug per artikel untuk SEO deep-link

## Environment
- MONGO_URL, DB_NAME, RESEND_API_KEY, SENDER_EMAIL, NOTIFY_RECIPIENT di /app/backend/.env
- REACT_APP_BACKEND_URL di /app/frontend/.env
