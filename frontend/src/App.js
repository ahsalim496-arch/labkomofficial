import React, { useState } from "react";
import {
  Laptop,
  Cpu,
  BookOpen,
  GraduationCap,
  FileText,
  Download,
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  Users,
  Award,
  CheckCircle2,
  ShieldCheck,
  Globe,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookMarked,
  Clock,
  Tag,
  Send,
  Check
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaYoutube, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    courseName: "",
    note: ""
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [downloadSearch, setDownloadSearch] = useState("");
  const [articleSearch, setArticleSearch] = useState("");

  const categories = [
    "Semua",
    "Pengenalan Komputer",
    "Hardware & Software",
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Internet",
    "Coding & Programming",
    "Data Analyst",
    "Desain Grafis",
    "AI & Teknologi",
    "Jaringan Komputer",
    "Keamanan Digital",
    "Troubleshooting Komputer"
  ];

  const courses = [
    {
      id: 1,
      title: "Mastering Microsoft Office Professional (Word, Excel, PPT)",
      category: "Microsoft Excel",
      level: "Pemula",
      duration: "4 Minggu (16 Sesi)",
      price: "Rp 150.000",
      originalPrice: "Rp 350.000",
      rating: 4.9,
      students: 1420,
      description: "Kuasai perkantoran modern dari dasar hingga mahir dengan formula Excel tingkat lanjut, laporan profesional Word, dan presentasi memukau.",
      image: "https://images.unsplash.com/photo-1743071441939-18ae26ddce3e?auto=format&fit=crop&w=800&q=80",
      syllabus: ["Dasar Antarmuka & Formatting", "Rumus VLOOKUP, XLOOKUP & Pivot Table", "Mail Merge & Laporan Dokumen Formal", "Desain Slide Presentasi Berdampak Tinggi"]
    },
    {
      id: 2,
      title: "Fullstack Web Development & AI Integration",
      category: "Coding & Programming",
      level: "Menengah",
      duration: "8 Minggu (32 Sesi)",
      price: "Rp 350.000",
      originalPrice: "Rp 750.000",
      rating: 5.0,
      students: 980,
      description: "Belajar membangun website modern menggunakan React, Tailwind CSS, Node.js, dan integrasi Artificial Intelligence API terkini.",
      image: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?auto=format&fit=crop&w=800&q=80",
      syllabus: ["HTML5, CSS3 Modern & JavaScript ES6+", "React.js & Tailwind CSS UI Framework", "RESTful API & Backend Node.js Express", "Integrasi OpenAI & Claude API ke Web App"]
    },
    {
      id: 3,
      title: "Data Analyst Fundamentals with Python & SQL",
      category: "Data Analyst",
      level: "Pemula",
      duration: "6 Minggu (24 Sesi)",
      price: "Rp 275.000",
      originalPrice: "Rp 600.000",
      rating: 4.8,
      students: 850,
      description: "Ubah data mentah menjadi keputusan bisnis bernilai tinggi dengan Python Pandas, SQL Query, dan Tableau Visualization.",
      image: "https://images.unsplash.com/photo-1743071441939-18ae26ddce3e?auto=format&fit=crop&w=800&q=80",
      syllabus: ["Pengantar Analisis Data & Excel Statistik", "SQL Queries & Database Management", "Python for Data Analysis (Pandas, NumPy)", "Visualisasi Dashboard Interaktif"]
    },
    {
      id: 4,
      title: "Desain Grafis Profesional & UI/UX Design",
      category: "Desain Grafis",
      level: "Pemula",
      duration: "5 Minggu (20 Sesi)",
      price: "Rp 200.000",
      originalPrice: "Rp 450.000",
      rating: 4.9,
      students: 1120,
      description: "Kuasai Photoshop, Illustrator, dan Figma untuk menciptakan materi pemasaran digital dan antarmuka aplikasi berstandar industri.",
      image: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?auto=format&fit=crop&w=800&q=80",
      syllabus: ["Prinsip Desain & Color Theory", "Adobe Photoshop & Illustrator Dasar", "Figma untuk UI/UX Wireframing", "Membuat Portofolio Desain Siap Kerja"]
    },
    {
      id: 5,
      title: "Jaringan Komputer & Keamanan Siber Dasar",
      category: "Jaringan Komputer",
      level: "Menengah",
      duration: "6 Minggu (24 Sesi)",
      price: "Rp 300.000",
      originalPrice: "Rp 650.000",
      rating: 4.7,
      students: 640,
      description: "Pelajari konfigurasi LAN/WAN, Mikrotik, router, serta teknik dasar pertahanan keamanan siber dari serangan siber.",
      image: "https://images.unsplash.com/photo-1743071441939-18ae26ddce3e?auto=format&fit=crop&w=800&q=80",
      syllabus: ["Konsep Dasar OSI Layer & TCP/IP", "Konfigurasi Router & Mikrotik LAN", "Network Troubleshooting & Subnetting", "Dasar Cyber Security & Firewall Protection"]
    },
    {
      id: 6,
      title: "AI & Prompt Engineering untuk Produktivitas",
      category: "AI & Teknologi",
      level: "Pemula",
      duration: "3 Minggu (12 Sesi)",
      price: "Rp 175.000",
      originalPrice: "Rp 400.000",
      rating: 5.0,
      students: 2100,
      description: "Manfaatkan ChatGPT, Claude, dan AI generative lainnya untuk mempercepat pekerjaan harian hingga 10x lipat.",
      image: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?auto=format&fit=crop&w=800&q=80",
      syllabus: ["Pengenalan Generative AI & LLM", "Advanced Prompt Engineering Framework", "Automating Workflow dengan AI Tools", "Etika dan Masa Depan Teknologi AI"]
    }
  ];

  const articles = [
    {
      id: 1,
      title: "10 Pintasan Excel Paling Penting untuk Pekerjaan Perkantoran 2026",
      category: "Microsoft Excel",
      date: "10 Juli 2026",
      author: "Tim Labkom Official",
      readTime: "5 menit baca",
      excerpt: "Tingkatkan produktivitas kerja Anda dengan menguasai shortcut Excel berikut yang jarang diketahui orang awam namun sangat ampuh.",
      content: "Microsoft Excel adalah salah satu perangkat lunak paling diandalkan di dunia perkantoran. Dalam artikel ini, kami merangkum 10 pintasan keyboard (shortcut) terbaik yang akan menghemat waktu Anda berjam-jam setiap minggunya..."
    },
    {
      id: 2,
      title: "Mengenal Perbedaan Artificial Intelligence Generatif vs Agentic AI",
      category: "AI & Teknologi",
      date: "8 Juli 2026",
      author: "Ahmad Teknokrat, M.Kom",
      readTime: "7 menit baca",
      excerpt: "Teknologi AI terus berkembang pesat. Simak bagaimana AI agent mandiri mulai mengambil alih tugas-tugas kompleks secara otomatis.",
      content: "Perkembangan AI telah melewati era teks generatif sederhana. Saat ini kita memasuki era Agentic AI, di mana sistem komputer tidak hanya menjawab pertanyaan, tetapi juga merencanakan dan mengeksekusi tugas multi-langkah secara mandiri..."
    },
    {
      id: 3,
      title: "Panduan Merakit PC Gaming & Kerja Produktif Tanpa Bottleneck",
      category: "Hardware & Software",
      date: "5 Juli 2026",
      author: "Budi Hardware",
      readTime: "10 menit baca",
      excerpt: "Tips memilih CPU, GPU, RAM, dan NVMe SSD yang seimbang sesuai budget agar performa komputer maksimal untuk berbagai kebutuhan.",
      content: "Memilih komponen PC seringkali membingungkan bagi pemula. Kesalahan dalam memilih motherboard atau RAM yang tidak seimbang dapat menyebabkan bottleneck. Simak panduan lengkap kami untuk merakit PC impian Anda..."
    }
  ];

  const downloadMaterials = [
    {
      id: 1,
      title: "Cheat Sheet Lengkap Rumus Excel VLOOKUP, XLOOKUP & Pivot Table",
      category: "Microsoft Excel",
      fileType: "PDF",
      size: "2.4 MB",
      downloads: 4820
    },
    {
      id: 2,
      title: "Modul Panduan Dasar Pemrograman Python untuk Pemula",
      category: "Coding & Programming",
      fileType: "PDF / ZIP",
      size: "5.8 MB",
      downloads: 3150
    },
    {
      id: 3,
      title: "Template Presentasi Profesional (PowerPoint Editable)",
      category: "Microsoft PowerPoint",
      fileType: "PPTX",
      size: "14.2 MB",
      downloads: 6200
    },
    {
      id: 4,
      title: "Checklist Troubleshoot Komputer Lemot & Bluescreen",
      category: "Troubleshooting Komputer",
      fileType: "PDF",
      size: "1.8 MB",
      downloads: 2940
    }
  ];

  const advantages = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: "Fasilitas & Lab Standar Industri",
      description: "Didukung perangkat komputer mutakhir, jaringan berkecepatan tinggi, dan lingkungan belajar digital yang nyaman."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: "Kurikulum Berbasis Kompetensi",
      description: "Materi disusun sesuai dengan kebutuhan dunia kerja, industri digital, dan perkembangan teknologi global terkini."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Instruktur Berpengalaman & Praktisi",
      description: "Dibimbing langsung oleh para pakar IT, praktisi industri, dan akademisi bersertifikasi nasional."
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Sertifikat Resmi & Portofolio",
      description: "Setiap peserta kursus yang lulus akan mendapatkan e-sertifikat resmi dan portofolio proyek nyata."
    }
  ];

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.whatsapp || !registerForm.courseName) {
      toast.error("Mohon lengkapi Nama, WhatsApp, dan Pilihan Kursus!");
      return;
    }
    const existingRegistrations = JSON.parse(localStorage.getItem("labkom_registrations") || "[]");
    localStorage.setItem("labkom_registrations", JSON.stringify([
      ...existingRegistrations,
      { ...registerForm, submittedAt: new Date().toISOString() }
    ]));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    toast.success("Pendaftaran kursus berhasil dikirim! Tim Labkom Official akan segera menghubungi Anda via WhatsApp.");
    setIsRegisterModalOpen(false);
    setRegisterForm({ name: "", email: "", whatsapp: "", courseName: "", note: "" });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.message) {
      toast.error("Mohon lengkapi Nama dan Pesan Anda!");
      return;
    }
    const existingMessages = JSON.parse(localStorage.getItem("labkom_messages") || "[]");
    localStorage.setItem("labkom_messages", JSON.stringify([
      ...existingMessages,
      { ...contactForm, submittedAt: new Date().toISOString() }
    ]));
    toast.success("Pesan Anda telah terkirim! Terima kasih telah menghubungi Labkom Official.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const triggerDownload = (item) => {
    confetti({ particleCount: 50, spread: 60 });
    toast.success(`Mengunduh file: ${item.title} (${item.fileType})`);
  };

  const filteredCourses = courses.filter((c) => {
    const matchCat = selectedCategory === "Semua" || c.category === selectedCategory;
    const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* TOP HEADER / ANNOUNCEMENT BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> www.labkomofficial.com
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">Pusat Pembelajaran Komputer & Teknologi Profesional</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/6287741844019" target="_blank" rel="noreferrer" data-testid="topbar-whatsapp" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <FaWhatsapp className="text-green-400 text-sm" /> 0877-4184-4019
            </a>
            <span className="text-slate-500">|</span>
            <a href="mailto:labkomlangitan25@gmail.com" data-testid="topbar-email" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> labkomlangitan25@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")} data-testid="nav-logo">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                  LABKOM <span className="text-blue-600">OFFICIAL</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest mt-1 block">
                  Technology Lab & Education
                </span>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: "home", label: "Home" },
                { id: "tentang", label: "Tentang Kami" },
                { id: "materi", label: "Belajar Komputer" },
                { id: "kursus", label: "Kursus" },
                { id: "tutorial", label: "Tutorial" },
                { id: "artikel", label: "Artikel" },
                { id: "download", label: "Materi Download" },
                { id: "kontak", label: "Kontak" }
              ].map((item) => (
                <button
                  key={item.id}
                  data-testid={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* RIGHT CTA & MOBILE HAMBURGER */}
            <div className="flex items-center gap-3">
              <button
                data-testid="header-register-btn"
                onClick={() => {
                  setRegisterForm({ ...registerForm, courseName: "Konsultasi & Pendaftaran Umum" });
                  setIsRegisterModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Daftar Kursus</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                data-testid="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2">
            {[
              { id: "home", label: "Home" },
              { id: "tentang", label: "Tentang Kami" },
              { id: "materi", label: "Belajar Komputer" },
              { id: "kursus", label: "Kursus" },
              { id: "tutorial", label: "Tutorial" },
              { id: "artikel", label: "Artikel" },
              { id: "download", label: "Materi Download" },
              { id: "kontak", label: "Kontak" }
            ].map((item) => (
              <button
                key={item.id}
                data-testid={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeTab === item.id ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRegisterForm({ ...registerForm, courseName: "Konsultasi & Pendaftaran Umum" });
                  setIsRegisterModalOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-center shadow-md shadow-blue-600/20"
              >
                Daftar Kursus Sekarang
              </button>
            </div>
          </div>
        )}
      </header>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/6287741844019?text=Halo%20Labkom%20Official,%20saya%20ingin%20bertanya%20mengenai%20kursus%20dan%20materi%20belajar."
        target="_blank"
        rel="noreferrer"
        data-testid="floating-whatsapp-btn"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center transition-all hover:scale-110 group"
        title="Hubungi WhatsApp Kami"
      >
        <FaWhatsapp className="w-7 h-7 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-semibold pl-0 group-hover:pl-2">
          Chat WhatsApp
        </span>
      </a>

      {/* BODY CONTENT BASED ON ACTIVE TAB */}
      <main className="transition-all duration-300">
        
        {/* ================= HOME VIEW ================= */}
        {activeTab === "home" && (
          <div>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
              <div className="absolute inset-0 z-0 opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1743071441939-18ae26ddce3e?auto=format&fit=crop&w=1920&q=80"
                  alt="Labkom Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/70" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-2 rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Pusat Teknologi & Keterampilan Digital #1 di Indonesia</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-6">
                    Belajar Komputer, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                      Berkembang Bersama Teknologi
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
                    Wujudkan karier impian dan tingkatkan keterampilan digital Anda bersama 
                    <strong className="text-white font-semibold"> LABKOM OFFICIAL</strong>. Dari pemula hingga mahir, dapatkan pelatihan terstruktur langsung dari para praktisi industri.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      data-testid="hero-mulai-belajar-btn"
                      onClick={() => setActiveTab("materi")}
                      className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                    >
                      <span>Mulai Belajar Sekarang</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      data-testid="hero-lihat-kursus-btn"
                      onClick={() => setActiveTab("kursus")}
                      className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-base backdrop-blur-md transition-all hover:scale-105"
                    >
                      <span>Lihat Daftar Kursus</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-16 mt-16 border-t border-slate-800">
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">15.000+</div>
                      <div className="text-slate-400 text-sm mt-1">Siswa & Profesional Aktif</div>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-sky-400">50+</div>
                      <div className="text-slate-400 text-sm mt-1">Modul & Kursus Unggulan</div>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">98%</div>
                      <div className="text-slate-400 text-sm mt-1">Tingkat Kepuasan Peserta</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PENGENALAN SINGKAT */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Tentang Labkom Official</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-6">
                      Membangun Generasi Digital yang Kompeten dan Siap Hadapi Masa Depan
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      <strong className="text-slate-900 font-semibold">LABKOM OFFICIAL</strong> (www.labkomofficial.com) hadir sebagai pusat informasi, pelatihan, dan sumber belajar komputer terlengkap di Indonesia. Kami mendedikasikan diri untuk menyediakan materi berkualitas tinggi yang mudah dipahami oleh siapa saja—mulai dari pelajar sekolah, mahasiswa, guru, hingga masyarakat umum yang ingin menguasai teknologi.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Metode pembelajaran interaktif teori dan praktek langsung",
                        "Akses materi selamanya dengan update berkala sesuai perkembangan teknologi",
                        "Dukungan komunitas belajar aktif dan mentor yang berpengalaman"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setActiveTab("tentang")}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                    >
                      <span>Pelajari Profil Selengkapnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-xl"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1758685848208-e108b6af94cc?auto=format&fit=crop&w=1000&q=80"
                        alt="Labkom Activities"
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* KEUNGGULAN LABKOM OFFICIAL */}
            <section className="py-20 bg-slate-100/70 border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Mengapa Memilih Kami</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
                    Keunggulan Labkom Official
                  </h2>
                  <p className="text-slate-600">
                    Kami berkomitmen memberikan standar pendidikan teknologi terbaik dengan fasilitas dan kurikulum yang dirancang khusus untuk kesuksesan Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {advantages.map((adv, idx) => (
                    <div
                      key={idx}
                      data-testid={`advantage-card-${idx}`}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                        {adv.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{adv.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{adv.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* DAFTAR KURSUS UNGGULAN */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                  <div>
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Program Pilihan</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                      Kursus Unggulan Labkom Official
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("kursus")}
                    className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                  >
                    <span>Lihat Semua Kursus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      data-testid={`course-card-${course.id}`}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {course.category}
                        </div>
                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {course.level}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> {course.rating}</span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-xs text-slate-400 line-through block">{course.originalPrice}</span>
                            <span className="text-lg font-black text-blue-600">{course.price}</span>
                          </div>
                          <button
                            data-testid={`btn-detail-course-${course.id}`}
                            onClick={() => {
                              setSelectedCourse(course);
                              setActiveTab("kursus");
                            }}
                            className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                          >
                            Detail Kursus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ARTIKEL & TUTORIAL TERBARU */}
            <section className="py-20 bg-slate-50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                  <div>
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Pusat Pengetahuan</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                      Artikel & Tutorial Terbaru
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("artikel")}
                    className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                  >
                    <span>Baca Semua Artikel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      data-testid={`home-article-${art.id}`}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-md">{art.category}</span>
                          <span>{art.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={() => setActiveTab("artikel")}>
                          {art.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 line-clamp-3">{art.excerpt}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>{art.author}</span>
                        <button
                          onClick={() => setActiveTab("artikel")}
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          Baca <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0,transparent_60%)]" />
              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
                  Siap Meningkatkan Keterampilan Digital Anda Hari Ini?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
                  Bergabunglah dengan ribuan peserta lainnya di Labkom Official. Dapatkan bimbingan profesional dan wujudkan karier impian di era teknologi modern.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    data-testid="cta-banner-register"
                    onClick={() => {
                      setRegisterForm({ ...registerForm, courseName: "Pendaftaran Umum Labkom Official" });
                      setIsRegisterModalOpen(true);
                    }}
                    className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all hover:scale-105"
                  >
                    Daftar Kursus Sekarang
                  </button>
                  <a
                    href="https://wa.me/6287741844019"
                    target="_blank"
                    rel="noreferrer"
                    data-testid="cta-banner-whatsapp"
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-5 h-5" /> Hubungi WhatsApp Kami
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= TENTANG KAMI VIEW ================= */}
        {activeTab === "tentang" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Profil Institusi</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Tentang Labkom Official</h1>
                <p className="text-slate-600 text-lg">
                  Pusat informasi dan pembelajaran komputer resmi yang berdedikasi mencetak talenta digital unggul di Indonesia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi & Misi Kami</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    <strong className="text-slate-900">LABKOM OFFICIAL</strong> didirikan dengan visi menjadi pusat pendidikan teknologi dan komputer yang terdepan, inklusif, serta mudah diakses oleh seluruh lapisan masyarakat di www.labkomofficial.com.
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Edukasi Berkualitas</h4>
                        <p className="text-slate-600 text-sm">Menyediakan materi pembelajaran komputer dari tingkat dasar hingga profesional.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Inklusi Digital</h4>
                        <p className="text-slate-600 text-sm">Menjangkau pelajar, mahasiswa, guru, dan umum agar tidak tertinggal kemajuan teknologi.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1743071441939-18ae26ddce3e?auto=format&fit=crop&w=1000&q=80"
                    alt="Labkom Team"
                    className="w-full h-[450px] object-cover"
                  />
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl font-extrabold mb-4">Fasilitas Laboratorium & Layanan</h2>
                  <p className="text-slate-400">Kami dilengkapi dengan infrastruktur modern untuk mendukung proses belajar mengajar secara optimal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <Laptop className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Lab Komputer Fisik & Online</h3>
                    <p className="text-slate-400 text-sm">Kapasitas puluhan unit PC berspesifikasi tinggi dengan koneksi internet berkecepatan gigabit.</p>
                  </div>
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <Users className="w-10 h-10 text-sky-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Mentor Pakar Industri</h3>
                    <p className="text-slate-400 text-sm">Tim instruktur berpengalaman yang siap membimbing studi kasus nyata dari dunia kerja.</p>
                  </div>
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Sertifikasi & Portofolio</h3>
                    <p className="text-slate-400 text-sm">Validasi keterampilan Anda dengan sertifikat kelulusan resmi ber-ID verifikasi digital.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= BELAJAR KOMPUTER VIEW ================= */}
        {activeTab === "materi" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Pusat Belajar</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Materi Belajar Komputer</h1>
                <p className="text-slate-600 text-lg">
                  Pilih kategori materi yang ingin Anda pelajari. Tersedia panduan lengkap dari tingkat dasar hingga tingkat lanjut.
                </p>
              </div>

              {/* SEARCH & CATEGORIES */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    data-testid="materi-search-input"
                    placeholder="Cari materi komputer (misal: Excel, Python, Jaringan)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm text-base"
                  />
                </div>
              </div>

              {/* CATEGORY PILLS */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    data-testid={`category-pill-${idx}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* DISPLAY COURSES & MODULES MATCHING CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {course.category}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{course.level}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                          <p className="text-slate-600 text-sm mb-4">{course.description}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <span className="text-base font-bold text-blue-600">{course.price}</span>
                          <button
                            data-testid={`btn-explore-materi-${course.id}`}
                            onClick={() => {
                              setSelectedCourse(course);
                              setActiveTab("kursus");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                          >
                            Pelajari Materi
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <Laptop className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Tidak ditemukan materi</h3>
                    <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain atau pilih kategori "Semua".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= KURSUS VIEW ================= */}
        {activeTab === "kursus" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* IF A SPECIFIC COURSE IS SELECTED, SHOW DETAIL */}
              {selectedCourse ? (
                <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 mb-12 animate-in fade-in-50">
                  <button
                    data-testid="back-to-courses-btn"
                    onClick={() => setSelectedCourse(null)}
                    className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:underline"
                  >
                    ← Kembali ke Daftar Kursus
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                      <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                        {selectedCourse.category}
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{selectedCourse.title}</h1>
                      <p className="text-slate-600 text-lg leading-relaxed mb-6">{selectedCourse.description}</p>

                      <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-700 font-medium">
                        <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" /> {selectedCourse.duration}
                        </span>
                        <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-600" /> Level: {selectedCourse.level}
                        </span>
                        <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" /> {selectedCourse.students} Peserta Terdaftar
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-4">Silabus & Materi Belajar:</h3>
                      <div className="space-y-3 mb-8">
                        {selectedCourse.syllabus.map((sil, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-800">{sil}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl h-fit">
                      <div className="mb-6">
                        <span className="text-xs text-slate-400 line-through">{selectedCourse.originalPrice}</span>
                        <div className="text-3xl font-black text-blue-600">{selectedCourse.price}</div>
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Akses Selamanya + Sertifikat
                        </span>
                      </div>

                      <button
                        data-testid="daftar-kursus-detail-btn"
                        onClick={() => {
                          setRegisterForm({ ...registerForm, courseName: selectedCourse.title });
                          setIsRegisterModalOpen(true);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition-all mb-4 text-center block"
                      >
                        Daftar Kursus Ini
                      </button>

                      <a
                        href={`https://wa.me/6287741844019?text=Halo%20Labkom%20Official,%20saya%20tertarik%20mendaftar%20kursus%20${encodeURIComponent(selectedCourse.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="konsultasi-whatsapp-btn"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp className="w-5 h-5" /> Tanya via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Katalog Kursus</span>
                    <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Pilih Kursus Teknologi Terbaik Anda</h1>
                    <p className="text-slate-600 text-lg">
                      Tingkatkan keahlian digital Anda bersama instruktur profesional dengan harga terjangkau dan kurikulum berstandar industri.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        data-testid={`catalog-course-${course.id}`}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {course.category}
                          </div>
                          <div className="absolute top-4 right-4 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {course.level}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                              <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> {course.rating}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-xs text-slate-400 line-through block">{course.originalPrice}</span>
                              <span className="text-lg font-black text-blue-600">{course.price}</span>
                            </div>
                            <button
                              data-testid={`select-course-detail-${course.id}`}
                              onClick={() => setSelectedCourse(course)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TUTORIAL VIEW ================= */}
        {activeTab === "tutorial" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Pusat Tutorial Praktis</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Tutorial Langkah Demi Langkah</h1>
                <p className="text-slate-600 text-lg">
                  Panduan praktis pengoperasian software, hardware, dan trik komputer sehari-hari yang mudah dipahami pemula.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Cara Mudah Membuat Mail Merge Sertifikat dengan Excel dan Word",
                    category: "Microsoft Word",
                    readTime: "6 min baca",
                    desc: "Cetak ratusan sertifikat atau surat undangan otomatis dalam hitungan detik menggunakan fitur Mail Merge."
                  },
                  {
                    title: "Tutorial Dasar Mikrotik: Konfigurasi Hotspot dan DHCP Server",
                    category: "Jaringan Komputer",
                    readTime: "9 min baca",
                    desc: "Panduan konfigurasi router Mikrotik untuk warnet, kantor, atau sekolah dari awal hingga terhubung internet."
                  },
                  {
                    title: "Tips Mengatasi Komputer / Laptop Lemot Tanpa Instal Ulang",
                    category: "Troubleshooting Komputer",
                    readTime: "5 min baca",
                    desc: "Langkah-langkah membersihkan file sampah, mengatur startup, dan optimalisasi SSD agar laptop kembali ngebut."
                  }
                ].map((tut, idx) => (
                  <div key={idx} data-testid={`tutorial-card-${idx}`} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-md">{tut.category}</span>
                        <span>{tut.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{tut.title}</h3>
                      <p className="text-slate-600 text-sm mb-6">{tut.desc}</p>
                    </div>
                    <button
                      onClick={() => toast.info("Membuka tutorial lengkap...")}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline text-sm"
                    >
                      <span>Baca Tutorial Lengkap</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ARTIKEL VIEW ================= */}
        {activeTab === "artikel" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Artikel & Berita</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Wawasan & Teknologi Terkini</h1>
                <p className="text-slate-600 text-lg">
                  Update informasi seputar perkembangan dunia komputer, AI, dan tips dunia kerja profesional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((art) => (
                  <div key={art.id} data-testid={`article-item-${art.id}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-md">{art.category}</span>
                        <span>{art.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{art.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{art.content}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Oleh {art.author}</span>
                      <span className="text-blue-600 font-bold">{art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= MATERI DOWNLOAD VIEW ================= */}
        {activeTab === "download" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Free Resources</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Materi Belajar & Modul Download</h1>
                <p className="text-slate-600 text-lg">
                  Unduh cheat sheet, modul PDF, dan template presentasi siap pakai secara gratis untuk mendukung proses belajar Anda.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {downloadMaterials.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`download-item-${item.id}`}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.fileType} • {item.size}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <span className="text-xs text-slate-500 mt-1 block">Telah diunduh {item.downloads} kali</span>
                    </div>

                    <button
                      data-testid={`btn-download-${item.id}`}
                      onClick={() => triggerDownload(item)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= KONTAK VIEW ================= */}
        {activeTab === "kontak" && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Hubungi Kami</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Mari Terhubung dengan Labkom Official</h1>
                <p className="text-slate-600 text-lg">
                  Punya pertanyaan seputar pendaftaran kursus, kerjasama, atau konsultasi teknologi? Tim kami siap membantu Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Informasi Kontak Resmi</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">WhatsApp Resmi</h4>
                          <a href="https://wa.me/6287741844019" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                            0877-4184-4019
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Email Resmi</h4>
                          <a href="mailto:labkomlangitan25@gmail.com" className="text-blue-600 font-semibold hover:underline">
                            labkomlangitan25@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Domain Utama</h4>
                          <span className="text-slate-700 font-semibold">www.labkomofficial.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-3">Jam Operasional Layanan</h3>
                    <p className="text-blue-100 text-sm mb-4">Senin - Sabtu: 08.00 - 21.00 WIB<br />Minggu & Hari Libur: Sesi Khusus / Online</p>
                    <a
                      href="https://wa.me/6287741844019"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-100 transition-all"
                    >
                      <FaWhatsapp className="w-5 h-5 text-green-600" /> Chat Cepat via WhatsApp
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Kirim Pesan / Pertanyaan</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        data-testid="contact-name-input"
                        placeholder="Masukkan nama Anda"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        data-testid="contact-email-input"
                        placeholder="alamat.email@domain.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Pesan / Pertanyaan</label>
                      <textarea
                        data-testid="contact-message-input"
                        rows="4"
                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      data-testid="contact-submit-btn"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" /> Kirim Pesan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL PENDAFTARAN KURSUS */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-blue-600 font-bold uppercase text-xs">Form Pendaftaran Demo</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Daftar Kursus Labkom Official</h3>
              </div>
              <button
                data-testid="close-register-modal"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  data-testid="register-modal-name"
                  placeholder="Masukkan nama lengkap Anda"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  data-testid="register-modal-email"
                  placeholder="email@domain.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="text"
                  data-testid="register-modal-whatsapp"
                  placeholder="08xxxxxxxxxx"
                  value={registerForm.whatsapp}
                  onChange={(e) => setRegisterForm({ ...registerForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pilihan Kursus / Program</label>
                <input
                  type="text"
                  data-testid="register-modal-course"
                  value={registerForm.courseName}
                  onChange={(e) => setRegisterForm({ ...registerForm, courseName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  data-testid="register-modal-note"
                  rows="2"
                  placeholder="Pertanyaan atau jadwal yang diinginkan..."
                  value={registerForm.note}
                  onChange={(e) => setRegisterForm({ ...registerForm, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  data-testid="register-modal-submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Konfirmasi Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-lg text-white block leading-none">
                    LABKOM <span className="text-blue-500">OFFICIAL</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">
                    www.labkomofficial.com
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Pusat informasi dan pembelajaran komputer, teknologi, serta keterampilan digital terpercaya untuk pelajar, mahasiswa, dan masyarakat umum.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://wa.me/6287741844019" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-green-600 hover:text-white flex items-center justify-center text-slate-300 transition-all">
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-300 transition-all">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-300 transition-all">
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-300 transition-all">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6">Menu Navigasi</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { id: "home", label: "Home" },
                  { id: "tentang", label: "Tentang Kami" },
                  { id: "materi", label: "Belajar Komputer" },
                  { id: "kursus", label: "Kursus" },
                  { id: "tutorial", label: "Tutorial" }
                ].map((item) => (
                  <li key={item.id}>
                    <button onClick={() => setActiveTab(item.id)} className="hover:text-white transition-colors">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6">Kategori Belajar</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setActiveTab("materi")} className="hover:text-white transition-colors">Microsoft Office & Excel</button></li>
                <li><button onClick={() => setActiveTab("materi")} className="hover:text-white transition-colors">Coding & Programming</button></li>
                <li><button onClick={() => setActiveTab("materi")} className="hover:text-white transition-colors">Data Analyst & Python</button></li>
                <li><button onClick={() => setActiveTab("materi")} className="hover:text-white transition-colors">Desain Grafis & UI/UX</button></li>
                <li><button onClick={() => setActiveTab("materi")} className="hover:text-white transition-colors">AI & Teknologi Terkini</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6">Kontak & Lokasi</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>WhatsApp: 0877-4184-4019</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>labkomlangitan25@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>www.labkomofficial.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 LABKOM OFFICIAL (www.labkomofficial.com). Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-slate-400 cursor-pointer">Bantuan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
