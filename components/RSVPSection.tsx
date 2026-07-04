"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type RSVPStatus = "attending" | "not_attending" | "maybe";

const OPTIONS: { value: RSVPStatus; labelKz: string; desc: string }[] = [
  { value: "attending", labelKz: "Келемін", desc: "Тойға қатысамын" },
  { value: "maybe", labelKz: "Мүмкін", desc: "Әлі белгісіз" },
  { value: "not_attending", labelKz: "Келе алмаймын", desc: "Қатыса алмаймын" },
];

const STORAGE_KEY = (weddingId: string) => `rsvp_sent_${weddingId}`;

/* ── shared reveal-on-scroll hook (mirrors Template1's useInView) ── */
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

/* ── decorative icons drawn in the same soft gradient
   line-art style as Template1's IcHeart / IcUsers ── */
const IcUsersRsvp = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient
        id="rsvp-users-g"
        x1="0"
        y1="0"
        x2="24"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={color} />
        <stop offset="1" stopColor={color} stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="url(#rsvp-users-g)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IcRingSmallRsvp = ({ color }: { color: string }) => (
  <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
    <defs>
      <linearGradient
        id="rsvp-ring-g"
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
      <radialGradient id="rsvp-gem-g" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="white" />
        <stop offset="45%" stopColor="#FDF2F8" />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
    </defs>
    <circle
      cx="30"
      cy="35"
      r="15"
      fill="none"
      stroke="url(#rsvp-ring-g)"
      strokeWidth="1.6"
    />
    <line
      x1="30"
      y1="25"
      x2="30"
      y2="19"
      stroke="url(#rsvp-ring-g)"
      strokeWidth="1"
    />
    <polygon
      points="30,10 24.5,17.5 30,25 35.5,17.5"
      fill="url(#rsvp-gem-g)"
      stroke="url(#rsvp-ring-g)"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

const MiniFloralRsvp = ({ color }: { color: string }) => (
  <svg viewBox="0 0 40 20" width="40" height="20" fill="none">
    <ellipse cx="20" cy="10" rx="3" ry="4.5" fill={color} opacity="0.75" />
    {[0, 72, 144, 216, 288].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={20 + Math.cos(r) * 5}
          cy={10 + Math.sin(r) * 5}
          rx="2.4"
          ry="3.6"
          transform={`rotate(${deg + 90},${20 + Math.cos(r) * 5},${10 + Math.sin(r) * 5})`}
          fill={color}
          opacity="0.35"
        />
      );
    })}
  </svg>
);

