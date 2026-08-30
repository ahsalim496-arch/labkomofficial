import React, { useEffect, useState } from "react";
import { Star, Quote, PencilLine, X, Send } from "lucide-react";
import { toast } from "sonner";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Fallback testimoni fiktif (ditampilkan jika belum ada ulasan bintang 5 tersimpan)
const fallbackTestimonials = [
  {
    id: "f1",
    name: "Rina Ayu Wulandari",
    role: "Staff Admin, PT Nusantara Digital",
    course_name: "Mastering Microsoft Office Professional",
    rating: 5,
    comment:
      "Awalnya saya cuma bisa buka Excel dan mengetik. Setelah 4 minggu di LABKOM, saya sekarang bikin laporan otomatis dengan VLOOKUP dan Pivot Table. Bos saya sampai kaget dan langsung menaikkan gaji!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina&backgroundColor=b6e3f4",
  },
  {
    id: "f2",
    name: "Bayu Setiawan",
    role: "Freelance Web Developer, Bandung",
    course_name: "Fullstack Web Development & AI Integration",
    rating: 5,
    comment:
      "Instrukturnya sabar banget menjelaskan React dan integrasi AI. Proyek akhir saya (chatbot toko) langsung dipakai klien pertama dan menghasilkan 5 juta di bulan pertama. Worth it banget!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bayu&backgroundColor=c0aede",
  },
  {
    id: "f3",
    name: "Dinda Permatasari",
    role: "Mahasiswa Statistika UNS",
    course_name: "Data Analyst Fundamentals",
    rating: 5,
    comment:
      "Materi Python + SQL disajikan step-by-step, tidak bikin pusing. Saya lolos magang di startup fintech gara-gara portofolio dashboard yang saya buat selama kursus. Terima kasih LABKOM!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dinda&backgroundColor=ffdfbf",
  },
  {
    id: "f4",
    name: "Adi Nugroho",
    role: "Guru SMK Multimedia, Yogyakarta",
    course_name: "Desain Grafis Profesional & UI/UX",
    rating: 5,
    comment:
      "Saya ambil kursus ini untuk memperbarui materi mengajar di sekolah. Sekarang siswa saya jadi lebih antusias belajar Figma dan Photoshop karena bahannya kekinian. Mentornya juga responsif di grup WA.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adi&backgroundColor=d1d4f9",
  },
  {
    id: "f5",
    name: "Salsabila Rahmat",
    role: "Content Creator & UMKM Fashion",
    course_name: "AI & Prompt Engineering untuk Produktivitas",
    rating: 5,
    comment:
      "Bikin caption produk yang dulu makan waktu 2 jam, sekarang cuma 10 menit pakai teknik prompt yang diajarkan. Produktivitas naik drastis dan omzet toko online saya juga ikut naik 40%.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=salsa&backgroundColor=ffb3c1",
  },
];

const avatarFor = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "labkom")}&backgroundColor=b6e3f4,c0aede,ffdfbf,d1d4f9,b5ead7,ffb3c1`;

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", course_name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch(`${backendUrl}/api/reviews?min_rating=5&limit=12`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.length < 2) return toast.error("Nama minimal 2 karakter");
    if (!form.course_name || form.course_name.length < 2) return toast.error("Nama kursus wajib diisi");
    if (!form.comment || form.comment.length < 10) return toast.error("Ulasan minimal 10 karakter");
    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Gagal mengirim ulasan");
        return;
      }
      toast.success(form.rating >= 5 ? "Terima kasih! Ulasan Anda akan tampil di halaman Kursus." : "Terima kasih atas ulasan Anda!");
      setForm({ name: "", role: "", course_name: "", rating: 5, comment: "" });
      setModalOpen(false);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const displayed = items.length > 0 ? items : fallbackTestimonials;
  const isFallback = items.length === 0;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Cerita Alumni</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
            Kisah Sukses Alumni LABKOM OFFICIAL
          </h2>
          <p className="text-slate-600 mb-6">
            {isFallback
              ? "Ribuan alumni telah membuktikan bahwa investasi belajar di LABKOM mengubah karier mereka. Bagikan cerita Anda juga!"
              : "Ulasan asli dari alumni LABKOM yang telah menyelesaikan kursus dan berbagi pengalaman."}
          </p>
          <button
            data-testid="open-review-form-btn"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30"
          >
            <PencilLine className="w-4 h-4" /> Tulis Ulasan Anda
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? [] : displayed).map((t, idx) => (
            <div
              key={t.id}
              data-testid={`testimonial-${idx + 1}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative flex flex-col"
            >
              <Quote className="w-10 h-10 text-blue-100 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">{t.rating}.0</span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 flex-1">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar || avatarFor(t.name)}
                  alt={t.name}
                  className="w-12 h-12 rounded-full bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-500 truncate">{t.role}</p>}
                  <p className="text-xs text-blue-600 font-semibold mt-0.5 truncate">{t.course_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !isFallback && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-full text-sm font-bold">
              <Star className="w-4 h-4 fill-blue-600" />
              {displayed.length} ulasan bintang 5 dari alumni terverifikasi
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-blue-600 font-bold uppercase text-xs">Ulasan Alumni</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Bagikan Cerita Anda</h3>
              </div>
              <button
                data-testid="close-review-modal"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Anda</label>
                <input
                  data-testid="review-name-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
                  maxLength={80}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Profesi / Peran (opsional)</label>
                <input
                  data-testid="review-role-input"
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Contoh: Freelance Developer, Mahasiswa"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kursus yang Diikuti</label>
                <input
                  data-testid="review-course-input"
                  type="text"
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rating Anda</label>
                <div className="flex gap-2" data-testid="review-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      data-testid={`rating-star-${star}`}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= form.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 self-center text-sm font-bold text-slate-600">{form.rating}.0</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ulasan (min 10 karakter)</label>
                <textarea
                  data-testid="review-comment-input"
                  rows="4"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Ceritakan pengalaman belajar Anda di LABKOM OFFICIAL..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">{form.comment.length}/500 karakter</p>
              </div>
              <button
                type="submit"
                data-testid="review-submit-btn"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> {submitting ? "Mengirim..." : "Kirim Ulasan"}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Ulasan bintang 5 akan tampil otomatis di halaman Kursus.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
