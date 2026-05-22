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
    desc: "Цагаан · Ягаан · Цэцэглэг",
    preview: "bg-gradient-to-br from-rose-100 to-pink-200",
    accent: "border-rose-400 ring-rose-200",
  },
  {
    id: "luxury",
    name: "Luxury",
    desc: "Хар · Алт · Элэгдэл",
    preview: "bg-gradient-to-br from-neutral-800 to-amber-900",
    accent: "border-amber-500 ring-amber-200",
  },
  // {
  //   id: "bohemian",
  //   name: "Bohemian",
  //   desc: "Чулуу · Ногоон · Байгаль",
  //   preview: "bg-gradient-to-br from-stone-200 to-emerald-100",
  //   accent: "border-emerald-500 ring-emerald-200",
  // },
  // {
  //   id: "azure",
  //   name: "Azure",
  //   desc: "Цагаан · Усан цэнгэр · Зөөлөн",
  //   preview: "bg-gradient-to-br from-sky-100 to-blue-200",
  //   accent: "border-sky-400 ring-sky-200",
  // },
  // {
  //   id: "sage",
  //   name: "Sage",
  //   desc: "Ногоовтор · Байгаль · Тайван",
  //   preview: "bg-gradient-to-br from-green-50 to-emerald-200",
  //   accent: "border-green-400 ring-green-200",
  // },
  // {
  //   id: "blush",
  //   name: "Blush",
  //   desc: "Зөөлөн · Ягаан · Романтик",
  //   preview: "bg-gradient-to-br from-pink-50 to-rose-100",
  //   accent: "border-pink-300 ring-pink-100",
  // },
  // {
  //   id: "midnight",
  //   name: "Midnight",
  //   desc: "Тэнгэр · Хар хөх · Зэрлэг",
  //   preview: "bg-gradient-to-br from-slate-800 to-indigo-950",
  //   accent: "border-indigo-400 ring-indigo-900",
  // },
  // {
  //   id: "terracotta",
  //   name: "Terracotta",
  //   desc: "Шавар · Улаавтар · Дулаан",
  //   preview: "bg-gradient-to-br from-orange-100 to-red-200",
  //   accent: "border-orange-400 ring-orange-200",
  // },
];

const INPUT =
  "w-full border border-stone-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 bg-white transition-all placeholder:text-stone-300";
const LABEL =
  "block text-[11px] text-stone-400 font-josefin uppercase tracking-widest mb-1.5";
