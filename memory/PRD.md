# LABKOM OFFICIAL - PRD

## Original Problem Statement
Website edukasi teknologi profesional Indonesia (www.labkomofficial.com) untuk belajar komputer, teknologi, dan keterampilan digital.

## Implementation Log
- Iteration 1 (MVP): Landing + 8 tab navigasi + kursus + materi + WhatsApp (DONE)
- Iteration 2 (Fase Lanjutan): MongoDB registrations/contacts + 4 PDF materials + Resend email + share (DONE)
- Iteration 3: Fix share clipboard + email transparency + custom logo (DONE)
- Iteration 4: Admin dashboard `/admin?key=` + article routing slugs + testimoni fiktif + galeri URL (DONE)
- Iteration 5 (fase saat ini):
  - **Upload foto sungguhan** via Emergent Object Storage: `/api/admin/gallery/upload` menerima file (JPG/PNG/WEBP/GIF, maks 8MB), simpan di `labkom-official/gallery/{uuid}.{ext}`, serve via `/api/files/{path}` (public read) (DONE)
  - Admin form: toggle Upload vs URL Eksternal, `capture="environment"` untuk kamera HP, preview upload di grid (DONE)
  - **Rating & Review Alumni Nyata**: Public form review dengan rating stars 1-5, submit ke `/api/reviews`. Testimonials fetch dari `/api/reviews?min_rating=5` (auto-tampilkan bintang 5 approved) dengan fallback ke 5 testimoni fiktif (DONE)
  - Admin Reviews tab: approve/hide/delete ulasan (DONE)
  - Meta description untuk `/galeri` (SEO gap fix) (DONE)

## Tech Stack
- Frontend: React 19 + CRA + CRACO + TailwindCSS + Shadcn UI + Sonner + react-router-dom v7
- Backend: FastAPI + Motor (async MongoDB) + Emergent Object Storage
- Documents: ReportLab
- Email: Resend SDK (testing mode)
- Storage: Emergent Object Storage via `integrations.emergentagent.com/objstore`

## API Routes
### Public
- `POST /api/registrations` — daftar kursus (menyimpan + kirim email Resend)
- `POST /api/contacts` — pesan kontak
- `POST /api/reviews` — kirim ulasan alumni (approved default true)
- `GET /api/reviews?min_rating=5` — public listing untuk halaman Kursus
- `GET /api/gallery` — daftar galeri publik
- `GET /api/files/{path}` — serve file dari Object Storage
- `GET /api/materials/{id}/download` — 4 PDF materi

### Admin (butuh `?key=` atau header `X-Admin-Key`)
- `GET /api/admin/verify`, `/registrations`, `/contacts`, `/stats`, `/reviews`
- `POST /api/admin/gallery` (URL) & `POST /api/admin/gallery/upload` (multipart file)
- `DELETE /api/admin/gallery/{id}`, `/admin/reviews/{id}`
- `PATCH /api/admin/reviews/{id}` — {approved: bool}

## Environment Variables (backend/.env)
- MONGO_URL, DB_NAME (dilindungi)
- RESEND_API_KEY, SENDER_EMAIL, NOTIFY_RECIPIENT
- ADMIN_KEY (default: labkom-admin-2026-secret)
- EMERGENT_LLM_KEY (untuk Emergent Object Storage init)
- INTEGRATION_PROXY_URL (auto-set oleh platform)

## Frontend Routes
- `/` - Landing dengan tabs
- `/artikel/:slug`, `/tutorial/:slug` - Detail dengan meta title/description
- `/galeri` - Public gallery
- `/admin?key=xxx` - Admin dashboard (4 tab)

## Prioritized Backlog
- P1: Verifikasi domain di Resend agar email ke labkomlangitan25@gmail.com
- P1: Materi Download labels realistic (tidak mengklaim PPTX/ZIP)
- P1: Split App.js monolitik jadi komponen kecil
- P2: Rate limiting + honeypot untuk endpoints public write
- P2: Header-only admin key, avoid ?key= di query
- P2: Move Resend send ke BackgroundTasks
- P2: Soft delete untuk gallery (Emergent Object Storage tidak punya delete API)

## GitHub Readiness (Jun 2026)
- Backend pytest 65/65 lulus; frontend production build (`yarn build`) sukses tanpa error
- Tidak ada bug/hardcoded secret ditemukan; deployment agent 2x PASS
- Dibuat: `backend/.env.example`, `frontend/.env.example` (template env, gitignore exception `!.env.example`)
- README.md ditulis lengkap: fitur, struktur, cara run lokal, tabel env vars
- Fix minor: format nomor WA di toast pendaftaran (0821-3297-6144)
- Catatan: kursus = data statis frontend (tidak ada /api/courses, by design)

