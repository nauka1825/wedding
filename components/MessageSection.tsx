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

type Lang = "kk" | "mn";

/* Template2-той ижил фонт стек */
const HEADLINE = "'Playfair Display', serif";
const BODY = "'EB Garamond', serif";
const LABEL = "'Montserrat', sans-serif";

const AVATAR_PALETTE_ALPHA = ["28", "1f", "24", "1a", "2c"];

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian)
   ====================================================================== */
interface MessageTranslationSet {
  leaveWish: string;
  wishAriaLabel: (n: number) => string;
  emptyState: string;
  writeYourWish: string;
  nameLabel: string;
  namePlaceholder: string;
  wishLabel: string;
  wishPlaceholder: string;
  sent: string;
  sending: string;
  send: string;
  hide: string;
  viewAll: (n: number) => string;
  dateLocale: string;
}

const MESSAGE_TRANSLATIONS: Record<Lang, MessageTranslationSet> = {
  kk: {
    leaveWish: "Тілек қалдыру",
    wishAriaLabel: (n) => `Тілек ${n}`,
    emptyState: "Алғашқы тілекті сіз қалдырыңыз",
    writeYourWish: "Тілегіңізді жазыңыз",
    nameLabel: "Есіміңіз",
    namePlaceholder: "Сіздің есіміңіз...",
    wishLabel: "Тілегіңіз",
    wishPlaceholder: "Жас жұпқа жылы тілектеріңізді жазыңыз...",
    sent: "Жіберілді!",
    sending: "Жіберілуде...",
    send: "Жіберу",
    hide: "Жасыру",
    viewAll: (n) => `Барлық тілектерді көру (${n})`,
    dateLocale: "kk-KZ",
  },
  mn: {
    leaveWish: "Ерөөл үлдээх",
    wishAriaLabel: (n) => `Ерөөл ${n}`,
    emptyState: "Анхны ерөөлийг та үлдээгээрэй",
    writeYourWish: "Ерөөлөө бичнэ үү",
    nameLabel: "Нэр",
    namePlaceholder: "Таны нэр...",
    wishLabel: "Таны ерөөл",
    wishPlaceholder: "Залуу гэр бүлд дулаан ерөөл хүсэлтээ бичнэ үү...",
    sent: "Илгээгдлээ!",
    sending: "Илгээж байна...",
    send: "Илгээх",
    hide: "Нуух",
    viewAll: (n) => `Бүх ерөөлийг харах (${n})`,
    dateLocale: "mn-MN",
  },
};

/* ── shared reveal-on-scroll hook, with a safety fallback ── */
function useInView(threshold = 0.15, fallbackMs = 900) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settled = false;
    const markVisible = () => {
      if (settled) return;
      settled = true;
      setVisible(true);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markVisible();
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);

    const fallback = setTimeout(markVisible, fallbackMs);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);
  return { ref, visible };
}