const SECTION =
  "bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-4";

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
    male_name: f.maleName || "Эрэгтэй нэр",
    female_name: f.femaleName || "Эмэгтэй нэр",
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
        msg: "Эрэгтэй болон эмэгтэй нэрийг заавал оруулна уу.",
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
      setStatus({ ok: true, msg: "Амжилттай бүртгэгдлээ! 🎉" });
      onSuccess?.();
    } catch (e: unknown) {
      setStatus({
        ok: false,
        msg: `Алдаа: ${e instanceof Error ? e.message : "Тодорхойгүй алдаа"}`,
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
      <div className="sticky top-[57px] z-20 bg-white/90 backdrop-blur-md border-b border-stone-100 flex shadow-sm">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 py-3.5 text-[11px] font-josefin tracking-widest uppercase transition-all ${!showPreview ? "text-stone-800 border-b-2 border-stone-800 bg-white" : "text-stone-400 hover:text-stone-600"}`}
        >
          ✏️ Бөглөх
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 py-3.5 text-[11px] font-josefin tracking-widest uppercase transition-all ${showPreview ? "text-stone-800 border-b-2 border-stone-800 bg-white" : "text-stone-400 hover:text-stone-600"}`}
        >
          👁 Урьдчилан харах
        </button>
      </div>

      {showPreview ? (
        /* ── PREVIEW TAB: template + save button ── */
        <div>
          {renderPreview()}
          <div className="p-4 pb-8 bg-white border-t border-stone-100 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#7B3F5E] to-[#9B6B7E] text-white font-josefin text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-rose-200"
            >
              {loading ? "⏳ Хадгалж байна..." : "💾 Хадгалах"}
            </button>
            {status && (
              <div
                className={`rounded-xl px-4 py-3 text-sm font-josefin text-center ${status.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
              >
                {status.msg}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── FORM TAB: fill in details ── */
        <div className="px-4 py-5 space-y-4 pb-10">
          {/* Template selector */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">✿</span>
              <p className={LABEL + " mb-0"}>Загвар сонгох</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all text-left ${template === t.id ? `${t.accent} ring-2` : "border-stone-200 hover:border-stone-300"}`}
                >
                  <div className={`${t.preview} h-16 w-full`} />
                  <div className="p-2.5 bg-white">
                    <p className="font-josefin font-semibold text-[11px] text-stone-700 tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      {t.desc}
                    </p>
                  </div>
                  {template === t.id && (
                    <span className="absolute top-2 right-2 bg-stone-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Хосын мэдээлэл */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">💍</span>
              <p className={LABEL + " mb-0"}>Хосын мэдээлэл</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Эрэгтэй нэр *</label>
                <input
                  value={f.maleName}
                  onChange={upd("maleName")}
                  placeholder="Дорж"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Эмэгтэй нэр *</label>
                <input
                  value={f.femaleName}
                  onChange={upd("femaleName")}
                  placeholder="Сарнай"
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Тайлбар 1 */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">✍️</span>
              <p className={LABEL + " mb-0"}>Тайлбар 1</p>
            </div>
            <textarea
              value={f.desc1}
              onChange={upd("desc1")}
              rows={3}
              placeholder="Хурмын тухай дэлгэрэнгүй..."
              className={INPUT}
            />
          </div>

          {/* Гол зураг */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">🖼️</span>
              <p className={LABEL + " mb-0"}>Гол зураг (hero)</p>
            </div>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/50 transition-all overflow-hidden">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="py-10 text-center">
                  <p className="text-3xl mb-2">🖼️</p>
                  <p className="text-xs text-stone-400 font-josefin">
                    Зураг сонгох
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

          {/* Хурмын эзэд аав ээж */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">👨‍👩‍👧</span>
              <p className={LABEL + " mb-0"}>Хурмын эзэд аав ээж</p>
            </div>
            <input
              value={f.organizer}
              onChange={upd("organizer")}
              placeholder="Хурмын эзэд аав ээж..."
              className={INPUT}
            />
          </div>

          {/* Галерей */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">🎞️</span>
              <p className={LABEL + " mb-0"}>Галерей (макс 5) — Swiper</p>
            </div>
            <label className="flex items-center gap-3 w-full border-2 border-dashed border-stone-200 rounded-2xl px-4 py-4 cursor-pointer hover:border-rose-300 hover:bg-rose-50/50 transition-all">
              <span className="text-2xl">🎞️</span>
              <span className="text-xs text-stone-400 font-josefin">
                {galleryPreviews.length > 0
                  ? `${galleryPreviews.length} зураг сонгосон`
                  : "Олон зураг сонгох"}
              </span>
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
                    className="h-16 w-16 flex-shrink-0 object-cover rounded-xl border border-stone-100"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Тайлбар 2 */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">✍️</span>
              <p className={LABEL + " mb-0"}>Тайлбар 2</p>
            </div>
            <textarea
              value={f.desc2}
              onChange={upd("desc2")}
              rows={3}
              placeholder="Нэмэлт тайлбар..."
              className={INPUT}
            />
          </div>

          {/* Зураг 3, 4 — эрэгтэй, эмэгтэй зураг */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">👫</span>
              <p className={LABEL + " mb-0"}>Хосын зургууд</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  ref: p3Ref,
                  preview: p3Preview,
                  setPreview: setP3Preview,
                  label: "Эрэгтэй зураг",
                },
                {
                  ref: p4Ref,
                  preview: p4Preview,
                  setPreview: setP4Preview,
                  label: "Эмэгтэй зураг",
                },
              ].map((item, i) => (
                <div key={i}>
                  <label className={LABEL}>{item.label}</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-rose-300 transition-all overflow-hidden aspect-square">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-2xl text-stone-300">
                          {i === 0 ? "🤵" : "👰"}
                        </p>
                        <p className="text-[10px] text-stone-300 font-josefin mt-1">
                          Зураг
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

          {/* Линк 1, 2 — Instagram */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">📱</span>
              <p className={LABEL + " mb-0"}>Instagram & Холбоосууд</p>
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

          {/* Footer мэдээлэл */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">🏛️</span>
              <p className={LABEL + " mb-0"}>Хурмын мэдээлэл (footer)</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Ордоны нэр</label>
                <input
                  value={f.venueName}
                  onChange={upd("venueName")}
                  placeholder="Мандал ордон"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Ордоны хаяг</label>
                <input
                  value={f.venueAddress}
                  onChange={upd("venueAddress")}
                  placeholder="Улаанбаатар, СБД..."
                  className={INPUT}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Огноо</label>
                  <input
                    type="date"
                    value={f.date}
                    onChange={upd("date")}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Цаг ⏰</label>
                  <input
                    type="time"
                    value={f.time}
                    onChange={upd("time")}
                    className={INPUT}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL}>Утас</label>
                <input
                  value={f.phone}
                  onChange={upd("phone")}
                  placeholder="99xxxxxx"
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Нэмэлт мэдээлэл */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">📝</span>
              <p className={LABEL + " mb-0"}>Нэмэлт мэдээлэл</p>
            </div>
            <div className="space-y-3">
              {(
                ["extra1", "extra2", "extra3", "extra4", "extra5"] as const
              ).map((k, i) => (
                <div key={k}>
                  <label className={LABEL}>Нэмэлт {i + 1}</label>
                  <input value={f[k]} onChange={upd(k)} className={INPUT} />
                </div>
              ))}
            </div>
          </div>

          {/* Нэмэлт зураг */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-rose-300">🖼️</span>
              <p className={LABEL + " mb-0"}>Нэмэлт зураг</p>
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-rose-300 transition-all overflow-hidden">
              {p5Preview ? (
                <img
                  src={p5Preview}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-2xl mb-1">🖼️</p>
                  <p className="text-xs text-stone-400 font-josefin">
                    Нэмэлт зураг сонгох
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
              className={`rounded-xl px-4 py-3 text-sm font-josefin text-center ${status.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
            >
              {status.msg}
            </div>
          )}

          {/* ✅ ЗАСВАР: зөвхөн preview рүү шилждэг, submit хийхгүй */}
          <button
            onClick={() => setShowPreview(true)}
            className="w-full py-4 bg-gradient-to-r from-[#7B3F5E] to-[#9B6B7E] text-white font-josefin text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-rose-200"
          >
            👁 Урьдчилан харах →
          </button>
        </div>
      )}
    </div>
  );
}
