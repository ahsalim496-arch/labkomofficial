import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { ArrowLeft, ExternalLink, Calendar, Clock, User, Tag } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { findArticle, findTutorial, articles, tutorials, slugify } from "../data/content";

const setMeta = (title, description) => {
  document.title = `${title} | LABKOM OFFICIAL`;
  let m = document.querySelector('meta[name="description"]');
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("name", "description");
    document.head.appendChild(m);
  }
  m.setAttribute("content", description);
};

const handleShare = async (url, title) => {
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      toast.success("Tautan berhasil disalin");
      return;
    }
    throw new Error("no-clipboard");
  } catch (err) {
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand && document.execCommand("copy");
      document.body.removeChild(ta);
      ok ? toast.success("Tautan berhasil disalin") : toast.info("Salin tautan manual: " + url);
    } catch (e) {
      toast.info("Salin tautan manual: " + url);
    }
  }
};

const ContentDetailLayout = ({ item, type }) => {
  const navigate = useNavigate();
  const relatedList = type === "artikel" ? articles : tutorials;
  const related = relatedList.filter((r) => r.id !== item.id).slice(0, 2);

  useEffect(() => {
    setMeta(item.title, item.excerpt || item.desc || item.content?.slice(0, 160) || item.title);
    window.scrollTo(0, 0);
  }, [item]);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="detail-home-link">
            <img src="/assets/labkom-logo.png" alt="LABKOM" className="w-10 h-10 object-contain" />
            <span className="font-extrabold text-lg text-slate-900">
              LABKOM <span className="text-blue-600">OFFICIAL</span>
            </span>
          </Link>
          <button
            data-testid="back-to-home-btn"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            to={type === "artikel" ? "/#artikel" : "/#tutorial"}
            className="inline-block bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-md mb-6"
          >
            <Tag className="w-3.5 h-3.5 inline mr-1.5" /> {item.category}
          </Link>
          <h1 data-testid="content-detail-title" className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
            {item.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-b border-slate-100 pb-6">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {item.author}</span>
            {item.date && (
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {item.date}</span>
            )}
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {item.readTime}</span>
          </div>
        </div>

        <article data-testid="content-detail-body" className="text-slate-700 text-lg leading-8 whitespace-pre-line">
          {item.content || item.desc}
        </article>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-3 items-center">
          <span className="text-sm text-slate-500">Bagikan konten ini:</span>
          <button
            data-testid="share-content-button"
            onClick={() => handleShare(window.location.href, item.title)}
            className="ml-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Bagikan Tautan
          </button>
          <a
            href={`https://wa.me/6287741844019?text=${encodeURIComponent(`Baca ${type}: ${item.title} - ${window.location.href}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <FaWhatsapp className="w-4 h-4" /> Kirim WhatsApp
          </a>
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Baca {type === "artikel" ? "Artikel" : "Tutorial"} Lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/${type}/${slugify(r.title)}`}
                  data-testid={`related-${type}-${r.id}`}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all bg-white"
                >
                  <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">{r.category}</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-3 mb-2 line-clamp-2">{r.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{r.excerpt || r.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const item = findArticle(slug);
  if (!item) return <NotFound type="artikel" />;
  return <ContentDetailLayout item={item} type="artikel" />;
};

export const TutorialDetailPage = () => {
  const { slug } = useParams();
  const item = findTutorial(slug);
  if (!item) return <NotFound type="tutorial" />;
  return <ContentDetailLayout item={item} type="tutorial" />;
};

const NotFound = ({ type }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
    <img src="/assets/labkom-logo.png" alt="LABKOM" className="w-20 h-20 object-contain mb-6" />
    <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{type === "artikel" ? "Artikel" : "Tutorial"} Tidak Ditemukan</h1>
    <p className="text-slate-600 mb-6">Konten yang Anda cari mungkin telah dipindahkan atau tidak tersedia.</p>
    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">Kembali ke Beranda</Link>
  </div>
);
