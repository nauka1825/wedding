"use client";
import { createContext, useContext, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import RSVPSection from "../RSVPSection";

export type Lang = "kk" | "mn";

interface T7Translations {
  eyebrow: string;
  organizerTitle: string;
  galleryTitle: string;
  coupleTitle: string;
  dateTimeTitle: string;
  venueTitle: string;
  rsvpTitle: string;
  rsvpSubtitle: string;
  wishesTitle: string;
  paymentLocked: string;
  monthsCaps: string[];
}

const T7: Record<Lang, T7Translations> = {
  kk: {
    eyebrow: "Той шақыруы",
    organizerTitle: "Той иелері",
    galleryTitle: "Суреттер жиынтығы",
    coupleTitle: "Жас жұбайлар",
    dateTimeTitle: "Күні және уақыты",
    venueTitle: "Той өтетін орын",
    rsvpTitle: "Тойға келетініңізді растаңыз",
    rsvpSubtitle: "Өтініш, жауабыңызды алдын ала беріңіз",
    wishesTitle: "Тілектер мен лебіздер",
    paymentLocked: "Төлем төленбеген",
    monthsCaps: [
      "Қаңтар",
      "Ақпан",
      "Наурыз",
      "Сәуір",
      "Мамыр",
      "Маусым",
      "Шілде",
      "Тамыз",
      "Қыркүйек",
      "Қазан",
      "Қараша",
      "Желтоқсан",
    ],
  },
  mn: {
    eyebrow: "Хуримын урилга",
    organizerTitle: "Хурим эзэд",
    galleryTitle: "Зургийн цомог",
    coupleTitle: "Хосын зургууд",
    dateTimeTitle: "Огноо & Цаг",
    venueTitle: "Хурмын байр",
    rsvpTitle: "Хуримд ирэхээ баталгаажуулна уу",
    rsvpSubtitle: "Хариугаа урьдчилан мэдэгдэнэ үү",
    wishesTitle: "Ерөөл хүсэлтүүд",
    paymentLocked: "Төлбөр төлөгдөөгүй",
    monthsCaps: [
      "Нэгдүгээр сар",
      "Хоёрдугаар сар",
      "Гуравдугаар сар",
      "Дөрөвдүгээр сар",
      "Тавдугаар сар",
      "Зургадугаар сар",
      "Долдугаар сар",
      "Наймдугаар сар",
      "Есдүгээр сар",
      "Аравдугаар сар",
      "Арван нэгдүгээр сар",
      "Арван хоёрдугаар сар",
    ],
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: T7Translations;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: T7.kk,
  toggleLang: () => {},
});

function useLang() {
  return useContext(LangContext);
}

/* ------------------------------------------------------------------------
   pickLang — some wedding fields come from the DB with BOTH languages
   packed into a single string, e.g.:
     "kk: Баян-Өлгий қаласы Өлгий сұмыны  mn: Баян-Өлгий аймаг Өлгий сум"
   ------------------------------------------------------------------------ */
function pickLang(raw: string | null | undefined, lang: Lang): string {
  if (!raw) return "";
  const labelRe = /\b(kk|mn)\s*:\s*/gi;

  const matches: { label: string; index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = labelRe.exec(raw)) !== null) {
    matches.push({
      label: m[1].toLowerCase(),
      index: m.index,
      length: m[0].length,
    });
    if (m[0].length === 0) labelRe.lastIndex++;
  }
  if (matches.length === 0) return raw.trim();

  const parts: Partial<Record<Lang, string>> = {};
  matches.forEach((match, i) => {
    const start = match.index + match.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const value = raw.slice(start, end).trim();
    if (value) parts[match.label as Lang] = value;
  });

  return parts[lang] ?? parts.kk ?? parts.mn ?? raw.trim();
}

function formatEventDate(iso: string | null | undefined, months: string[]) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

function decodeHtmlEntities(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function MultilineText({
  text,
  className = "",
  style = {},
}: {
  text: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
}) {
  const decoded = decodeHtmlEntities(text);
  const lines = decoded.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <p
          key={i}
          className={className}
          style={{
            margin: 0,
            marginBottom: i < lines.length - 1 ? 4 : 0,
            ...style,
          }}
        >
          {line === "" ? "\u00A0" : line}
        </p>
      ))}
    </>
  );
}

function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-[60] flex items-center gap-1 rounded-full px-3 py-1.5 transition-transform active:scale-95"
      style={{
        background: "rgba(13,21,37,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid #3D5A8A60",
        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#C5D8F0",
      }}
      aria-label="Switch language / Хэл сэлгэх"
    >
      <span style={{ opacity: lang === "kk" ? 1 : 0.4 }}>ҚАЗ</span>
      <span style={{ opacity: 0.35 }}>/</span>
      <span style={{ opacity: lang === "mn" ? 1 : 0.4 }}>МОН</span>
    </button>
  );
}

function PaymentLockOverlay() {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-0 h-full w-full flex items-center justify-center"
      style={{ background: "#000000", zIndex: 9999 }}
    >
      <div className="text-center px-6">
        <span className="text-4xl block mb-4" style={{ opacity: 0.7 }}>
          🔒
        </span>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            fontSize: 22,
            color: "#ffffff",
          }}
        >
          {t.paymentLocked}
        </p>
      </div>
    </div>
  );
}

