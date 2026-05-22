"use client";
import { useState, useRef, ChangeEvent } from "react";
import { supabase, uploadImage, Template, Wedding } from "@/lib/supabase";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6";
import Template7 from "./templates/Template7";
import Template8 from "./templates/Template8";

const TEMPLATES: {
  id: Template;
  name: string;
  desc: string;
  preview: string;
  accent: string;
}[] = [
  {
    id: "romantic",
    name: "Romantic",
    desc: "Ақ · Қызғылт · Гүлді",
    preview: "bg-gradient-to-br from-rose-100 to-pink-200",
    accent: "border-rose-400 ring-rose-200",
  },
  {
    id: "luxury",
    name: "Luxury",
    desc: "Қара · Алтын · Сәнді",
    preview: "bg-gradient-to-br from-neutral-800 to-amber-900",
    accent: "border-amber-500 ring-amber-200",
  },
  // {
  //   id: "bohemian",
  //   name: "Bohemian",
  //   desc: "Тас · Жасыл · Табиғат",
  //   preview: "bg-gradient-to-br from-stone-200 to-emerald-100",
  //   accent: "border-emerald-500 ring-emerald-200",
  // },
  // {
  //   id: "azure",
  //   name: "Azure",
  //   desc: "Ақ · Көк · Нәзік",
  //   preview: "bg-gradient-to-br from-sky-100 to-blue-200",
  //   accent: "border-sky-400 ring-sky-200",
  // },
  // {
  //   id: "sage",
  //   name: "Sage",
  //   desc: "Жасылдау · Табиғи · Тыныш",
  //   preview: "bg-gradient-to-br from-green-50 to-emerald-200",
  //   accent: "border-green-400 ring-green-200",
  // },
  // {
  //   id: "blush",
  //   name: "Blush",
  //   desc: "Нәзік · Қызғылт · Романтик",
  //   preview: "bg-gradient-to-br from-pink-50 to-rose-100",
  //   accent: "border-pink-300 ring-pink-100",
  // },
  // {
  //   id: "midnight",
  //   name: "Midnight",
  //   desc: "Аспан · Қара көк · Кеш",
  //   preview: "bg-gradient-to-br from-slate-800 to-indigo-950",
  //   accent: "border-indigo-400 ring-indigo-900",
  // },
  // {
  //   id: "terracotta",
  //   name: "Terracotta",
  //   desc: "Балшық · Қызылдау · Жылы",
  //   preview: "bg-gradient-to-br from-orange-100 to-red-200",
  //   accent: "border-orange-400 ring-orange-200",
  // },
];

const INPUT =
  "w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 bg-white/80 transition-all placeholder:text-stone-300 font-[Josefin_Sans,sans-serif]";
const LABEL =
  "block text-[11px] text-stone-400 font-[Josefin_Sans,sans-serif] uppercase tracking-widest mb-1.5";
const SECTION =
  "bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-white/80 shadow-sm shadow-rose-100/30 space-y-4";

const EMPTY_WEDDING: Omit<Wedding, "id" | "created_at"> = {
  male_name: "",
  female_name: "",
  wedding_date: null,
  venue_name: null,
  venue_address: null,
  organizer: null,
  phone: null,
  template: "romantic",
  main_photo_url: null,
  gallery_urls: null,
  photo3_url: null,
  photo4_url: null,
  photo5_url: null,
  description1: null,
  description2: null,
  link1: null,
  link2: null,
  extra1: null,
  extra2: null,
  extra3: null,
  extra4: null,
  extra5: null,
};

