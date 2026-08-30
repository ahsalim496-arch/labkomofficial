import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, ImageIcon as ImgIcon, Video } from "lucide-react";
import { Toaster } from "sonner";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const resolveUrl = (u) => (u && u.startsWith("/api/") ? `${backendUrl}${u}` : u);

const getYouTubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    return parts[parts.length - 1];
  } catch {
    return null;
  }
};

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = "Galeri Foto & Video Kursus | LABKOM OFFICIAL";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", "Dokumentasi foto dan video kegiatan kursus LABKOM OFFICIAL - workshop, sesi belajar, dan aktivitas alumni.");
    fetch(`${backendUrl}/api/gallery`)
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "semua" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/labkom-logo.png" alt="LABKOM" className="w-10 h-10 object-contain" />
            <span className="font-extrabold text-lg text-slate-900">
              LABKOM <span className="text-blue-600">OFFICIAL</span>
            </span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm" data-testid="gallery-back">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Dokumentasi</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">Galeri Foto & Video Kursus</h1>
          <p className="text-slate-600 text-lg">
            Lihat momen-momen kegiatan belajar, workshop, dan aktivitas seru bersama LABKOM OFFICIAL.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {[
            { id: "semua", label: "Semua", icon: null },
            { id: "foto", label: "Foto", icon: ImgIcon },
            { id: "video", label: "Video", icon: Video },
          ].map((f) => (
            <button
              key={f.id}
              data-testid={`gallery-filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === f.id ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.icon && <f.icon className="w-4 h-4" />}
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Memuat galeri...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <ImgIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Dokumentasi</h3>
            <p className="text-slate-500">Foto dan video kursus akan ditampilkan di sini setelah admin menambahkannya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g) => {
              const ytId = g.type === "video" ? getYouTubeId(g.url) : null;
              const thumb = g.type === "video" && ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : resolveUrl(g.url);
              return (
                <button
                  key={g.id}
                  data-testid={`public-gallery-${g.id}`}
                  onClick={() => setSelected({ ...g, ytId })}
                  className="text-left bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img src={thumb} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { e.target.style.opacity = 0.3; }} />
                    {g.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                        <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                          <Play className="w-7 h-7 text-blue-600 fill-blue-600 ml-1" />
                        </div>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                      {g.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{g.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{g.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-black">
              {selected.type === "video" && selected.ytId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selected.ytId}?autoplay=1`}
                  title={selected.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img src={resolveUrl(selected.url)} alt={selected.title} className="w-full h-full object-contain" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{selected.title}</h3>
              <p className="text-slate-600 mt-2">{selected.description}</p>
              <button data-testid="close-gallery-modal" onClick={() => setSelected(null)} className="mt-4 text-slate-500 hover:text-slate-900 font-semibold text-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
