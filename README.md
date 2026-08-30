# LABKOM OFFICIAL — Website Edukasi Teknologi

Website resmi **LABKOM OFFICIAL** (labkomofficial.com): platform edukasi teknologi berbahasa Indonesia untuk pelajar, mahasiswa, guru, dan masyarakat umum.

## Fitur

- 🏠 Landing page profesional dengan info kursus, artikel, dan tutorial
- 📚 Katalog kursus + formulir pendaftaran (tersimpan ke database, notifikasi email via Resend)
- 📝 Artikel & tutorial dengan URL unik (`/artikel/:slug`, `/tutorial/:slug`) yang SEO-friendly
- 📄 Materi PDF gratis (dibuat dengan ReportLab)
- 🖼️ Galeri foto/video (`/galeri`) — upload foto langsung dari HP/laptop via Object Storage
- ⭐ Ulasan alumni asli dengan moderasi admin
- 🛠️ Dashboard admin (`/admin`) — pendaftaran, pesan kontak, galeri, ulasan
- 💬 Tombol WhatsApp di seluruh halaman

## Teknologi

| Bagian   | Stack                                                       |
|----------|-------------------------------------------------------------|
| Frontend | React 19 (CRA + CRACO), Tailwind CSS, shadcn/ui, React Router |
| Backend  | FastAPI (Python), Motor (MongoDB async), ReportLab, Resend  |
| Database | MongoDB                                                     |

## Struktur Project

```
├── backend/
│   ├── server.py            # Semua API endpoint (prefix /api)
│   ├── requirements.txt
│   ├── .env.example         # Template environment backend
│   └── tests/               # Pytest API tests
└── frontend/
    ├── src/
    │   ├── App.js           # Halaman publik utama
    │   ├── pages/           # ContentDetail, AdminDashboard, GalleryPage
    │   ├── components/      # Testimonials + shadcn/ui
    │   └── data/content.js  # Data artikel & tutorial
    ├── package.json
    └── .env.example         # Template environment frontend
```

## Cara Menjalankan (Lokal)

### Prasyarat

- Python 3.11+
- Node.js 18+ dan **Yarn** (jangan gunakan npm)
- MongoDB berjalan lokal atau connection string MongoDB Atlas

### 1. Backend

```bash
cd backend
cp .env.example .env          # lalu isi nilai environment Anda
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

> Paket `emergentintegrations` diinstal dari index khusus:
> `pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/`

### 2. Frontend

```bash
cd frontend
cp .env.example .env          # sesuaikan REACT_APP_BACKEND_URL
yarn install
yarn start                    # dev server di http://localhost:3000
```

Build produksi: `yarn build` → hasil di `frontend/build/`.

### 3. Verifikasi

- Buka `http://localhost:3000` → landing page LABKOM tampil
- Cek API: `curl http://localhost:8001/api/` (health) dan `curl http://localhost:8001/api/gallery`
- Jalankan test backend: `cd backend && python -m pytest tests/ -q`

## Environment Variables

### Backend (`backend/.env`)

| Variabel          | Keterangan                                             |
|-------------------|--------------------------------------------------------|
| `MONGO_URL`       | Connection string MongoDB (wajib)                      |
| `DB_NAME`         | Nama database (wajib)                                  |
| `CORS_ORIGINS`    | Origin yang diizinkan, pisah koma, atau `*`            |
| `RESEND_API_KEY`  | API key Resend untuk email notifikasi pendaftaran      |
| `SENDER_EMAIL`    | Alamat pengirim email (domain terverifikasi di Resend) |
| `NOTIFY_RECIPIENT`| Email penerima notifikasi pendaftaran                  |
| `ADMIN_KEY`       | Kunci rahasia akses dashboard admin                    |
| `EMERGENT_LLM_KEY`| Kunci Emergent untuk Object Storage (upload galeri)    |

### Frontend (`frontend/.env`)

| Variabel                | Keterangan                          |
|-------------------------|-------------------------------------|
| `REACT_APP_BACKEND_URL` | URL backend, tanpa trailing slash   |

## Dashboard Admin

Buka `/admin`, masukkan kunci admin (nilai `ADMIN_KEY` di backend `.env`).

## Catatan

- Semua route backend berprefix `/api`
- Email Resend dalam mode testing hanya bisa mengirim ke email pemilik akun; verifikasi domain di Resend untuk pengiriman ke alamat lain
- Upload foto galeri memakai Emergent Object Storage (butuh `EMERGENT_LLM_KEY`); tanpa key ini fitur upload nonaktif namun fitur lain tetap berjalan

---

© LABKOM OFFICIAL — Belajar Komputer Jadi Mudah
