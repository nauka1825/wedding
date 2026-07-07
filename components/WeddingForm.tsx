"use client";
import { useState, ChangeEvent } from "react";
import { supabase, uploadImage, Template, Wedding } from "@/lib/supabase";
import GoogleMapEmbed from "./GoogleMapEmbed";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6";
import Template7 from "./templates/Template7";
import Template8 from "./templates/Template8";

/* ---------------------------------------------------------------------- */
/*  Material Symbols icon helper — matches the reference HTML exactly     */
/* ---------------------------------------------------------------------- */
function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={
        filled
          ? {
              fontVariationSettings:
                "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }
          : undefined
      }
    >
      {name}
    </span>
  );
}

const TEMPLATES: {
  id: Template;
  name: string;
  desc: string;
  swatch: string;
}[] = [
  {
    id: "romantic",
    name: "Romantic",
    desc: "Ақ · Қызғылт · Гүлді",
    swatch: "bg-gradient-to-br from-rose-100 via-pink-200 to-rose-300",
  },
  {
    id: "luxury",
    name: "Luxury",
    desc: "Жасыл · Алтын · Салтанатты",
    swatch: "bg-gradient-to-br from-emerald-950 via-amber-500 to-emerald-900",
  },
  {
    id: "sage",
    name: "Sage",
    desc: "Тас · Жасыл · Табиғат",
    swatch: "bg-gradient-to-br from-stone-200 to-emerald-100",
  },
  {
    id: "blush",
    name: "Blush",
    desc: "Ақшыл · Күлгін · Нәзік",
    swatch: "bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300",
  },
];

const INPUT =
  "w-full bg-white/50 border border-sky-accent/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-accent focus:ring-2 focus:ring-sky-accent/15 backdrop-blur-sm transition-all placeholder:text-slate-300 text-on-surface";

const LABEL =
  "text-[11px] uppercase tracking-widest text-slate-400 font-semibold ml-1 mb-1.5 block";

const SECTION = "glass-card rounded-2xl p-6 space-y-5";

const SECTION_HEADER =
  "flex items-center gap-2 border-b border-sky-accent/10 pb-3";

const SECTION_TITLE = "text-lg font-semibold text-slate-700";

type WeddingWithCoords = Omit<Wedding, "id" | "created_at"> & {
  latitude: number | null;
  longitude: number | null;
};

const EMPTY_WEDDING: WeddingWithCoords = {
  male_name: "",
  female_name: "",
  wedding_date: null,
  venue_name: null,
  venue_address: null,
  latitude: null,
  longitude: null,
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
  payment: null,
};

function GlobalFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=EB+Garamond:wght@400;500&family=Montserrat:wght@400;500;600&family=Josefin+Sans:wght@300;400;600&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 300,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
      .font-josefin {
        font-family: "Josefin Sans", sans-serif;
      }
      .font-headline {
        font-family: "Playfair Display", serif;
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(14, 165, 233, 0.1);
      }
      .text-sky-accent {
        color: #0ea5e9;
      }
      .bg-sky-accent {
        background-color: #0ea5e9;
      }
      .border-sky-accent {
        border-color: #0ea5e9;
      }
      .ring-sky-accent {
        --tw-ring-color: #0ea5e9;
      }
      .custom-scrollbar::-webkit-scrollbar {
        height: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #0ea5e9;
        border-radius: 10px;
      }
    `}</style>
  );
}

/* ---------------------------------------------------------------------- */
/*  Collapsible section — every form section can be expanded/collapsed    */
/* ---------------------------------------------------------------------- */
function CollapsibleSection({
  icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={SECTION}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${SECTION_HEADER} w-full text-left`}
      >
        <Icon name={icon} className="text-sky-accent" />
        <h3 className={`${SECTION_TITLE} flex-1`}>{title}</h3>
        <Icon
          name="expand_more"
          className={`text-slate-400 text-[20px] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="pt-1 space-y-5">{children}</div>}
    </section>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-6 font-josefin">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="w-20 h-20 bg-sky-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Өтінішіңіз қабылданды!
        </h2>
        <p className="text-slate-500 mb-1 leading-relaxed">
          Сіздің тойыңыздың мәліметтері сәтті тіркелді.
        </p>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Бізбен байланысып,{" "}
          <span className="text-sky-accent font-semibold">төлемді төлеп</span>,
          сілтемеңізді алыңыз! 🔗
        </p>

        <div className="bg-sky-accent/5 border border-sky-accent/10 rounded-2xl px-4 py-3 mb-6 text-left space-y-3">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
            Байланыс
          </p>
          <a
            href="tel:+97699521825"
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-sky-accent transition-colors"
          >
            <Icon name="call" className="text-[18px] text-sky-accent" />
            +97699521825 арқылы қоңырау шалу
          </a>
          <a
            href="https://www.facebook.com/naurizbyek.khuatbyekuli?mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-sky-accent transition-colors"
          >
            <span className="text-base leading-none">💬</span>
            Facebook арқылы жазу
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-sky-accent hover:opacity-90 text-white rounded-2xl font-bold shadow-lg shadow-sky-accent/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Icon name="check_circle" filled />
          Жабу
        </button>
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
    latitude: "",
    longitude: "",
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
    payment: "",
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

  const previewWedding: WeddingWithCoords = {
    ...EMPTY_WEDDING,
    male_name: f.maleName || "Жасұлан",
    female_name: f.femaleName || "Альбина",
    wedding_date: f.date ? (f.time ? `${f.date}T${f.time}` : f.date) : null,
    venue_name: f.venueName || null,
    venue_address: f.venueAddress || null,
    latitude: f.latitude ? parseFloat(f.latitude) : null,
    longitude: f.longitude ? parseFloat(f.longitude) : null,
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
    payment: f.payment || null,
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
        latitude: f.latitude ? parseFloat(f.latitude) : null,
        longitude: f.longitude ? parseFloat(f.longitude) : null,
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
        payment: f.payment || null,
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
    return <Template1 wedding={w} hideBottomNav />;
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-josefin text-on-surface">
      <GlobalFonts />
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}

      {/* Brand header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-sky-accent/10 h-16 flex items-center px-6">
        <div className="flex items-center gap-3">
          <Icon
            name="favorite"
            className="text-sky-accent text-[22px]"
            filled
          />
          <h1 className="text-xl font-semibold tracking-tight text-primary font-headline">
            Біздің ерекше күн
          </h1>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="sticky top-16 z-20 bg-white/60 backdrop-blur-md border-b border-sky-accent/5 flex h-12">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            !showPreview
              ? "text-sky-accent border-b-2 border-sky-accent"
              : "text-slate-400 hover:text-sky-accent"
          }`}
        >
          <Icon name="edit_note" className="text-[20px]" />
          Толтыру
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            showPreview
              ? "text-sky-accent border-b-2 border-sky-accent"
              : "text-slate-400 hover:text-sky-accent"
          }`}
        >
          <Icon name="visibility" className="text-[20px]" />
          Алдын ала қарау
        </button>
      </div>

      {showPreview ? (
        <div>
          {renderPreview()}
          <div className="h-28" />
          <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 bg-white/90 backdrop-blur-md border-t border-sky-accent/10 space-y-3 max-w-lg mx-auto">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-sky-accent hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-sky-accent/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Сақталуда..."
              ) : (
                <>
                  Дайын! Шақыруды сақтау
                  <Icon name="send" />
                </>
              )}
            </button>
            {status && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm text-center ${
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
        <main className="px-5 py-8 space-y-8 max-w-lg mx-auto">
          {/* Header introduction */}
          <section className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800 font-headline">
              Шақыру қағазын жасау
            </h2>
            <p className="text-slate-500 font-light">
              Тойдың барлық мәліметтерін төменде толтырыңыз
            </p>
          </section>

          {/* Template selection */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-semibold text-slate-700">
                Дизайн таңдау
              </h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className="flex-shrink-0 w-32 snap-start text-left"
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden aspect-[3/4] transition-all ${
                      template === t.id
                        ? "ring-2 ring-sky-accent shadow-lg shadow-sky-accent/10"
                        : "opacity-60 hover:opacity-100 border-2 border-transparent"
                    }`}
                  >
                    <div className={`absolute inset-0 ${t.swatch}`} />
                    {template === t.id && (
                      <div className="absolute bottom-2 right-2 bg-sky-accent text-white rounded-full p-1 shadow-md">
                        <Icon
                          name="check_circle"
                          className="text-[16px]"
                          filled
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs text-center font-medium ${
                      template === t.id ? "text-sky-accent" : "text-slate-500"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px] text-center text-slate-400">
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Жұптың аты */}
          <CollapsibleSection icon="favorite" title="Жұптың аты" defaultOpen>
            <div className="grid grid-cols-2 gap-4">
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
          </CollapsibleSection>

          {/* Басты сурет */}
          <CollapsibleSection icon="photo_camera" title="Басты сурет">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-sky-accent/30 rounded-2xl bg-sky-accent/5 hover:bg-sky-accent/10 transition-colors cursor-pointer overflow-hidden group">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Icon
                    name="add_a_photo"
                    className="text-sky-accent text-3xl group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs text-slate-400 mt-2">
                    Басты мұқаба суретін жүктеу
                  </span>
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
          </CollapsibleSection>

          {/* Той иелері */}
          <CollapsibleSection icon="groups" title="Той иелері">
            <div>
              <label className={LABEL}>Атаулары</label>
              <input
                value={f.organizer}
                onChange={upd("organizer")}
                placeholder="Руслан &amp; Ләйлә"
                className={INPUT}
              />
            </div>
          </CollapsibleSection>

          {/* Фотоальбом (gallery, max 5) */}
          <CollapsibleSection icon="image" title="Фотоальбом (макс 5)">
            <div className="space-y-2">
              <label className={LABEL}>Галерея</label>
              <div className="flex gap-2 flex-wrap">
                <label className="w-16 h-16 border-2 border-dashed border-sky-accent/20 rounded-xl flex items-center justify-center bg-white/50 cursor-pointer hover:bg-sky-accent/10 transition-colors">
                  <Icon name="add" className="text-sky-accent text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(
                        0,
                        5,
                      );
                      setGalleryFiles(files);
                      setGalleryPreviews(
                        files.map((f) => URL.createObjectURL(f)),
                      );
                    }}
                  />
                </label>
                {galleryPreviews.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="preview"
                    className="w-16 h-16 rounded-xl object-cover border border-sky-accent/10"
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 pl-1">
                {galleryPreviews.length > 0
                  ? `${galleryPreviews.length} сурет таңдалды`
                  : "Swiper ретінде көрінеді"}
              </p>
            </div>
          </CollapsibleSection>

          {/* Жұптың суреттері */}
          <CollapsibleSection icon="portrait" title="Жұптың суреттері">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Сурет 1</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-accent/30 rounded-2xl cursor-pointer hover:bg-sky-accent/5 transition-all overflow-hidden aspect-[3/4]">
                  {p3Preview ? (
                    <img
                      src={p3Preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      name="add_photo_alternate"
                      className="text-sky-accent text-3xl"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setP3File(file);
                        setP3Preview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </CollapsibleSection>

          {/* Той мекенжайы */}
          <CollapsibleSection icon="location_on" title="Той мекенжайы">
            <div className="space-y-4">
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
                <div className="relative">
                  <input
                    value={f.venueAddress}
                    onChange={upd("venueAddress")}
                    placeholder="Баян-Өлгий, Улаанбаатар"
                    className={`${INPUT} pr-10`}
                  />
                  <Icon
                    name="map"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-accent text-[20px]"
                  />
                </div>
              </div>

              {/* Coordinates (optional, gives an exact map pin) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`${LABEL} mb-0`}>
                    Координат (міндетті емес)
                  </label>
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-accent font-semibold flex items-center gap-1 mr-1"
                  >
                    <Icon name="my_location" className="text-[14px]" />
                    Google Maps-тан алу
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={f.latitude}
                    onChange={upd("latitude")}
                    placeholder="Latitude, мыс. 43.238949"
                    inputMode="decimal"
                    className={INPUT}
                  />
                  <input
                    value={f.longitude}
                    onChange={upd("longitude")}
                    placeholder="Longitude, мыс. 76.889709"
                    inputMode="decimal"
                    className={INPUT}
                  />
                </div>
                <p className="text-[10px] text-slate-400 pl-1 leading-relaxed">
                  Google Maps-та орынды тауып, оны басып тұрып шыққан
                  координатты (мыс. 43.238949, 76.889709) осында қойыңыз —
                  шақыруда картаға дәл сол нүкте белгіленеді.
                </p>
                {(f.latitude || f.longitude || f.venueAddress) && (
                  <GoogleMapEmbed
                    address={f.venueAddress || undefined}
                    latitude={f.latitude ? parseFloat(f.latitude) : undefined}
                    longitude={
                      f.longitude ? parseFloat(f.longitude) : undefined
                    }
                    height={160}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>
                    <span className="inline-flex items-center gap-1">
                      <Icon name="calendar_today" className="text-[14px]" />
                      Күні
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
                      <Icon name="schedule" className="text-[14px]" />
                      Уақыты
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
                    <Icon name="call" className="text-[14px]" />
                    Байланыс телефоны
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
          </CollapsibleSection>

          {/* Қосымша ақпарат */}
          <CollapsibleSection icon="info" title="Қосымша ақпарат">
            <div className="space-y-4">
              {(["extra1", "extra2", "extra3", "extra4"] as const).map(
                (k, i) => (
                  <div key={k}>
                    <label className={LABEL}>
                      {i === 0
                        ? "Дресс-код"
                        : i === 1
                          ? "Қонақтарға ескерту"
                          : `Қосымша ${i + 1}`}
                    </label>
                    <input
                      value={f[k]}
                      onChange={upd(k)}
                      className={INPUT}
                      placeholder={
                        i === 0
                          ? "Мысалы: Классикалық стиль, ақ және көк түстер..."
                          : i === 1
                            ? "Тойға кешікпей келулеріңізді сұраймыз"
                            : ""
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </CollapsibleSection>

          {/* Қосымша сурет */}
          <CollapsibleSection icon="image" title="Қосымша сурет">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-accent/30 rounded-2xl cursor-pointer hover:bg-sky-accent/5 transition-all overflow-hidden">
              {p5Preview ? (
                <img
                  src={p5Preview}
                  alt="preview"
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="py-8 flex flex-col items-center">
                  <Icon
                    name="add_photo_alternate"
                    className="text-sky-accent text-3xl mb-2"
                  />
                  <span className="text-xs text-slate-400">
                    Суретті таңдаңыз
                  </span>
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
          </CollapsibleSection>

          {status && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm text-center ${
                status.ok
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {status.msg}
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full bg-sky-accent hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-sky-accent/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="check_circle" filled />
              Алдын ала қарау
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