const WaveDecorRsvp = ({
  color,
  flip = false,
}: {
  color: string;
  flip?: boolean;
}) => (
  <svg
    viewBox="0 0 320 20"
    fill="none"
    style={{
      width: "100%",
      height: 18,
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  >
    <defs>
      <linearGradient id={`rsvp-wave-${flip}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color} stopOpacity="0" />
        <stop offset="50%" stopColor={color} stopOpacity="0.55" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 14 Q26 5 52 14 Q78 23 104 14 Q130 5 156 14 Q182 23 208 14 Q234 5 260 14 Q286 23 320 14"
      stroke={`url(#rsvp-wave-${flip})`}
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <g transform="translate(160,11)">
      <path d="M0-4 L2.4 0 L0 4 L-2.4 0Z" fill={color} opacity="0.55" />
    </g>
  </svg>
);

export default function RSVPSection({
  weddingId,
  accentColor = "#7B3F5E",
  lightColor = "#FDF6F0",
}: {
  weddingId: string;
  accentColor?: string;
  lightColor?: string;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { ref: headerRef, visible: headerVisible } = useInView(0.3);
  const { ref: cardRef, visible: cardVisible } = useInView(0.15);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY(weddingId))) {
      setDone(true);
    }
  }, [weddingId]);

  async function handleSubmit() {
    if (!name.trim() || !status) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("rsvp").insert({
      wedding_id: weddingId,
      name: name.trim(),
      status,
    });
    if (err) {
      setError("Қате орын алды. Қайталап көріңіз.");
    } else {
      localStorage.setItem(STORAGE_KEY(weddingId), "1");
      setDone(true);
    }
    setLoading(false);
  }

  const sharedStyles = (
    <style>{`
      @keyframes rsvp-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      @keyframes rsvp-reveal { 0%{opacity:0; transform:translateY(28px) scale(0.97); filter:blur(3px);} 60%{filter:blur(0);} 100%{opacity:1; transform:translateY(0) scale(1); filter:blur(0);} }
      @keyframes rsvp-glow { 0%,100% { box-shadow: 0 4px 24px rgba(196,160,176,0.10);} 50% { box-shadow: 0 6px 32px rgba(196,160,176,0.20);} }
      .rsvp-glass-card {
        background: rgba(255,255,255,0.62);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(196,160,176,0.16), 0 1px 0 rgba(255,255,255,0.9) inset;
      }
    `}</style>
  );

  // ── Already submitted ──
  if (done) {
    return (
      <div className="mx-5 mt-8 mb-2">
        {sharedStyles}
        <div
          className="rsvp-glass-card"
          style={{
            padding: "36px 24px",
            border: `1px solid ${accentColor}22`,
            textAlign: "center",
            animation: "rsvp-reveal 0.8s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <div className="flex justify-center mb-3">
            <IcRingSmallRsvp color={accentColor} />
          </div>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 15,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Рахмет!
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              fontStyle: "italic",
              color: `${accentColor}99`,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Жауабыңыз қабылданды.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="mx-5 mt-8 mb-2">
      {sharedStyles}

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 22,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}45)`,
          }}
        />
        <MiniFloralRsvp color={accentColor} />
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: accentColor,
            fontWeight: 500,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          Қатысу туралы
        </p>
        <MiniFloralRsvp color={accentColor} />
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to left, transparent, ${accentColor}45)`,
          }}
        />
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="rsvp-glass-card relative overflow-hidden"
        style={{
          border: `1px solid ${accentColor}22`,
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? "translateY(0)" : "translateY(22px)",
          transition:
            "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="px-3 pt-2">
          <WaveDecorRsvp color={accentColor} />
        </div>

        <div className="p-5 pt-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IcUsersRsvp color={accentColor} />
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: `${accentColor}99`,
                margin: 0,
              }}
            >
              Атыңызды жазыңыз
            </p>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Сіздің атыңыз"
            style={{
              width: "100%",
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 16,
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.04em",
              color: "#3d2030",
              border: `1.5px solid ${accentColor}28`,
              background: "rgba(255,255,255,0.75)",
              outline: "none",
              marginBottom: 22,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = `${accentColor}80`;
              e.target.style.boxShadow = `0 0 0 3px ${accentColor}14`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${accentColor}28`;
              e.target.style.boxShadow = "none";
            }}
          />

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: `${accentColor}99`,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            Тойға қатысасыз ба?
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {OPTIONS.map((opt) => {
              const selected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderRadius: 16,
                    border: selected
                      ? `2px solid ${accentColor}`
                      : `1.5px solid ${accentColor}22`,
                    background: selected
                      ? `linear-gradient(135deg, ${accentColor}14, ${accentColor}08)`
                      : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    textAlign: "left",
                    boxShadow: selected
                      ? `0 4px 18px ${accentColor}20`
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: selected
                        ? `2px solid ${accentColor}`
                        : `2px solid ${accentColor}38`,
                      background: selected
                        ? `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {selected && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 13,
                        fontWeight: selected ? 600 : 400,
                        letterSpacing: "0.1em",
                        color: selected ? accentColor : `${accentColor}99`,
                        margin: 0,
                        transition: "color 0.2s",
                      }}
                    >
                      {opt.labelKz}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 13,
                        fontStyle: "italic",
                        color: `${accentColor}70`,
                        margin: 0,
                        marginTop: 1,
                      }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p
              style={{
                color: "#c0392b",
                fontFamily: "'Cinzel', serif",
                fontSize: 12,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !status}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 14,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              color: "#fff",
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              border: "none",
              cursor: !name.trim() || !status ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading || !name.trim() || !status ? 0.35 : 1,
              boxShadow: `0 4px 16px ${accentColor}30`,
              transition: "opacity 0.2s, box-shadow 0.2s",
            }}
          >
            {loading ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  style={{ animation: "rsvp-spin 1s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Жіберілуде...
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Жіберу
              </>
            )}
          </button>
        </div>

        <div className="px-3 pb-2">
          <WaveDecorRsvp color={accentColor} flip />
        </div>
      </div>
    </div>
  );
}
