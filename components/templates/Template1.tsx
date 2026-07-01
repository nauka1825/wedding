"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicMan from "../MusicMan";
import RSVPSection from "../RSVPSection";

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

function ScrollRevealSection({
  children,
  direction = "up",
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
        <radialGradient id="clk-bg-p" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="100%" stopColor="#FDDDE8" />
        </radialGradient>
        <filter id="clk-shadow-p">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(196,160,176,0.18)"
          />
        </filter>
      </defs>
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="url(#clk-bg-p)"
        filter="url(#clk-shadow-p)"
        stroke="rgba(196,160,176,0.4)"
        strokeWidth="0.8"
      />
      <circle
        cx="40"
        cy="40"
        r="33"
        fill="none"
        stroke="rgba(196,160,176,0.15)"
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
              i % 3 === 0 ? "rgba(196,160,176,0.8)" : "rgba(196,160,176,0.35)"
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
        stroke="#7B3F5E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 21 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={40 + 21 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke="#7B3F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 23 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={40 + 23 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke="rgba(196,160,176,0.9)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="2.5" fill="#7B3F5E" />
      <circle cx="40" cy="40" r="1.2" fill="#fff" />
    </svg>
  );
}

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
        @keyframes cal-drop-p{0%{opacity:0;transform:translateY(-18px) scale(0.92)}60%{transform:translateY(3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes day-pop-p{0%{opacity:0;transform:scale(0.5)}65%{transform:scale(1.18)}100%{opacity:1;transform:scale(1)}}
        @keyframes heart-beat-p{0%,100%{transform:scale(1)}30%{transform:scale(1.3)}60%{transform:scale(0.88)}}
        @keyframes ring-draw-p{0%{stroke-dashoffset:550;opacity:0.2}100%{stroke-dashoffset:0;opacity:0.65}}
        @keyframes dot-in-p{0%{opacity:0;transform:scale(0)}100%{opacity:1;transform:scale(1)}}
        .cal-ring-p{stroke-dasharray:550;animation:ring-draw-p 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards}
        .cal-wrap-p{animation:cal-drop-p 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both}
        .day-pop-p{animation:day-pop-p 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.55s both}
        .hrt-beat-p{animation:heart-beat-p 1.4s ease-in-out 1.2s infinite;transform-origin:center;display:inline-block}
        .dot-in-p{animation:dot-in-p 0.4s ease both}
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
          className="cal-ring-p"
          cx="84"
          cy="107"
          r="90"
          fill="none"
          stroke="rgba(196,160,176,0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="84"
          cy="107"
          r="97"
          fill="none"
          stroke="rgba(196,160,176,0.1)"
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
            className="dot-in-p"
            cx={cx}
            cy={cy}
            r="2"
            fill="#7B3F5E"
            opacity="0.5"
            style={{ animationDelay: `${0.9 + i * 0.07}s` }}
          />
        ))}
      </svg>
      <div
        className="cal-wrap-p"
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.85)",
          border: "0.5px solid rgba(196,160,176,0.35)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 8px 32px rgba(196,160,176,0.18),0 2px 8px rgba(196,160,176,0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#F9D5E5 0%,#FDDDE8 50%,#F9D5E5 100%)",
            padding: "14px 16px 12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 14,
              letterSpacing: "0.38em",
              color: "#7B3F5E",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {KAZ_MONTHS[month]} · {year}
          </p>
        </div>
        <div
          style={{
            background: "rgba(196,160,176,0.08)",
            borderBottom: "0.5px solid rgba(196,160,176,0.15)",
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
                  color: "rgba(196,160,176,0.95)",
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
            background: "rgba(255,255,255,0.7)",
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
                          fill="rgba(196,160,176,0.2)"
                          stroke="rgba(196,160,176,0.7)"
                          strokeWidth="0.9"
                        />
                      </svg>
                      <span
                        className="day-pop-p"
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#7B3F5E",
                          position: "relative",
                          zIndex: 1,
                          lineHeight: 1,
                        }}
                      >
                        {cell}
                      </span>
                    </div>
                    <span
                      className="hrt-beat-p"
                      style={{ lineHeight: 1, marginTop: 1 }}
                    >
                      <svg viewBox="0 0 12 11" width="10" height="10">
                        <path
                          d="M6,9.5 C6,9.5 0.5,6 0.5,3 C0.5,1.6 1.6,0.5 3,0.5 C4.2,0.5 5.2,1.3 6,2.2 C6.8,1.3 7.8,0.5 9,0.5 C10.4,0.5 11.5,1.6 11.5,3 C11.5,6 6,9.5 6,9.5Z"
                          fill="#C4A0B0"
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
                        ? "rgba(196,160,176,0.65)"
                        : "rgba(196,160,176,0.45)",
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
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.42em",
          fontFamily: "'Cinzel',serif",
          color: "rgba(196,160,176,0.9)",
          textTransform: "uppercase",
          fontWeight: 400,
          margin: "0 0 10px",
        }}
      >
        Уақыты
      </p>
      <SmallDivider />
      {time && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) rotate(0deg)"
              : "scale(0.6) rotate(-15deg)",
            transition:
              "opacity 0.65s cubic-bezier(0.34,1.56,0.64,1), transform 0.65s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <AnimatedClock time={time} visible={visible} />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(249,213,229,0.4)",
              border: "1px solid rgba(232,180,200,0.35)",
              borderRadius: 10,
              padding: "7px 18px",
            }}
          >
            <IcClock />
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 22,
                letterSpacing: "0.32em",
                color: "#7B3F5E",
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
          style={{
            marginTop: 14,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 26,
              color: "#7B3F5E",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
              margin: 0,
              fontWeight: 400,
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
          "radial-gradient(circle, rgba(196,160,176,0.6) 0%, rgba(196,160,176,0.0) 70%)",
        animation: `org-float-p ${duration}s ease-in-out ${delay}s infinite`,
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
  const { ref, visible } = useInView(0.2);
  const lines = organizer.split("\n").filter(Boolean);
  return (
    <div ref={ref} className="mx-5 mt-8 py-2">
      <style>{`
        @keyframes org-reveal-p{0%{opacity:0;transform:translateY(32px) scale(0.96);filter:blur(4px)}60%{filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
        @keyframes org-line-p{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes org-float-p{0%,100%{transform:translateY(0) scale(1);opacity:0.4}50%{transform:translateY(-60px) scale(0.6);opacity:0}}
        @keyframes org-glow-p{0%,100%{box-shadow:0 0 0px rgba(196,160,176,0)}50%{box-shadow:0 0 32px rgba(196,160,176,0.22),0 4px 24px rgba(196,160,176,0.12)}}
        .org-card-p{animation:org-reveal-p 0.9s cubic-bezier(0.22,1,0.36,1) both}
        .org-line-p{animation:org-line-p 0.6s cubic-bezier(0.22,1,0.36,1) both}
        .org-glow-p{animation:org-glow-p 3s ease-in-out 1s infinite}
      `}</style>
      <FloralDivider className="mb-6" />
      <div
        className="org-card-p org-glow-p"
        style={{
          animationPlayState: visible ? "running" : "paused",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "28px 24px 24px",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(232,180,200,0.38)",
          boxShadow:
            "0 4px 32px rgba(196,160,176,0.14), 0 1px 6px rgba(0,0,0,0.04)",
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
        {[
          ["top:10px", "left:12px"],
          ["top:10px", "right:12px"],
          ["bottom:10px", "left:12px"],
          ["bottom:10px", "right:12px"],
        ].map(([p1, p2], i) => (
          <svg
            key={i}
            style={{
              position: "absolute",
              [p1.split(":")[0]]: p1.split(":")[1],
              [p2.split(":")[0]]: p2.split(":")[1],
              opacity: 0.3,
            }}
            width="22"
            height="22"
            viewBox="0 0 22 22"
          >
            <path
              d={
                [
                  "M2,20 Q2,2 20,2",
                  "M20,20 Q20,2 2,2",
                  "M2,2 Q2,20 20,20",
                  "M20,2 Q20,20 2,20",
                ][i]
              }
              stroke="#C4A0B0"
              strokeWidth="0.8"
              fill="none"
            />
            <circle
              cx={[2, 20, 2, 20][i]}
              cy={[20, 20, 2, 2][i]}
              r="1.5"
              fill="#7B3F5E"
            />
          </svg>
        ))}
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
              stroke="rgba(196,160,176,0.1)"
              strokeWidth="0.6"
            />
            <ellipse
              cx="50%"
              cy="50%"
              rx="38%"
              ry="35%"
              fill="none"
              stroke="rgba(196,160,176,0.07)"
              strokeWidth="0.4"
            />
          </svg>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
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
                  "linear-gradient(to right,transparent,rgba(196,160,176,0.5))",
              }}
            />
            <IcHeart />
            <p
              style={{
                fontSize: 14,
                letterSpacing: "0.45em",
                fontFamily: "'Cinzel',serif",
                fontWeight: 500,
                color: "rgba(196,160,176,0.95)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Той иелері
            </p>
            <IcHeart />
            <div
              style={{
                height: 1,
                width: 28,
                background:
                  "linear-gradient(to left,transparent,rgba(196,160,176,0.5))",
              }}
            />
          </div>
          <p
            className="org-line-p"
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7B3F5E",
              lineHeight: 1.9,
              wordBreak: "break-word",
              margin: 0,
              animationDelay: visible ? "0.2s" : "0s",
              animationPlayState: visible ? "running" : "paused",
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
                      className="org-line-p"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7B3F5E",
                        lineHeight: 1.9,
                        wordBreak: "break-word",
                        margin: 0,
                        animationDelay: visible ? "0.2s" : "0s",
                        animationPlayState: visible ? "running" : "paused",
                      }}
                    >
                      {items[0]}
                    </p>
                    <div
                      className="org-line-p"
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
                            "linear-gradient(to right,transparent,rgba(196,160,176,0.5))",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Playfair Display',Georgia,serif",
                          fontSize: 30,
                          fontStyle: "italic",
                          color: "rgba(196,160,176,0.75)",
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
                            "linear-gradient(to left,transparent,rgba(196,160,176,0.5))",
                        }}
                      />
                    </div>
                    <p
                      className="org-line-p"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7B3F5E",
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
              return items.map((line, i) => (
                <p
                  key={i}
                  className="org-line-p"
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#7B3F5E",
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
                  background: `rgba(196,160,176,${op})`,
                }}
              />
            ))}
          </div>
          {(maleParents || femaleParents) && (
            <div
              style={{
                marginTop: 22,
                borderTop: "0.5px solid rgba(196,160,176,0.2)",
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
                      "linear-gradient(to right,transparent,rgba(196,160,176,0.45))",
                  }}
                />
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.38em",
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 500,
                    color: "rgba(196,160,176,0.85)",
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
                      "linear-gradient(to left,transparent,rgba(196,160,176,0.45))",
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
                    className="org-line-p"
                    style={{
                      textAlign: "center",
                      animationDelay: visible ? "0.55s" : "0s",
                      animationPlayState: visible ? "running" : "paused",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.32em",
                        fontFamily: "'Cinzel',serif",
                        color: "rgba(196,160,176,0.75)",
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
                        color: "#7B3F5E",
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
                          "linear-gradient(to right,transparent,rgba(196,160,176,0.4))",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: 22,
                        fontStyle: "italic",
                        color: "rgba(196,160,176,0.7)",
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
                          "linear-gradient(to left,transparent,rgba(196,160,176,0.4))",
                      }}
                    />
                  </div>
                )}
                {femaleParents && (
                  <div
                    className="org-line-p"
                    style={{
                      textAlign: "center",
                      animationDelay: visible ? "0.68s" : "0s",
                      animationPlayState: visible ? "running" : "paused",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.32em",
                        fontFamily: "'Cinzel',serif",
                        color: "rgba(196,160,176,0.75)",
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
                        color: "#7B3F5E",
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

function InvitationHero({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
  const { ref, visible } = useInView(0.1);
  return (
    <div ref={ref} className="text-center px-6 mt-4 mb-2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        @keyframes inv-slide-left-p{0%{opacity:0;transform:translateX(-52px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes inv-slide-right-p{0%{opacity:0;transform:translateX(52px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes inv-fade-up-p{0%{opacity:0;transform:translateY(28px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes inv-name-pop-p{0%{opacity:0;transform:scale(0.85) translateY(16px);filter:blur(6px)}70%{filter:blur(0)}100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)}}
        .inv-from-left-p{animation:inv-slide-left-p 0.8s cubic-bezier(0.22,1,0.36,1) both}
        .inv-from-right-p{animation:inv-slide-right-p 0.8s cubic-bezier(0.22,1,0.36,1) both}
        .inv-fade-up-p{animation:inv-fade-up-p 0.7s cubic-bezier(0.22,1,0.36,1) both}
        .inv-name-pop-p{animation:inv-name-pop-p 0.9s cubic-bezier(0.34,1.4,0.64,1) both}
        .shimmer-pink{background:linear-gradient(90deg,#7B3F5E 15%,#C4A0B0 42%,#E8B4C8 58%,#7B3F5E 85%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-gold 6s linear infinite}
      `}</style>
      <p
        className="inv-from-left-p"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          fontSize: 15,
          letterSpacing: "0.2em",
          color: "rgba(196,160,176,0.95)",
          lineHeight: 2,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        Құрметті ағайын-туыс, құда-жекжат, дос-жаран, әріптестер мен көршілер!
      </p>
      <p
        className="inv-from-left-p"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          fontSize: 15,
          letterSpacing: "0.2em",
          color: "rgba(196,160,176,0.95)",
          lineHeight: 2.2,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: "4px 0 0",
          animationDelay: visible ? "0.18s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        Сіздерді ұлымыз
      </p>
      <p
        className="shimmer-pink inv-name-pop-p"
        style={{
          fontFamily: "'Great Vibes',cursive",
          fontSize: "clamp(2.8rem,11vw,4.2rem)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          margin: "8px 0 4px",
          animationDelay: visible ? "0.3s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {maleName}
      </p>
      <div
        className="inv-fade-up-p"
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
              "linear-gradient(to right,transparent,rgba(196,160,176,0.5))",
          }}
        />
        <p
          style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontStyle: "italic",
            fontSize: 14,
            letterSpacing: "0.3em",
            color: "rgba(196,160,176,0.88)",
            textTransform: "uppercase",
            fontWeight: 700,
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
              "linear-gradient(to left,transparent,rgba(196,160,176,0.5))",
          }}
        />
      </div>
      <p
        className="shimmer-pink inv-name-pop-p"
        style={{
          fontFamily: "'Great Vibes',cursive",
          fontSize: "clamp(2.8rem,11vw,4.2rem)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          margin: "4px 0 12px",
          animationDelay: visible ? "0.52s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        {femaleName}
      </p>
      <p
        className="inv-from-right-p"
        style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontStyle: "italic",
          fontSize: 15,
          letterSpacing: "0.13em",
          color: "rgba(196,160,176,0.88)",
          lineHeight: 1.95,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
          animationDelay: visible ? "0.66s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        дің үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы
        болуға шақырамыз!
      </p>
      <div
        className="inv-fade-up-p"
        style={{
          marginTop: 16,
          animationDelay: visible ? "0.8s" : "0s",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        <SmallDivider />
      </div>
    </div>
  );
}

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
      <style>{`@keyframes gallery-progress-p{from{width:0%}to{width:100%}}`}</style>
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
              width: "72vw",
              maxWidth: 300,
              height: 220,
              borderRadius: 20,
              border: `1px solid ${active === i ? "rgba(232,180,200,0.6)" : "rgba(232,180,200,0.25)"}`,
              transition: "transform 0.35s ease, box-shadow 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.93)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(196,160,176,0.32)"
                  : "0 2px 8px rgba(196,160,176,0.08)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center top",
                opacity: active === i ? 1 : 0.7,
                transition: "opacity 0.35s ease",
              }}
            />
          </div>
        ))}
      </div>
      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 rounded-full overflow-hidden relative"
              style={{
                width: active === i ? 20 : 7,
                height: 7,
                background: "#E8B4C8",
                opacity: active === i ? 1 : 0.45,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#C4A0B0",
                    animation: "gallery-progress-p 5s linear forwards",
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

const IcCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="17" rx="4" fill="url(#cal-body-e)" />
    <rect x="3" y="5" width="18" height="7" rx="4" fill="url(#cal-head-e)" />
    <rect x="3" y="9" width="18" height="3" fill="url(#cal-head-e)" />
    <line
      x1="8"
      y1="3"
      x2="8"
      y2="7.5"
      stroke="#F9A8D4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="3"
      x2="16"
      y2="7.5"
      stroke="#F9A8D4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="15" r="1.5" fill="#F472B6" />
    <circle cx="12" cy="15" r="1.5" fill="#EC4899" />
    <circle cx="16" cy="15" r="1.5" fill="#DB2777" />
    <circle cx="8" cy="19" r="1.5" fill="#F9A8D4" />
    <circle cx="12" cy="19" r="1.5" fill="#F472B6" />
    <defs>
      <linearGradient
        id="cal-body-e"
        x1="3"
        y1="5"
        x2="21"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </linearGradient>
      <linearGradient
        id="cal-head-e"
        x1="3"
        y1="5"
        x2="21"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
    </defs>
  </svg>
);

const IcClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="url(#clk-bg-e)" />
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#F9A8D4"
      strokeWidth="0.8"
      fill="none"
    />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const isMain = deg % 90 === 0;
      return (
        <line
          key={i}
          x1={12 + Math.cos(r) * 8.2}
          y1={12 + Math.sin(r) * 8.2}
          x2={12 + Math.cos(r) * (isMain ? 6.5 : 7.5)}
          y2={12 + Math.sin(r) * (isMain ? 6.5 : 7.5)}
          stroke={isMain ? "#DB2777" : "#F9A8D4"}
          strokeWidth={isMain ? "1.2" : "0.6"}
          strokeLinecap="round"
        />
      );
    })}
    <line
      x1="12"
      y1="12"
      x2="12"
      y2="6"
      stroke="#BE185D"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="16.5"
      y2="14"
      stroke="#EC4899"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="1.8" fill="#BE185D" />
    <circle cx="12" cy="12" r="0.8" fill="#FFF0F5" />
    <defs>
      <radialGradient id="clk-bg-e" cx="40%" cy="35%" r="65%">
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </radialGradient>
    </defs>
  </svg>
);

const IcMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="22" rx="4" ry="1.2" fill="#F9A8D4" opacity="0.4" />
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="url(#pin-body-e)"
    />
    <circle cx="12" cy="9" r="4" fill="white" opacity="0.9" />
    <circle cx="12" cy="9" r="2.5" fill="url(#pin-dot-e)" />
    <circle cx="10.5" cy="7.5" r="1" fill="white" opacity="0.5" />
    <defs>
      <linearGradient
        id="pin-body-e"
        x1="5"
        y1="2"
        x2="19"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="0.5" stopColor="#EC4899" />
        <stop offset="1" stopColor="#9D174D" />
      </linearGradient>
      <radialGradient id="pin-dot-e" cx="40%" cy="35%" r="65%">
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#BE185D" />
      </radialGradient>
    </defs>
  </svg>
);

const IcMapPinTiny = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginTop: 2, flexShrink: 0 }}
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="url(#pin-tiny-e)"
    />
    <circle cx="12" cy="9" r="3" fill="white" opacity="0.85" />
    <defs>
      <linearGradient
        id="pin-tiny-e"
        x1="5"
        y1="2"
        x2="19"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#9D174D" />
      </linearGradient>
    </defs>
  </svg>
);

const IcPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="1" width="14" height="22" rx="3" fill="url(#ph-body-e)" />
    <rect x="5" y="1" width="14" height="8" rx="3" fill="url(#ph-top-e)" />
    <rect
      x="7"
      y="3"
      width="10"
      height="15"
      rx="1.5"
      fill="url(#ph-screen-e)"
    />
    <circle cx="12" cy="2.8" r="1" fill="#F9A8D4" opacity="0.6" />
    <circle cx="12" cy="20.5" r="1.2" fill="#F9A8D4" opacity="0.7" />
    <defs>
      <linearGradient
        id="ph-body-e"
        x1="5"
        y1="1"
        x2="19"
        y2="23"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE7F3" />
        <stop offset="1" stopColor="#F9A8D4" />
      </linearGradient>
      <linearGradient
        id="ph-top-e"
        x1="5"
        y1="1"
        x2="19"
        y2="9"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient
        id="ph-screen-e"
        x1="7"
        y1="3"
        x2="17"
        y2="18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </linearGradient>
    </defs>
  </svg>
);

const IcUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <ellipse cx="9" cy="22.5" rx="5.5" ry="1" fill="#F9A8D4" opacity="0.3" />
    <circle cx="16" cy="8" r="3.5" fill="url(#usr-head2-e)" />
    <path d="M10 22c0-4.4 2.7-8 6-8s6 3.6 6 8" fill="url(#usr-body2-e)" />
    <circle cx="9" cy="8" r="4" fill="url(#usr-head-e)" />
    <path d="M2 22c0-4.8 3.1-8.5 7-8.5s7 3.7 7 8.5" fill="url(#usr-body-e)" />
    <circle cx="7.5" cy="6.5" r="1.2" fill="white" opacity="0.45" />
    <defs>
      <radialGradient id="usr-head-e" cx="40%" cy="35%" r="65%">
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#DB2777" />
      </radialGradient>
      <linearGradient
        id="usr-body-e"
        x1="2"
        y1="13.5"
        x2="16"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="usr-head2-e" cx="40%" cy="35%" r="65%">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </radialGradient>
      <linearGradient
        id="usr-body2-e"
        x1="10"
        y1="14"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCD34D" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

const IcInstagram = ({ white = false }: { white?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      fill={white ? "rgba(255,255,255,0.25)" : "url(#ig-bg-e)"}
    />
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      stroke={white ? "rgba(255,255,255,0.5)" : "url(#ig-border-e)"}
      strokeWidth="0.8"
    />
    <circle
      cx="12"
      cy="12"
      r="4.5"
      stroke={white ? "white" : "url(#ig-ring-e)"}
      strokeWidth="1.6"
      fill="none"
    />
    <circle
      cx="17.2"
      cy="6.8"
      r="1.4"
      fill={white ? "white" : "url(#ig-dot-e)"}
    />
    <defs>
      <linearGradient
        id="ig-bg-e"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE7F3" />
        <stop offset="1" stopColor="#FDE8D8" />
      </linearGradient>
      <linearGradient
        id="ig-border-e"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#FCA5A5" />
      </linearGradient>
      <linearGradient
        id="ig-ring-e"
        x1="7.5"
        y1="7.5"
        x2="16.5"
        y2="16.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EC4899" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
      <radialGradient id="ig-dot-e" cx="40%" cy="40%" r="60%">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
  </svg>
);

/* ── IcHeart : redesigned — centered inside its own viewBox,
   soft calligraphic outline instead of a heavy 3D fill,
   feels like a single continuous pen stroke ── */
const IcHeart = () => (
  <svg width="30" height="27" viewBox="0 0 40 36" fill="none">
    <defs>
      <linearGradient
        id="hrt-line-e"
        x1="6"
        y1="5"
        x2="34"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hrt-fill-e2" cx="50%" cy="35%" r="70%">
        <stop stopColor="#FDF2F8" />
        <stop offset="1" stopColor="#F9A8D4" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    <path
      d="M20,30.5 C20,30.5 6,20.8 6,12.2 C6,7.6 9.5,4.5 13.9,4.5 C16.7,4.5 18.9,6.2 20,8.6 C21.1,6.2 23.3,4.5 26.1,4.5 C30.5,4.5 34,7.6 34,12.2 C34,20.8 20,30.5 20,30.5Z"
      fill="url(#hrt-fill-e2)"
      stroke="url(#hrt-line-e)"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path
      d="M12.5,10.3 Q14.2,8.9 16,10.4"
      stroke="white"
      strokeWidth="0.8"
      strokeLinecap="round"
      fill="none"
      opacity="0.75"
    />
  </svg>
);

/* ── IcRing : redesigned — single elegant band, centered in
   the viewBox, thin calligraphic line-art instead of a bulky
   3D double-ring render ── */
const IcRing = () => (
  <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
    <defs>
      <linearGradient
        id="ring-line-e"
        x1="8"
        y1="8"
        x2="52"
        y2="52"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FDE68A" />
        <stop offset="0.5" stopColor="#D97706" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
      <radialGradient id="gem-e" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="white" />
        <stop offset="45%" stopColor="#FDF2F8" />
        <stop offset="100%" stopColor="#F9A8D4" />
      </radialGradient>
    </defs>
    <circle
      cx="30"
      cy="35"
      r="15"
      fill="none"
      stroke="url(#ring-line-e)"
      strokeWidth="1.6"
    />
    <circle
      cx="30"
      cy="35"
      r="15"
      fill="none"
      stroke="#FEF3C7"
      strokeWidth="0.5"
      opacity="0.55"
    />
    <line
      x1="30"
      y1="25"
      x2="30"
      y2="19"
      stroke="url(#ring-line-e)"
      strokeWidth="1"
    />
    <polygon
      points="30,10 24.5,17.5 30,25 35.5,17.5"
      fill="url(#gem-e)"
      stroke="url(#ring-line-e)"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d="M26.5,15.5 L30,10 L33.5,15.5"
      fill="none"
      stroke="url(#ring-line-e)"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="14.5" r="0.8" fill="white" opacity="0.9" />
  </svg>
);

const FloralDivider = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 32"
    fill="none"
    className={className}
    style={{ width: "100%", maxWidth: 280, height: 32 }}
  >
    <defs>
      <linearGradient id="vine-l-e" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="0" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="vine-r-e" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="1" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 16 Q15 16 25 16"
      stroke="url(#vine-l-e)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M25 16 Q30 16 35 14 Q40 12 42 16 Q40 20 35 18 Q30 16 35 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M42 16 Q52 16 60 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M60 16 Q64 16 66 13 Q70 8 73 11 Q75 14 72 17 Q69 20 66 17 Q64 16 66 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M73 16 Q88 16 96 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M96 16 Q100 16 102 14 Q105 10 108 13 Q110 16 107 19 Q104 21 101 18 Q100 16 102 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M108 16 Q118 16 124 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <g transform="translate(128,6)">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 7}
            cy={10 + Math.sin(r) * 7}
            rx="3.5"
            ry="5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 7},${10 + Math.sin(r) * 7})`}
            fill="#F2C8DC"
            opacity="0.55"
          />
        );
      })}
      {[30, 90, 150, 210, 270, 330].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 4}
            cy={10 + Math.sin(r) * 4}
            rx="2.2"
            ry="3.5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
            fill="#E8A8C4"
            opacity="0.65"
          />
        );
      })}
      <circle cx="12" cy="10" r="3" fill="#D4809C" opacity="0.8" />
      <circle cx="12" cy="10" r="1.5" fill="#C06080" opacity="0.9" />
    </g>
    <path
      d="M156 16 Q162 16 172 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <path
      d="M172 16 Q176 16 178 18 Q181 22 184 19 Q186 16 183 13 Q180 10 177 14 Q176 16 178 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M184 16 Q192 16 207 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M207 16 Q211 16 213 14 Q216 10 219 13 Q221 16 218 19 Q215 21 212 18 Q211 16 213 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M219 16 Q227 16 238 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M238 16 Q243 16 245 14 Q248 9 251 12 Q253 16 250 18 Q247 21 244 17 Q243 16 245 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M251 16 Q261 16 280 16"
      stroke="url(#vine-r-e)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

