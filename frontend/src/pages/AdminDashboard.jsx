import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Trash2,
  Plus,
  Lock,
  RefreshCw,
  ExternalLink,
  Calendar,
  Star,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const resolveUrl = (u) => (u && u.startsWith("/api/") ? `${backendUrl}${u}` : u);

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key") || "";
  const [verified, setVerified] = useState(null);
  const [tab, setTab] = useState("registrations");
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ registrations: 0, contacts: 0, gallery: 0 });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", type: "foto", url: "", description: "", category: "Kegiatan Kursus" });
  const [uploadMode, setUploadMode] = useState("upload"); // "upload" | "url"
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const authHeader = useMemo(() => ({ "x-admin-key": key, "Content-Type": "application/json" }), [key]);

  useEffect(() => {
    document.title = "Admin Dashboard | LABKOM OFFICIAL";
    if (!key) {
      setVerified(false);
      return;
    }
    fetch(`${backendUrl}/api/admin/verify?key=${encodeURIComponent(key)}`)
      .then((r) => setVerified(r.ok))
      .catch(() => setVerified(false));
  }, [key]);

  const loadAll = async () => {
    if (!verified) return;
    setLoading(true);
    try {
      const params = [];
      if (dateFrom) params.push(`from=${dateFrom}`);
      if (dateTo) params.push(`to=${dateTo}`);
      const qs = params.length ? `&${params.join("&")}` : "";
      const [regRes, conRes, galRes, statsRes, revRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/registrations?key=${encodeURIComponent(key)}${qs}`, { headers: authHeader }),
        fetch(`${backendUrl}/api/admin/contacts?key=${encodeURIComponent(key)}${qs}`, { headers: authHeader }),
        fetch(`${backendUrl}/api/gallery`),
        fetch(`${backendUrl}/api/admin/stats?key=${encodeURIComponent(key)}`, { headers: authHeader }),
        fetch(`${backendUrl}/api/admin/reviews?key=${encodeURIComponent(key)}`, { headers: authHeader }),
      ]);
      if (regRes.ok) setRegistrations(await regRes.json());
      if (conRes.ok) setContacts(await conRes.json());
      if (galRes.ok) setGallery(await galRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (e) {
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified, dateFrom, dateTo]);

  const submitGallery = async (e) => {
    e.preventDefault();
    if (uploadMode === "upload" && newItem.type === "foto") {
      if (!newItem.title || !uploadFile) {
        toast.error("Judul dan file foto wajib diisi");
        return;
      }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", uploadFile);
        const q = new URLSearchParams({
          key,
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
        });
        const res = await fetch(`${backendUrl}/api/admin/gallery/upload?${q.toString()}`, {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          toast.success("Foto berhasil diupload");
          setNewItem({ title: "", type: "foto", url: "", description: "", category: "Kegiatan Kursus" });
          setUploadFile(null);
          loadAll();
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.detail || "Gagal upload foto");
        }
      } finally {
        setUploading(false);
      }
      return;
    }
    if (!newItem.title || !newItem.url) {
      toast.error("Judul dan URL wajib diisi");
      return;
    }
    const res = await fetch(`${backendUrl}/api/admin/gallery?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      toast.success("Item galeri ditambahkan");
      setNewItem({ title: "", type: "foto", url: "", description: "", category: "Kegiatan Kursus" });
      loadAll();
    } else {
      toast.error("Gagal menambah item");
    }
  };

  const removeGallery = async (id) => {
    if (!window.confirm("Hapus item galeri ini?")) return;
    const res = await fetch(`${backendUrl}/api/admin/gallery/${id}?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) {
      toast.success("Item dihapus");
      loadAll();
    } else {
      toast.error("Gagal menghapus");
    }
  };

  const setReviewApproved = async (id, approved) => {
    const res = await fetch(`${backendUrl}/api/admin/reviews/${id}?key=${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: authHeader,
      body: JSON.stringify({ approved }),
    });
    if (res.ok) {
      toast.success(approved ? "Ulasan disetujui" : "Ulasan disembunyikan");
      loadAll();
    } else {
      toast.error("Gagal update ulasan");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Hapus ulasan ini permanen?")) return;
    const res = await fetch(`${backendUrl}/api/admin/reviews/${id}?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) {
      toast.success("Ulasan dihapus");
      loadAll();
    } else {
      toast.error("Gagal menghapus");
    }
  };

  if (verified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  if (verified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Akses Ditolak</h1>
          <p className="text-slate-600 mb-6">Kunci admin tidak valid atau tidak disertakan. Gunakan URL dengan parameter <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">?key=...</code></p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold" data-testid="back-home-btn">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "registrations", label: "Pendaftaran", icon: Users, count: stats.registrations },
    { id: "contacts", label: "Pesan Kontak", icon: MessageSquare, count: stats.contacts },
    { id: "gallery", label: "Galeri Kursus", icon: ImageIcon, count: stats.gallery },
    { id: "reviews", label: "Ulasan Alumni", icon: Star, count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/labkom-logo.png" alt="LABKOM" className="w-10 h-10 object-contain bg-white/5 rounded-xl p-1" />
            <div>
              <span className="font-extrabold text-lg block leading-none">
                LABKOM <span className="text-blue-400">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Panel Kontrol Internal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              data-testid="refresh-btn"
              onClick={loadAll}
              className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <Link to="/" className="text-slate-300 hover:text-white text-sm font-semibold">
              Ke Website
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <span className="text-blue-600 font-bold uppercase text-xs tracking-widest">Dashboard</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Ringkasan Kegiatan LABKOM</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              data-testid={`admin-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                tab === t.id ? "border-blue-500 bg-white shadow-lg ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tab === t.id ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-900">{t.count}</span>
              </div>
              <p className="text-sm font-bold text-slate-700">{t.label}</p>
            </button>
          ))}
        </div>

        {(tab === "registrations" || tab === "contacts") && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-widest">Dari Tanggal</label>
                <input
                  type="date"
                  data-testid="filter-from-date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-widest">Sampai Tanggal</label>
                <input
                  type="date"
                  data-testid="filter-to-date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                />
              </div>
              <button
                data-testid="apply-filter-btn"
                onClick={loadAll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Terapkan Filter
              </button>
              <button
                data-testid="reset-filter-btn"
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-slate-600 hover:text-slate-900 text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {tab === "registrations" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Daftar Pendaftaran Kursus ({registrations.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-6 py-3 font-bold">Waktu</th>
                    <th className="text-left px-6 py-3 font-bold">Nama</th>
                    <th className="text-left px-6 py-3 font-bold">WhatsApp</th>
                    <th className="text-left px-6 py-3 font-bold">Email</th>
                    <th className="text-left px-6 py-3 font-bold">Kursus</th>
                    <th className="text-left px-6 py-3 font-bold">Email Terkirim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">Belum ada data pendaftaran</td>
                    </tr>
                  ) : (
                    registrations.map((r) => (
                      <tr key={r.id} data-testid={`reg-row-${r.id}`} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-600 text-xs">{new Date(r.submitted_at).toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{r.name}</td>
                        <td className="px-6 py-4 text-slate-700">
                          <a href={`https://wa.me/62${r.whatsapp?.replace(/^0/, "")}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                            {r.whatsapp}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{r.email || "-"}</td>
                        <td className="px-6 py-4 text-slate-700">{r.course_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.notification_sent ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {r.notification_sent ? "Terkirim" : "Gagal"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "contacts" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Daftar Pesan Kontak ({contacts.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-6 py-3 font-bold">Waktu</th>
                    <th className="text-left px-6 py-3 font-bold">Nama</th>
                    <th className="text-left px-6 py-3 font-bold">Email</th>
                    <th className="text-left px-6 py-3 font-bold">Pesan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-slate-500">Belum ada pesan</td></tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} data-testid={`contact-row-${c.id}`} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-600 text-xs">{new Date(c.submitted_at).toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="px-6 py-4 text-slate-700">{c.email || "-"}</td>
                        <td className="px-6 py-4 text-slate-700 max-w-md">{c.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={submitGallery} className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Tambah Foto/Video</h2>
              </div>
              <input
                data-testid="gallery-title-input"
                type="text"
                placeholder="Judul dokumentasi"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                required
              />
              <select
                data-testid="gallery-type-select"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
              >
                <option value="foto">Foto</option>
                <option value="video">Video (URL YouTube)</option>
              </select>

              {newItem.type === "foto" && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    data-testid="gallery-mode-upload"
                    onClick={() => setUploadMode("upload")}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${uploadMode === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                  <button
                    type="button"
                    data-testid="gallery-mode-url"
                    onClick={() => setUploadMode("url")}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${uploadMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> URL Eksternal
                  </button>
                </div>
              )}

              {newItem.type === "foto" && uploadMode === "upload" ? (
                <div>
                  <label
                    htmlFor="gallery-file-input"
                    className="flex flex-col items-center justify-center w-full px-4 py-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-center"
                  >
                    <Upload className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">
                      {uploadFile ? uploadFile.name : "Pilih atau ambil foto"}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP (maks 8MB)</span>
                    <input
                      id="gallery-file-input"
                      data-testid="gallery-file-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <input
                  data-testid="gallery-url-input"
                  type="url"
                  placeholder={newItem.type === "foto" ? "https://.../image.jpg" : "https://www.youtube.com/watch?v=..."}
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                  required={newItem.type === "video" || uploadMode === "url"}
                />
              )}
              <input
                data-testid="gallery-category-input"
                type="text"
                placeholder="Kategori (mis. Kegiatan Kursus)"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
              />
              <textarea
                data-testid="gallery-description-input"
                rows="3"
                placeholder="Deskripsi singkat"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
              />
              <button
                type="submit"
                data-testid="gallery-submit-btn"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold text-sm shadow-md"
              >
                {uploading ? (<><RefreshCw className="w-4 h-4 inline mr-1 animate-spin" /> Mengupload...</>) : (<><Plus className="w-4 h-4 inline mr-1" /> Simpan ke Galeri</>)}
              </button>
            </form>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Galeri Aktif ({gallery.length})</h2>
              {gallery.length === 0 ? (
                <p className="text-slate-500 text-center py-12">Belum ada foto/video. Tambahkan di form kiri.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} data-testid={`gallery-item-${g.id}`} className="border border-slate-200 rounded-xl overflow-hidden group">
                      <div className="aspect-video bg-slate-100 relative">
                        {g.type === "foto" ? (
                          <img src={resolveUrl(g.url)} alt={g.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity = 0.3; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                            <Video className="w-12 h-12 opacity-50" />
                          </div>
                        )}
                        <button
                          data-testid={`gallery-delete-${g.id}`}
                          onClick={() => removeGallery(g.id)}
                          className="absolute top-2 right-2 w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-600">{g.type.toUpperCase()}</span>
                          <a href={resolveUrl(g.url)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{g.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{g.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Ulasan Alumni ({reviews.length})</h2>
              <p className="text-xs text-slate-500">Bintang 5 & disetujui akan tampil di halaman Kursus</p>
            </div>
            {reviews.length === 0 ? (
              <p className="text-center py-16 text-slate-500">Belum ada ulasan masuk.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <div key={r.id} data-testid={`review-row-${r.id}`} className="p-6 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        ))}
                        <span className="text-xs font-bold text-slate-500 ml-1">{r.rating}.0</span>
                        {!r.approved && (
                          <span className="ml-2 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md">DISEMBUNYIKAN</span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed mb-2">"{r.comment}"</p>
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-900">{r.name}</span>
                        {r.role && <> — {r.role}</>} · <span className="text-blue-600 font-semibold">{r.course_name}</span> · {new Date(r.submitted_at).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      {r.approved ? (
                        <button
                          data-testid={`review-hide-${r.id}`}
                          onClick={() => setReviewApproved(r.id, false)}
                          className="px-3 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg"
                        >
                          Sembunyikan
                        </button>
                      ) : (
                        <button
                          data-testid={`review-approve-${r.id}`}
                          onClick={() => setReviewApproved(r.id, true)}
                          className="px-3 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg"
                        >
                          Setujui
                        </button>
                      )}
                      <button
                        data-testid={`review-delete-${r.id}`}
                        onClick={() => deleteReview(r.id)}
                        className="px-3 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
