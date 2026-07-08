"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type RSVPStatus = "attending" | "not_attending" | "maybe";
type Lang = "kk" | "mn";

const STORAGE_KEY = (weddingId: string) => `rsvp_sent_${weddingId}`;

const HEADLINE = "'Playfair Display', Georgia, serif";
const BODY = "'Montserrat', sans-serif";

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian)
   ====================================================================== */
interface RsvpTranslationSet {
  options: { value: RSVPStatus; label: string; desc: string }[];
  writeYourName: string;
  namePlaceholder: string;
  attendingQuestion: string;
  errorMsg: string;
  thanks: string;
  received: string;
  sending: string;
  send: string;
}

const RSVP_TRANSLATIONS: Record<Lang, RsvpTranslationSet> = {
  kk: {
    options: [
      { value: "attending", label: "Келемін", desc: "Тойға қатысамын" },
      { value: "maybe", label: "Мүмкін", desc: "Әлі белгісіз" },
      {
        value: "not_attending",
        label: "Келе алмаймын",
        desc: "Қатыса алмаймын",
      },
    ],
    writeYourName: "Атыңызды жазыңыз",
    namePlaceholder: "Сіздің атыңыз",
    attendingQuestion: "Тойға қатысасыз ба?",
    errorMsg: "Қате орын алды. Қайталап көріңіз.",
    thanks: "Рахмет!",
    received: "Жауабыңыз қабылданды.",
    sending: "Жіберілуде...",
    send: "Жіберу",
  },
  mn: {
    options: [
      { value: "attending", label: "Ирнэ", desc: "Хуримд оролцоно" },
      { value: "maybe", label: "Магадгүй", desc: "Одоохондоо тодорхойгүй" },
      { value: "not_attending", label: "Ирэхгүй", desc: "Оролцох боломжгүй" },
    ],
    writeYourName: "Нэрээ бичнэ үү",
    namePlaceholder: "Таны нэр",
    attendingQuestion: "Хуримд ирэх үү?",
    errorMsg: "Алдаа гарлаа. Дахин оролдоно уу.",
    thanks: "Баярлалаа!",
    received: "Таны хариулт хүлээн авлаа.",
    sending: "Илгээж байна...",
    send: "Илгээх",
  },
};

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

const IcUsersRsvp = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IcRingSmallRsvp = ({ color }: { color: string }) => (
  <svg width="34" height="34" viewBox="0 0 60 60" fill="none">
    <defs>
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
      stroke={color}
      strokeWidth="1.6"
      opacity="0.7"
    />
    <line
      x1="30"
      y1="25"
      x2="30"
      y2="19"
      stroke={color}
      strokeWidth="1"
      opacity="0.7"
    />
    <polygon
      points="30,10 24.5,17.5 30,25 35.5,17.5"
      fill="url(#rsvp-gem-g)"
      stroke={color}
      strokeWidth="1"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

export default function RSVPSection({
  weddingId,
  accentColor = "#7B3F5E",
  lightColor = "#FDF6F0",
  lang = "kk",
}: {
  weddingId: string;
  accentColor?: string;
  lightColor?: string;
  lang?: Lang;
}) {
  const t = RSVP_TRANSLATIONS[lang];

  const [name, setName] = useState("");
  const [status, setStatus] = useState<RSVPStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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
      setError(t.errorMsg);
    } else {
      localStorage.setItem(STORAGE_KEY(weddingId), "1");
      setDone(true);
    }
    setLoading(false);
  }

  const sharedStyles = (
    <style>{`
      @keyframes rsvp-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      @keyframes rsvp-reveal { 0%{opacity:0; transform:translateY(20px);} 100%{opacity:1; transform:translateY(0);} }
    `}</style>
  );

  // ── Already sent ──
  if (done) {
    return (
      <div
        style={{ textAlign: "center", animation: "rsvp-reveal 0.7s ease both" }}
      >
        {sharedStyles}
        <div className="flex justify-center mb-3">
          <IcRingSmallRsvp color={accentColor} />
        </div>
        <p
          style={{
            fontFamily: HEADLINE,
            fontWeight: 600,
            fontSize: 20,
            color: accentColor,
            marginBottom: 6,
          }}
        >
          {t.thanks}
        </p>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 14,
            color: `${accentColor}99`,
            margin: 0,
          }}
        >
          {t.received}
        </p>
      </div>
    );
  }

  // ── Form ──
  return (
    <div
      ref={cardRef}
      style={{
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {sharedStyles}

      <div className="flex items-center justify-center gap-2 mb-4">
        <IcUsersRsvp color={accentColor} />
        <p
          style={{
            fontFamily: BODY,
            fontSize: 12,
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: accentColor,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {t.writeYourName}
        </p>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.namePlaceholder}
        style={{
          width: "100%",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 15,
          fontFamily: BODY,
          color: "#1e1b18",
          border: `1.5px solid ${accentColor}30`,
          background: "rgba(255,255,255,0.8)",
          outline: "none",
          marginBottom: 20,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = `${accentColor}80`;
          e.target.style.boxShadow = `0 0 0 3px ${accentColor}14`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = `${accentColor}30`;
          e.target.style.boxShadow = "none";
        }}
      />

      <p
        style={{
          fontFamily: BODY,
          fontSize: 12,
          letterSpacing: "0.15em",
          fontWeight: 600,
          color: accentColor,
          textAlign: "center",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        {t.attendingQuestion}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {t.options.map((opt) => {
          const selected = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                border: selected
                  ? `2px solid ${accentColor}`
                  : `1.5px solid ${accentColor}25`,
                background: selected
                  ? `linear-gradient(135deg, ${accentColor}14, ${accentColor}08)`
                  : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: selected
                    ? `2px solid ${accentColor}`
                    : `2px solid ${accentColor}38`,
                  background: selected ? accentColor : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {selected && (
                  <svg
                    width="9"
                    height="9"
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
                    fontFamily: BODY,
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? accentColor : "#1e1b18",
                    margin: 0,
                  }}
                >
                  {opt.label}
                </p>
                <p
                  style={{
                    fontFamily: BODY,
                    fontSize: 12,
                    color: `${accentColor}80`,
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
            fontFamily: BODY,
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
          padding: "13px 0",
          borderRadius: 999,
          background: accentColor,
          color: "#fff",
          fontFamily: BODY,
          fontSize: 12,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
          border: "none",
          cursor: !name.trim() || !status ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: loading || !name.trim() || !status ? 0.4 : 1,
          boxShadow: `0 8px 20px ${accentColor}30`,
          transition: "opacity 0.2s",
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
            {t.sending}
          </>
        ) : (
          t.send
        )}
      </button>
    </div>
  );
}
