"use client";
import { useState, ChangeEvent } from "react";
import { supabase, uploadImage, Template, Wedding } from "@/lib/supabase";
import Template4 from "./templates/Template4";
import {
  HiOutlineCamera,
  HiOutlinePhotograph,
  HiOutlineUsers,
  HiOutlineLocationMarker,
  HiOutlineInformationCircle,
  HiOutlineChatAlt2,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlinePencilAlt,
  HiOutlineEye,
} from "react-icons/hi";

const INPUT =
  "w-full rounded-2xl border border-sky-200/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all font-[Josefin_Sans,sans-serif]";

const LABEL =
  "block mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sky-500 font-[Josefin_Sans,sans-serif]";

const SECTION =
  "rounded-3xl border border-sky-100/70 bg-white/60 backdrop-blur-md p-5 shadow-sm shadow-sky-100/30 space-y-4";

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
  template: "azure",
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
  latitude: null,
  longitude: null,
};

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient bar — azure палитра */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-200/60 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🎉</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-[Josefin_Sans,sans-serif] font-semibold text-slate-800 tracking-wide mb-2">
            Өтінішіңіз қабылданды!
          </h2>

          {/* Body */}
          <p className="text-sm text-slate-500 font-[Josefin_Sans,sans-serif] leading-relaxed mb-1">
            Сіздің тойыңыздың мәліметтері сәтті тіркелді.
          </p>
          <p className="text-sm text-slate-500 font-[Josefin_Sans,sans-serif] leading-relaxed mb-6">
            Бізбен байланысып,{" "}
            <span className="text-sky-600 font-semibold">төлемді төлеп</span>,
            сілтемеңізді алыңыз! 🔗
          </p>

          {/* Contact info box */}
          <div className="bg-sky-50/80 border border-sky-100 rounded-2xl px-4 py-3 mb-6 text-left space-y-2">
            <p className="text-[10px] text-sky-500 font-[Josefin_Sans,sans-serif] uppercase tracking-widest font-semibold mb-2">
              Байланыс
            </p>
            <a
              href="tel:+77001234567"
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

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-sm font-[Josefin_Sans,sans-serif] tracking-widest uppercase shadow-lg shadow-sky-200/60 hover:opacity-90 transition-opacity"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WeddingFormWomen({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const template: Template = "azure";
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

  // File states
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [p3File, setP3File] = useState<File | null>(null);
  const [p4File, setP4File] = useState<File | null>(null);
  const [p5File, setP5File] = useState<File | null>(null);

  // Preview states
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [p3Preview, setP3Preview] = useState<string | null>(null);
  const [p4Preview, setP4Preview] = useState<string | null>(null);
  const [p5Preview, setP5Preview] = useState<string | null>(null);

  const previewWedding: Omit<Wedding, "id" | "created_at"> = {
    ...EMPTY_WEDDING,
    male_name: f.maleName,
    female_name: f.femaleName,
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
    if (!f.femaleName.trim()) {
      setStatus({ ok: false, msg: "Қыздың атын міндетті түрде енгізіңіз." });
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

  return (
    <div className="min-h-screen">
      {/* Success Modal */}
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
          <HiOutlinePencilAlt className="w-4 h-4" />
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
          <HiOutlineEye className="w-4 h-4" />
          Алдын ала қарау
        </button>
      </div>

      {showPreview ? (
        <div>
          <Template4 wedding={previewWedding as Wedding} />
          <div className="p-4 pb-8 bg-white/80 backdrop-blur-md border-t border-sky-100 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl py-4 text-sm font-[Josefin_Sans,sans-serif] tracking-widest uppercase text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-lg shadow-sky-200/50 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
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
          {/* Қыздың аты */}
          <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineUsers className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Қыздың аты</p>
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

          {/* Шақыру мәтіні */}
          {/* <div className={SECTION}>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineChatAlt2 className="w-4 h-4 text-sky-400" />
              <p className={SECTION_TITLE}>Шақыру мәтіні</p>
            </div>
            <textarea
              value={f.desc1}
              onChange={upd("desc1")}
              rows={4}
              placeholder="Сіз(дер)ді аяулы қызымыз Альбинаның ұзату тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз."
              className={INPUT + " resize-none leading-relaxed"}
            />
          </div> */}

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
              <HiOutlineUsers className="w-4 h-4 text-sky-400" />
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
            <div>
              <label className={LABEL}>Қосымша 1</label>
              <input
                value={f.extra1}
                onChange={upd("extra1")}
                className={INPUT}
                placeholder="Дресс-код: ақ-қызғылт"
              />
            </div>
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
            className="w-full py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-[Josefin_Sans,sans-serif] text-sm tracking-widest uppercase rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-sky-200 flex items-center justify-center gap-2"
          >
            <HiOutlineCheckCircle className="w-5 h-5" />
            Алдын ала қарау →
          </button>
        </div>
      )}
    </div>
  );
}