/* Material Symbols icon helper */
function Icon({
  name,
  size = 15,
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
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@400;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
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
  lang = "kk",
}: {
  weddingId: string;
  accentColor?: string;
  lightColor?: string;
  borderColor?: string;
  lang?: Lang;
}) {
  const t = MESSAGE_TRANSLATIONS[lang];

  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fetchError, setFetchError] = useState(false);
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
    }, 3800);
    return () => {
      if (sliderRef.current) clearInterval(sliderRef.current);
    };
  }, [messages]);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("wedding_messages")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("wedding_messages fetch error:", error);
      setFetchError(true);
      return;
    }
    setFetchError(false);
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
    } else {
      console.error("wedding_messages insert error:", error);
    }
    setLoading(false);
  }

  const top5 = messages.slice(0, 5);
  const disabled = loading || !name.trim() || !text.trim();

  function avatarShade(nameStr: string) {
    let h = 0;
    for (let i = 0; i < nameStr.length; i++)
      h = (h * 31 + nameStr.charCodeAt(i)) % AVATAR_PALETTE_ALPHA.length;
    return AVATAR_PALETTE_ALPHA[h];
  }

  return (
    <div style={{ position: "relative", fontFamily: BODY }}>
      <GlobalFonts />

      {/* ── Section eyebrow — Template2 F_LABEL_CAPS хэмжээтэй ── */}
      <div
        ref={headerRef}
        className="flex items-center justify-center gap-2 mb-5"
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
          size={13}
          filled
          color={accentColor}
          style={{ opacity: 0.55 }}
        />
        <p
          style={{
            fontFamily: LABEL,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accentColor,
            fontWeight: 600,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {t.leaveWish}
        </p>
        <Icon
          name="favorite"
          size={13}
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
          className="mb-5"
          style={{
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
              background: "rgba(255, 248, 245, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `0.5px solid ${accentColor}4d`,
              padding: "24px 8px 14px",
            }}
          >
            <div
              className="absolute top-0 right-0 p-3"
              style={{ opacity: 0.1 }}
            >
              <Icon name="format_quote" size={40} color={accentColor} />
            </div>

            {/* message counter badge */}
            <div
              className="absolute top-2.5 left-3 flex items-center gap-1.5"
              style={{
                fontFamily: LABEL,
                fontSize: 9,
                letterSpacing: "0.12em",
                color: `${accentColor}90`,
              }}
            >
              <Icon
                name="favorite"
                size={10}
                filled
                color={`${accentColor}80`}
              />
              {messages.length}
            </div>

            {/* Slide track — fixed height so short/long wishes don't
                make the card jump; each slide vertically centers its
                own content inside that fixed box. */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                height: 150,
              }}
            >
              {top5.map((m) => (
                <div
                  key={m.id}
                  className="min-w-full px-6 text-center flex flex-col items-center justify-center"
                  style={{ height: "100%" }}
                >
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontStyle: "italic",
                      fontSize: 17,
                      lineHeight: 1.6,
                      color: accentColor,
                      marginBottom: 12,
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    "{m.message}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="h-px w-5"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accentColor})`,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: LABEL,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: accentColor,
                        margin: 0,
                      }}
                    >
                      {m.sender_name}
                    </p>
                    <div
                      className="h-px w-5"
                      style={{
                        background: `linear-gradient(to left, transparent, ${accentColor})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {top5.length > 1 && (
              <div className="flex justify-center gap-1.5 pt-4">
                {top5.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={t.wishAriaLabel(i + 1)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? 16 : 5,
                      height: 5,
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

      {/* ── Empty state (no messages yet) ── */}
      {top5.length === 0 && !fetchError && (
        <div
          className="mb-5 text-center"
          style={{
            padding: "20px 16px",
            border: `1px dashed ${accentColor}35`,
            background: `${lightColor}60`,
          }}
        >
          <Icon
            name="favorite_border"
            size={18}
            color={accentColor}
            style={{ opacity: 0.6 }}
          />
          <p
            style={{
              fontFamily: HEADLINE,
              fontStyle: "italic",
              fontSize: 14,
              color: `${accentColor}b0`,
              marginTop: 6,
            }}
          >
            {t.emptyState}
          </p>
        </div>
      )}

      {/* ── Write form — Template2 GlassCard хэмжээтэй ── */}
      <div
        ref={formRef}
        style={{
          background: "rgba(255, 248, 245, 0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `0.5px solid ${accentColor}4d`,
          padding: 24,
          opacity: formVisible ? 1 : 0,
          transform: formVisible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-5">
          <Icon name="edit_note" size={15} color={accentColor} />
          <p
            style={{
              fontFamily: LABEL,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: accentColor,
              margin: 0,
            }}
          >
            {t.writeYourWish}
          </p>
        </div>

        <div className="space-y-5">
          <div className="relative group">
            <label
              style={{
                fontFamily: LABEL,
                fontSize: 9.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: `${accentColor}99`,
                display: "block",
                marginBottom: 4,
              }}
            >
              {t.nameLabel}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${accentColor}30`,
                padding: "7px 0",
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
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 4 }}
            >
              <label
                style={{
                  fontFamily: LABEL,
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: `${accentColor}99`,
                }}
              >
                {t.wishLabel}
              </label>
              <span
                style={{
                  fontFamily: LABEL,
                  fontSize: 9.5,
                  color: `${accentColor}60`,
                }}
              >
                {text.length}/500
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              placeholder={t.wishPlaceholder}
              rows={3}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${accentColor}30`,
                padding: "7px 0",
                fontFamily: HEADLINE,
                fontStyle: "italic",
                fontSize: 15,
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
            marginTop: 20,
            padding: "12px 0",
            borderRadius: 999,
            background: accentColor,
            color: "#fff",
            fontFamily: LABEL,
            fontSize: 11,
            letterSpacing: "0.2em",
            fontWeight: 600,
            textTransform: "uppercase",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : 1,
            boxShadow: `0 10px 25px -8px ${accentColor}66`,
          }}
        >
          {sent ? (
            <>
              <Icon name="check_circle" size={14} filled color="#fff" />
              {t.sent}
            </>
          ) : loading ? (
            <>
              <Icon
                name="progress_activity"
                size={14}
                color="#fff"
                style={{ animation: "msg-spin-t1 1s linear infinite" }}
              />
              {t.sending}
            </>
          ) : (
            <>
              <Icon name="send" size={14} color="#fff" />
              {t.send}
            </>
          )}
        </button>
      </div>

      {/* ── All messages toggle + feed ── */}
      {messages.length > 0 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-70 group"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: accentColor,
              fontFamily: LABEL,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span
              className="h-px w-5"
              style={{ background: `${accentColor}50` }}
            />
            {showAll ? t.hide : t.viewAll(messages.length)}
            <span
              className="h-px w-5"
              style={{ background: `${accentColor}50` }}
            />
          </button>

          {showAll && (
            <div className="mt-4 space-y-3 text-left">
              {messages.map((m, idx) => (
                <div
                  key={m.id}
                  style={{
                    background: "rgba(255, 248, 245, 0.85)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: `0.5px solid ${accentColor}33`,
                    padding: "16px 18px",
                    animation: `msg-fadeIn-t1 0.45s ease ${idx * 45}ms both`,
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: `${accentColor}${avatarShade(m.sender_name)}`,
                        color: accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: HEADLINE,
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {m.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontFamily: LABEL,
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          color: accentColor,
                          margin: 0,
                        }}
                      >
                        {m.sender_name}
                      </p>
                      <p
                        style={{
                          fontFamily: LABEL,
                          fontSize: 10,
                          color: `${accentColor}80`,
                          margin: 0,
                        }}
                      >
                        {new Date(m.created_at).toLocaleDateString(
                          t.dateLocale,
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontStyle: "italic",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "#3d3438",
                      margin: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    "{m.message}"
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
