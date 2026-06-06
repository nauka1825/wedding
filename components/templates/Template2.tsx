"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import {
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaLeaf,
} from "react-icons/fa";
import Template2Music from "../template2Music";

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
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="100%" stopColor="#FAF3DC" />
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
        stroke="rgba(201,168,76,0.4)"
        strokeWidth="0.8"
      />
      <circle
        cx="40"
        cy="40"
        r="33"
        fill="none"
        stroke="rgba(201,168,76,0.15)"
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
              i % 3 === 0 ? "rgba(160,118,40,0.7)" : "rgba(160,118,40,0.3)"
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
        stroke="#7a5820"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 21 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={40 + 21 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke="#A07028"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 23 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={40 + 23 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke="rgba(201,168,76,0.8)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="2.5" fill="#C9A84C" />
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
          stroke="rgba(201,168,76,0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="84"
          cy="107"
          r="97"
          fill="none"
          stroke="rgba(201,168,76,0.1)"
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
            fill="#C9A84C"
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
          border: "0.5px solid rgba(201,168,76,0.28)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.07),0 2px 8px rgba(201,168,76,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#FAF3DC 0%,#F5E9C0 50%,#FAF3DC 100%)",
            padding: "14px 16px 12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 10,
              letterSpacing: "0.38em",
              color: "rgba(122,88,32,0.9)",
              textTransform: "uppercase",
              margin: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {KAZ_MONTHS[month]} · {year}
          </p>
        </div>
        {/* Day headers */}
        <div
          style={{
            background: "rgba(201,168,76,0.05)",
            borderBottom: "0.5px solid rgba(201,168,76,0.12)",
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
                  fontSize: 7.5,
                  letterSpacing: "0.04em",
                  color: "rgba(160,118,40,0.65)",
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        {/* Days grid */}
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
                          fill="rgba(201,168,76,0.15)"
                          stroke="rgba(201,168,76,0.65)"
                          strokeWidth="0.9"
                        />
                      </svg>
                      <span
                        className="day-pop"
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#A07028",
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
                          fill="#C9A84C"
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
                      fontSize: 10,
                      color: isWeekend
                        ? "rgba(201,168,76,0.55)"
                        : "rgba(70,55,40,0.5)",
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
              height: 300,
              borderRadius: 12,
              border:
                active === i
                  ? "1.5px solid rgba(201,168,76,0.7)"
                  : "1px solid rgba(201,168,76,0.2)",
              transition:
                "transform 0.35s ease,box-shadow 0.35s ease,border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 10px 40px rgba(0,0,0,0.12),0 2px 8px rgba(201,168,76,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 1}`}
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
              className="transition-all duration-300 rounded-none overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                background: "rgba(201,168,76,0.3)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#C9A84C",
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
            "linear-gradient(to right,transparent,rgba(201,168,76,0.45))",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(201,168,76,0.4)",
            transform: "rotate(45deg)",
          }}
        />
        <FaStar
          size={8}
          style={{ color: "rgba(201,168,76,0.65)", flexShrink: 0 }}
        />
        <div
          style={{
            width: 4,
            height: 4,
            background: "rgba(201,168,76,0.4)",
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left,transparent,rgba(201,168,76,0.45))",
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
            background: `rgba(201,168,76,${op})`,
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
        fontSize: 12,
        letterSpacing: "0.38em",
        fontFamily: "'Cinzel',serif",
        fontWeight: 600,
        color: "rgba(160,118,40,0.75)",
        margin: "0 0 10px 0",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

// ─── Card ───
function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: "#ffffff",
        border: "0.5px solid rgba(201,168,76,0.18)",
        borderRadius: 16,
        boxShadow:
          "0 2px 20px rgba(0,0,0,0.05),0 1px 4px rgba(0,0,0,0.03),inset 0 0 0 1px rgba(255,255,255,0.8)",
        ...style,
      }}
    >
      {children}
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
      <FaLeaf
        size={9}
        style={{ color: "rgba(201,168,76,0.45)", transform: "scaleX(-1)" }}
      />
      <div
        className="h-px"
        style={{
          width: 30,
          background:
            "linear-gradient(to right,transparent,rgba(201,168,76,0.35))",
        }}
      />
      <p
        style={{
          fontSize: 9,
          letterSpacing: "0.42em",
          fontFamily: "'Cinzel',serif",
          color: "rgba(160,118,40,0.65)",
          textTransform: "uppercase",
          fontWeight: 500,
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
            "linear-gradient(to left,transparent,rgba(201,168,76,0.35))",
        }}
      />
      <FaLeaf size={8} style={{ color: "rgba(201,168,76,0.45)" }} />
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
  const { ref, visible } = useInView(0.2);
  return (
    <div ref={ref} className="text-center" style={{ padding: "4px 0" }}>
      <Label>Уақыты</Label>
      <FloralDots />
      {time && (
        <div
          className="tick-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            animationPlayState: visible ? "running" : "paused",
          }}
        >
          <AnimatedClock time={time} visible={visible} />
          <div
            className="reveal-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,#FFFBF0,#FAF3DC)",
              border: "0.5px solid rgba(201,168,76,0.35)",
              borderRadius: 10,
              padding: "7px 18px",
              animationDelay: "0.2s",
              animationPlayState: visible ? "running" : "paused",
            }}
          >
            <FaClock size={10} style={{ color: "#C9A84C" }} />
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 18,
                letterSpacing: "0.32em",
                color: "#7a5820",
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
        <div
          className="reveal-up"
          style={{
            marginTop: 14,
            animationDelay: "0.35s",
            animationPlayState: visible ? "running" : "paused",
          }}
        >
          <p
            className="font-light italic"
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 22,
              color: "#111009",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
              margin: 0,
              fontWeight: 500,
            }}
          >
            {date}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── ScrollRevealSection — баруун/зүүн талаас гарч ирэх ───
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

