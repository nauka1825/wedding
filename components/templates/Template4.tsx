"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicPlayer from "../MusicPlayer";
import RSVPSection from "../RSVPSection";

// ─── DEFAULT WEDDING ───
const DEFAULT_WEDDING: Wedding = {
  id: "preview",
  created_at: "2026-01-01T00:00:00.000Z",
  male_name: "",
  female_name: "",
  wedding_date: "2026-09-14T17:00",
  venue_name: "",
  venue_address: "",
  organizer: "",
  phone: "",
  template: "azure",
  main_photo_url: null,
  gallery_urls: null,
  photo3_url: null,
  photo4_url: null,
  photo5_url: null,
  description1: "",
  description2: null,
  link1: null,
  link2: null,
  extra1: "",
  extra2: "",
  extra3: null,
  extra4: null,
  extra5: null,
  latitude: null,
  longitude: null,
  payment: null,
};

// ─── useInView ───
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted, threshold]);

  return { ref, inView: mounted ? inView : false };
}

// ─── FadeIn (scroll reveal) ───
function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  const translate =
    from === "bottom"
      ? "translateY(28px)"
      : from === "top"
        ? "translateY(-28px)"
        : from === "left"
          ? "translateX(-28px)"
          : "translateX(28px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : translate,
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
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
        <radialGradient id="t4-clock-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EAF6FF" />
          <stop offset="100%" stopColor="#C8E9FA" />
        </radialGradient>
        <filter id="t4-clock-shadow">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(91,168,213,0.18)"
          />
        </filter>
      </defs>
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="url(#t4-clock-bg)"
        filter="url(#t4-clock-shadow)"
        stroke="rgba(91,168,213,0.55)"
        strokeWidth="0.8"
      />
      <circle
        cx="40"
        cy="40"
        r="33"
        fill="none"
        stroke="rgba(91,168,213,0.18)"
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
            stroke={
              i % 3 === 0 ? "rgba(29,107,142,0.8)" : "rgba(91,168,213,0.4)"
            }
            strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
          />
        );
      })}
      <line
        x1="40"
        y1="40"
        x2={40 + 15 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
        y2={40 + 15 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
        stroke="#1D5F82"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 21 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={40 + 21 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke="#1D5F82"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 23 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={40 + 23 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke="rgba(91,168,213,0.9)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="2.5" fill="#1D5F82" />
      <circle cx="40" cy="40" r="1.2" fill="#fff" />
    </svg>
  );
}

// ─── AnimatedCalendar ───
const KAZ_MONTHS = [
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
];
const KAZ_DAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"];

function AnimatedCalendar({ dateStr }: { dateStr?: string | null }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear(),
    month = d.getMonth(),
    day = d.getDate();
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
        @keyframes t4-cal-drop { 0%{opacity:0;transform:translateY(-18px) scale(0.92)} 60%{transform:translateY(3px) scale(1.02)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes t4-day-pop  { 0%{opacity:0;transform:scale(0.5)} 65%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)} }
        @keyframes t4-hrt-beat { 0%,100%{transform:scale(1)} 30%{transform:scale(1.3)} 60%{transform:scale(0.88)} }
        @keyframes t4-ring-draw{ 0%{stroke-dashoffset:550;opacity:0.2} 100%{stroke-dashoffset:0;opacity:0.55} }
        @keyframes t4-dot-in   { 0%{opacity:0;transform:scale(0)} 100%{opacity:1;transform:scale(1)} }
        .t4-cal-ring { stroke-dasharray:550; animation:t4-ring-draw 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards; }
        .t4-cal-wrap { animation:t4-cal-drop 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .t4-day-pop  { animation:t4-day-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.55s both; }
        .t4-hrt-beat { animation:t4-hrt-beat 1.4s ease-in-out 1.2s infinite; transform-origin:center; display:inline-block; }
        .t4-dot-in   { animation:t4-dot-in 0.4s ease both; }
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
          className="t4-cal-ring"
          cx="84"
          cy="107"
          r="90"
          fill="none"
          stroke="rgba(91,168,213,0.5)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="84"
          cy="107"
          r="97"
          fill="none"
          stroke="rgba(168,216,240,0.18)"
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
            className="t4-dot-in"
            cx={cx}
            cy={cy}
            r="2"
            fill="#5BA8D5"
            opacity="0.6"
            style={{ animationDelay: `${0.9 + i * 0.07}s` }}
          />
        ))}
      </svg>

      <div
        className="t4-cal-wrap"
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(168,216,240,0.45)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 8px 32px rgba(91,168,213,0.12),0 2px 8px rgba(91,168,213,0.08)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#C8E9FA 0%,#A8D8F0 50%,#C8E9FA 100%)",
            padding: "14px 16px 12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 14,
              letterSpacing: "0.38em",
              color: "#1D5F82",
              textTransform: "uppercase",
              margin: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {KAZ_MONTHS[month]} · {year}
          </p>
        </div>
        <div
          style={{
            background: "rgba(91,168,213,0.08)",
            borderBottom: "0.5px solid rgba(91,168,213,0.2)",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}
          >
            {KAZ_DAYS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  padding: "5px 0",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 11.5,
                  letterSpacing: "0.04em",
                  color: "rgba(29,95,130,0.9)",
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: "6px 8px 10px",
            background: "rgba(255,255,255,0.85)",
          }}
        >
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
                          fill="rgba(91,168,213,0.22)"
                          stroke="rgba(29,107,142,0.7)"
                          strokeWidth="0.9"
                        />
                      </svg>
                      <span
                        className="t4-day-pop"
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#1D5F82",
                          position: "relative",
                          zIndex: 1,
                          lineHeight: 1,
                        }}
                      >
                        {cell}
                      </span>
                    </div>
                    <span
                      className="t4-hrt-beat"
                      style={{ lineHeight: 1, marginTop: 1 }}
                    >
                      <svg viewBox="0 0 12 11" width="10" height="10">
                        <path
                          d="M6,9.5 C6,9.5 0.5,6 0.5,3 C0.5,1.6 1.6,0.5 3,0.5 C4.2,0.5 5.2,1.3 6,2.2 C6.8,1.3 7.8,0.5 9,0.5 C10.4,0.5 11.5,1.6 11.5,3 C11.5,6 6,9.5 6,9.5Z"
                          fill="#5BA8D5"
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
                      fontFamily: "'Cinzel',serif",
                      fontSize: 14,
                      color: isWeekend
                        ? "rgba(91,168,213,0.65)"
                        : "rgba(29,95,130,0.45)",
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
      <style>{`@keyframes t4-progress{from{width:0%}to{width:100%}}`}</style>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 overflow-hidden"
            style={{
              width: "75vw",
              maxWidth: 380,
              height: 300,
              borderRadius: 12,
              border:
                active === i
                  ? "1.5px solid rgba(91,168,213,0.75)"
                  : "1px solid rgba(168,216,240,0.35)",
              transition:
                "transform 0.35s ease,box-shadow 0.35s ease,border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 10px 40px rgba(91,168,213,0.18),0 2px 8px rgba(91,168,213,0.12)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={url}
              alt={`зураг ${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center top",
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
              className="transition-all duration-300 rounded-full overflow-hidden relative"
              style={{
                width: active === i ? 22 : 7,
                height: 7,
                background: "rgba(168,216,240,0.55)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#5BA8D5",
                    animation: "t4-progress 5s linear forwards",
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

// ─── Divider ───
function AzureDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right,transparent,rgba(91,168,213,0.55))",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(91,168,213,0.5)",
            transform: "rotate(45deg)",
          }}
        />
        <IconDiamond size={8} color="rgba(91,168,213,0.75)" />
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(91,168,213,0.5)",
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left,transparent,rgba(91,168,213,0.55))",
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
            background: `rgba(91,168,213,${op})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── SectionHeader ───
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 px-5 mb-5"
      style={{ justifyContent: "center" }}
    >
      <div
        className="h-px"
        style={{
          width: 30,
          background:
            "linear-gradient(to right,transparent,rgba(91,168,213,0.45))",
        }}
      />
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.42em",
          fontFamily: "'Cinzel',serif",
          color: "rgba(29,107,142,0.9)",
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
            "linear-gradient(to left,transparent,rgba(91,168,213,0.45))",
        }}
      />
    </div>
  );
}

