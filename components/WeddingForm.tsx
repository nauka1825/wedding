"use client";
import { useState, ChangeEvent } from "react";
import {
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineCamera,
  HiOutlinePhotograph,
  HiOutlineUsers,
  HiOutlineChatAlt2,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineInformationCircle,
  HiOutlineLink,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";
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
    desc: "Ақ · Алтын · Сәнді",
    preview: "bg-gradient-to-br from-amber-50 to-yellow-100",
    accent: "border-amber-500 ring-amber-200",
  },
  // {
  //   id: "bohemian",
  //   name: "Bohemian",
  //   desc: "Тас · Жасыл · Табиғат",
  //   preview: "bg-gradient-to-br from-stone-200 to-emerald-100",
  //   accent: "border-emerald-500 ring-emerald-200",
  // },
];

const INPUT =
  "w-full border border-sky-200/60 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white/70 backdrop-blur-sm transition-all placeholder:text-slate-300 text-slate-700 font-[Josefin_Sans,sans-serif]";

const LABEL =
  "block text-[10px] text-sky-500 font-[Josefin_Sans,sans-serif] uppercase tracking-widest mb-1.5 font-semibold";

const SECTION =
  "bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-sky-100/70 shadow-sm shadow-sky-100/30 space-y-4";

const SECTION_TITLE =
  "text-[11px] text-sky-600 font-[Josefin_Sans,sans-serif] uppercase tracking-widest font-semibold mb-0";

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

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-sky-200/60 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-lg font-[Josefin_Sans,sans-serif] font-semibold text-slate-800 tracking-wide mb-2">
            Өтінішіңіз қабылданды!
          </h2>
          <p className="text-sm text-slate-500 font-[Josefin_Sans,sans-serif] leading-relaxed mb-1">
            Сіздің тойыңыздың мәліметтері сәтті тіркелді.
          </p>
          <p className="text-sm text-slate-500 font-[Josefin_Sans,sans-serif] leading-relaxed mb-6">
            Бізбен байланысып,{" "}
            <span className="text-sky-600 font-semibold">төлемді төлеп</span>,
            сілтемеңізді алыңыз! 🔗
          </p>
          <div className="bg-sky-50/80 border border-sky-100 rounded-2xl px-4 py-3 mb-6 text-left space-y-2">
            <p className="text-[10px] text-sky-500 font-[Josefin_Sans,sans-serif] uppercase tracking-widest font-semibold mb-2">
              Байланыс
            </p>
            <a
              href="tel:+97699521825"
              className="flex items-center gap-2 text-sm text-slate-700 font-[Josefin_Sans,sans-serif] hover:text-sky-600 transition-colors"
            >
              <HiOutlinePhone className="w-4 h-4 text-sky-400 flex-shrink-0" />
              +97699521825 арқылы қоңырау шалу
            </a>
            <a
              href="https://www.facebook.com/naurizbyek.khuatbyekuli?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-700 font-[Josefin_Sans,sans-serif] hover:text-sky-600 transition-colors"
            >
              <span className="text-green-500 text-base leading-none">💬</span>
              Facebook арқылы жазу
            </a>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white text-sm font-[Josefin_Sans,sans-serif] tracking-widest uppercase shadow-lg shadow-sky-200/60 hover:opacity-90 transition-opacity"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WeddingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [template, setTemplate] = useState<Template>("romantic");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const [mainFile, setMainFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [p3File, setP3File] = useState<File | null>(null);
  const [p4File, setP4File] = useState<File | null>(null);
  const [p5File, setP5File] = useState<File | null>(null);

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

      const p3Url = p3File
        ? await uploadImage(p3File, `${ts}_p3_${p3File.name}`)
        : null;
      const p4Url = p4File
        ? await uploadImage(p4File, `${ts}_p4_${p4File.name}`)
        : null;
      const p5Url = p5File
        ? await uploadImage(p5File, `${ts}_p5_${p5File.name}`)
        : null;

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
      setShowSuccess(true);
      onSuccess?.();
    } catch (e: unknown) {
      setStatus({
        ok: false,
        msg: `Қате: ${e instanceof Error ? e.message : "Белгісіз қате"}`,
      });
    }
    setLoading(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/";
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
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}

      {/* Tab switcher */}
      <div className="sticky top-[57px] z-20 bg-white/80 backdrop-blur-md border-b border-sky-100/60 flex shadow-sm shadow-sky-100/20">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 py-4 text-[11px] font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            !showPreview
              ? "text-sky-700 border-b-2 border-sky-500 bg-white/60"
              : "text-slate-400 hover:text-sky-500"
          }`}
        >
          <HiOutlineCamera className="w-4 h-4" />
          Толтыру
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 py-4 text-[11px] font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            showPreview
              ? "text-sky-700 border-b-2 border-sky-500 bg-white/60"
              : "text-slate-400 hover:text-sky-500"
          }`}
        >
          <HiOutlineCheckCircle className="w-4 h-4" />
          Алдын ала қарау
        </button>
      </div>

      {showPreview ? (
        <div>
          {renderPreview()}
          <div className="p-4 pb-8 bg-white/80 backdrop-blur-md border-t border-sky-100 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-[Josefin_Sans,sans-serif] text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-sky-200"
            >
              {loading ? "⏳ Сақталуда..." : "💾 Сақтау"}
            </button>
            {status && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-[Josefin_Sans,sans-serif] text-center ${
                  status.ok
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
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
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineSparkles className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Үлгі таңдау</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`relative flex gap-3 items-center rounded-2xl overflow-hidden border-2 transition-all p-3 bg-white/80 ${
                    template === t.id
                      ? `${t.accent} ring-2`
                      : "border-sky-100/70 hover:border-sky-200"
                  }`}
                >
                  <div
                    className={`${t.preview} h-12 w-12 rounded-xl flex-shrink-0`}
                  />
                  <div className="text-left">
                    <p className="font-[Josefin_Sans,sans-serif] font-semibold text-[11px] text-slate-700 tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {t.desc}
                    </p>
                  </div>
                  {template === t.id && (
                    <span className="absolute top-2 right-2 bg-sky-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Жұптың аты */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineHeart className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Жұптың аты</p>
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
          {/* Басты сурет */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineCamera className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Басты сурет</p>
            </div>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-sky-200/70 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all overflow-hidden">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="preview"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-3">
                    <HiOutlineCamera className="w-5 h-5 text-sky-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-[Josefin_Sans,sans-serif] tracking-wide">
                    Суретті таңдаңыз
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainFile(file);
                    setMainPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          {/* Той иелері */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineUserGroup className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Той иелері</p>
            </div>
            <input
              value={f.organizer}
              onChange={upd("organizer")}
              placeholder="Руслан & Ләйлә"
              className={INPUT}
            />
          </div>

          {/* Фотоальбом */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlinePhotograph className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Фотоальбом (макс 5)</p>
            </div>
            <label className="flex items-center gap-3 w-full border-2 border-dashed border-sky-200/70 rounded-2xl px-4 py-4 cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                <HiOutlinePhotograph className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-[Josefin_Sans,sans-serif] font-semibold">
                  {galleryPreviews.length > 0
                    ? `${galleryPreviews.length} сурет таңдалды`
                    : "Бірнеше сурет таңдаңыз"}
                </p>
                <p className="text-[10px] text-slate-400 font-[Josefin_Sans,sans-serif] mt-0.5">
                  Swiper ретінде көрінеді
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 5);
                  setGalleryFiles(files);
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
                    className="h-16 w-16 flex-shrink-0 object-cover rounded-xl border border-sky-100"
                  />
                ))}
              </div>
            )}
          </div>
          {/* Той суреттері */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineUsers className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Жұптың суреттері</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  file: p3File,
                  setFile: setP3File,
                  preview: p3Preview,
                  setPreview: setP3Preview,
                  label: "сурет1",
                  icon: "",
                },
                {
                  file: p4File,
                  setFile: setP4File,
                  preview: p4Preview,
                  setPreview: setP4Preview,
                  label: "сурет2",
                  icon: "",
                },
              ].map((item, i) => (
                <div key={i}>
                  <label className={LABEL}>{item.label}</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200/70 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/20 transition-all overflow-hidden aspect-[3/4]">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <p className="text-3xl mb-2">{item.icon}</p>
                        <p className="text-[10px] text-slate-300 font-[Josefin_Sans,sans-serif] leading-tight">
                          {item.label}
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          item.setFile(file);
                          item.setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Той мекенжайы */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineLocationMarker className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Той мекенжайы</p>
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
                  placeholder="Баян-Өлгий, Улаанбаатар"
                  className={INPUT}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" /> Күні
                    </span>
                  </label>
                  <input
                    type="date"
                    value={f.date}
                    onChange={upd("date")}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" /> Уақыты
                    </span>
                  </label>
                  <input
                    type="time"
                    value={f.time}
                    onChange={upd("time")}
                    className={INPUT}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL}>
                  <span className="inline-flex items-center gap-1">
                    <HiOutlinePhone className="w-3 h-3" /> Телефон
                  </span>
                </label>
                <input
                  value={f.phone}
                  onChange={upd("phone")}
                  placeholder="+976 99119911"
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          {/* Қосымша ақпарат */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineInformationCircle className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Қосымша ақпарат</p>
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
                          ? "уақытында келулеріңізді сұраймыз"
                          : ""
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Қосымша сурет */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlinePhotograph className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Қосымша сурет</p>
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200/70 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all overflow-hidden">
              {p5Preview ? (
                <img
                  src={p5Preview}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-3">
                    <HiOutlinePhotograph className="w-5 h-5 text-sky-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-[Josefin_Sans,sans-serif] tracking-wide">
                    Суретті таңдаңыз
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setP5File(file);
                    setP5Preview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          {status && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-[Josefin_Sans,sans-serif] text-center ${
                status.ok
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {status.msg}
            </div>
          )}

          <button
            onClick={() => setShowPreview(true)}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-[Josefin_Sans,sans-serif] text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-sky-200 flex items-center justify-center gap-2"
          >
            <HiOutlineCheckCircle className="w-5 h-5" />
            Алдын ала қарау →
          </button>
        </div>
      )}
    </div>
  );
}
