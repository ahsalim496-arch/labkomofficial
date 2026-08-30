import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rina Ayu Wulandari",
    role: "Staff Admin, PT Nusantara Digital",
    course: "Mastering Microsoft Office Professional",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina&backgroundColor=b6e3f4",
    quote:
      "Awalnya saya cuma bisa buka Excel dan mengetik. Setelah 4 minggu di LABKOM, saya sekarang bikin laporan otomatis dengan VLOOKUP dan Pivot Table. Bos saya sampai kaget dan langsung menaikkan gaji!",
  },
  {
    id: 2,
    name: "Bayu Setiawan",
    role: "Freelance Web Developer, Bandung",
    course: "Fullstack Web Development & AI Integration",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bayu&backgroundColor=c0aede",
    quote:
      "Instrukturnya sabar banget menjelaskan React dan integrasi AI. Proyek akhir saya (chatbot toko) langsung dipakai klien pertama dan menghasilkan 5 juta di bulan pertama. Worth it banget!",
  },
  {
    id: 3,
    name: "Dinda Permatasari",
    role: "Mahasiswa Statistika UNS",
    course: "Data Analyst Fundamentals",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dinda&backgroundColor=ffdfbf",
    quote:
      "Materi Python + SQL disajikan step-by-step, tidak bikin pusing. Saya lolos magang di startup fintech gara-gara portofolio dashboard yang saya buat selama kursus. Terima kasih LABKOM!",
  },
  {
    id: 4,
    name: "Adi Nugroho",
    role: "Guru SMK Multimedia, Yogyakarta",
    course: "Desain Grafis Profesional & UI/UX",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adi&backgroundColor=d1d4f9",
    quote:
      "Saya ambil kursus ini untuk memperbarui materi mengajar di sekolah. Sekarang siswa saya jadi lebih antusias belajar Figma dan Photoshop karena bahannya kekinian. Mentornya juga responsif di grup WA.",
  },
  {
    id: 5,
    name: "Cahya Prasetya",
    role: "IT Support, Sekolah Kristen Kalam Kudus",
    course: "Jaringan Komputer & Keamanan Siber Dasar",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cahya&backgroundColor=b5ead7",
    quote:
      "Sebelumnya saya belajar Mikrotik otodidak, banyak error. Setelah ikut kursus, konfigurasi hotspot dan bandwidth management jadi rapi. Jaringan sekolah sekarang jauh lebih stabil.",
  },
  {
    id: 6,
    name: "Salsabila Rahmat",
    role: "Content Creator & UMKM Fashion",
    course: "AI & Prompt Engineering untuk Produktivitas",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=salsa&backgroundColor=ffb3c1",
    quote:
      "Bikin caption produk yang dulu makan waktu 2 jam, sekarang cuma 10 menit pakai teknik prompt yang diajarkan. Produktivitas naik drastis dan omzet toko online saya juga ikut naik 40%.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Cerita Alumni</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
            Kisah Sukses Alumni LABKOM OFFICIAL
          </h2>
          <p className="text-slate-600">
            Ribuan alumni telah membuktikan bahwa investasi belajar di LABKOM mengubah karier dan penghasilan mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              data-testid={`testimonial-${t.id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative flex flex-col"
            >
              <Quote className="w-10 h-10 text-blue-100 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">{t.rating}.0</span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-500 truncate">{t.role}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5 truncate">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-full text-sm font-bold">
            <Star className="w-4 h-4 fill-blue-600" />
            Rating rata-rata alumni: <span className="text-lg">4.9/5.0</span> dari 12.400+ ulasan
          </div>
        </div>
      </div>
    </section>
  );
}
