// Shared content data untuk artikel dan tutorial LABKOM OFFICIAL

export const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const articles = [
  {
    id: 1,
    title: "10 Pintasan Excel Paling Penting untuk Pekerjaan Perkantoran 2026",
    category: "Microsoft Excel",
    date: "10 Juli 2026",
    author: "Tim Labkom Official",
    readTime: "5 menit baca",
    excerpt:
      "Tingkatkan produktivitas kerja Anda dengan menguasai shortcut Excel berikut yang jarang diketahui orang awam namun sangat ampuh.",
    content:
      "Microsoft Excel adalah salah satu perangkat lunak paling diandalkan di dunia perkantoran. Dalam artikel ini, kami merangkum 10 pintasan keyboard (shortcut) terbaik yang akan menghemat waktu Anda berjam-jam setiap minggunya. Mulai dari Ctrl+; untuk memasukkan tanggal saat ini, F4 untuk mengunci referensi sel, Ctrl+Shift+L untuk filter cepat, Alt+= untuk auto-sum, hingga Ctrl+Space dan Shift+Space untuk seleksi kolom/baris penuh. Kami juga menambahkan tips membaca formula panjang dengan F2, menjalankan makro dengan Alt+F8, serta cara instan membuat tabel dengan Ctrl+T. Terapkan satu shortcut baru setiap hari selama 10 hari dan rasakan produktivitas Anda melejit.",
  },
  {
    id: 2,
    title: "Mengenal Perbedaan Artificial Intelligence Generatif vs Agentic AI",
    category: "AI & Teknologi",
    date: "8 Juli 2026",
    author: "Ahmad Teknokrat, M.Kom",
    readTime: "7 menit baca",
    excerpt:
      "Teknologi AI terus berkembang pesat. Simak bagaimana AI agent mandiri mulai mengambil alih tugas-tugas kompleks secara otomatis.",
    content:
      "Perkembangan AI telah melewati era teks generatif sederhana. Saat ini kita memasuki era Agentic AI, di mana sistem komputer tidak hanya menjawab pertanyaan, tetapi juga merencanakan dan mengeksekusi tugas multi-langkah secara mandiri. Generative AI seperti ChatGPT berfokus menghasilkan konten baru berdasarkan prompt, sedangkan Agentic AI mampu memakai tools, mengingat konteks jangka panjang, dan mengambil keputusan. Artikel ini membahas contoh use case: agent riset otomatis, agent pengelola email, agent programmer, dan risiko yang perlu diantisipasi seperti hallucination dan kegagalan otonomi. Pahami kapan memakai LLM biasa dan kapan memakai orchestrator agent.",
  },
  {
    id: 3,
    title: "Panduan Merakit PC Gaming & Kerja Produktif Tanpa Bottleneck",
    category: "Hardware & Software",
    date: "5 Juli 2026",
    author: "Budi Hardware",
    readTime: "10 menit baca",
    excerpt:
      "Tips memilih CPU, GPU, RAM, dan NVMe SSD yang seimbang sesuai budget agar performa komputer maksimal untuk berbagai kebutuhan.",
    content:
      "Memilih komponen PC seringkali membingungkan bagi pemula. Kesalahan dalam memilih motherboard atau RAM yang tidak seimbang dapat menyebabkan bottleneck—kondisi di mana satu komponen memperlambat sisanya. Panduan ini membahas kombinasi ideal antara CPU (Intel Core i5/i7 gen 13+ atau Ryzen 5/7 seri 7000), GPU (RTX 4060 hingga 4070 untuk gaming 1440p), RAM DDR5 minimal 32 GB dengan XMP aktif, SSD NVMe Gen4, PSU 80+ Gold minimum 750W, hingga pemilihan casing dengan airflow bagus. Ditutup dengan checklist perakitan aman, urutan pemasangan, serta software benchmarking untuk verifikasi stabilitas sistem.",
  },
];

