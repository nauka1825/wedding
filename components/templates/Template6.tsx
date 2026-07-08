"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import {
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaLeaf,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import RSVPSection from "../RSVPSection";
import Template6Music from "../template6Music";

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian)
   ====================================================================== */
export type Lang = "kk" | "mn";

interface T6Translations {
  langButtonLabel: string;
  calendarMonths: string[]; // Title case, used for calendar header + date text
  calendarDays: string[]; // Mon..Sun abbreviations
  photoWord: string; // "сурет" / "зураг"
  mainPhotoAlt: string;
  groomPhotoAlt: string;
  extraPhotoAlt: string;
  invitationLine1: string;
  invitationLine2: string;
  invitationConnector: string;
  invitationLine3: string;
  organizerTitle: string;
  organizerSubtitle: string;
  parentsTitle: string;
  groomSide: string;
  brideSide: string;
  timeLabel: string;
  venueLabel: string;
  wishesTitle: string;
  galleryTitle: string;
  galleryCaption: string;
  paymentLocked: string;
  footerPoem: string[];
  nav: {
    love: string;
    photos: string;
    details: string;
    wishes: string;
  };
}

const T6: Record<Lang, T6Translations> = {
  kk: {
    langButtonLabel: "ҚАЗ",
    calendarMonths: [
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
    calendarDays: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"],
    photoWord: "сурет",
    mainPhotoAlt: "Негізгі сурет",
    groomPhotoAlt: "Ер",
    extraPhotoAlt: "Қосымша сурет",
    invitationLine1:
      "Құрметті ағайын-туыс, құда-жекжат, дос-жаран, әріптестер мен көршілер!",
    invitationLine2: "Сіздерді ұлымыз",
    invitationConnector: "пен келініміз",
    invitationLine3:
      "ның үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
    organizerTitle: "Той иелері",
    organizerSubtitle: "Ата анасы",
    parentsTitle: "Ата-аналары",
    groomSide: "Күйеу жақ",
    brideSide: "Келін жақ",
    timeLabel: "Уақыты",
    venueLabel: "Мекен жайымыз",
    wishesTitle: "Тілектер",
    galleryTitle: "Суреттер жиынтығы",
    galleryCaption: "❤️ Біздің махаббатымыздың естеліктері ❤️",
    paymentLocked: "Төлем төленбеген",
    footerPoem: [
      "Біз екеуміз тек екеуміз",
      "Жүректермен бір екенбіз",
      "Мен сен үшін сен мен үшін",
      "Жаралған екенбіз",
    ],
    nav: {
      love: "Махаббат",
      photos: "Фотолар",
      details: "Мәліметтер",
      wishes: "Тілектер",
    },
  },
  mn: {
    langButtonLabel: "МОН",
    calendarMonths: [
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
    calendarDays: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
    photoWord: "зураг",
    mainPhotoAlt: "Үндсэн зураг",
    groomPhotoAlt: "Хүргэн",
    extraPhotoAlt: "Нэмэлт зураг",
    invitationLine1:
      "Эрхэм хүндэт ахан дүүс, төрөл төрөгсөд, худ ураг, найз нөхөд, хамтран ажиллагсад болон хөршүүд ээ!",
    invitationLine2: "Таныг хүү",
    invitationConnector: "болон бэр",
    invitationLine3: "-ийн хуримын ёслолд хүндэт зочноор урьж байна!",
    organizerTitle: "Хурим эзэд",
    organizerSubtitle: "Эцэг эх",
    parentsTitle: "Эцэг эхчүүд",
    groomSide: "Хүргэн тал",
    brideSide: "Бэр тал",
    timeLabel: "Цаг",
    venueLabel: "Байршил",
    wishesTitle: "Ерөөл хүсэлт",
    galleryTitle: "Зургийн цомог",
    galleryCaption: "❤️ Бидний хайрын дурсамжууд ❤️",
    paymentLocked: "Төлбөр төлөгдөөгүй",
    footerPoem: [
      "Чамд дурла гэж заяа минь намайг хөтөлсөн",
      "Чамайг хайрла гэж хорвоо надад тушаасан",
      "Хамгаас илүү гэж бурхан надад шивнэсэн",
      "Хайрлаж явья гэж харин би өөрөө шийдсэн",
    ],
    nav: {
      love: "Хайр",
      photos: "Зургууд",
      details: "Дэлгэрэнгүй",
      wishes: "Ерөөл",
    },
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: T6Translations;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: T6.kk,
  toggleLang: () => {},
});

function useLang() {
  return useContext(LangContext);
}

function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-[110] flex items-center gap-1 rounded-full px-3 py-1.5 transition-transform active:scale-95"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "0.5px solid rgba(0,65,106,0.25)",
        boxShadow: "0 6px 16px rgba(0,65,106,0.15)",
        fontFamily: "'Optima',sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: "#00416A",
      }}
      aria-label="Switch language / Хэл сэлгэх"
    >
      <span style={{ opacity: lang === "kk" ? 1 : 0.4 }}>ҚАЗ</span>
      <span style={{ opacity: 0.35 }}>/</span>
      <span style={{ opacity: lang === "mn" ? 1 : 0.4 }}>МОН</span>
    </button>
  );
}

function formatEventDate(
  iso: string | null | undefined,
  months: string[],
): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