// ─── OrganizerBlock (from Template2, azure-themed) ───
function OrganizerParticle({
  delay,
  duration,
  x,
  size,
}: {
  delay: number;
  duration: number;
  x: number;
  size: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: -10,
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(91,168,213,0.6) 0%, rgba(91,168,213,0.0) 70%)",
        animation: `t4-org-float ${duration}s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

function OrganizerBlock({
  organizer,
  maleParents,
  femaleParents,
}: {
  organizer: string;
  maleParents?: string | null;
  femaleParents?: string | null;
}) {
  const { ref, inView } = useInView(0.2);
  const lines = organizer.split("\n").filter(Boolean);

  return (
    <div ref={ref} className="mx-5 mt-8 py-2">
      <style>{`
        @keyframes t4-org-reveal { 0%{opacity:0;transform:translateY(32px) scale(0.96);filter:blur(4px)} 60%{filter:blur(0)} 100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)} }
        @keyframes t4-org-line   { 0%{opacity:0;transform:translateX(-20px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes t4-org-float  { 0%,100%{transform:translateY(0) scale(1);opacity:0.5} 50%{transform:translateY(-60px) scale(0.6);opacity:0} }
        @keyframes t4-org-glow   { 0%,100%{box-shadow:0 0 0px rgba(91,168,213,0)} 50%{box-shadow:0 0 32px rgba(91,168,213,0.2),0 4px 24px rgba(91,168,213,0.12)} }
        .t4-org-card  { animation:t4-org-reveal 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .t4-org-line  { animation:t4-org-line   0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .t4-org-glow  { animation:t4-org-glow   3s ease-in-out 1s infinite; }
      `}</style>

      <AzureDivider className="mb-6" />

      <div
        className="t4-org-card t4-org-glow"
        style={{
          animationPlayState: inView ? "running" : "paused",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "28px 24px 24px",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(168,216,240,0.45)",
          textAlign: "center",
          boxShadow:
            "0 4px 32px rgba(91,168,213,0.1),0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        {inView &&
          [
            { delay: 0, duration: 4.5, x: 10, size: 40 },
            { delay: 1.2, duration: 5.5, x: 85, size: 28 },
            { delay: 0.6, duration: 6, x: 50, size: 20 },
            { delay: 2, duration: 4.8, x: 30, size: 16 },
            { delay: 1.8, duration: 5.2, x: 70, size: 24 },
          ].map((p, i) => <OrganizerParticle key={i} {...p} />)}

        {/* Corner ornaments */}
        {[
          ["top:10px", "left:12px", "M2,20 Q2,2 20,2", "2", "2"],
          ["top:10px", "right:12px", "M20,20 Q20,2 2,2", "20", "2"],
          ["bottom:10px", "left:12px", "M2,2 Q2,20 20,20", "2", "20"],
          ["bottom:10px", "right:12px", "M20,2 Q20,20 2,20", "20", "20"],
        ].map(([p1, p2, path, cx, cy], i) => (
          <svg
            key={i}
            style={{
              position: "absolute",
              [p1.split(":")[0]]: p1.split(":")[1],
              [p2.split(":")[0]]: p2.split(":")[1],
              opacity: 0.4,
            }}
            width="22"
            height="22"
            viewBox="0 0 22 22"
          >
            <path d={path} stroke="#5BA8D5" strokeWidth="0.8" fill="none" />
            <circle cx={cx} cy={cy} r="1.5" fill="#5BA8D5" />
          </svg>
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
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
                  "linear-gradient(to right,transparent,rgba(91,168,213,0.6))",
              }}
            />
            <IconDiamond size={14} color="rgba(91,168,213,0.7)" />
            <p
              style={{
                fontSize: 14,
                letterSpacing: "0.45em",
                fontFamily: "'Cinzel',serif",
                fontWeight: 500,
                color: "rgba(29,95,130,0.92)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Той иелері
            </p>
            <IconDiamond size={14} color="rgba(91,168,213,0.7)" />
            <div
              style={{
                height: 1,
                width: 28,
                background:
                  "linear-gradient(to left,transparent,rgba(91,168,213,0.6))",
              }}
            />
          </div>

          <p
            className="t4-org-line"
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1D5F82",
              lineHeight: 1.9,
              wordBreak: "break-word",
              margin: 0,
              animationDelay: inView ? "0.2s" : "0s",
              animationPlayState: inView ? "running" : "paused",
            }}
          >
            Ата анасы
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
                      className="t4-org-line"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#1D5F82",
                        lineHeight: 1.9,
                        wordBreak: "break-word",
                        margin: 0,
                        animationDelay: inView ? "0.22s" : "0s",
                        animationPlayState: inView ? "running" : "paused",
                      }}
                    >
                      {items[0]}
                    </p>
                    <div
                      className="t4-org-line"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        animationDelay: inView ? "0.32s" : "0s",
                        animationPlayState: inView ? "running" : "paused",
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          width: 24,
                          background:
                            "linear-gradient(to right,transparent,rgba(91,168,213,0.55))",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond',Georgia,serif",
                          fontSize: 30,
                          fontStyle: "italic",
                          color: "rgba(91,168,213,0.8)",
                          lineHeight: 1,
                          fontWeight: 500,
                        }}
                      >
                        &amp;
                      </span>
                      <div
                        style={{
                          height: 1,
                          width: 24,
                          background:
                            "linear-gradient(to left,transparent,rgba(91,168,213,0.55))",
                        }}
                      />
                    </div>
                    <p
                      className="t4-org-line"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#1D5F82",
                        lineHeight: 1.9,
                        wordBreak: "break-word",
                        margin: 0,
                        animationDelay: inView ? "0.44s" : "0s",
                        animationPlayState: inView ? "running" : "paused",
                      }}
                    >
                      {items[1]}
                    </p>
                  </>
                );
              return items.map((line, i) => (
                <p
                  key={i}
                  className="t4-org-line"
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#1D5F82",
                    lineHeight: 1.9,
                    wordBreak: "break-word",
                    margin: 0,
                    animationDelay: inView ? `${0.2 + i * 0.12}s` : "0s",
                    animationPlayState: inView ? "running" : "paused",
                  }}
                >
                  {line}
                </p>
              ));
            })()}
          </div>

          <FloralDots />

          {/* Ata-analary (parents) */}
          {(maleParents || femaleParents) && (
            <div
              style={{
                marginTop: 22,
                borderTop: "0.5px solid rgba(91,168,213,0.25)",
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
                      "linear-gradient(to right,transparent,rgba(91,168,213,0.5))",
                  }}
                />
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.38em",
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 500,
                    color: "rgba(29,95,130,0.85)",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Ата-аналары
                </p>
                <div
                  style={{
                    height: 1,
                    width: 22,
                    background:
                      "linear-gradient(to left,transparent,rgba(91,168,213,0.5))",
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
                  <div
                    className="t4-org-line"
                    style={{
                      textAlign: "center",
                      animationDelay: inView ? "0.55s" : "0s",
                      animationPlayState: inView ? "running" : "paused",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.32em",
                        fontFamily: "'Cinzel',serif",
                        color: "rgba(91,168,213,0.75)",
                        textTransform: "uppercase",
                        margin: "0 0 4px",
                        fontWeight: 500,
                      }}
                    >
                      Күйеу жақ
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#1D5F82",
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        height: 1,
                        width: 20,
                        background:
                          "linear-gradient(to right,transparent,rgba(91,168,213,0.5))",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 22,
                        fontStyle: "italic",
                        color: "rgba(91,168,213,0.75)",
                        lineHeight: 1,
                        fontWeight: 500,
                      }}
                    >
                      &amp;
                    </span>
                    <div
                      style={{
                        height: 1,
                        width: 20,
                        background:
                          "linear-gradient(to left,transparent,rgba(91,168,213,0.5))",
                      }}
                    />
                  </div>
                )}
                {femaleParents && (
                  <div
                    className="t4-org-line"
                    style={{
                      textAlign: "center",
                      animationDelay: inView ? "0.68s" : "0s",
                      animationPlayState: inView ? "running" : "paused",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.32em",
                        fontFamily: "'Cinzel',serif",
                        color: "rgba(91,168,213,0.75)",
                        textTransform: "uppercase",
                        margin: "0 0 4px",
                        fontWeight: 500,
                      }}
                    >
                      Келін жақ
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#1D5F82",
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
    </div>
  );
}

// ─── InvitationHero (Template2 style, azure-themed) ───
function InvitationHero({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className="text-center px-6 mt-4 mb-2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes t4-slide-left  { 0%{opacity:0;transform:translateX(-52px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes t4-slide-right { 0%{opacity:0;transform:translateX(52px)}  100%{opacity:1;transform:translateX(0)} }
        @keyframes t4-fade-up-h   { 0%{opacity:0;transform:translateY(28px)}  100%{opacity:1;transform:translateY(0)} }
        @keyframes t4-name-pop    { 0%{opacity:0;transform:scale(0.85) translateY(16px);filter:blur(6px)} 70%{filter:blur(0)} 100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)} }
        .t4-from-left  { animation:t4-slide-left  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .t4-from-right { animation:t4-slide-right 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .t4-fade-up-h  { animation:t4-fade-up-h  0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .t4-name-pop   { animation:t4-name-pop   0.9s cubic-bezier(0.34,1.4,0.64,1) both; }
        @keyframes t4-shimmer-azure {
          0%{background-position:-200% center} 100%{background-position:200% center}
        }
        .t4-shimmer-name {
          background:linear-gradient(90deg,#0d4a6e 15%,#5BA8D5 42%,#1D6B8E 58%,#0d4a6e 85%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:t4-shimmer-azure 5s linear infinite;
        }
      `}</style>

      <p
        className="t4-from-left"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 15,
          letterSpacing: "0.2em",
          color: "rgba(29,95,130,0.95)",
          lineHeight: 2,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
          animationPlayState: inView ? "running" : "paused",
        }}
      >
        Құрметті Сіз(дер)ді қызымыз
      </p>

      <p
        className="t4-shimmer-name t4-name-pop"
        style={{
          fontFamily: "'Great Vibes',cursive",
          fontSize: "clamp(2.8rem,11vw,4.2rem)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          margin: "8px 0 4px",
          animationDelay: inView ? "0.3s" : "0s",
          animationPlayState: inView ? "running" : "paused",
        }}
      >
        {femaleName} -ның
      </p>
      <p
        className="t4-from-right"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 15,
          letterSpacing: "0.13em",
          color: "rgba(29,95,130,0.88)",
          lineHeight: 1.95,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
          animationDelay: inView ? "0.66s" : "0s",
          animationPlayState: inView ? "running" : "paused",
        }}
      >
        ұзату тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы
        болуға шақырамыз!
      </p>

      <div
        className="t4-fade-up-h"
        style={{
          marginTop: 16,
          animationDelay: inView ? "0.8s" : "0s",
          animationPlayState: inView ? "running" : "paused",
        }}
      >
        <FloralDots />
      </div>
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
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref} className="text-center" style={{ padding: "4px 0" }}>
      <p
        style={{
          fontSize: 16,
          letterSpacing: "0.38em",
          fontFamily: "'Cinzel',serif",
          fontWeight: 600,
          color: "rgba(29,95,130,0.95)",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
        }}
      >
        Уақыты
      </p>
      <FloralDots />
      {time && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <AnimatedClock time={time} visible={inView} />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(200,233,250,0.45)",
              border: "1px solid rgba(91,168,213,0.35)",
              borderRadius: 10,
              padding: "7px 18px",
            }}
          >
            <IconClock size={11} color="#5BA8D5" />
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 22,
                letterSpacing: "0.32em",
                color: "#1D5F82",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {time}
            </p>
          </div>
        </div>
      )}
      {date && (
        <div style={{ marginTop: 14 }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 26,
              color: "#1D5F82",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
              margin: 0,
              fontWeight: 500,
              fontStyle: "italic",
            }}
          >
            {date}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Icon Components ───
const IconDiamond = ({
  size = 14,
  color = "#A8D8F0",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L22 12L12 22L2 12Z" fill={color} />
  </svg>
);
const IconClock = ({
  size = 13,
  color = "#5BA8D5",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconMapPin = ({
  size = 15,
  color = "#6BB8D8",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill={color} stroke="none" />
  </svg>
);

const IconCheck = ({
  size = 10,
  color = "#5BA8D5",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── MAIN ───
export default function Template4({ wedding: raw }: { wedding: Wedding }) {
  const wedding: Wedding = {
    ...DEFAULT_WEDDING,
    ...Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== null && v !== "" && v !== undefined,
      ),
    ),
  };

  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;
  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
    wedding.extra5,
  ].filter(Boolean);

  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg,#EAF6FF 0%,#F5FBFF 30%,#EDF4FB 60%,#DDEEFA 100%)",
        fontFamily: "'Playfair Display','Georgia',serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing:border-box; }
        img { border:none !important; outline:none !important; }

        @keyframes t4-float-slow { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.03)} }
        @keyframes t4-drift      { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
        @keyframes t4-shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes t4-pulse-ring { 0%{box-shadow:0 0 0 0 rgba(168,216,240,0.45)} 70%{box-shadow:0 0 0 10px rgba(168,216,240,0)} 100%{box-shadow:0 0 0 0 rgba(168,216,240,0)} }
        @keyframes t4-spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes t4-twinkle    { 0%,100%{opacity:0.12;transform:scale(0.8)} 50%{opacity:0.55;transform:scale(1.2)} }
        @keyframes t4-hero-reveal{ from{clip-path:inset(100% 0 0 0);opacity:0} to{clip-path:inset(0% 0 0 0);opacity:1} }
        @keyframes t4-floatHeart { 0%{transform:translateY(0) rotate(0deg);opacity:0} 50%{transform:translateY(-100px) translateX(20px) rotate(180deg);opacity:.8} 100%{transform:translateY(-220px) translateX(-20px) rotate(360deg);opacity:0} }

        .t4-hero-img  { animation:t4-hero-reveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .t4-float-orb { animation:t4-float-slow 7s ease-in-out infinite; }
        .t4-drift-orb { animation:t4-drift 9s ease-in-out infinite; }
        .t4-shimmer-text {
          background:linear-gradient(90deg,#0d4a6e 30%,#7EC8F0 50%,#0d4a6e 70%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:t4-shimmer 4s linear infinite;
        }
        .t4-twinkle { animation:t4-twinkle 2.5s ease-in-out infinite; }
        .t4-twinkle:nth-child(2) { animation-delay:0.8s; }
        .t4-twinkle:nth-child(3) { animation-delay:1.6s; }

        .t4-label  { font-family:'Jost',sans-serif;font-weight:400;letter-spacing:0.38em;text-transform:uppercase;font-size:10px;color:rgba(91,168,213,0.65); }
        .t4-body   { font-family:'Jost',sans-serif;font-weight:300; }
        .t4-display{ font-family:'Cormorant Garamond',serif;font-weight:300; }
        .t4-heading{ font-family:'Playfair Display',serif; }

        .t4-glass {
          background:rgba(255,255,255,0.62);
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          border:1px solid rgba(168,216,240,0.35);border-radius:20px;
          box-shadow:0 8px 32px rgba(91,168,213,0.08),0 1px 0 rgba(255,255,255,0.9) inset;
        }
      `}</style>

      {/* Top bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right,#C8E9FA,#5BA8D5,#A8D8F0,#5BA8D5,#C8E9FA)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="t4-float-orb absolute top-24 right-4 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(168,216,240,0.18) 0%,transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="t4-drift-orb absolute top-60 left-2 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(100,180,230,0.12) 0%,transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Twinkle stars */}
      <div
        className="absolute top-16 left-8 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="t4-twinkle absolute"
            style={{ top: `${i * 22}px`, left: `${i * 18}px` }}
            width="7"
            height="7"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
              fill="#A8D8F0"
            />
          </svg>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className={`t4-hero-img w-full h-full object-cover transition-all duration-1000 ${heroLoaded ? "scale-100" : "scale-110"}`}
            style={{ filter: "brightness(0.88) saturate(1.08)" }}
            onLoad={() => setHeroLoaded(true)}
          />
        ) : (
          <img
            src={"/images/duzka1.jpg"}
            alt="Гол зураг"
            className={`t4-hero-img w-full h-full object-cover transition-all duration-1000 ${heroLoaded ? "scale-100" : "scale-110"}`}
            style={{ filter: "brightness(0.88) saturate(1.08)" }}
            onLoad={() => setHeroLoaded(true)}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top,#EAF6FF 0%,transparent 55%)",
          }}
        />
      </div>

      {/* Event badge */}
      <FadeIn delay={100} className="flex justify-center -mt-5 relative z-10">
        <div
          className="relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(168,216,240,0.45)",
            boxShadow:
              "0 4px 20px rgba(91,168,213,0.12),inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg,transparent 30%,rgba(168,216,240,0.2) 50%,transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "t4-shimmer 3s linear infinite",
            }}
          />
          <IconDiamond size={11} color="#6BB8D8" />
          <span
            className="t4-label relative"
            style={{
              color: "#1D6B8E",
              letterSpacing: "0.42em",
              fontSize: "10px",
            }}
          >
            Қыз ұзату
          </span>
          <IconDiamond size={11} color="#6BB8D8" />
        </div>
      </FadeIn>

      {/* ─── INVITATION HERO (Kazakh text + script names) ─── */}
      <div className="relative z-10 mt-6">
        <InvitationHero
          maleName={wedding.male_name}
          femaleName={wedding.female_name}
        />
      </div>

      {/* ─── photo3 ─── */}
      {wedding.photo3_url && (
        <FadeIn
          delay={0}
          className="relative z-10"
          style={{ overflow: "hidden", padding: "0 20px", marginTop: 8 }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "0.5px solid rgba(91,168,213,0.3)",
              boxShadow: "0 4px 24px rgba(91,168,213,0.1)",
            }}
          >
            <img
              src={wedding.photo3_url}
              alt="Ер"
              className="w-full object-cover"
              style={{
                display: "block",
                border: "none",
                maxHeight: 480,
                objectPosition: "center top",
              }}
            />
          </div>
        </FadeIn>
      )}

      {/* ─── ORGANIZER ─── */}
      {wedding.organizer && (
        <FadeIn delay={0} className="relative z-10" from="left">
          <OrganizerBlock
            organizer={wedding.organizer}
            maleParents={(wedding as any).male_parents ?? null}
            femaleParents={(wedding as any).female_parents ?? null}
          />
        </FadeIn>
      )}

      {/* ─── Description 1 ─── */}
      {wedding.description1 && (
        <FadeIn delay={100} className="mx-5 mt-8 relative z-10">
          <div
            className="t4-glass relative px-7 py-7"
            style={{ borderRadius: "20px" }}
          >
            <span
              className="absolute -top-4 left-5 text-5xl leading-none"
              style={{
                color: "#A8D8F0",
                fontFamily: "'Playfair Display',serif",
                fontWeight: 400,
              }}
            >
              "
            </span>
            <p
              className="t4-display italic leading-relaxed text-center mt-1"
              style={{ color: "#2F6E91", fontSize: "17px" }}
            >
              {wedding.description1}
            </p>
            <span
              className="absolute -bottom-5 right-5 text-5xl leading-none rotate-180 block"
              style={{
                color: "#A8D8F0",
                fontFamily: "'Playfair Display',serif",
                fontWeight: 400,
              }}
            >
              "
            </span>
          </div>
        </FadeIn>
      )}

      {/* ─── GALLERY ─── */}
      {!!wedding.gallery_urls?.length && (
        <FadeIn delay={0} className="mt-10 relative z-10">
          <SectionHeader>Суреттер жиынтығы</SectionHeader>
          <GallerySwiper urls={wedding.gallery_urls} />
        </FadeIn>
      )}

      {/* ─── INFO CARD ─── */}
      <div className="mx-5 mt-10 mb-2 relative z-10">
        <FadeIn>
          <AzureDivider className="mb-6" />
        </FadeIn>

        <FadeIn>
          <div className="t4-glass p-6 space-y-5">
            {/* Date + Clock + Calendar */}
            {(date || time) && (
              <FadeIn delay={0} from="bottom">
                <DateTimeBlock date={date} time={time} />
              </FadeIn>
            )}

            {wedding.wedding_date && (
              <FadeIn delay={80} from="right">
                <div style={{ padding: "0 0 4px" }}>
                  <AnimatedCalendar dateStr={wedding.wedding_date} />
                </div>
              </FadeIn>
            )}

            {/* Venue */}
            {(wedding.venue_name || wedding.venue_address) && (
              <FadeIn
                delay={100}
                from="left"
                style={{
                  borderTop: "0.5px solid rgba(168,216,240,0.3)",
                  paddingTop: 20,
                }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2.5">
                    <IconMapPin size={14} color="#6BB8D8" />
                    <p className="t4-label">Той орны мекенжайы</p>
                  </div>
                  {wedding.venue_name && (
                    <p
                      className="t4-heading italic font-normal text-center"
                      style={{ color: "#1D5F82", fontSize: "20px" }}
                    >
                      {wedding.venue_name}
                    </p>
                  )}
                  {wedding.venue_address && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <IconMapPin size={12} color="#8BBDD4" />
                      <p
                        className="t4-body text-center"
                        style={{
                          color: "#6AA8C4",
                          fontSize: "12px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {wedding.venue_address}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Messages */}
      <FadeIn delay={0} className="relative z-10">
        <RSVPSection
          weddingId={wedding.id}
          accentColor="#2C5F7A"
          lightColor="#EAF6FF"
        />
        <MessageSection
          weddingId={wedding.id}
          accentColor="#2C5F7A"
          lightColor="#EAF6FF"
          borderColor="border-sky-100"
        />
      </FadeIn>

      {/* ─── FOOTER ─── */}
      <div className="text-center py-12 mt-4 relative z-10 overflow-hidden">
        <p
          className="t4-shimmer-text uppercase mt-4"
          style={{
            fontSize: 18,
            fontFamily: "'Cinzel',serif",
            letterSpacing: "0.4em",
          }}
        >
          {wedding.male_name} {wedding.female_name}
        </p>
        {date && (
          <p
            className="mt-2"
            style={{
              fontSize: 18,
              fontFamily: "'Cinzel',serif",
              letterSpacing: "0.24em",
              color: "rgba(91,168,213,0.75)",
            }}
          >
            {date}
          </p>
        )}
        <div style={{ marginTop: 20 }}>
          <FloralDots />
        </div>

        {/* Floating hearts */}
        {[...Array(10)].map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            width={14 + Math.random() * 10}
            height={14 + Math.random() * 10}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${10 + i * 15}%`,
              animation: `t4-floatHeart ${4 + i}s linear infinite`,
              animationDelay: `${i * 0.8}s`,
              pointerEvents: "none",
            }}
          >
            <g fill="rgba(255,192,203,0.35)">
              <circle cx="20" cy="9" r="7" />
              <circle cx="31" cy="17" r="7" />
              <circle cx="27" cy="30" r="7" />
              <circle cx="13" cy="30" r="7" />
              <circle cx="9" cy="17" r="7" />
            </g>

            <circle cx="20" cy="20" r="4" fill="rgba(255,240,180,0.6)" />
          </svg>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right,#C8E9FA,#5BA8D5,#A8D8F0,#5BA8D5,#C8E9FA)",
        }}
      />
      <MusicPlayer />
    </div>
  );
}