export default function WeddingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [template, setTemplate] = useState<Template>("romantic");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);

  const [f, setF] = useState({
    maleName: "",
    femaleName: "",
    date: "",
    time: "",
    venueName: "",
    venueAddress: "",
    organizer: "",
    phone: "",
    desc1: "",
    desc2: "",
    link1: "",
    link2: "",
    extra1: "",
    extra2: "",
    extra3: "",
    extra4: "",
    extra5: "",
  });

  const upd =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  const mainRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const p3Ref = useRef<HTMLInputElement>(null);
  const p4Ref = useRef<HTMLInputElement>(null);
  const p5Ref = useRef<HTMLInputElement>(null);

  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [p3Preview, setP3Preview] = useState<string | null>(null);
  const [p4Preview, setP4Preview] = useState<string | null>(null);
  const [p5Preview, setP5Preview] = useState<string | null>(null);

  const previewWedding: Omit<Wedding, "id" | "created_at"> = {
    ...EMPTY_WEDDING,
    male_name: f.maleName || "Жасұлан",
    female_name: f.femaleName || "Альбина",
    wedding_date: f.date ? (f.time ? `${f.date}T${f.time}` : f.date) : null,
    venue_name: f.venueName || null,
    venue_address: f.venueAddress || null,
    organizer: f.organizer || null,
    phone: f.phone || null,
    template,
    main_photo_url: mainPreview,
    gallery_urls: galleryPreviews.length ? galleryPreviews : null,
    photo3_url: p3Preview,
    photo4_url: p4Preview,
    photo5_url: p5Preview,
    description1: f.desc1 || null,
    description2: f.desc2 || null,
    link1: f.link1 || null,
    link2: f.link2 || null,
    extra1: f.extra1 || null,
    extra2: f.extra2 || null,
    extra3: f.extra3 || null,
    extra4: f.extra4 || null,
    extra5: f.extra5 || null,
  };

  const handleSubmit = async () => {
    if (!f.maleName.trim() || !f.femaleName.trim()) {
      setStatus({
        ok: false,
        msg: "Жігіт пен қыздың атын міндетті түрде енгізіңіз.",
      });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const ts = Date.now();
      const mainFile = mainRef.current?.files?.[0];
      const galleryFiles = Array.from(galleryRef.current?.files || []).slice(
        0,
        5,
      );
      const p3 = p3Ref.current?.files?.[0];
      const p4 = p4Ref.current?.files?.[0];
      const p5 = p5Ref.current?.files?.[0];

      const mainUrl = mainFile
        ? await uploadImage(mainFile, `${ts}_main_${mainFile.name}`)
        : null;
      const galleryUrls: string[] = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const u = await uploadImage(
          galleryFiles[i],
          `${ts}_g${i}_${galleryFiles[i].name}`,
        );
        if (u) galleryUrls.push(u);
      }
      const p3Url = p3 ? await uploadImage(p3, `${ts}_p3_${p3.name}`) : null;
      const p4Url = p4 ? await uploadImage(p4, `${ts}_p4_${p4.name}`) : null;
      const p5Url = p5 ? await uploadImage(p5, `${ts}_p5_${p5.name}`) : null;
      const weddingDate = f.date
        ? f.time
          ? `${f.date}T${f.time}`
          : f.date
        : null;

      const { error } = await supabase.from("weddings").insert({
        male_name: f.maleName.trim(),
        female_name: f.femaleName.trim(),
        wedding_date: weddingDate,
        venue_name: f.venueName || null,
        venue_address: f.venueAddress || null,
        organizer: f.organizer || null,
        phone: f.phone || null,
        template,
        main_photo_url: mainUrl,
        gallery_urls: galleryUrls.length ? galleryUrls : null,
        photo3_url: p3Url,
        photo4_url: p4Url,
        photo5_url: p5Url,
        description1: f.desc1 || null,
        description2: f.desc2 || null,
        link1: f.link1 || null,
        link2: f.link2 || null,
        extra1: f.extra1 || null,
        extra2: f.extra2 || null,
        extra3: f.extra3 || null,
        extra4: f.extra4 || null,
        extra5: f.extra5 || null,
      });
      if (error) throw error;
      setStatus({ ok: true, msg: "Сәтті тіркелді! 🎉" });
      onSuccess?.();
    } catch (e: unknown) {
      setStatus({
        ok: false,
        msg: `Қате: ${e instanceof Error ? e.message : "Белгісіз қате"}`,
      });
    }
    setLoading(false);
  };

  const renderPreview = () => {
    const w = previewWedding as Wedding;
    if (template === "luxury") return <Template2 wedding={w} />;
    if (template === "bohemian") return <Template3 wedding={w} />;
    if (template === "azure") return <Template4 wedding={w} />;
    if (template === "sage") return <Template5 wedding={w} />;
    if (template === "blush") return <Template6 wedding={w} />;
    if (template === "midnight") return <Template7 wedding={w} />;
    if (template === "terracotta") return <Template8 wedding={w} />;
    return <Template1 wedding={w} />;
  };

  return (
    <div className="min-h-screen">
      {/* Tab switcher */}
      <div className="sticky top-[57px] z-20 bg-white/90 backdrop-blur-md border-b border-rose-100/50 flex shadow-sm">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 py-4 text-[11px] font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${!showPreview ? "text-stone-800 border-b-2 border-[#7B3F5E] bg-white" : "text-stone-400 hover:text-stone-600"}`}
        >
          <span>✏️</span> Толтыру
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 py-4 text-[11px] font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${showPreview ? "text-stone-800 border-b-2 border-[#7B3F5E] bg-white" : "text-stone-400 hover:text-stone-600"}`}
        >
          <span>👁</span> Алдын ала қарау
        </button>
      </div>

      {showPreview ? (
        <div>
          {renderPreview()}
          <div className="p-4 pb-8 bg-white border-t border-stone-100 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#7B3F5E] to-[#9B6B7E] text-white font-[Josefin_Sans,sans-serif] text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-rose-200"
            >
              {loading ? "⏳ Сақталуда..." : "💾 Сақтау"}
            </button>
            {status && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-[Josefin_Sans,sans-serif] text-center ${status.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
              >
                {status.msg}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 py-5 space-y-4 pb-10">
          {/* Үлгі таңдау */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <p className={LABEL + " mb-0"}>Үлгі таңдау</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`relative flex gap-3 items-center rounded-2xl overflow-hidden border-2 transition-all p-3 bg-white ${template === t.id ? `${t.accent} ring-2` : "border-stone-100 hover:border-stone-200"}`}
                >
                  <div
                    className={`${t.preview} h-12 w-12 rounded-xl flex-shrink-0`}
                  />
                  <div className="text-left">
                    <p className="font-[Josefin_Sans,sans-serif] font-semibold text-[11px] text-stone-700 tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      {t.desc}
                    </p>
                  </div>
                  {template === t.id && (
                    <span className="absolute top-2 right-2 bg-stone-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Жұптың аты */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className={LABEL + " mb-0"}>Жұптың аты</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Жігіттің аты *</label>
                <input
                  value={f.maleName}
                  onChange={upd("maleName")}
                  placeholder="Жасұлан"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Қыздың аты *</label>
                <input
                  value={f.femaleName}
                  onChange={upd("femaleName")}
                  placeholder="Альбина"
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Құрметті қонақтар */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className={LABEL + " mb-0"}>Шақыру мәтіні</p>
            </div>
            <textarea
              value={f.desc1}
              onChange={upd("desc1")}
              rows={4}
              placeholder="Құрметті қонақтар! Сіздерді үйлену тойымызға шақырамыз..."
              className={INPUT + " resize-none leading-relaxed"}
            />
          </div>

          {/* Басты сурет */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className={LABEL + " mb-0"}>Басты сурет</p>
            </div>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-rose-100 rounded-2xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-all overflow-hidden">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="preview"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C4A0B0"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-xs text-stone-400 font-[Josefin_Sans,sans-serif] tracking-wide">
                    Суретті таңдаңыз
                  </p>
                </div>
              )}
              <input
                ref={mainRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setMainPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* Той иелері */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className={LABEL + " mb-0"}>Той иелері</p>
            </div>
            <input
              value={f.organizer}
              onChange={upd("organizer")}
              placeholder="Руслан-Ләйлә"
              className={INPUT}
            />
          </div>

          {/* Фотоальбом */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <p className={LABEL + " mb-0"}>Фотоальбом (макс 5)</p>
            </div>
            <label className="flex items-center gap-3 w-full border-2 border-dashed border-rose-100 rounded-2xl px-4 py-4 cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C4A0B0"
                  strokeWidth="1.5"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-600 font-[Josefin_Sans,sans-serif] font-semibold">
                  {galleryPreviews.length > 0
                    ? `${galleryPreviews.length} сурет таңдалды`
                    : "Бірнеше сурет таңдаңыз"}
                </p>
                <p className="text-[10px] text-stone-400 font-[Josefin_Sans,sans-serif] mt-0.5">
                  Swiper ретінде көрінеді
                </p>
              </div>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 5);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                }}
              />
            </label>
            {galleryPreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryPreviews.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="preview"
                    className="h-16 w-16 flex-shrink-0 object-cover rounded-xl border border-rose-100"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Тайлбар 2 */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className={LABEL + " mb-0"}>Қосымша мәтін</p>
            </div>
            <textarea
              value={f.desc2}
              onChange={upd("desc2")}
              rows={4}
              placeholder="Құрметті жақыным! Жуырда біздің өміріміздегі ең бақытты күн болмақ..."
              className={INPUT + " resize-none leading-relaxed"}
            />
          </div>

          {/* Хосын зургууд */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className={LABEL + " mb-0"}>Жұптың суреттері</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  ref: p3Ref,
                  preview: p3Preview,
                  setPreview: setP3Preview,
                  label: "Жігіт сурет",
                  icon: "🤵",
                },
                {
                  ref: p4Ref,
                  preview: p4Preview,
                  setPreview: setP4Preview,
                  label: "Қыз сурет",
                  icon: "👰",
                },
              ].map((item, i) => (
                <div key={i}>
                  <label className={LABEL}>{item.label}</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-100 rounded-2xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/20 transition-all overflow-hidden aspect-[3/4]">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <p className="text-3xl mb-2">{item.icon}</p>
                        <p className="text-[10px] text-stone-300 font-[Josefin_Sans,sans-serif] leading-tight">
                          {item.label}
                        </p>
                      </div>
                    )}
                    <input
                      ref={item.ref}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) item.setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#C4A0B0" />
              </svg>
              <p className={LABEL + " mb-0"}>Instagram сілтемелері</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>📸 Instagram 1</label>
                <input
                  value={f.link1}
                  onChange={upd("link1")}
                  placeholder="https://instagram.com/..."
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>📸 Instagram 2</label>
                <input
                  value={f.link2}
                  onChange={upd("link2")}
                  placeholder="https://instagram.com/..."
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Той мекенжайы */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className={LABEL + " mb-0"}>Той мекенжайы</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Той залының атауы</label>
                <input
                  value={f.venueName}
                  onChange={upd("venueName")}
                  placeholder="Sky Palace"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Мекенжай</label>
                <input
                  value={f.venueAddress}
                  onChange={upd("venueAddress")}
                  placeholder="Алматы, Достық даңғылы..."
                  className={INPUT}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Күні 📅</label>
                  <input
                    type="date"
                    value={f.date}
                    onChange={upd("date")}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Уақыты ⏰</label>
                  <input
                    type="time"
                    value={f.time}
                    onChange={upd("time")}
                    className={INPUT}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL}>Телефон</label>
                <input
                  value={f.phone}
                  onChange={upd("phone")}
                  placeholder="+7 777 123 4567"
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Қосымша ақпарат */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className={LABEL + " mb-0"}>Қосымша ақпарат</p>
            </div>
            <div className="space-y-3">
              {(
                ["extra1", "extra2", "extra3", "extra4", "extra5"] as const
              ).map((k, i) => (
                <div key={k}>
                  <label className={LABEL}>Қосымша {i + 1}</label>
                  <input
                    value={f[k]}
                    onChange={upd(k)}
                    className={INPUT}
                    placeholder={
                      i === 0
                        ? "Дресс-код: ақ-қызғылт"
                        : i === 1
                          ? "Тегін паркинг бар"
                          : ""
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Қосымша сурет */}
          <div className={SECTION}>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className={LABEL + " mb-0"}>Қосымша сурет</p>
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-100 rounded-2xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-all overflow-hidden">
              {p5Preview ? (
                <img
                  src={p5Preview}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C4A0B0"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-xs text-stone-400 font-[Josefin_Sans,sans-serif] tracking-wide">
                    Суретті таңдаңыз
                  </p>
                </div>
              )}
              <input
                ref={p5Ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setP5Preview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {status && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-[Josefin_Sans,sans-serif] text-center ${status.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
            >
              {status.msg}
            </div>
          )}

          <button
            onClick={() => setShowPreview(true)}
            className="w-full py-4 bg-gradient-to-r from-[#7B3F5E] to-[#9B6B7E] text-white font-[Josefin_Sans,sans-serif] text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-rose-200"
          >
            👁 Алдын ала қарау →
          </button>
        </div>
      )}
    </div>
  );
}