/* ------------------------------------------------------------------------
   pickLang — some wedding fields come from the DB with BOTH languages
   packed into a single string, e.g.:
     "kk: Баян-Өлгий қаласы Өлгий сұмыны  mn: Баян-Өлгий аймаг Өлгий сум"
   This pulls out just the part matching the active language. If only one
   of "kk:" / "mn:" is present, that one is used regardless of active
   language. If neither label is present, the original text is returned
   as-is (so plain, non-tagged fields keep working exactly like before).
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
    // avoid infinite loops on zero-length matches
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

// ─── useInView hook ───
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── AnimatedClock ───
function AnimatedClock({ time, visible }: { time: string; visible: boolean }) {
  const [h, m] = time.split(":").map(Number);
  const hourDeg = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const minDeg = (m / 60) * 360;
  const [secDeg, setSecDeg] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const tick = () => setSecDeg((new Date().getSeconds() / 60) * 360);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="clock-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eef0f8" />
          <stop offset="100%" stopColor="#eef0f8" />
        </radialGradient>
        <filter id="clock-shadow">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.08)"
          />
        </filter>
      </defs>
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="url(#clock-bg)"
        filter="url(#clock-shadow)"
        stroke="rgba(0,65,106,0.4)"
        strokeWidth="0.8"
      />
      <circle
        cx="40"
        cy="40"
        r="33"
        fill="none"
        stroke="rgba(0,65,106,0.15)"
        strokeWidth="0.4"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const r1 = 28,
          r2 = i % 3 === 0 ? 24 : 26;
        return (
          <line
            key={i}
            x1={40 + r1 * Math.cos(a)}
            y1={40 + r1 * Math.sin(a)}
            x2={40 + r2 * Math.cos(a)}
            y2={40 + r2 * Math.sin(a)}
            stroke={i % 3 === 0 ? "rgba(0,65,106,0.7)" : "rgba(0,65,106,0.3)"}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
          />
        );
      })}
      <line
        x1="40"
        y1="40"
        x2={40 + 15 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
        y2={40 + 15 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
        stroke="#00416A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 21 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={40 + 21 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke="#00416A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 23 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={40 + 23 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke="rgba(0,65,106,0.8)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="2.5" fill="#00416A" />
      <circle cx="40" cy="40" r="1.2" fill="#fff" />
    </svg>
  );
}

// ─── AnimatedCalendar ───
function AnimatedCalendar({ dateStr }: { dateStr?: string | null }) {
  const { t } = useLang();
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const firstDow = (() => {
    const v = new Date(year, month, 1).getDay();
    return v === 0 ? 6 : v - 1;
  })();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ position: "relative", margin: "0 auto" }}>
      <style>{`
        @keyframes cal-drop { 0%{opacity:0;transform:translateY(-18px) scale(0.92)} 60%{transform:translateY(3px) scale(1.02)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes day-pop { 0%{opacity:0;transform:scale(0.5)} 65%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)} }
        @keyframes heart-beat { 0%,100%{transform:scale(1)} 30%{transform:scale(1.3)} 60%{transform:scale(0.88)} }
        @keyframes ring-draw { 0%{stroke-dashoffset:550;opacity:0.2} 100%{stroke-dashoffset:0;opacity:0.65} }
        @keyframes dot-in { 0%{opacity:0;transform:scale(0)} 100%{opacity:1;transform:scale(1)} }
        .cal-ring { stroke-dasharray:550; animation:ring-draw 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards; }
        .cal-wrap  { animation:cal-drop 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .day-pop   { animation:day-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.55s both; }
        .hrt-beat  { animation:heart-beat 1.4s ease-in-out 1.2s infinite; transform-origin:center; display:inline-block; }
        .dot-in    { animation:dot-in 0.4s ease both; }
      `}</style>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 0,
        }}
        viewBox="0 0 168 215"
      >
        <circle
          className="cal-ring"
          cx="84"
          cy="107"
          r="90"
          fill="none"
          stroke="rgba(0,65,106,0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="84"
          cy="107"
          r="97"
          fill="none"
          stroke="rgba(0,65,106,0.1)"
          strokeWidth="0.5"
        />
        {[
          [84, 12],
          [84, 202],
          [4, 107],
          [164, 107],
          [24, 35],
          [144, 35],
          [24, 179],
          [144, 179],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            className="dot-in"
            cx={cx}
            cy={cy}
            r="2"
            fill="#00416A"
            opacity="0.6"
            style={{ animationDelay: `${0.9 + i * 0.07}s` }}
          />
        ))}
      </svg>
      <div
        className="cal-wrap"
        style={{
          position: "relative",
          zIndex: 2,
          background: "#ffffff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07),0 2px 8px rgba(0,65,106,0.1)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#eef0f8 0%,#dde0ee 50%,#eef0f8 100%)",
            padding: "14px 16px 12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "'Optima',sans-serif",
              fontSize: 14,
              letterSpacing: "0.38em",
              color: "#00416A",
              textTransform: "uppercase",
              margin: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {t.calendarMonths[month]} · {year}
          </p>
        </div>
        <div
          style={{
            background: "rgba(0,65,106,0.05)",
            borderBottom: "0.5px solid rgba(0,65,106,0.12)",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}
          >
            {t.calendarDays.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  padding: "5px 0",
                  fontFamily: "'Optima',sans-serif",
                  fontSize: 11.5,
                  letterSpacing: "0.04em",
                  color: "rgba(0,65,106,0.90)",
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "6px 8px 10px", background: "#ffffff" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 2,
              textAlign: "center",
            }}
          >
            {cells.map((cell, idx) => {
              if (!cell) return <div key={idx} />;
              const dow = (firstDow + cell - 1) % 7;
              const isWeekend = dow === 5 || dow === 6;
              const isTarget = cell === day;
              if (isTarget)
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "3px 0",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        viewBox="0 0 28 26"
                        width="28"
                        height="28"
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <path
                          d="M14,23 C14,23 2,15 2,7.5 C2,4.5 4.3,2.5 7.5,2.5 C10,2.5 12.2,4 14,6 C15.8,4 18,2.5 20.5,2.5 C23.7,2.5 26,4.5 26,7.5 C26,15 14,23 14,23Z"
                          fill="rgba(0,65,106,0.15)"
                          stroke="rgba(0,65,106,0.65)"
                          strokeWidth="0.9"
                        />
                      </svg>
                      <span
                        className="day-pop"
                        style={{
                          fontFamily: "'Optima',sans-serif",
                          fontSize: 15,
                          fontWeight: 400,
                          color: "#00416A",
                          position: "relative",
                          zIndex: 1,
                          lineHeight: 1,
                        }}
                      >
                        {cell}
                      </span>
                    </div>
                    <span
                      className="hrt-beat"
                      style={{ lineHeight: 1, marginTop: 1 }}
                    >
                      <svg viewBox="0 0 12 11" width="10" height="10">
                        <path
                          d="M6,9.5 C6,9.5 0.5,6 0.5,3 C0.5,1.6 1.6,0.5 3,0.5 C4.2,0.5 5.2,1.3 6,2.2 C6.8,1.3 7.8,0.5 9,0.5 C10.4,0.5 11.5,1.6 11.5,3 C11.5,6 6,9.5 6,9.5Z"
                          fill="#00416A"
                          opacity="0.9"
                        />
                      </svg>
                    </span>
                  </div>
                );
              return (
                <div key={idx} style={{ padding: "4px 0" }}>
                  <span
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 14,
                      color: isWeekend
                        ? "rgba(0,65,106,0.55)"
                        : "rgba(0,65,106,0.45)",
                    }}
                  >
                    {cell}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GallerySwiper ───
function GallerySwiper({ urls }: { urls: string[] }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child)
      el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
    setActive(i);
  };
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % urls.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
  };
  useEffect(() => {
    if (urls.length <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [urls.length]);
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.offsetWidth / 2;
    let closest = 0,
      minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  };
  return (
    <div>
      <style>{`@keyframes gold-progress{from{width:0%}to{width:100%}}`}</style>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-1 overflow-x-auto snap-x snap-mandatory px-5 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 overflow-hidden"
            style={{
              width: "75vw",
              maxWidth: 380,
              height: 340,
              borderRadius: 12,
              background: "transparent",
              transition: "transform 0.35s ease,box-shadow 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 10px 32px rgba(0,0,0,0.10)"
                  : "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={url}
              alt={`${t.photoWord} ${i + 1}`}
              className="w-full h-full object-contain"
              style={{
                display: "block",
                border: "none",
                opacity: active === i ? 1 : 0.65,
                transition: "opacity 0.35s ease",
              }}
            />
          </div>
        ))}
      </div>
      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 rounded-none overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                background: "rgba(0,65,106,0.3)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#3d4f7c",
                    animation: "gold-progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GoldDivider ───
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right,transparent,rgba(0,65,106,0.45))",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(0,65,106,0.4)",
            transform: "rotate(45deg)",
          }}
        />
        <FaStar
          size={8}
          style={{ color: "rgba(0,65,106,0.65)", flexShrink: 0 }}
        />
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(0,65,106,0.4)",
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left,transparent,rgba(0,65,106,0.45))",
        }}
      />
    </div>
  );
}

// ─── FloralDots ───
function FloralDots() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "4px 0",
      }}
    >
      {[0.2, 0.4, 0.65, 0.4, 0.2].map((op, i) => (
        <div
          key={i}
          style={{
            width: i === 2 ? 5 : 3,
            height: i === 2 ? 5 : 3,
            borderRadius: "50%",
            background: `rgba(0,65,106,${op})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Label ───
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 16,
        letterSpacing: "0.38em",
        fontFamily: "'Optima',sans-serif",
        fontWeight: 400,
        color: "rgba(0,65,106,0.95)",
        margin: "0 0 10px 0",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

// ─── SectionHeader ───
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 px-5 mb-5"
      style={{ justifyContent: "center" }}
    >
      <FaLeaf
        size={9}
        style={{ color: "rgba(0,65,106,0.45)", transform: "scaleX(-1)" }}
      />
      <div
        className="h-px"
        style={{
          width: 25,
          background:
            "linear-gradient(to right,transparent,rgba(0,65,106,0.35))",
        }}
      />
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.42em",
          fontFamily: "'Optima',sans-serif",
          color: "rgba(0,65,106,0.90)",
          textTransform: "uppercase",
          fontWeight: 400,
          margin: 0,
        }}
      >
        {children}
      </p>
      <div
        className="h-px"
        style={{
          width: 30,
          background:
            "linear-gradient(to left,transparent,rgba(0,65,106,0.35))",
        }}
      />
      <FaLeaf size={8} style={{ color: "rgba(0,65,106,0.45)" }} />
    </div>
  );
}

// ─── DateTimeBlock ───
function DateTimeBlock({
  date,
  time,
}: {
  date: string | null;
  time: string | null;
}) {
  const { t } = useLang();
  const { ref, visible } = useInView(0.2);
  return (
    <div ref={ref} className="text-center" style={{ padding: "4px 0" }}>
      <style>{`
        @keyframes dtb-border-spin { 0%{ --dtb-angle: 0deg } 100%{ --dtb-angle: 360deg } }
        @keyframes dtb-glow-pulse { 0%,100%{ box-shadow:0 0 0px rgba(0,65,106,0),0 8px 28px rgba(0,65,106,0.10) } 50%{ box-shadow:0 0 26px rgba(61,79,124,0.35),0 12px 34px rgba(0,65,106,0.16) } }
        @keyframes dtb-sheen { 0%{ transform:translateX(-130%) skewX(-18deg) } 100%{ transform:translateX(230%) skewX(-18deg) } }
        @keyframes dtb-sparkle { 0%,100%{ opacity:0.25; transform:scale(0.85) } 50%{ opacity:1; transform:scale(1.15) } }
        @property --dtb-angle { syntax:'<angle>'; inherits:false; initial-value:0deg; }
        .dtb-frame {
          position: relative;
          border-radius: 22px;
          padding: 2px;
          background: conic-gradient(from var(--dtb-angle), #00416A, #8fa0d6, #eef0f8, #3d4f7c, #00416A);
          animation: dtb-border-spin 7s linear infinite, dtb-glow-pulse 3.4s ease-in-out infinite;
        }
        .dtb-inner {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(160deg,#ffffff 0%,#f4f6fc 60%,#eef0f8 100%);
          padding: 26px 24px 22px;
        }
        .dtb-sheen-el {
          position: absolute;
          top: -40%;
          left: 0;
          width: 40%;
          height: 180%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%);
          animation: dtb-sheen 3.6s ease-in-out infinite;
          animation-delay: 1s;
          pointer-events: none;
        }
      `}</style>
      <Label>{t.timeLabel}</Label>
      <FloralDots />
      <div
        className="dtb-frame mt-4 mx-auto"
        style={{
          maxWidth: 300,
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        <div className="dtb-inner">
          <div className="dtb-sheen-el" />
          {[
            ["top:8px", "left:8px", "M1,13 Q1,1 13,1"],
            ["top:8px", "right:8px", "M13,13 Q13,1 1,1"],
            ["bottom:8px", "left:8px", "M1,1 Q1,13 13,13"],
            ["bottom:8px", "right:8px", "M13,1 Q13,13 1,13"],
          ].map(([p1, p2, path], i) => (
            <svg
              key={i}
              style={{
                position: "absolute",
                [p1.split(":")[0]]: p1.split(":")[1],
                [p2.split(":")[0]]: p2.split(":")[1],
                opacity: 0.55,
                zIndex: 2,
              }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
            >
              <path
                d={path}
                stroke="#3d4f7c"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          ))}
          {time && (
            <div
              className="tick-in"
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                animationPlayState: visible ? "running" : "paused",
              }}
            >
              <AnimatedClock time={time} visible={visible} />
              <div
                className="reveal-up"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background:
                    "linear-gradient(135deg,#00416A 0%,#3d4f7c 55%,#00416A 100%)",
                  borderRadius: 10,
                  padding: "8px 22px",
                  boxShadow:
                    "0 4px 18px rgba(0,65,106,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  animationDelay: "0.2s",
                  animationPlayState: visible ? "running" : "paused",
                }}
              >
                <FaClock size={10} style={{ color: "#eef0f8" }} />
                <p
                  style={{
                    fontFamily: "'Optima',sans-serif",
                    fontSize: 22,
                    letterSpacing: "0.32em",
                    color: "#ffffff",
                    fontWeight: 400,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {time}
                </p>
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute",
                      top: i === 0 ? -4 : "auto",
                      bottom: i === 1 ? -4 : "auto",
                      left: i === 0 ? 10 : "auto",
                      right: i === 1 ? 10 : "auto",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#8fa0d6",
                      animation: `dtb-sparkle ${1.8 + i * 0.5}s ease-in-out ${i * 0.6}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {date && (
            <div
              className="reveal-up"
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: time ? 16 : 0,
                animationDelay: "0.35s",
                animationPlayState: visible ? "running" : "paused",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 20,
                    background:
                      "linear-gradient(to right,transparent,rgba(0,65,106,0.4))",
                  }}
                />
                <FaStar size={7} style={{ color: "rgba(0,65,106,0.5)" }} />
                <div
                  style={{
                    height: 1,
                    width: 20,
                    background:
                      "linear-gradient(to left,transparent,rgba(0,65,106,0.4))",
                  }}
                />
              </div>
              <p
                className="font-light italic"
                style={{
                  fontFamily: "'Optima',sans-serif",
                  fontSize: 26,
                  color: "#00416A",
                  letterSpacing: "0.02em",
                  lineHeight: 1.3,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {date}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ScrollRevealSection ───
function ScrollRevealSection({
  children,
  direction = "left",
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.12);
  const translateMap = {
    left: "translateX(-48px)",
    right: "translateX(48px)",
    up: "translateY(32px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : translateMap[direction],
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── InvitationHero ───
function InvitationHero({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
  const { t } = useLang();
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="text-center px-6 mt-4 mb-2"
      style={{ background: "#ffffff" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap');
        @keyframes inv-slide-left { 0%{opacity:0;transform:translateX(-52px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes inv-slide-right { 0%{opacity:0;transform:translateX(52px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes inv-fade-up { 0%{opacity:0;transform:translateY(28px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes inv-name-pop { 0%{opacity:0;transform:scale(0.85) translateY(16px);filter:blur(6px)} 70%{filter:blur(0)} 100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)} }
        .inv-from-left  { animation: inv-slide-left  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-from-right { animation: inv-slide-right 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-fade-up    { animation: inv-fade-up     0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-name-pop   { animation: inv-name-pop    0.9s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>
      <p
        className="inv-from-left"
        style={{
          fontFamily: "'Optima',sans-serif",
          fontSize: 15,
          letterSpacing: "0.2em",
          color: "rgba(0,65,106,0.95)",
          lineHeight: 2,
          textTransform: "uppercase",
          fontWeight: 400,
          margin: 0,
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {t.invitationLine1}
      </p>
      <p
        className="inv-from-left"
        style={{
          fontFamily: "'Optima',sans-serif",
          fontSize: 15,
          letterSpacing: "0.2em",
          color: "rgba(0,65,106,0.95)",
          lineHeight: 2.2,
          textTransform: "uppercase",
          fontWeight: 400,
          margin: "4px 0 0",
          animationDelay: visible ? "0.18s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {t.invitationLine2}
      </p>
      <p
        className="name-solid inv-name-pop"
        style={{
          fontFamily: "'Monsieur La Doulaise',cursive",
          color: "#00416A",
          fontSize: 36,
          fontWeight: 400,
          fontStyle: "normal",
          lineHeight: 1.05,
          letterSpacing: "0.01em",
          margin: "8px 0 4px",
          animationDelay: visible ? "0.3s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {maleName}
      </p>
      <div
        className="inv-fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          margin: "4px 0",
          animationDelay: visible ? "0.42s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        <div
          style={{
            height: 1,
            width: 32,
            background:
              "linear-gradient(to right,transparent,rgba(0,65,106,0.5))",
          }}
        />
        <p
          style={{
            fontFamily: "'Optima',sans-serif",
            fontSize: 14,
            letterSpacing: "0.3em",
            color: "rgba(0,65,106,0.88)",
            textTransform: "uppercase",
            fontWeight: 400,
            margin: 0,
          }}
        >
          {t.invitationConnector}
        </p>
        <div
          style={{
            height: 1,
            width: 32,
            background:
              "linear-gradient(to left,transparent,rgba(0,65,106,0.5))",
          }}
        />
      </div>
      <p
        className="name-solid inv-name-pop"
        style={{
          fontFamily: "'Monsieur La Doulaise',cursive",
          color: "#00416A",
          fontSize: 36,
          fontWeight: 400,
          fontStyle: "normal",
          lineHeight: 1.05,
          letterSpacing: "0.01em",
          margin: "4px 0 12px",
          animationDelay: visible ? "0.52s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {femaleName}
      </p>
      <p
        className="inv-from-right"
        style={{
          fontFamily: "'Optima',sans-serif",
          fontSize: 15,
          letterSpacing: "0.13em",
          color: "rgba(0,65,106,0.88)",
          lineHeight: 1.95,
          textTransform: "uppercase",
          fontWeight: 400,
          margin: 0,
          animationDelay: visible ? "0.66s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {t.invitationLine3}
      </p>
      <div
        className="inv-fade-up"
        style={{
          marginTop: 16,
          animationDelay: visible ? "0.8s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      ></div>
    </div>
  );
}

// ─── OrganizerBlock ───
function OrganizerBlock({
  organizer,
  maleParents,
  femaleParents,
}: {
  organizer: string;
  maleParents?: string | null;
  femaleParents?: string | null;
}) {
  const { t } = useLang();
  const lines = organizer.split("\n").filter(Boolean);
  return (
    <div className="mx-5 mt-8 py-2">
      <GoldDivider className="mb-6" />
      <div
        style={{
          borderRadius: 20,
          padding: "28px 24px 24px",
          background: "#ffffff",
          boxShadow: "0 2px 20px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              height: 1,
              width: 28,
              background:
                "linear-gradient(to right,transparent,rgba(0,65,106,0.5))",
            }}
          />
          <svg viewBox="0 0 20 18" width="16" height="14">
            <path
              d="M10,16 C10,16 1,10 1,5 C1,2.8 2.8,1 5,1 C7,1 8.8,2.2 10,3.8 C11.2,2.2 13,1 15,1 C17.2,1 19,2.8 19,5 C19,10 10,16 10,16Z"
              fill="rgba(0,65,106,0.25)"
              stroke="rgba(0,65,106,0.6)"
              strokeWidth="0.7"
            />
          </svg>
          <p
            style={{
              fontSize: 14,
              letterSpacing: "0.45em",
              fontFamily: "'Optima',sans-serif",
              fontWeight: 400,
              color: "rgba(0,65,106,0.92)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {t.organizerTitle}
          </p>
          <svg viewBox="0 0 20 18" width="16" height="14">
            <path
              d="M10,16 C10,16 1,10 1,5 C1,2.8 2.8,1 5,1 C7,1 8.8,2.2 10,3.8 C11.2,2.2 13,1 15,1 C17.2,1 19,2.8 19,5 C19,10 10,16 10,16Z"
              fill="rgba(0,65,106,0.25)"
              stroke="rgba(0,65,106,0.6)"
              strokeWidth="0.7"
            />
          </svg>
          <div
            style={{
              height: 1,
              width: 28,
              background:
                "linear-gradient(to left,transparent,rgba(0,65,106,0.5))",
            }}
          />
        </div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#002237",
          }}
        >
          {t.organizerSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "center",
          }}
        >
          {(() => {
            const items = lines.length > 0 ? lines : [organizer];
            if (items.length === 2)
              return (
                <>
                  <p
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#002237",
                      lineHeight: 1.9,
                      wordBreak: "break-word",
                      margin: 0,
                    }}
                  >
                    {items[0]}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        height: 1,
                        width: 24,
                        background:
                          "linear-gradient(to right,transparent,rgba(0,65,106,0.5))",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Optima',sans-serif",
                        fontSize: 30,
                        fontStyle: "italic",
                        color: "rgba(0,65,106,0.75)",
                        lineHeight: 1,
                        fontWeight: 400,
                      }}
                    >
                      &amp;
                    </span>
                    <div
                      style={{
                        height: 1,
                        width: 24,
                        background:
                          "linear-gradient(to left,transparent,rgba(0,65,106,0.5))",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#002237",
                      lineHeight: 1.9,
                      wordBreak: "break-word",
                      margin: 0,
                    }}
                  >
                    {items[1]}
                  </p>
                </>
              );
            return items.flatMap((line, i) =>
              line
                .split(/<br\s*\/?>/i)
                .map((sub) => sub.trim())
                .filter(Boolean)
                .map((sub, j) => (
                  <p
                    key={`${i}-${j}`}
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#002237",
                    }}
                  >
                    {sub}
                  </p>
                )),
            );
          })()}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            marginTop: 16,
          }}
        >
          {[0.15, 0.3, 0.55, 0.3, 0.15].map((op, i) => (
            <div
              key={i}
              style={{
                width: i === 2 ? 6 : i === 1 || i === 3 ? 4 : 3,
                height: i === 2 ? 6 : i === 1 || i === 3 ? 4 : 3,
                borderRadius: "50%",
                background: `rgba(0,65,106,${op})`,
              }}
            />
          ))}
        </div>
        {(maleParents || femaleParents) && (
          <div
            style={{
              marginTop: 22,
              borderTop: "0.5px solid rgba(0,65,106,0.18)",
              paddingTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  height: 1,
                  width: 22,
                  background:
                    "linear-gradient(to right,transparent,rgba(0,65,106,0.45))",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.38em",
                  fontFamily: "'Optima',sans-serif",
                  fontWeight: 400,
                  color: "rgba(0,65,106,0.85)",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {t.parentsTitle}
              </p>
              <div
                style={{
                  height: 1,
                  width: 22,
                  background:
                    "linear-gradient(to left,transparent,rgba(0,65,106,0.45))",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: "center",
              }}
            >
              {maleParents && (
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      fontFamily: "'Optima',sans-serif",
                      color: "rgba(0,65,106,0.75)",
                      textTransform: "uppercase",
                      margin: "0 0 4px",
                      fontWeight: 400,
                    }}
                  >
                    {t.groomSide}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#00416A",
                      lineHeight: 1.75,
                      wordBreak: "break-word",
                      margin: 0,
                    }}
                  >
                    {maleParents}
                  </p>
                </div>
              )}
              {maleParents && femaleParents && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      height: 1,
                      width: 20,
                      background:
                        "linear-gradient(to right,transparent,rgba(0,65,106,0.4))",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 22,
                      fontStyle: "italic",
                      color: "rgba(0,65,106,0.7)",
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                  >
                    &amp;
                  </span>
                  <div
                    style={{
                      height: 1,
                      width: 20,
                      background:
                        "linear-gradient(to left,transparent,rgba(0,65,106,0.4))",
                    }}
                  />
                </div>
              )}
              {femaleParents && (
                <div
                  className="org-line-enter"
                  style={{
                    textAlign: "center",
                    animationDelay: "0s",
                    animationPlayState: "paused",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      fontFamily: "'Optima',sans-serif",
                      color: "rgba(0,65,106,0.75)",
                      textTransform: "uppercase",
                      margin: "0 0 4px",
                      fontWeight: 400,
                    }}
                  >
                    {t.brideSide}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Optima',sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#00416A",
                      lineHeight: 1.75,
                      wordBreak: "break-word",
                      margin: 0,
                    }}
                  >
                    {femaleParents}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RotatingOrnament ───
function RotatingOrnament({
  position,
  size = 200,
  opacity = 0.07,
}: {
  position: "top-right" | "bottom-left";
  size?: number;
  opacity?: number;
}) {
  const isTopRight = position === "top-right";
  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        top: isTopRight ? -size * 0.1 : "auto",
        bottom: isTopRight ? "auto" : -size * 0.3,
        right: isTopRight ? -size * 0.3 : "auto",
        left: isTopRight ? "auto" : -size * 0.3,
        opacity,
        animation: "spin-slow 22s linear infinite",
        animationDirection: isTopRight ? "normal" : "reverse",
      }}
    >
      <img
        src="/images/hee.jpg"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          border: "none",
        }}
      />
    </div>
  );
}

// ─── SECTION NAV ───
function SectionNavBar() {
  const { t } = useLang();
  const [active, setActive] = useState("section-hero");

  const NAV_ITEMS = [
    { id: "section-hero", emoji: "💍", label: t.nav.love },
    { id: "section-photos", emoji: "📸", label: t.nav.photos },
    { id: "section-details", emoji: "📅", label: t.nav.details },
    { id: "section-messages", emoji: "💌", label: t.nav.wishes },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActive(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "0.5px solid rgba(0,65,106,0.22)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {NAV_ITEMS.map(({ id, emoji, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "10px 4px 10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "20%",
                    right: "20%",
                    height: 2,
                    borderRadius: "0 0 2px 2px",
                    background:
                      "linear-gradient(to right,#3d4f7c,#00416A,#3d4f7c)",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 22,
                  lineHeight: 1,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {emoji}
              </span>
              <span
                style={{
                  fontFamily: "'Optima',sans-serif",
                  fontSize: 9.5,
                  letterSpacing: "0.05em",
                  color: isActive ? "#00416A" : "rgba(0,65,106,0.6)",
                  fontWeight: 400,
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function Template6({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = T6[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const date = formatEventDate(wedding.wedding_date, t.calendarMonths);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  // Some fields may store both languages inline ("kk: ... mn: ...");
  // pick out the part matching the active language (falls back to
  // whatever is available, or the raw text if it isn't tagged at all).
  const venueName = pickLang(wedding.venue_name, lang);
  const venueAddress = pickLang(wedding.venue_address, lang);
  const organizer = pickLang(wedding.organizer, lang);
  const maleParents = pickLang((wedding as any).male_parents, lang);
  const femaleParents = pickLang((wedding as any).female_parents, lang);
  const description1 = pickLang(wedding.description1, lang);

  const extras = [
    pickLang(wedding.extra1, lang),
    pickLang(wedding.extra2, lang),
    pickLang(wedding.extra3, lang),
    pickLang(wedding.extra4, lang),
  ].filter(Boolean);

  const extra5 = wedding.extra5 ? wedding.extra5 : null;

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {extra5 ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <LanguageToggle />
          <p
            style={{
              fontFamily: "'Optima',sans-serif",
              fontSize: 18,
              letterSpacing: "0.3em",
              color: "rgba(0,65,106,0.7)",
              textTransform: "uppercase",
            }}
          >
            {t.paymentLocked}
          </p>

          <Template6Music />
        </div>
      ) : (
        <>
          <style>{`
        * { box-sizing:border-box; }
        img { border:none !important; outline:none !important; }
        body,#__next { background:#ffffff !important; }
        @keyframes shimmer-gold { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float-gentle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes petal-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .shimmer-gold { background:linear-gradient(90deg,#1a2040 15%,#4a5280 42%,#00416A 58%,#1a2040 85%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-gold 6s linear infinite; }
        .name-solid { font-family:'Monsieur La Doulaise',cursive; color:#00416A; }
        .fade-up { animation:fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1  { animation-delay:0.1s; }
        .fade-2  { animation-delay:0.25s; }
        .fade-3  { animation-delay:0.4s; }
        @keyframes tick-in { 0%{opacity:0;transform:scale(0.6) rotate(-15deg)} 70%{transform:scale(1.08) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
        @keyframes reveal-up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .reveal-up { animation:reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .tick-in   { animation:tick-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes floatHeart { 0%{transform:translateY(0) rotate(0deg);opacity:0} 50%{transform:translateY(-100px) translateX(20px) rotate(180deg);opacity:.8} 100%{transform:translateY(-220px) translateX(-20px) rotate(360deg);opacity:0} }
      `}</style>
          <div
            className="fixed inset-0 z-0"
            style={{ background: "#ffffff" }}
          />

          <LanguageToggle />

          <div
            className="relative z-10 min-h-screen overflow-y-auto"
            style={{
              fontFamily: "'Optima',sans-serif",
              background: "#ffffff",
              paddingBottom: 80,
            }}
          >
            <RotatingOrnament position="top-right" size={220} opacity={0.07} />
            <RotatingOrnament
              position="bottom-left"
              size={220}
              opacity={0.07}
            />

            {/* ═══════════════════════════════════════════════════
                SECTION 1: ЕСІМДЕР — Hero + Invitation + Organizer
            ═══════════════════════════════════════════════════ */}
            <section id="section-hero">
              <div className="relative w-full h-[62vh] overflow-hidden">
                {wedding.main_photo_url ? (
                  <img
                    src={wedding.main_photo_url}
                    alt={t.mainPhotoAlt}
                    className="w-full h-full object-cover"
                    style={{ display: "block", border: "none" }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg,#eef0f8 0%,#dde0ee 50%,#eef0f8 100%)",
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        style={{ animation: "petal-spin 30s linear infinite" }}
                      >
                        {[
                          0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
                        ].map((deg, i) => {
                          const r = (deg * Math.PI) / 180;
                          return (
                            <ellipse
                              key={i}
                              cx={60 + Math.cos(r) * 28}
                              cy={60 + Math.sin(r) * 28}
                              rx="9"
                              ry="14"
                              transform={`rotate(${deg + 90},${60 + Math.cos(r) * 28},${60 + Math.sin(r) * 28})`}
                              fill="#3d4f7c"
                              opacity="0.25"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute">
                        <FaHeart
                          size={36}
                          style={{ color: "rgba(0,65,106,0.35)" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,#ffffff 0%,transparent 55%)",
                  }}
                />
              </div>

              <div
                className="mt-10 relative z-10"
                style={{ background: "#ffffff" }}
              >
                <InvitationHero
                  maleName={wedding.male_name}
                  femaleName={wedding.female_name}
                />
              </div>

              {organizer && (
                <ScrollRevealSection direction="left" delay={0.05}>
                  <OrganizerBlock
                    organizer={organizer}
                    maleParents={maleParents || null}
                    femaleParents={femaleParents || null}
                  />
                </ScrollRevealSection>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 2: ФОТОЛАР — Photo3 + Gallery
            ═══════════════════════════════════════════════════ */}
            <section id="section-photos">
              {wedding.photo3_url && (
                <ScrollRevealSection
                  direction="up"
                  delay={0}
                  style={{
                    overflow: "hidden",
                    padding: "0 20px",
                    marginTop: 16,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "0.5px solid rgba(0,65,106,0.2)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    }}
                  >
                    <img
                      src={wedding.photo3_url}
                      alt={t.groomPhotoAlt}
                      className="w-full object-cover"
                      style={{
                        display: "block",
                        border: "none",
                        maxHeight: 480,
                        objectPosition: "center top",
                      }}
                    />
                  </div>
                </ScrollRevealSection>
              )}

              {!!wedding.gallery_urls?.length && (
                <ScrollRevealSection
                  direction="up"
                  delay={0}
                  style={{ marginTop: 32 }}
                >
                  <p
                    className="shimmer-gold my-2 flex justify-center w-full"
                    style={{ fontSize: 15, fontFamily: "'Optima',sans-serif" }}
                  >
                    {t.galleryCaption}
                  </p>
                  <SectionHeader>{t.galleryTitle}</SectionHeader>
                  <GallerySwiper urls={wedding.gallery_urls} />
                </ScrollRevealSection>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 3: МӘЛІМЕТТЕР — Дата/Уақыт/Мекен/Extras
            ═══════════════════════════════════════════════════ */}
            <section id="section-details">
              {wedding.wedding_date && (
                <ScrollRevealSection
                  direction="right"
                  delay={0.05}
                  style={{ marginTop: 16, padding: "0 20px" }}
                >
                  <AnimatedCalendar dateStr={wedding.wedding_date} />
                </ScrollRevealSection>
              )}

              <div style={{ padding: "0 32px", marginTop: 24 }}>
                <GoldDivider />
              </div>

              <div className="mx-5 mt-10 mb-2">
                <div className="p-6 space-y-5">
                  {(date || time) && (
                    <ScrollRevealSection direction="up" delay={0}>
                      <DateTimeBlock date={date} time={time} />
                    </ScrollRevealSection>
                  )}

                  {(venueName || venueAddress) && (
                    <ScrollRevealSection
                      direction="left"
                      delay={0.1}
                      style={{
                        borderTop: "0.5px solid rgba(0,65,106,0.1)",
                        paddingTop: 20,
                      }}
                    >
                      <div className="text-center">
                        <Label>{t.venueLabel}</Label>
                        <FloralDots />
                        {venueName && (
                          <p
                            className="font-light italic mt-3"
                            style={{
                              fontSize: 28,
                              wordBreak: "break-word",
                              color: "#00416A",
                              lineHeight: 1.35,
                              letterSpacing: "0.01em",
                            }}
                          >
                            {venueName}
                          </p>
                        )}
                        {venueAddress && (
                          <div className="flex items-start justify-center gap-1.5 mt-2">
                            <FaMapMarkerAlt
                              size={11}
                              style={{
                                color: "rgba(0,65,106,0.75)",
                                flexShrink: 0,
                                marginTop: 3,
                              }}
                            />
                            <p
                              style={{
                                fontSize: 18,
                                fontWeight: 400,
                                fontFamily: "'Optima',sans-serif",
                                wordBreak: "break-word",
                                letterSpacing: "0.04em",
                                color: "#00416A",
                                lineHeight: 1.6,
                              }}
                            >
                              {venueAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollRevealSection>
                  )}

                  {extras.length > 0 && (
                    <div
                      className="border-t pt-5 space-y-4"
                      style={{ borderColor: "rgba(0,65,106,0.1)" }}
                    >
                      {extras.map((e, i) => (
                        <ScrollRevealSection
                          key={i}
                          direction={i % 2 === 0 ? "left" : "right"}
                          delay={i * 0.08}
                        >
                          <div className="flex items-start gap-3">
                            <FaStar
                              size={16}
                              style={{
                                color: "rgba(0,65,106,0.6)",
                                flexShrink: 0,
                                marginTop: 5,
                              }}
                            />
                            <p
                              className="leading-relaxed"
                              style={{
                                fontSize: 20,
                                fontFamily: "'Optima',sans-serif",
                                wordBreak: "break-word",
                                color: "#00416A",
                                letterSpacing: "0.02em",
                                lineHeight: 1.65,
                                fontWeight: 400,
                              }}
                            >
                              {e}
                            </p>
                          </div>
                        </ScrollRevealSection>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* DESCRIPTION 1 */}
              {description1 && (
                <ScrollRevealSection
                  direction="up"
                  delay={0}
                  style={{ marginTop: 32 }}
                >
                  <div className="mx-5">
                    <GoldDivider className="mb-6" />
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 20,
                        padding: "30px 26px 26px",
                        background: "#ffffff",
                        border: "0.5px solid rgba(0,65,106,0.16)",
                        boxShadow:
                          "0 2px 20px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          marginBottom: 18,
                        }}
                      >
                        <div
                          style={{
                            height: 1,
                            width: 28,
                            background:
                              "linear-gradient(to right,transparent,rgba(0,65,106,0.5))",
                          }}
                        />
                        <FaHeart
                          size={13}
                          style={{ color: "rgba(0,65,106,0.55)" }}
                        />
                        <div
                          style={{
                            height: 1,
                            width: 28,
                            background:
                              "linear-gradient(to left,transparent,rgba(0,65,106,0.5))",
                          }}
                        />
                      </div>
                      <div>
                        {description1
                          .split(/<br\s*\/?>/i)
                          .map((sub) => sub.trim())
                          .filter(Boolean)
                          .map((sub, i) => (
                            <p
                              key={i}
                              style={{
                                fontFamily: "'Optima',sans-serif",
                                fontSize: 15,
                                fontWeight: 400,
                                fontStyle: "italic",
                                letterSpacing: "0.02em",
                                color: "#00416A",
                                lineHeight: 1.9,
                                wordBreak: "break-word",
                                margin: i === 0 ? 0 : "10px 0 0",
                              }}
                            >
                              {sub}
                            </p>
                          ))}
                      </div>
                      <div style={{ marginTop: 18 }}>
                        <FloralDots />
                      </div>
                    </div>
                  </div>
                </ScrollRevealSection>
              )}
              {wedding.photo5_url && (
                <ScrollRevealSection
                  direction="up"
                  delay={0}
                  style={{ marginTop: 40, overflow: "hidden" }}
                >
                  <GoldDivider className="mb-6 mx-8" />
                  <div
                    style={{
                      width: "100%",
                      overflow: "hidden",
                      borderTop: "0.5px solid rgba(0,65,106,0.25)",
                      borderBottom: "0.5px solid rgba(0,65,106,0.25)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
                    }}
                  >
                    <img
                      src={wedding.photo5_url}
                      alt={t.extraPhotoAlt}
                      style={{
                        display: "block",
                        width: "100%",
                        border: "none",
                        filter: "brightness(0.93) saturate(0.9)",
                      }}
                    />
                  </div>
                </ScrollRevealSection>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 4: ТІЛЕКТЕР — RSVP + Messages
            ═══════════════════════════════════════════════════ */}
            <section
              id="section-messages"
              style={{ marginTop: 48, padding: "0 20px" }}
            >
              <ScrollRevealSection direction="up" delay={0}>
                <GoldDivider className="mb-6" />
                <SectionHeader>{t.wishesTitle}</SectionHeader>
                <div
                  style={{
                    borderRadius: 20,
                    padding: "28px 22px 26px",
                    background: "#ffffff",
                    border: "0.5px solid rgba(0,65,106,0.16)",
                    boxShadow:
                      "0 2px 20px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <RSVPSection
                    weddingId={wedding.id}
                    accentColor="#00416A"
                    lightColor="#eef0f8"
                    lang={lang}
                  />
                  <div
                    style={{
                      marginTop: 28,
                      borderTop: "0.5px solid rgba(0,65,106,0.15)",
                      paddingTop: 26,
                    }}
                  >
                    <MessageSection
                      weddingId={wedding.id}
                      accentColor="#00416A"
                      lightColor="#eef0f8"
                      borderColor="border-amber-100"
                      lang={lang}
                    />
                  </div>
                </div>
              </ScrollRevealSection>
            </section>

            {/* ═══ FOOTER ═══ */}
            <div
              className="text-center py-12 mt-4"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <GoldDivider className="mb-5 mx-8" />
              {t.footerPoem.map((line, i) => (
                <p
                  key={i}
                  className={i === 0 ? "mt-4" : "mt-2"}
                  style={{
                    fontSize: 16,
                    fontFamily: "'Optima',sans-serif",
                    fontStyle: "italic",
                    color: "#00416A",
                  }}
                >
                  {line}
                </p>
              ))}
              <FloralDots />
              <p
                className="shimmer-gold uppercase mt-4"
                style={{
                  fontSize: 18,
                  fontFamily: "'Optima',sans-serif",
                  letterSpacing: "0.4em",
                }}
              >
                {wedding.male_name} &amp; {wedding.female_name}
              </p>
              {date && (
                <p
                  className="mt-2"
                  style={{
                    fontSize: 18,
                    fontFamily: "'Optima',sans-serif",
                    letterSpacing: "0.24em",
                    color: "rgba(0,65,106,0.75)",
                  }}
                >
                  {date}
                </p>
              )}
              <div style={{ marginTop: 20 }}>
                <FloralDots />
              </div>
              {[...Array(10)].map((_, i) => (
                <FaHeart
                  key={i}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: `${10 + i * 15}%`,
                    color: "rgba(0,65,106,0.25)",
                    fontSize: `${12 + ((i * 37) % 8)}px`,
                    animation: `floatHeart ${4 + i}s linear infinite`,
                    animationDelay: `${i * 0.8}s`,
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                height: 4,
                background:
                  "linear-gradient(to right,transparent,rgba(0,65,106,0.55),rgba(0,65,106,0.4),rgba(0,65,106,0.55),transparent)",
              }}
            />
            <Template6Music />

            {/* ═══ BOTTOM NAV ═══ */}
            <SectionNavBar />
          </div>
        </>
      )}
    </LangContext.Provider>
  );
}