function Template7Inner({ wedding }: { wedding: Wedding }) {
  const { t, lang } = useLang();

  const isoDate = wedding.wedding_date || null;
  const date = formatEventDate(isoDate, t.monthsCaps) || formatDate(isoDate);
  const time = isoDate?.includes("T")
    ? isoDate.split("T")[1].slice(0, 5)
    : null;

  const organizerText = pickLang(wedding.organizer, lang);
  const venueName = pickLang(wedding.venue_name, lang);
  const venueAddress = pickLang(wedding.venue_address, lang);
  const description1 = pickLang(wedding.description1, lang);
  const description2 = pickLang(wedding.description2, lang);

  const extras = [
    pickLang(wedding.extra1, lang),
    pickLang(wedding.extra2, lang),
    pickLang(wedding.extra3, lang),
    pickLang(wedding.extra4, lang),
    pickLang(wedding.extra5, lang),
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #0A0E1A 0%, #0D1525 50%, #0A0E1A 100%)",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');`}</style>

      <LanguageToggle />

      {/* Top stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3D5A8A, #7B9CC0, #3D5A8A)",
        }}
      />

      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 60 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1A2540 0%, #0A0E1A 50%, #1A2540 100%)",
            }}
          >
            <span className="text-8xl opacity-20">🌙</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #0A0E1A 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Нэр */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to right, transparent, #7B9CC0)",
            }}
          />
          <p
            className="tracking-[0.4em] text-[9px] uppercase font-[Josefin_Sans,sans-serif]"
            style={{ color: "#7B9CC080" }}
          >
            {t.eyebrow}
          </p>
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to left, transparent, #7B9CC0)",
            }}
          />
        </div>

        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ color: "#C5D8F0" }}
        >
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #3D5A8A60)",
            }}
          />
          <span className="text-xl" style={{ color: "#7B9CC0" }}>
            ✦
          </span>
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #3D5A8A60)",
            }}
          />
        </div>
        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ color: "#C5D8F0" }}
        >
          {wedding.female_name}
        </h1>
      </div>

      {/* Тайлбар 1 */}
      {description1 && (
        <div className="mx-5 mt-8 text-center">
          <span
            className="text-5xl font-serif leading-none"
            style={{ color: "#3D5A8A40" }}
          >
            "
          </span>
          <div className="-mt-3 px-2">
            <MultilineText
              text={description1}
              className="text-lg leading-relaxed italic"
              style={{ color: "#A0BCD8" }}
            />
          </div>
          <span
            className="text-5xl font-serif leading-none rotate-180 block"
            style={{ color: "#3D5A8A40" }}
          >
            "
          </span>
        </div>
      )}

      {/* Хурмын эзэд аав ээж */}
      {organizerText && (
        <div className="mx-5 mt-7 text-center">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-2"
            style={{ color: "#7B9CC060" }}
          >
            {t.organizerTitle}
          </p>
          <div
            className="relative px-5 py-4"
            style={{ border: "1px solid #3D5A8A40", borderRadius: "4px" }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 border-t border-l"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 border-t border-r"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 border-b border-l"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b border-r"
              style={{ borderColor: "#7B9CC060" }}
            />
            <MultilineText
              text={organizerText}
              className="text-base font-light leading-relaxed"
              style={{ color: "#A0BCD8" }}
            />
          </div>
        </div>
      )}

      {/* Gallery swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3"
            style={{ color: "#7B9CC060" }}
          >
            {t.galleryTitle}
          </p>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[75vw] max-w-[320px] h-52 overflow-hidden"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={url}
                  alt={`зураг ${i + 1}`}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            ))}
          </div>
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  style={{ background: "#7B9CC0", opacity: i === 0 ? 1 : 0.3 }}
                  className={`rounded-full ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Тайлбар 2 */}
      {description2 && (
        <div className="mx-5 mt-7">
          <div className="p-5" style={{ borderLeft: "3px solid #3D5A8A60" }}>
            <MultilineText
              text={description2}
              className="text-sm leading-relaxed"
              style={{ color: "#A0BCD880" }}
            />
          </div>
        </div>
      )}

      {/* Хосын зургууд */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3"
            style={{ color: "#7B9CC060" }}
          >
            {t.coupleTitle}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Эмэгтэй"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instagram линкүүд */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-7 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-colors"
              style={{
                border: "1px solid #3D5A8A60",
                color: "#7B9CC0",
                borderRadius: "4px",
              }}
            >
              <span>📸</span> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1A2E50, #3D5A8A)",
                borderRadius: "4px",
              }}
            >
              <span>📸</span> Instagram →
            </a>
          )}
        </div>
      )}

      {/* Footer info card */}
      <div className="mx-5 mt-10 mb-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1" style={{ background: "#3D5A8A30" }} />
          <span style={{ color: "#7B9CC060" }}>🌙</span>
          <div className="h-px flex-1" style={{ background: "#3D5A8A30" }} />
        </div>

        <div
          className="relative p-6 space-y-5"
          style={{ border: "1px solid #3D5A8A40", borderRadius: "4px" }}
        >
          <div
            className="absolute top-0 left-0 w-5 h-5 border-t border-l"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute top-0 right-0 w-5 h-5 border-t border-r"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute bottom-0 left-0 w-5 h-5 border-b border-l"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute bottom-0 right-0 w-5 h-5 border-b border-r"
            style={{ borderColor: "#7B9CC060" }}
          />

          {/* Огноо & Цаг */}
          {(date || time) && (
            <div className="text-center">
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1"
                style={{ color: "#7B9CC060" }}
              >
                {t.dateTimeTitle}
              </p>
              {date && (
                <p
                  className="text-xl font-light italic"
                  style={{ color: "#C5D8F0" }}
                >
                  {date}
                </p>
              )}
              {time && (
                <div
                  className="mt-2 inline-flex items-center gap-2 px-4 py-1.5"
                  style={{
                    background: "#1A2540",
                    border: "1px solid #3D5A8A40",
                    borderRadius: "100px",
                  }}
                >
                  <span className="text-xs" style={{ color: "#7B9CC0" }}>
                    ⏰
                  </span>
                  <p
                    className="text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-widest"
                    style={{ color: "#C5D8F0" }}
                  >
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ордон */}
          {(venueName || venueAddress) && (
            <div
              className="text-center pt-4"
              style={{ borderTop: "1px solid #3D5A8A30" }}
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1"
                style={{ color: "#7B9CC060" }}
              >
                {t.venueTitle}
              </p>
              {venueName && (
                <p
                  className="text-xl font-light italic"
                  style={{ color: "#C5D8F0" }}
                >
                  {venueName}
                </p>
              )}
              {venueAddress && (
                <p
                  className="text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide"
                  style={{ color: "#7B9CC060" }}
                >
                  📍 {venueAddress}
                </p>
              )}
            </div>
          )}

          {/* Нэмэлт мэдээлэл */}
          {extras.length > 0 && (
            <div
              className="pt-4 space-y-2"
              style={{ borderTop: "1px solid #3D5A8A30" }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="text-xs mt-0.5 flex-shrink-0"
                    style={{ color: "#7B9CC060" }}
                  >
                    ✦
                  </span>
                  <p
                    className="text-sm font-[Josefin_Sans,sans-serif] leading-relaxed"
                    style={{ color: "#A0BCD880" }}
                  >
                    {e}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Нэмэлт зураг */}
          {wedding.photo5_url && (
            <div className="pt-4" style={{ borderTop: "1px solid #3D5A8A30" }}>
              <div
                className="overflow-hidden"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Нэмэлт зураг"
                  className="w-full object-cover opacity-70"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RSVP */}
      <div className="mx-5 mt-10">
        <div className="text-center mb-5">
          <p
            className="text-2xl font-light italic mb-1"
            style={{ color: "#C5D8F0" }}
          >
            {t.rsvpTitle}
          </p>
          <p
            className="text-xs font-[Josefin_Sans,sans-serif]"
            style={{ color: "#7B9CC080" }}
          >
            {t.rsvpSubtitle}
          </p>
        </div>
        <div
          className="p-6"
          style={{
            border: "1px solid #3D5A8A40",
            borderRadius: "4px",
            background: "#0D152580",
          }}
        >
          <RSVPSection
            weddingId={wedding.id}
            accentColor="#7B9CC0"
            lightColor="#0D1525"
            lang={lang}
          />
        </div>
      </div>

      {/* Сэтгэгдэл */}
      <div className="mx-5 mt-10">
        <p
          className="text-2xl font-light italic text-center mb-5"
          style={{ color: "#C5D8F0" }}
        >
          {t.wishesTitle}
        </p>
        <div
          className="p-6"
          style={{
            border: "1px solid #3D5A8A40",
            borderRadius: "4px",
            background: "#0D152580",
          }}
        >
          <MessageSection
            weddingId={wedding.id}
            accentColor="#7B9CC0"
            lightColor="#0D1525"
            borderColor="border-blue-900"
            lang={lang}
          />
        </div>
      </div>

      {/* Footer signature */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10" style={{ background: "#3D5A8A30" }} />
          <span style={{ color: "#7B9CC040" }}>🌙</span>
          <div className="h-px w-10" style={{ background: "#3D5A8A30" }} />
        </div>
        <p
          className="text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase"
          style={{ color: "#7B9CC060" }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            className="text-xs mt-1 font-[Josefin_Sans,sans-serif]"
            style={{ color: "#3D5A8A40" }}
          >
            {date}
          </p>
        )}
      </div>

      {/* Bottom stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3D5A8A, #7B9CC0, #3D5A8A)",
        }}
      />
    </div>
  );
}

export default function Template7({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = T7[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const isPaymentLocked = String((wedding as any).payment) === "2";

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {isPaymentLocked ? (
        <PaymentLockOverlay />
      ) : (
        <Template7Inner wedding={wedding} />
      )}
    </LangContext.Provider>
  );
}
