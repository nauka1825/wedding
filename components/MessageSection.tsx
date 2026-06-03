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

  const inputBase =
    "w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all font-[Josefin_Sans,sans-serif] placeholder:text-slate-300 text-slate-700";

  return (
    <div className="mx-5 mt-10 mb-2">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-7">
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}40)`,
          }}
        />
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            opacity="0.6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p
            className="text-[10px] font-[Josefin_Sans,sans-serif] tracking-[0.38em] uppercase"
            style={{ color: accentColor, opacity: 0.65 }}
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

      {/* Message slider */}
      {top5.length > 0 && (
        <div className="mb-6">
          <div
            className="relative overflow-hidden rounded-3xl border"
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
                <div key={m.id} className="min-w-full px-7 py-6 text-center">
                  {/* Big quote */}
                  <div className="flex justify-center mb-1">
                    <svg width="28" height="20" viewBox="0 0 40 28" fill="none">
                      <path
                        d="M0 28V16C0 9.333 2.667 4.333 8 1L11 4C8.667 5.333 7 7.333 6 10H12V28H0ZM22 28V16C22 9.333 24.667 4.333 30 1L33 4C30.667 5.333 29 7.333 28 10H34V28H22Z"
                        fill={accentColor}
                        opacity="0.15"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-[15px] leading-relaxed italic mb-4 font-[Cormorant_Garamond,serif]"
                    style={{ color: accentColor, opacity: 0.85 }}
                  >
                    {m.message}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-6 h-px rounded-full"
                      style={{ background: accentColor, opacity: 0.25 }}
                    />
                    <p
                      className="text-[10px] font-[Josefin_Sans,sans-serif] tracking-[0.3em] uppercase"
                      style={{ color: accentColor, opacity: 0.55 }}
                    >
                      {m.sender_name}
                    </p>
                    <div
                      className="w-6 h-px rounded-full"
                      style={{ background: accentColor, opacity: 0.25 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {top5.length > 1 && (
              <div className="flex justify-center gap-1.5 pb-4">
                {top5.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? 20 : 6,
                      height: 6,
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

      {/* Write form */}
      <div
        className="rounded-3xl p-5 border space-y-3"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(14px)",
          borderColor: `${accentColor}18`,
          boxShadow: `0 4px 20px ${accentColor}08`,
        }}
      >
        {/* Form header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            opacity="0.55"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <p
            className="text-[10px] font-[Josefin_Sans,sans-serif] tracking-[0.35em] uppercase"
            style={{ color: accentColor, opacity: 0.65 }}
          >
            Тілегіңізді жазыңыз
          </p>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Сіздің атыңыз"
          className={inputBase}
          style={{
            border: `1px solid ${accentColor}25`,
            background: "rgba(255,255,255,0.80)",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
          onBlur={(e) => (e.target.style.borderColor = `${accentColor}25`)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Жас жұпқа жылы тілектеріңізді жазыңыз..."
          rows={3}
          className={
            inputBase +
            " resize-none leading-relaxed font-[Cormorant_Garamond,serif] text-base"
          }
          style={{
            border: `1px solid ${accentColor}25`,
            background: "rgba(255,255,255,0.80)",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${accentColor}60`)}
          onBlur={(e) => (e.target.style.borderColor = `${accentColor}25`)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !text.trim()}
          className="w-full py-3.5 rounded-2xl text-white text-[11px] font-[Josefin_Sans,sans-serif] tracking-[0.3em] uppercase transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-35 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
          }}
        >
          {sent ? (
            <>
              <svg
                width="14"
                height="14"
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
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Жіберілуде...
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
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

      {/* All messages toggle */}
      {messages.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 rounded-2xl text-[10px] font-[Josefin_Sans,sans-serif] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-2 hover:opacity-80 active:scale-[0.98]"
            style={{
              border: `1px solid ${accentColor}28`,
              color: accentColor,
              background: "rgba(255,255,255,0.45)",
            }}
          >
            <svg
              width="12"
              height="12"
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
            <div className="mt-3 space-y-2.5">
              {messages.map((m, idx) => (
                <div
                  key={m.id}
                  className="rounded-2xl px-4 py-4 border transition-all"
                  style={{
                    background: "rgba(255,255,255,0.58)",
                    borderColor: `${accentColor}15`,
                    animation: `fadeSlideIn 0.4s ease ${idx * 40}ms both`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                        style={{
                          background: `${accentColor}15`,
                          color: accentColor,
                        }}
                      >
                        {m.sender_name.charAt(0).toUpperCase()}
                      </div>
                      <p
                        className="text-[11px] font-[Josefin_Sans,sans-serif] tracking-wide font-semibold"
                        style={{ color: accentColor }}
                      >
                        {m.sender_name}
                      </p>
                    </div>
                    <p
                      className="text-[10px] font-[Josefin_Sans,sans-serif]"
                      style={{ color: `${accentColor}60` }}
                    >
                      {new Date(m.created_at).toLocaleDateString("kk-KZ", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <p
                    className="text-[14px] leading-relaxed font-[Cormorant_Garamond,serif] italic"
                    style={{ color: `${accentColor}CC` }}
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
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