const CardWaveDecor = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 360 28"
    fill="none"
    style={{
      width: "100%",
      height: 28,
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  >
    <defs>
      <linearGradient id={`wave-grad-e-${flip}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#E8B4C8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M0 20 Q30 8 60 20 Q90 32 120 20 Q150 8 180 20 Q210 32 240 20 Q270 8 300 20 Q330 32 360 20"
      stroke={`url(#wave-grad-e-${flip})`}
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    {[60, 120, 180, 240, 300].map((x, i) => (
      <g key={i} transform={`translate(${x},20)`}>
        <path d="M0-3 L2 0 L0 3 L-2 0Z" fill="#DDA8C0" opacity="0.55" />
      </g>
    ))}
    <g transform="translate(180,14)">
      <path d="M0-5 L3 0 L0 5 L-3 0Z" fill="#CC8EAA" opacity="0.7" />
      <circle cx="0" cy="0" r="1.5" fill="#B87090" opacity="0.8" />
    </g>
  </svg>
);

const SmallDivider = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <svg viewBox="0 0 160 20" fill="none" style={{ width: 160, height: 20 }}>
      <defs>
        <linearGradient id="sdiv-l-e" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0" />
          <stop offset="100%" stopColor="#E8B4C8" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="sdiv-r-e" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8B4C8" stopOpacity="1" />
          <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 10 L55 10"
        stroke="url(#sdiv-l-e)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <circle cx="62" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={80 + Math.cos(r) * 4}
            cy={10 + Math.sin(r) * 4}
            rx="2"
            ry="3"
            transform={`rotate(${deg + 90},${80 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
            fill="#EEBAD0"
            opacity="0.5"
          />
        );
      })}
      <circle cx="80" cy="10" r="2.2" fill="#D4809C" opacity="0.8" />
      <circle cx="80" cy="10" r="1" fill="#C06080" opacity="0.9" />
      <circle cx="98" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
      <path
        d="M105 10 L160 10"
        stroke="url(#sdiv-r-e)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

function RotatingOrnament({
  position,
  size = 200,
  opacity = 0.05,
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
        animation: "spin-slow-e 22s linear infinite",
        animationDirection: isTopRight ? "normal" : "reverse",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        style={{ width: "100%", height: "100%" }}
      >
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
          (deg, i) => {
            const r = (deg * Math.PI) / 180;
            return (
              <ellipse
                key={i}
                cx={100 + Math.cos(r) * 45}
                cy={100 + Math.sin(r) * 45}
                rx="16"
                ry="26"
                transform={`rotate(${deg + 90},${100 + Math.cos(r) * 45},${100 + Math.sin(r) * 45})`}
                fill="#C4A0B0"
                opacity="0.4"
              />
            );
          },
        )}
        <circle cx="100" cy="100" r="18" fill="#F9A8D4" opacity="0.3" />
      </svg>
    </div>
  );
}

// ─── SECTION NAV ───
const NAV_ITEMS = [
  { id: "section-hero", emoji: "💍", label: "Есімдер" },
  { id: "section-photos", emoji: "📸", label: "Фотолар" },
  { id: "section-details", emoji: "📅", label: "Мәліметтер" },
  { id: "section-messages", emoji: "💌", label: "Тілектер" },
];

function SectionNavBar() {
  const [active, setActive] = useState("section-hero");

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
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(253,240,245,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "0.5px solid rgba(232,180,200,0.5)",
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
                      "linear-gradient(to right,#E8B4C8,#7B3F5E,#E8B4C8)",
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
                  fontFamily: "'Cinzel',serif",
                  fontSize: 9.5,
                  letterSpacing: "0.05em",
                  color: isActive ? "#7B3F5E" : "rgba(196,160,176,0.7)",
                  fontWeight: isActive ? 600 : 400,
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
export default function Template1({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg,#FDF0F5 0%,#FDF6F0 40%,#F5F0FD 100%)",
        fontFamily: "'Cormorant Garamond','Georgia',serif",
        paddingBottom: 80,
      }}
    >
      <MusicMan />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&family=Cinzel:wght@400;500;600&display=swap');
        * { box-sizing:border-box; }
        img { border:none !important; outline:none !important; }
        @keyframes fade-up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes petal-spin-e{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spin-slow-e{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer-gold{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes float-gentle-e{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .fade-up{animation:fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both}
        .fade-1{animation-delay:0.1s}
        .fade-2{animation-delay:0.28s}
        .fade-3{animation-delay:0.46s}
        .label-sm{font-family:'Jost',sans-serif;font-weight:400;letter-spacing:0.32em;text-transform:uppercase;font-size:9px;color:rgba(196,160,176,0.9)}
        .glass-card{background:rgba(255,255,255,0.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(232,180,200,0.38);border-radius:24px;box-shadow:0 8px 32px rgba(196,160,176,0.16),0 1px 0 rgba(255,255,255,0.9) inset,0 -1px 0 rgba(232,180,200,0.12) inset}
        .icon-box{width:40px;height:40px;border-radius:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#F9D5E5 0%,#FDF0F5 100%);box-shadow:0 2px 8px rgba(196,160,176,0.18)}
        .ring-float{animation:float-gentle-e 3s ease-in-out infinite}
      `}</style>

      <RotatingOrnament position="top-right" size={220} opacity={0.06} />
      <RotatingOrnament position="bottom-left" size={220} opacity={0.06} />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — Есімдер + Шақыру + Той иелері
      ═══════════════════════════════════════════════════════ */}
      <section id="section-hero">
        {/* HERO IMAGE */}
        <div className="relative w-full h-[62vh] overflow-hidden">
          {wedding.main_photo_url ? (
            <img
              src={wedding.main_photo_url}
              alt="Басты сурет"
              className="w-full h-full object-cover"
              style={{ display: "block", border: "none" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#F9D5E5 0%,#FDF6F0 50%,#E5D5F9 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern
                      id="dots-e"
                      x="0"
                      y="0"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="15" cy="15" r="1" fill="#C4A0B0" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots-e)" />
                </svg>
              </div>
              <div className="relative flex items-center justify-center">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                  style={{ animation: "petal-spin-e 30s linear infinite" }}
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
                          fill="#F2C8DC"
                          opacity="0.35"
                        />
                      );
                    },
                  )}
                </svg>
                <div className="absolute ring-float">
                  <IcRing />
                </div>
              </div>
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top,#FDF0F5 0%,transparent 55%)",
            }}
          />
          <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right,transparent,rgba(255,255,255,0.5))",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Jost',sans-serif",
                fontSize: 9,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
              }}
            >
              Үйлену тойы
            </span>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left,transparent,rgba(255,255,255,0.5))",
              }}
            />
          </div>
        </div>

        {/* NAMES */}
        <div className="text-center px-6 -mt-14 relative z-10">
          <div
            className="fade-up fade-1 inline-flex items-center justify-center mb-5 bg-white/70 backdrop-blur-sm p-3 rounded-full border border-pink-100/50"
            style={{
              boxShadow:
                "0 2px 16px rgba(196,160,176,0.18),0 1px 0 rgba(255,255,255,0.9) inset",
            }}
          >
            <IcRing />
          </div>
          <h1
            className="fade-up fade-1 font-light italic leading-tight"
            style={{
              fontFamily: "'Playfair Display',serif",
              color: "#7B3F5E",
              fontSize: "clamp(2.4rem,10vw,3.2rem)",
            }}
          >
            {wedding.male_name}
          </h1>
          <div className="fade-up fade-2 flex items-center justify-center gap-3 my-5">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(to right,transparent,#E8B4C8)",
              }}
            />
            <IcHeart />
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(to left,transparent,#E8B4C8)",
              }}
            />
          </div>
          <h1
            className="fade-up fade-2 font-light italic leading-tight"
            style={{
              fontFamily: "'Playfair Display',serif",
              color: "#7B3F5E",
              fontSize: "clamp(2.4rem,10vw,3.2rem)",
            }}
          >
            {wedding.female_name}
          </h1>
          <div className="fade-up fade-3 flex justify-center mt-5">
            <FloralDivider />
          </div>
        </div>

        {/* INVITATION TEXT */}
        <div
          className="relative z-10 mt-6"
          style={{ background: "transparent" }}
        >
          <InvitationHero
            maleName={wedding.male_name}
            femaleName={wedding.female_name}
          />
        </div>

        {/* ORGANIZER BLOCK */}
        {wedding.organizer && (
          <ScrollRevealSection direction="left" delay={0.05}>
            <OrganizerBlock
              organizer={wedding.organizer}
              maleParents={(wedding as any).male_parents}
              femaleParents={(wedding as any).female_parents}
            />
          </ScrollRevealSection>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: ФОТОЛАР
      ═══════════════════════════════════════════════════════ */}
      <section id="section-photos">
        {/* PHOTO3 only */}
        {wedding.photo3_url && !wedding.photo4_url && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ overflow: "hidden", padding: "0 20px", marginTop: 16 }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(232,180,200,0.3)",
                boxShadow: "0 4px 24px rgba(196,160,176,0.15)",
              }}
            >
              <img
                src={wedding.photo3_url}
                alt="Сурет"
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

        {/* PHOTO3 + PHOTO4 grid */}
        {wedding.photo3_url && wedding.photo4_url && (
          <div className="mx-5 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
                }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Жігіт"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
                }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Қыз"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {!!wedding.gallery_urls?.length && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ marginTop: 28 }}
          >
            <div className="flex items-center gap-3 px-5 mb-4">
              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to right,transparent,#E8B4C8)",
                }}
              />
              <p className="label-sm">Фотоальбом</p>
              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to left,transparent,#E8B4C8)",
                }}
              />
            </div>
            <p
              style={{
                textAlign: "center",
                fontSize: 15,
                fontFamily: "'Cinzel',serif",
                background:
                  "linear-gradient(90deg,#7B3F5E 15%,#C4A0B0 42%,#E8B4C8 58%,#7B3F5E 85%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer-gold 6s linear infinite",
                marginBottom: 12,
              }}
            >
              ❤️ Біздің махаббатымыздың естеліктері ❤️
            </p>
            <GallerySwiper urls={wedding.gallery_urls} />
          </ScrollRevealSection>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: МӘЛІМЕТТЕР — Уақыт + Той залы + Басқа
      ═══════════════════════════════════════════════════════ */}
      <section id="section-details">
        {/* SECTION HEADER */}
        <div style={{ textAlign: "center", padding: "36px 20px 4px" }}>
          <SmallDivider />
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 13,
              letterSpacing: "0.45em",
              color: "rgba(196,160,176,0.9)",
              textTransform: "uppercase",
              margin: "12px 0 0",
              fontWeight: 500,
            }}
          >
            Мерекелік мәліметтер
          </p>
        </div>

        {/* DATE DISPLAY */}
        {date && (
          <ScrollRevealSection
            direction="up"
            delay={0}
            style={{ textAlign: "center", marginTop: 16 }}
          >
            <p
              className="fade-up fade-3 mt-3 uppercase"
              style={{
                fontSize: 14,
                letterSpacing: "0.44em",
                fontFamily: "'Cinzel',serif",
                color: "rgba(196,160,176,0.90)",
                fontWeight: 600,
              }}
            >
              {date}
            </p>
          </ScrollRevealSection>
        )}

        {/* ANIMATED CALENDAR */}
        {wedding.wedding_date && (
          <ScrollRevealSection
            direction="right"
            delay={0.05}
            style={{ marginTop: 16, padding: "0 20px" }}
          >
            <AnimatedCalendar dateStr={wedding.wedding_date} />
          </ScrollRevealSection>
        )}

        {/* INSTAGRAM LINKS */}
        {(wedding.link1 || wedding.link2) && (
          <div className="mx-5 mt-8 flex gap-4">
            {wedding.link1 && (
              <a
                href={wedding.link1}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all hover:opacity-80"
                style={{
                  border: "1px solid rgba(196,160,176,0.38)",
                  color: "#9B6B7E",
                  background: "rgba(255,255,255,0.5)",
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  boxShadow: "0 2px 12px rgba(196,160,176,0.1)",
                }}
              >
                <IcInstagram /> Instagram
              </a>
            )}
            {wedding.link2 && (
              <a
                href={wedding.link2}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#7B3F5E,#C4A0B0)",
                  boxShadow: "0 4px 16px rgba(123,63,94,0.28)",
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                <IcInstagram white /> Instagram
              </a>
            )}
          </div>
        )}

        {/* INFO CARD */}
        <div className="mx-5 mt-7 mb-2">
          <div className="glass-card relative overflow-hidden">
            <div
              className="h-[2px]"
              style={{
                background:
                  "linear-gradient(to right,#F9D5E5,#C4A0B0,#D5D5F9,#C4A0B0,#F9D5E5)",
              }}
            />
            <div className="px-2 pt-1">
              <CardWaveDecor />
            </div>
            <div className="p-5 space-y-4">
              {/* DateTime */}
              {(date || time) && (
                <ScrollRevealSection direction="up" delay={0}>
                  <DateTimeBlock date={date} time={time} />
                </ScrollRevealSection>
              )}

              {/* Venue */}
              {(wedding.venue_name || wedding.venue_address) && (
                <ScrollRevealSection
                  direction="left"
                  delay={0.1}
                  style={{
                    borderTop: "0.5px solid rgba(232,180,200,0.2)",
                    paddingTop: 20,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="icon-box mt-0.5">
                      <IcMapPin />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="label-sm">Той залы</p>
                      {wedding.venue_name && (
                        <p
                          className="font-light italic mt-0.5"
                          style={{
                            fontFamily: "'Playfair Display',serif",
                            color: "#7B3F5E",
                            fontSize: 16,
                            wordBreak: "break-word",
                          }}
                        >
                          {wedding.venue_name}
                        </p>
                      )}
                      {wedding.venue_address && (
                        <div className="flex items-start gap-1 mt-1">
                          <IcMapPinTiny />
                          <p
                            style={{
                              color: "#C4A0B0",
                              fontSize: 12,
                              fontFamily: "'Jost',sans-serif",
                              lineHeight: 1.6,
                              wordBreak: "break-word",
                            }}
                          >
                            {wedding.venue_address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollRevealSection>
              )}

              {/* Extras */}
              {extras.length > 0 && (
                <div
                  className="pt-3 border-t space-y-2.5"
                  style={{ borderColor: "rgba(232,180,200,0.2)" }}
                >
                  {extras.map((e, i) => (
                    <ScrollRevealSection
                      key={i}
                      direction={i % 2 === 0 ? "left" : "right"}
                      delay={i * 0.08}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(249,213,229,0.5)",
                            border: "1px solid rgba(232,180,200,0.35)",
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#C4A0B0" }}
                          />
                        </div>
                        <p
                          style={{
                            color: "#9B6B7E",
                            fontSize: 13,
                            fontFamily: "'Jost',sans-serif",
                            lineHeight: 1.75,
                            wordBreak: "break-word",
                          }}
                        >
                          {e}
                        </p>
                      </div>
                    </ScrollRevealSection>
                  ))}
                </div>
              )}

              {/* Photo5 */}
              {wedding.photo5_url && (
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: "rgba(232,180,200,0.2)" }}
                >
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{ boxShadow: "0 4px 16px rgba(196,160,176,0.15)" }}
                  >
                    <img
                      src={wedding.photo5_url}
                      alt="Қосымша сурет"
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="px-2 pb-2">
              <CardWaveDecor flip />
            </div>
          </div>
        </div>

        {/* DESCRIPTION 2 */}
        {wedding.description2 && (
          <div className="mx-5 mt-8">
            <div
              className="relative rounded-3xl p-5 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(232,180,200,0.25)",
                boxShadow: "0 4px 20px rgba(196,160,176,0.1)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
                style={{
                  background:
                    "linear-gradient(to bottom,#F9D5E5,#E8B4C8,#F9D5E5)",
                }}
              />
              <p
                className="text-[#9B6B7E] text-[14px] leading-[1.85] pl-3"
                style={{ wordBreak: "break-word" }}
              >
                {wedding.description2}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: ТІЛЕКТЕР
      ═══════════════════════════════════════════════════════ */}
      <section id="section-messages">
        <RSVPSection
          weddingId={wedding.id}
          accentColor="#7B3F5E"
          lightColor="#FDF0F5"
        />
        {/* SECTION HEADER */}
        <div style={{ textAlign: "center", padding: "36px 20px 4px" }}>
          <SmallDivider />
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 13,
              letterSpacing: "0.45em",
              color: "rgba(196,160,176,0.9)",
              textTransform: "uppercase",
              margin: "12px 0 0",
              fontWeight: 500,
            }}
          >
            Тілектер
          </p>
        </div>

        <ScrollRevealSection direction="up" delay={0}>
          <MessageSection
            weddingId={wedding.id}
            accentColor="#7B3F5E"
            lightColor="#FDF0F5"
            borderColor="border-rose-100"
          />
        </ScrollRevealSection>
      </section>

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-12 mt-4">
        <div className="flex justify-center mb-5">
          <FloralDivider />
        </div>
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
              fontSize: 16,
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              color: "#9B6B7E",
            }}
          >
            {line}
          </p>
        ))}
        <div className="flex justify-center mt-5 mb-3">
          <SmallDivider />
        </div>
        <p
          style={{
            color: "#C4A0B0",
            fontFamily: "'Jost',sans-serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            style={{
              color: "#DDB4C8",
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              marginTop: 6,
            }}
          >
            {date}
          </p>
        )}
        <div className="flex justify-center mt-6">
          <FloralDivider />
        </div>
      </div>

      <div
        style={{
          height: 4,
          background:
            "linear-gradient(to right,transparent,rgba(196,160,176,0.55),rgba(196,160,176,0.4),rgba(196,160,176,0.55),transparent)",
        }}
      />

      {/* ═══ BOTTOM NAV ═══ */}
      <SectionNavBar />
    </div>
  );
}
