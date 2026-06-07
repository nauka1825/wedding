"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type RSVPStatus = "attending" | "not_attending" | "maybe";

const OPTIONS: {
  value: RSVPStatus;
  labelKz: string;
  emoji: string;
  desc: string;
}[] = [
  {
    value: "attending",
    labelKz: "Келемін",
    emoji: "✅",
    desc: "Тойға қатысамын",
  },
  { value: "maybe", labelKz: "Мүмкін", emoji: "🤔", desc: "Әлі белгісіз" },
  {
    value: "not_attending",
    labelKz: "Келе алмаймын",
    emoji: "❌",
    desc: "Қатыса алмаймын",
  },
];

const STORAGE_KEY = (weddingId: string) => `rsvp_sent_${weddingId}`;

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

  // Fix hydration: localStorage only on client
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

  const sentOption = OPTIONS.find((o) => o.value === status);

  // ── Already submitted ──
  if (done) {
    return (
      <div className="mx-5 mt-8 mb-2">
        <div
          style={{
            borderRadius: 24,
            padding: "32px 24px",
            background: lightColor,
            border: `1px solid ${accentColor}20`,
            boxShadow: `0 4px 24px ${accentColor}10`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {sentOption?.emoji ?? "💌"}
          </div>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 15,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Рахмет!
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 17,
              fontStyle: "italic",
              color: `${accentColor}99`,
              lineHeight: 1.6,
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}40)`,
          }}
        />
        <div className="flex items-center gap-2">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 500,
              margin: 0,
            }}
          >
            Қатысу туралы
          </p>
        </div>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to left, transparent, ${accentColor}40)`,
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          borderRadius: 24,
          padding: "24px 20px",
          background: "rgba(255,255,255,0.97)",
          border: `1px solid ${accentColor}18`,
          boxShadow: `0 4px 20px ${accentColor}08`,
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: `${accentColor}99`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Атыңызды жазыңыз
        </p>

        {/* Name input */}
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
            border: `1.5px solid ${accentColor}25`,
            background: lightColor,
            outline: "none",
            marginBottom: 20,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${accentColor}70`)}
          onBlur={(e) => (e.target.style.borderColor = `${accentColor}25`)}
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

        {/* 3 options */}
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
                    : `1.5px solid ${accentColor}20`,
                  background: selected
                    ? `${accentColor}10`
                    : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  boxShadow: selected ? `0 2px 12px ${accentColor}18` : "none",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: selected
                      ? `2px solid ${accentColor}`
                      : `2px solid ${accentColor}35`,
                    background: selected ? accentColor : "transparent",
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
                <span style={{ fontSize: 22, lineHeight: 1 }}>{opt.emoji}</span>
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

        {/* Submit */}
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

      <style>{`
        @keyframes rsvp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