// ─── InvitationHero — scroll-triggered invitation text section ───
function InvitationHero({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
  const { ref, visible } = useInView(0.1);

  return (
    <div
      ref={ref}
      className="text-center px-6 mt-4 mb-2"
      style={{ background: "#ffffff" }}
    >
      <style>{`
        @keyframes inv-slide-left {
          0%   { opacity:0; transform:translateX(-52px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes inv-slide-right {
          0%   { opacity:0; transform:translateX(52px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes inv-fade-up {
          0%   { opacity:0; transform:translateY(28px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes inv-name-pop {
          0%   { opacity:0; transform:scale(0.85) translateY(16px); filter:blur(6px); }
          70%  { filter:blur(0); }
          100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        .inv-from-left  { animation: inv-slide-left  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-from-right { animation: inv-slide-right 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-fade-up    { animation: inv-fade-up     0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .inv-name-pop   { animation: inv-name-pop    0.9s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>

      {/* Жоғарғы мәтін — зүүн талаас */}
      <p
        className="inv-from-left"
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(100,78,45,0.7)",
          lineHeight: 2,
          textTransform: "uppercase",
          fontWeight: 600,
          margin: 0,
          animationDelay: visible ? "0s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        Құрметті ағайын-туыс, құда-жекжат,
      </p>

      <p
        className="inv-from-right"
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(100,78,45,0.7)",
          lineHeight: 2,
          textTransform: "uppercase",
          fontWeight: 600,
          margin: 0,
          animationDelay: visible ? "0.08s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        дос-жаран, әріптестер мен көршілер!
      </p>

      <p
        className="inv-from-left"
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(100,78,45,0.7)",
          lineHeight: 2.2,
          textTransform: "uppercase",
          fontWeight: 600,
          margin: "4px 0 0",
          animationDelay: visible ? "0.18s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        Сіздерді ұлымыз
      </p>

      {/* Ер есімі — pop */}
      <p
        className="shimmer-gold inv-name-pop"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: "clamp(2rem,9vw,3rem)",
          fontWeight: 500,
          fontStyle: "italic",
          lineHeight: 1.1,
          letterSpacing: "0.04em",
          margin: "4px 0 6px",
          animationDelay: visible ? "0.3s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {maleName}
      </p>

      {/* Connector line */}
      <div
        className="inv-fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          margin: "2px 0",
          animationDelay: visible ? "0.42s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        <div
          style={{
            height: 1,
            width: 32,
            background:
              "linear-gradient(to right,transparent,rgba(201,168,76,0.5))",
          }}
        />
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "rgba(100,78,45,0.6)",
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          пен келініміз
        </p>
        <div
          style={{
            height: 1,
            width: 32,
            background:
              "linear-gradient(to left,transparent,rgba(201,168,76,0.5))",
          }}
        />
      </div>

      {/* Әйел есімі — pop */}
      <p
        className="shimmer-gold inv-name-pop"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: "clamp(2rem,9vw,3rem)",
          fontWeight: 500,
          fontStyle: "italic",
          lineHeight: 1.1,
          letterSpacing: "0.04em",
          margin: "6px 0 10px",
          animationDelay: visible ? "0.52s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {femaleName}
      </p>

      {/* Соңғы мәтін — оң талаас */}
      <p
        className="inv-from-right"
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          letterSpacing: "0.13em",
          color: "rgba(100,78,45,0.6)",
          lineHeight: 1.95,
          textTransform: "uppercase",
          fontWeight: 600,
          margin: 0,
          animationDelay: visible ? "0.66s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        дің үйлену тойына арналған салтанатты ақ
        <br />
        дастарханымыздың қадірлі қонағы
        <br />
        болуға шақырамыз!
      </p>

      {/* Доод чимэглэл */}
      <div
        className="inv-fade-up"
        style={{
          marginTop: 16,
          animationDelay: visible ? "0.8s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        <FloralDots />
      </div>
    </div>
  );
}

// ─── OrganizerBlock ───
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
          "radial-gradient(circle, rgba(240,216,120,0.7) 0%, rgba(201,168,76,0.0) 70%)",
        animation: `organizer-float ${duration}s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

function OrganizerBlock({ organizer }: { organizer: string }) {
  const { ref, visible } = useInView(0.2);
  const lines = organizer.split("\n").filter(Boolean);

  return (
    <div ref={ref} className="mx-5 mt-8 py-2">
      <style>{`
        @keyframes organizer-reveal { 0%{opacity:0;transform:translateY(32px) scale(0.96);filter:blur(4px)} 60%{filter:blur(0)} 100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)} }
        @keyframes organizer-line   { 0%{opacity:0;transform:translateX(-20px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes organizer-float  { 0%,100%{transform:translateY(0) scale(1);opacity:0.5} 50%{transform:translateY(-60px) scale(0.6);opacity:0} }
        @keyframes organizer-glow   { 0%,100%{box-shadow:0 0 0px rgba(201,168,76,0)} 50%{box-shadow:0 0 32px rgba(201,168,76,0.18),0 4px 24px rgba(201,168,76,0.10)} }
        .org-card-enter { animation: organizer-reveal 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .org-line-enter { animation: organizer-line 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .org-glow       { animation: organizer-glow 3s ease-in-out 1s infinite; }
      `}</style>

      <GoldDivider className="mb-6" />

      <div
        className="org-card-enter org-glow"
        style={{
          animationPlayState: visible ? "running" : "paused",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "28px 24px 24px",
          background: "#ffffff",
          border: "1px solid rgba(201,168,76,0.22)",
          boxShadow:
            "0 4px 32px rgba(201,168,76,0.08), 0 1px 6px rgba(0,0,0,0.04)",
          textAlign: "center",
        }}
      >
        {visible &&
          [
            { delay: 0, duration: 4.5, x: 10, size: 40 },
            { delay: 1.2, duration: 5.5, x: 85, size: 28 },
            { delay: 0.6, duration: 6, x: 50, size: 20 },
            { delay: 2, duration: 4.8, x: 30, size: 16 },
            { delay: 1.8, duration: 5.2, x: 70, size: 24 },
          ].map((p, i) => <OrganizerParticle key={i} {...p} />)}

        {/* Corner SVGs */}
        {[
          ["top:10px", "left:12px", "M2,20 Q2,2 20,2", "2", "2"],
          ["top:10px", "right:12px", "M20,20 Q20,2 2,2", "20", "2"],
          ["bottom:10px", "left:12px", "M2,2 Q2,20 20,20", "2", "20"],
          ["bottom:10px", "right:12px", "M20,2 Q20,20 2,20", "20", "20"],
        ].map(([pos1, pos2, path, cx, cy], i) => (
          <svg
            key={i}
            style={{
              position: "absolute",
              [pos1.split(":")[0]]: pos1.split(":")[1],
              [pos2.split(":")[0]]: pos2.split(":")[1],
              opacity: 0.3,
            }}
            width="22"
            height="22"
            viewBox="0 0 22 22"
          >
            <path d={path} stroke="#C9A84C" strokeWidth="0.8" fill="none" />
            <circle cx={cx} cy={cy} r="1.5" fill="#C9A84C" />
          </svg>
        ))}

        {/* Watermark rings */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
          >
            <ellipse
              cx="50%"
              cy="50%"
              rx="45%"
              ry="42%"
              fill="none"
              stroke="rgba(201,168,76,0.08)"
              strokeWidth="0.6"
            />
            <ellipse
              cx="50%"
              cy="50%"
              rx="38%"
              ry="35%"
              fill="none"
              stroke="rgba(201,168,76,0.05)"
              strokeWidth="0.4"
            />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title row */}
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
                  "linear-gradient(to right,transparent,rgba(201,168,76,0.5))",
              }}
            />
            <svg viewBox="0 0 20 18" width="16" height="14">
              <path
                d="M10,16 C10,16 1,10 1,5 C1,2.8 2.8,1 5,1 C7,1 8.8,2.2 10,3.8 C11.2,2.2 13,1 15,1 C17.2,1 19,2.8 19,5 C19,10 10,16 10,16Z"
                fill="rgba(201,168,76,0.25)"
                stroke="rgba(201,168,76,0.6)"
                strokeWidth="0.7"
              />
            </svg>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.45em",
                fontFamily: "'Cinzel',serif",
                fontWeight: 500,
                color: "rgba(160,118,40,0.7)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Той иелері
            </p>
            <svg viewBox="0 0 20 18" width="16" height="14">
              <path
                d="M10,16 C10,16 1,10 1,5 C1,2.8 2.8,1 5,1 C7,1 8.8,2.2 10,3.8 C11.2,2.2 13,1 15,1 C17.2,1 19,2.8 19,5 C19,10 10,16 10,16Z"
                fill="rgba(201,168,76,0.25)"
                stroke="rgba(201,168,76,0.6)"
                strokeWidth="0.7"
              />
            </svg>
            <div
              style={{
                height: 1,
                width: 28,
                background:
                  "linear-gradient(to left,transparent,rgba(201,168,76,0.5))",
              }}
            />
          </div>

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
              // 2 мөр байвал хооронд нь & сепаратор оруулна
              if (items.length === 2) {
                return (
                  <>
                    <p
                      className="org-line-enter"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7a5820",
                        lineHeight: 1.9,
                        wordBreak: "break-word",
                        margin: 0,
                        animationDelay: visible ? "0.2s" : "0s",
                        animationPlayState: visible ? "running" : "paused",
                      }}
                    >
                      {items[0]}
                    </p>
                    {/* & separator */}
                    <div
                      className="org-line-enter"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        animationDelay: visible ? "0.3s" : "0s",
                        animationPlayState: visible ? "running" : "paused",
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          width: 24,
                          background:
                            "linear-gradient(to right,transparent,rgba(201,168,76,0.5))",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond',Georgia,serif",
                          fontSize: 26,
                          fontStyle: "italic",
                          color: "rgba(201,168,76,0.75)",
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
                            "linear-gradient(to left,transparent,rgba(201,168,76,0.5))",
                        }}
                      />
                    </div>
                    <p
                      className="org-line-enter"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7a5820",
                        lineHeight: 1.9,
                        wordBreak: "break-word",
                        margin: 0,
                        animationDelay: visible ? "0.42s" : "0s",
                        animationPlayState: visible ? "running" : "paused",
                      }}
                    >
                      {items[1]}
                    </p>
                  </>
                );
              }
              // 2-оос өөр тооны үед жагсаалтаар харуулна
              return items.map((line, i) => (
                <p
                  key={i}
                  className="org-line-enter"
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#7a5820",
                    lineHeight: 1.9,
                    wordBreak: "break-word",
                    margin: 0,
                    animationDelay: visible ? `${0.2 + i * 0.12}s` : "0s",
                    animationPlayState: visible ? "running" : "paused",
                  }}
                >
                  {line}
                </p>
              ));
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
                  background: `rgba(201,168,76,${op})`,
                }}
              />
            ))}
          </div>
        </div>
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

