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

const HEADLINE = "'Playfair Display', Georgia, serif";
const BODY = "'Montserrat', sans-serif";

const AVATAR_PALETTE_ALPHA = ["28", "1f", "24", "1a", "2c"]; // subtle variety for avatar bg

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

/* ── shared reveal-on-scroll hook, now with a safety fallback ──
   If the IntersectionObserver never fires (e.g. rendered inside an
   iframe/preview container with no real scrolling), we force the
   content visible after a short delay instead of leaving it hidden
   forever. */
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

    // Fallback: some hosting contexts (preview iframes, scaled
    // thumbnails, non-scrolling wrappers) never fire the observer.
    // Don't let content stay invisible forever because of that.
    const fallback = setTimeout(markVisible, fallbackMs);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
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
          {t.leaveWish}
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
              background: `linear-gradient(160deg, ${lightColor}c9, ${lightColor}88)`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${accentColor}22`,
              borderRadius: 22,
              boxShadow: `0 14px 36px ${accentColor}22, inset 0 1px 0 #ffffff55`,
              padding: "34px 8px 18px",
            }}
          >
            <div
              className="absolute top-0 right-0 p-4"
              style={{ opacity: 0.1 }}
            >
              <Icon name="format_quote" size={56} color={accentColor} />
            </div>

            {/* message counter badge */}
            <div
              className="absolute top-3 left-4 flex items-center gap-1.5"
              style={{
                fontFamily: BODY,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: `${accentColor}90`,
              }}
            >
              <Icon
                name="favorite"
                size={11}
                filled
                color={`${accentColor}80`}
              />
              {messages.length}
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
                    aria-label={t.wishAriaLabel(i + 1)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? 20 : 6,
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

      {/* ── Empty state (no messages yet) ── */}
      {top5.length === 0 && !fetchError && (
        <div
          className="mb-7 text-center"
          style={{
            padding: "26px 20px",
            borderRadius: 20,
            border: `1px dashed ${accentColor}35`,
            background: `${lightColor}60`,
          }}
        >
          <Icon
            name="favorite_border"
            size={22}
            color={accentColor}
            style={{ opacity: 0.6 }}
          />
          <p
            style={{
              fontFamily: HEADLINE,
              fontStyle: "italic",
              fontSize: 15,
              color: `${accentColor}b0`,
              marginTop: 8,
            }}
          >
            {t.emptyState}
          </p>
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
            {t.writeYourWish}
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
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 4 }}
            >
              <label
                style={{
                  fontFamily: BODY,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: `${accentColor}99`,
                }}
              >
                {t.wishLabel}
              </label>
              <span
                style={{
                  fontFamily: BODY,
                  fontSize: 10,
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
              {t.sent}
            </>
          ) : loading ? (
            <>
              <Icon
                name="progress_activity"
                size={16}
                color="#fff"
                style={{ animation: "msg-spin-t1 1s linear infinite" }}
              />
              {t.sending}
            </>
          ) : (
            <>
              <Icon name="send" size={16} color="#fff" />
              {t.send}
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
            {showAll ? t.hide : t.viewAll(messages.length)}
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
                        background: `${accentColor}${avatarShade(m.sender_name)}`,
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
