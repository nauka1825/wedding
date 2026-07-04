"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  wedding_id: string;
  sender_name: string;
  message: string;
  created_at: string;
};

const HEADLINE = "'Playfair Display', Georgia, serif";
const BODY = "'Montserrat', sans-serif";

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

/* Material Symbols icon helper — same pattern used across the site */
function Icon({
  name,
  size = 18,
  filled = false,
  color,
  style = {},
}: {
  name: string;
  size?: number;
  filled?: boolean;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        lineHeight: 1,
        color,
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
        ...style,
      }}
    >
      {name}
    </span>
  );
}

function GlobalFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 300,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
    `}</style>
  );
}

export default function MessageSection({
  weddingId,
  accentColor = "#602846",
  lightColor = "#fdf6f0",
  borderColor = "border-rose-100",
}: {
  weddingId: string;
  accentColor?: string;
  lightColor?: string;
  borderColor?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: headerRef, visible: headerVisible } = useInView(0.3);
  const { ref: sliderWrapRef, visible: sliderVisible } = useInView(0.2);
  const { ref: formRef, visible: formVisible } = useInView(0.15);

  useEffect(() => {
    fetchMessages();
  }, [weddingId]);

  useEffect(() => {
    if (messages.length <= 1) return;
    sliderRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(messages.length, 5));
    }, 3200);
    return () => {
      if (sliderRef.current) clearInterval(sliderRef.current);
    };
  }, [messages]);

  async function fetchMessages() {
    const { data } = await supabase
      .from("wedding_messages")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  }

  async function handleSubmit() {
    if (!name.trim() || !text.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("wedding_messages").insert({
      wedding_id: weddingId,
      sender_name: name.trim(),
      message: text.trim(),
    });
    if (!error) {
      setName("");
      setText("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      await fetchMessages();
      setCurrentSlide(0);
    }
    setLoading(false);
  }

  const top5 = messages.slice(0, 5);
  const disabled = loading || !name.trim() || !text.trim();

  return (
    <div style={{ position: "relative", fontFamily: BODY }}>
      <GlobalFonts />

      {/* ── Section eyebrow ── */}
      <div
        ref={headerRef}
        className="flex items-center justify-center gap-3 mb-7"
        style={{
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
        <Icon
          name="favorite"
          size={16}
          filled
          color={accentColor}
          style={{ opacity: 0.55 }}
        />
        <p
          style={{
            fontFamily: BODY,
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: accentColor,
            fontWeight: 600,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          Тілек қалдыру
        </p>
        <Icon
          name="favorite"
          size={16}
          filled
          color={accentColor}
          style={{ opacity: 0.55 }}
        />
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to left, transparent, ${accentColor}45)`,
          }}
        />
      </div>

      {/* ── Quote slider ── */}
      {top5.length > 0 && (
        <div
          ref={sliderWrapRef}
          className="mb-7"
          style={{
            opacity: sliderVisible ? 1 : 0,
            transform: sliderVisible
              ? "translateY(0) scale(1)"
              : "translateY(18px) scale(0.98)",
            transition:
              "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              background: `${lightColor}99`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${accentColor}22`,
              borderRadius: 20,
              boxShadow: `0 10px 32px ${accentColor}1f`,
              padding: "32px 8px 16px",
            }}
          >
            <div
              className="absolute top-0 right-0 p-4"
              style={{ opacity: 0.1 }}
            >
              <Icon name="format_quote" size={56} color={accentColor} />
            </div>

            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {top5.map((m) => (
                <div key={m.id} className="min-w-full px-7 text-center">
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontStyle: "italic",
                      fontSize: 21,
                      lineHeight: 1.65,
                      color: accentColor,
                      marginBottom: 16,
                      wordBreak: "break-word",
                    }}
                  >
                    “{m.message}”
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="h-px w-6"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accentColor})`,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: BODY,
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: accentColor,
                        margin: 0,
                      }}
                    >
                      {m.sender_name}
                    </p>
                    <div
                      className="h-px w-6"
                      style={{
                        background: `linear-gradient(to left, transparent, ${accentColor})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {top5.length > 1 && (
              <div className="flex justify-center gap-1.5 pt-6">
                {top5.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Тілек ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? 18 : 6,
                      height: 6,
                      background: accentColor,
                      opacity: currentSlide === i ? 0.9 : 0.22,
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Write form — underline inputs, matching the site's premium form style ── */}
      <div
        ref={formRef}
        style={{
          background: `${lightColor}80`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${accentColor}22`,
          borderRadius: 20,
          padding: 28,
          opacity: formVisible ? 1 : 0,
          transform: formVisible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Icon name="edit_note" size={18} color={accentColor} />
          <p
            style={{
              fontFamily: BODY,
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: accentColor,
              margin: 0,
            }}
          >
            Тілегіңізді жазыңыз
          </p>
        </div>

        <div className="space-y-7">
          <div className="relative group">
            <label
              style={{
                fontFamily: BODY,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: `${accentColor}99`,
                display: "block",
                marginBottom: 4,
              }}
            >
              Есіміңіз
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Сіздің есіміңіз..."
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${accentColor}30`,
                padding: "8px 0",
                fontFamily: BODY,
                fontSize: 15,
                color: "#1e1b18",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = accentColor)}
              onBlur={(e) =>
                (e.target.style.borderBottomColor = `${accentColor}30`)
              }
            />
          </div>

          <div className="relative group">
            <label
              style={{
                fontFamily: BODY,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: `${accentColor}99`,
                display: "block",
                marginBottom: 4,
              }}
            >
              Тілегіңіз
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Жас жұпқа жылы тілектеріңізді жазыңыз..."
              rows={3}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${accentColor}30`,
                padding: "8px 0",
                fontFamily: HEADLINE,
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#1e1b18",
                outline: "none",
                resize: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = accentColor)}
              onBlur={(e) =>
                (e.target.style.borderBottomColor = `${accentColor}30`)
              }
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            marginTop: 24,
            padding: "14px 0",
            borderRadius: 999,
            background: accentColor,
            color: "#fff",
            fontFamily: BODY,
            fontSize: 12,
            letterSpacing: "0.2em",
            fontWeight: 600,
            textTransform: "uppercase",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : 1,
            boxShadow: `0 10px 25px -8px ${accentColor}88`,
          }}
        >
          {sent ? (
            <>
              <Icon name="check_circle" size={16} filled color="#fff" />
              Жіберілді!
            </>
          ) : loading ? (
            <>
              <Icon
                name="progress_activity"
                size={16}
                color="#fff"
                style={{ animation: "msg-spin-t1 1s linear infinite" }}
              />
              Жіберілуде...
            </>
          ) : (
            <>
              <Icon name="send" size={16} color="#fff" />
              Жіберу
            </>
          )}
        </button>
      </div>

      {/* ── All messages toggle + feed ── */}
      {messages.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-70 group"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: accentColor,
              fontFamily: BODY,
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span
              className="h-px w-6"
              style={{ background: `${accentColor}50` }}
            />
            {showAll ? "Жасыру" : `Барлық тілектерді көру (${messages.length})`}
            <span
              className="h-px w-6"
              style={{ background: `${accentColor}50` }}
            />
          </button>

          {showAll && (
            <div className="mt-5 space-y-4 text-left">
              {messages.map((m, idx) => (
                <div
                  key={m.id}
                  style={{
                    background: `${lightColor}80`,
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: `1px solid ${accentColor}18`,
                    borderRadius: 18,
                    padding: "18px 20px",
                    animation: `msg-fadeIn-t1 0.45s ease ${idx * 45}ms both`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: `${accentColor}18`,
                        color: accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: HEADLINE,
                        fontWeight: 700,
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {m.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontFamily: BODY,
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: accentColor,
                          margin: 0,
                        }}
                      >
                        {m.sender_name}
                      </p>
                      <p
                        style={{
                          fontFamily: BODY,
                          fontSize: 10.5,
                          color: `${accentColor}80`,
                          margin: 0,
                        }}
                      >
                        {new Date(m.created_at).toLocaleDateString("kk-KZ", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontStyle: "italic",
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: "#3d3438",
                      margin: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    “{m.message}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes msg-fadeIn-t1 { from { opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes msg-spin-t1 { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      `}</style>
    </div>
  );
}
