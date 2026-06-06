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

export default function MessageSection({
  weddingId,
  accentColor = "#7B3F5E",
  lightColor = "#FDF6F0",
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

  return (
    <div className="mx-5 mt-10 mb-2">
      {/* ── Section header ── */}
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
            opacity="0.6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: accentColor,
              opacity: 1,
              fontWeight: 500,
              margin: 0,
            }}
          >
            Тілек қалдыру
          </p>
        </div>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to left, transparent, ${accentColor}40)`,
          }}
        />
      </div>

      {/* ── Message slider ── */}
      {top5.length > 0 && (
        <div className="mb-5">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{
              background: lightColor,
              borderColor: `${accentColor}18`,
              boxShadow: `0 4px 24px ${accentColor}0D`,
            }}
          >
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {top5.map((m) => (
                <div key={m.id} className="min-w-full px-6 py-5 text-center">
                  {/* Quote icon */}
                  <div className="flex justify-center mb-2">
                    <svg width="22" height="16" viewBox="0 0 40 28" fill="none">
                      <path
                        d="M0 28V16C0 9.333 2.667 4.333 8 1L11 4C8.667 5.333 7 7.333 6 10H12V28H0ZM22 28V16C22 9.333 24.667 4.333 30 1L33 4C30.667 5.333 29 7.333 28 10H34V28H22Z"
                        fill={accentColor}
                        opacity="0.15"
                      />
                    </svg>
                  </div>
                  {/* Message text */}
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 19,
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      color: accentColor,
                      opacity: 1,
                      marginBottom: 14,
                    }}
                  >
                    {m.message}
                  </p>
                  {/* Sender */}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-5 h-px"
                      style={{ background: accentColor, opacity: 1 }}
                    />
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: accentColor,
                        opacity: 1,
                        margin: 0,
                      }}
                    >
                      {m.sender_name}
                    </p>
                    <div
                      className="w-5 h-px"
                      style={{ background: accentColor, opacity: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {top5.length > 1 && (
              <div className="flex justify-center gap-1.5 pb-3">
                {top5.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? 18 : 5,
                      height: 5,
                      background: accentColor,
                      opacity: currentSlide === i ? 0.8 : 0.2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Write form ── */}
      <div
        className="rounded-2xl p-5 border space-y-3"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(14px)",
          borderColor: `${accentColor}18`,
          boxShadow: `0 4px 20px ${accentColor}08`,
        }}
      >
        {/* Form label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            opacity="0.55"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: accentColor,
              opacity: 1,
              margin: 0,
            }}
          >
            Тілегіңізді жазыңыз
          </p>
        </div>

        {/* Name input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Сіздің атыңыз"
          style={{
            width: "100%",
            borderRadius: 14,
            padding: "11px 16px",
            fontSize: 16,
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.04em",
            color: "#3d3020",
            border: `1px solid ${accentColor}25`,
            background: "rgba(255,255,255,0.85)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
          onBlur={(e) => (e.target.style.borderColor = `${accentColor}25`)}
        />

        {/* Message textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Жас жұпқа жылы тілектеріңізді жазыңыз..."
          rows={3}
          style={{
            width: "100%",
            borderRadius: 14,
            padding: "11px 16px",
            fontSize: 17,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            lineHeight: 1.65,
            color: "#3d3020",
            border: `1px solid ${accentColor}25`,
            background: "rgba(255,255,255,0.85)",
            outline: "none",
            resize: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
          onBlur={(e) => (e.target.style.borderColor = `${accentColor}25`)}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !text.trim()}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            color: "#fff",
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: loading || !name.trim() || !text.trim() ? 0.35 : 1,
            transition: "opacity 0.2s, transform 0.1s",
          }}
        >
          {sent ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Жіберілді!
            </>
          ) : loading ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                style={{ animation: "msg-spin 1s linear infinite" }}
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

      {/* ── All messages toggle ── */}
      {messages.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 14,
              border: `1px solid ${accentColor}28`,
              color: accentColor,
              background: "rgba(255,255,255,0.9)",
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              style={{
                transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {showAll ? "Жасыру" : `Барлық тілектер (${messages.length})`}
          </button>

          {showAll && (
            <div className="mt-3 space-y-2">
              {messages.map((m, idx) => (
                <div
                  key={m.id}
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: `1px solid ${accentColor}15`,
                    background: "rgba(255,255,255,0.97)",
                    animation: `msg-fadeIn 0.4s ease ${idx * 40}ms both`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: `${accentColor}15`,
                          color: accentColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Cinzel', serif",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {m.sender_name.charAt(0).toUpperCase()}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: 12,
                          letterSpacing: "0.1em",
                          fontWeight: 600,
                          color: accentColor,
                          margin: 0,
                        }}
                      >
                        {m.sender_name}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        color: accentColor,
                        margin: 0,
                      }}
                    >
                      {new Date(m.created_at).toLocaleDateString("kk-KZ", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 17,
                      lineHeight: 1.65,
                      fontStyle: "italic",
                      color: accentColor,
                      margin: 0,
                    }}
                  >
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes msg-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes msg-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
