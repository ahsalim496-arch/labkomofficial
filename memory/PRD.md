# PRD — LABKOM OFFICIAL

**Tanggal pembaruan:** 2026-08-30

## Problem Statement
LABKOM OFFICIAL membutuhkan website profesional, modern, responsif, dan berbahasa Indonesia sebagai pusat informasi serta pembelajaran komputer, teknologi, dan keterampilan digital di www.labkomofficial.com.

## User Personas
- Pelajar dan mahasiswa yang ingin membangun fondasi komputer dan skill kerja.
- Guru dan profesional yang membutuhkan materi praktis.
- Masyarakat umum dan pemula yang ingin belajar teknologi secara bertahap.

## Arsitektur dan Keputusan
- React dengan navigasi berbasis state untuk pengalaman single-page yang cepat.
- Tailwind CSS dan komponen ikon untuk tampilan konsisten dan responsif.
- Konten katalog dan artikel terstruktur sebagai data frontend agar mudah dikembangkan.
- Form pendaftaran dan kontak menggunakan localStorage sebagai alur demo yang disepakati pengguna.
- Backend FastAPI/MongoDB tetap tersedia sebagai fondasi API berikutnya; URL dan environment bawaan tidak diubah.

## Kebutuhan Inti (Statis)
- Branding, tagline, hero, pengenalan, keunggulan, kursus unggulan, artikel/tutorial, CTA, footer.
- Navigasi Home, Tentang Kami, Belajar Komputer, Kursus, Tutorial, Artikel, Materi Download, Kontak.
- 13 kategori materi, pencarian, katalog kursus, detail kursus, pendaftaran, kontak, WhatsApp.
- Tampilan Bahasa Indonesia, SEO dasar, cepat, responsif desktop/tablet/ponsel.

## Yang Telah Diimplementasikan
**2026-08-30**
- Landing page lengkap LABKOM OFFICIAL dengan identitas visual biru, putih, dan slate serta gambar edukasi teknologi.
- Navigasi desktop/mobile, kategori materi, pencarian, detail kursus, form demo, artikel, tutorial, materi download, kontak, dan floating WhatsApp.
- Metadata SEO: judul, deskripsi, kata kunci, bahasa Indonesia, theme color, serta typography Outfit/Inter.
- Data pendaftaran dan pesan kontak demo disimpan di browser localStorage dan memberi konfirmasi visual.
- Build frontend berhasil dan pengujian desktop/mobile seluruhnya lolos.

## Backlog Terprioritas
### P0 — berikutnya
- Sambungkan pendaftaran dan pesan kontak ke API FastAPI serta MongoDB.
- Sediakan file materi download nyata dan endpoint pengelolaan materi.

### P1
- Tambahkan halaman admin untuk mengelola kursus, artikel, tutorial, dan materi.
- Tambahkan detail artikel/tutorial dengan URL yang dapat dibagikan.
- Tambahkan notifikasi email atau WhatsApp untuk pendaftar baru.

### P2
- Tambahkan akun peserta, progres belajar, dan sertifikat digital.
- Tambahkan analitik pencarian, kursus populer, serta rekomendasi materi.

## Tugas Fase Berikutnya
1. Buat API domain untuk kursus, artikel, pendaftaran, kontak, dan materi.
2. Migrasikan penyimpanan demo ke database dengan validasi dan keamanan.
3. Ganti tombol download feedback dengan berkas yang benar-benar dapat diunduh.
4. Pecah App.js menjadi komponen halaman kecil sebelum ekspansi fitur besar.