export const tutorials = [
  {
    id: 1,
    title: "Cara Mudah Membuat Mail Merge Sertifikat dengan Excel dan Word",
    category: "Microsoft Word",
    readTime: "6 menit baca",
    author: "Tim Labkom Official",
    date: "12 Juli 2026",
    desc: "Cetak ratusan sertifikat atau surat undangan otomatis dalam hitungan detik menggunakan fitur Mail Merge.",
    content:
      "Mail Merge adalah fitur ajaib untuk mencetak dokumen massal dengan data berbeda per dokumen. Langkah-langkahnya: (1) Siapkan data peserta di Excel dengan header pada baris pertama (Nama, Nomor Sertifikat, Tanggal). (2) Buka Word, buat template sertifikat, klik Mailings > Start Mail Merge > Letters. (3) Pilih Select Recipients > Use Existing List > pilih file Excel Anda. (4) Klik Insert Merge Field di setiap placeholder. (5) Preview hasil dengan Preview Results, lalu Finish & Merge > Edit Individual Documents untuk menghasilkan satu file dengan semua sertifikat. Tips: format tanggal Excel bisa berubah, gunakan formula TEXT() agar tetap konsisten. Simpan file induk untuk pemakaian berulang di acara berikutnya.",
  },
  {
    id: 2,
    title: "Tutorial Dasar Mikrotik: Konfigurasi Hotspot dan DHCP Server",
    category: "Jaringan Komputer",
    readTime: "9 menit baca",
    author: "Ahmad Teknokrat, M.Kom",
    date: "9 Juli 2026",
    desc: "Panduan konfigurasi router Mikrotik untuk warnet, kantor, atau sekolah dari awal hingga terhubung internet.",
    content:
      "Mikrotik adalah pilihan populer untuk manajemen jaringan berbiaya rendah namun kaya fitur. Tutorial ini memandu Anda dari factory reset, akses via Winbox, konfigurasi WAN via PPPoE, hingga aktifkan NAT masquerade agar client bisa internetan. Selanjutnya buat DHCP Server pada interface LAN dengan pool 192.168.10.10-192.168.10.254 dan gateway 192.168.10.1. Untuk hotspot: IP > Hotspot > Setup, pilih interface, alokasikan pool, atur DNS 1.1.1.1, buat user profile dengan rate-limit 5M/5M, dan tambahkan user via User Manager. Terakhir uji dengan menghubungkan HP, tampilan login otomatis muncul. Simpan konfigurasi via File > Backup untuk restore cepat.",
  },
  {
    id: 3,
    title: "Tips Mengatasi Komputer / Laptop Lemot Tanpa Instal Ulang",
    category: "Troubleshooting Komputer",
    readTime: "5 menit baca",
    author: "Budi Hardware",
    date: "3 Juli 2026",
    desc: "Langkah-langkah membersihkan file sampah, mengatur startup, dan optimalisasi SSD agar laptop kembali ngebut.",
    content:
      "Sebelum memutuskan instal ulang, coba 6 langkah ini: (1) Buka Task Manager > tab Startup, nonaktifkan aplikasi yang tidak wajib berjalan saat boot. (2) Jalankan Disk Cleanup dan Storage Sense untuk hapus file sementara & Recycle Bin. (3) Uninstall aplikasi tidak terpakai via Settings > Apps. (4) Aktifkan Fast Startup (Control Panel > Power Options). (5) Jika HDD, pertimbangkan upgrade ke SSD SATA/NVMe—dampak paling terasa. (6) Update driver GPU & chipset dari situs resmi vendor, bukan sekedar Windows Update. Terakhir scan malware ringan dengan Microsoft Defender Offline. Jika hardware sudah tua (>7 tahun), pertimbangkan tambah RAM ke 16GB agar Chrome dan Office lebih lancar.",
  },
];

export const findArticle = (slug) => articles.find((a) => slugify(a.title) === slug);
export const findTutorial = (slug) => tutorials.find((t) => slugify(t.title) === slug);