// ─── MAIN ───
export default function Template2({ wedding }: { wedding: Wedding }) {
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        * { box-sizing:border-box; }
        img { border:none !important; outline:none !important; }
        body,#__next { background:#ffffff !important; }
        @keyframes shimmer-gold { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float-gentle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes petal-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .shimmer-gold {
          background:linear-gradient(90deg,#B8832A 15%,#F0D878 42%,#D4A940 58%,#B8832A 85%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer-gold 6s linear infinite;
        }
        .fade-up { animation:fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1  { animation-delay:0.1s; }
        .fade-2  { animation-delay:0.25s; }
        .fade-3  { animation-delay:0.4s; }
        @keyframes tick-in { 0%{opacity:0;transform:scale(0.6) rotate(-15deg)} 70%{transform:scale(1.08) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
        @keyframes reveal-up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .reveal-up { animation:reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .tick-in   { animation:tick-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="fixed inset-0 z-0" style={{ background: "#ffffff" }} />

      <div
        className="relative z-10 min-h-screen overflow-y-auto"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          background: "#ffffff",
        }}
      >
        <RotatingOrnament position="top-right" size={220} opacity={0.07} />
        <RotatingOrnament position="bottom-left" size={220} opacity={0.07} />

        {/* ═══ HERO ═══ */}
        <div className="relative w-full h-[62vh] overflow-hidden">
          {wedding.main_photo_url ? (
            <img
              src={wedding.main_photo_url}
              alt="Негізгі сурет"
              className="w-full h-full object-cover"
              style={{ display: "block", border: "none" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#FDF8EE 0%,#FAF3D8 50%,#F5EDD0 100%)",
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
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                    (deg, i) => {
                      const r = (deg * Math.PI) / 180;
                      return (
                        <ellipse
                          key={i}
                          cx={60 + Math.cos(r) * 28}
                          cy={60 + Math.sin(r) * 28}
                          rx="9"
                          ry="14"
                          transform={`rotate(${deg + 90},${60 + Math.cos(r) * 28},${60 + Math.sin(r) * 28})`}
                          fill="#EAC84A"
                          opacity="0.25"
                        />
                      );
                    },
                  )}
                </svg>
                <div className="absolute">
                  <FaHeart
                    size={36}
                    style={{ color: "rgba(201,168,76,0.35)" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top,#ffffff 0%,transparent 55%)",
            }}
          />
        </div>

        {/* ═══ INVITATION HERO — scroll animation ═══ */}
        <div className="mt-10 relative z-10" style={{ background: "#ffffff" }}>
          <InvitationHero
            maleName={wedding.male_name}
            femaleName={wedding.female_name}
          />
        </div>

        {/* ═══ PHOTO 3 ═══ */}
        {wedding.photo3_url && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ overflow: "hidden", padding: "0 20px", marginTop: 8 }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "0.5px solid rgba(201,168,76,0.2)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
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
          </ScrollRevealSection>
        )}

        {/* ═══ ТОЙ ИЕЛЕРІ ═══ */}
        {wedding.organizer && (
          <ScrollRevealSection direction="left" delay={0.05}>
            <OrganizerBlock organizer={wedding.organizer} />
          </ScrollRevealSection>
        )}

        {/* ═══ DATE LABEL ═══ */}
        {date && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ textAlign: "center", marginTop: 20 }}
          >
            <FloralDots />
            <p
              className="fade-up fade-3 mt-3 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.44em",
                fontFamily: "'Cinzel',serif",
                color: "rgba(160,118,40,0.65)",
                fontWeight: 700,
              }}
            >
              {date}
            </p>
          </ScrollRevealSection>
        )}

        {/* ═══ CALENDAR ═══ */}
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

        {/* ═══ GALLERY ═══ */}
        {!!wedding.gallery_urls?.length && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ marginTop: 32 }}
          >
            <p
              className="shimmer-gold my-2 flex justify-center w-full"
              style={{ fontSize: 11, fontFamily: "'Cinzel',serif" }}
            >
              ❤️ Біздің махаббатымыздың естеліктері ❤️
            </p>
            <SectionHeader>Суреттер жиынтығы</SectionHeader>
            <GallerySwiper urls={wedding.gallery_urls} />
          </ScrollRevealSection>
        )}

        {/* ═══ INFO CARD ═══ */}
        <div className="mx-5 mt-10 mb-2">
          <GoldDivider className="mb-6" />
          <Card className="p-6 space-y-5">
            {(date || time) && (
              <ScrollRevealSection direction="up" delay={0}>
                <DateTimeBlock date={date} time={time} />
              </ScrollRevealSection>
            )}

            {(wedding.venue_name || wedding.venue_address) && (
              <ScrollRevealSection
                direction="left"
                delay={0.1}
                style={{
                  borderTop: "0.5px solid rgba(201,168,76,0.1)",
                  paddingTop: 20,
                }}
              >
                <div className="text-center">
                  <Label>Мекен жайымыз</Label>
                  <FloralDots />
                  {wedding.venue_name && (
                    <p
                      className="font-light italic mt-3"
                      style={{
                        fontSize: 24,
                        wordBreak: "break-word",
                        color: "#111009",
                        lineHeight: 1.35,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {wedding.venue_name}
                    </p>
                  )}
                  {wedding.venue_address && (
                    <div className="flex items-start justify-center gap-1.5 mt-2">
                      <FaMapMarkerAlt
                        size={11}
                        style={{
                          color: "rgba(201,168,76,0.75)",
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          fontFamily: "'Cinzel',serif",
                          wordBreak: "break-word",
                          letterSpacing: "0.04em",
                          color: "#5c4e3d",
                          lineHeight: 1.6,
                        }}
                      >
                        {wedding.venue_address}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollRevealSection>
            )}

            {extras.length > 0 && (
              <div
                className="border-t pt-5 space-y-4"
                style={{ borderColor: "rgba(201,168,76,0.1)" }}
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
                          color: "rgba(201,168,76,0.6)",
                          flexShrink: 0,
                          marginTop: 5,
                        }}
                      />
                      <p
                        className="leading-relaxed"
                        style={{
                          fontSize: 16,
                          fontFamily: "'Cinzel',serif",
                          wordBreak: "break-word",
                          color: "#2e2720",
                          letterSpacing: "0.02em",
                          lineHeight: 1.65,
                          fontWeight: 500,
                        }}
                      >
                        {e}
                      </p>
                    </div>
                  </ScrollRevealSection>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ═══ MESSAGES ═══ */}
        <ScrollRevealSection direction="up" delay={0}>
          <MessageSection
            weddingId={wedding.id}
            accentColor="#A07028"
            lightColor="#FDFAF0"
            borderColor="border-amber-100"
          />
        </ScrollRevealSection>

        {/* ═══ PHOTO 5 ═══ */}
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
                borderTop: "0.5px solid rgba(201,168,76,0.25)",
                borderBottom: "0.5px solid rgba(201,168,76,0.25)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
              }}
            >
              <img
                src={wedding.photo5_url}
                alt="Қосымша сурет"
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

        {/* ═══ FOOTER ═══ */}
        <div className="text-center py-12 mt-4">
          <GoldDivider className="mb-5 mx-8" />
          {[
            "Біз екеуміз тек екеуміз",
            "Жүректермен бір екенбіз",
            "Мен сен үшін сен мен үшін",
            "Жаралған екенбіз",
          ].map((line, i) => (
            <p
              key={i}
              className={i === 0 ? "mt-4" : "mt-2"}
              style={{
                fontSize: 12,
                fontFamily: "'Playfair Display',serif",
                fontStyle: "italic",
                color: "#67748E",
              }}
            >
              {line}
            </p>
          ))}
          <FloralDots />
          <p
            className="shimmer-gold uppercase mt-4"
            style={{
              fontSize: 14,
              fontFamily: "'Cinzel',serif",
              letterSpacing: "0.4em",
            }}
          >
            {wedding.male_name} &amp; {wedding.female_name}
          </p>
          {date && (
            <p
              className="mt-2"
              style={{
                fontSize: 14,
                fontFamily: "'Cinzel',serif",
                letterSpacing: "0.24em",
                color: "rgba(160,118,40,0.45)",
              }}
            >
              {date}
            </p>
          )}
          <div style={{ marginTop: 20 }}>
            <FloralDots />
          </div>
        </div>

        <div
          style={{
            height: 4,
            background:
              "linear-gradient(to right,transparent,rgba(201,168,76,0.55),rgba(240,210,100,0.4),rgba(201,168,76,0.55),transparent)",
          }}
        />
        <Template2Music />
      </div>
    </>
  );
}
