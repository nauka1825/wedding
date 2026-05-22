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
  const [showAll, setShowAll] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [weddingId]);

  // Auto swipe
  useEffect(() => {
    if (messages.length <= 1) return;
    sliderRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(messages.length, 5));
    }, 3000);
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
      await fetchMessages();
      setCurrentSlide(0);
    }
    setLoading(false);
  }

  const top5 = messages.slice(0, 5);

  return (
    <div className="mx-5 mt-10 mb-2">
      {/* Section title */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div
          className="h-px flex-1 opacity-30"
          style={{ background: accentColor }}
        />
        <p
          className="text-xs font-[Josefin_Sans,sans-serif] tracking-[0.3em] uppercase opacity-60"
          style={{ color: accentColor }}
        >
          Сэтгэгдэл үлдээх
        </p>
        <div
          className="h-px flex-1 opacity-30"
          style={{ background: accentColor }}
        />
      </div>

      {/* Swiper — top 5 messages */}
      {top5.length > 0 && (
        <div className="mb-6">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ background: lightColor }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {top5.map((m, i) => (
                <div key={m.id} className="min-w-full px-6 py-5 text-center">
                  <p
                    className="text-2xl mb-3 opacity-30"
                    style={{ color: accentColor }}
                  >
                    "
                  </p>
                  <p
                    className="text-sm leading-relaxed italic mb-4"
                    style={{ color: accentColor }}
                  >
                    {m.message}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-6 h-px opacity-40"
                      style={{ background: accentColor }}
                    />
                    <p
                      className="text-[11px] font-[Josefin_Sans,sans-serif] tracking-widest uppercase opacity-60"
                      style={{ color: accentColor }}
                    >
                      {m.sender_name}
                    </p>
                    <div
                      className="w-6 h-px opacity-40"
                      style={{ background: accentColor }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            {top5.length > 1 && (
              <div className="flex justify-center gap-1.5 pb-4">
                {top5.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === i ? "20px" : "6px",
                      height: "6px",
                      background: accentColor,
                      opacity: currentSlide === i ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Write message form */}
      <div
        className="bg-white/70 backdrop-blur rounded-2xl p-5 border space-y-3"
        style={{ borderColor: borderColor.replace("border-", "") }}
      >
        <p
          className="text-[11px] font-[Josefin_Sans,sans-serif] tracking-[0.25em] uppercase text-center mb-1"
          style={{ color: accentColor, opacity: 0.7 }}
        >
          ✍️ Сэтгэгдэлээ бичих
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Таны нэр"
          className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none bg-white placeholder:text-stone-300 font-[Josefin_Sans,sans-serif]"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Хосуудад сэтгэлийн үг..."
          rows={3}
          className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none bg-white placeholder:text-stone-300 resize-none font-[Cormorant_Garamond,serif] text-base"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !text.trim()}
          className="w-full py-3 rounded-xl text-white text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-opacity disabled:opacity-40 hover:opacity-90"
          style={{ background: accentColor }}
        >
          {loading ? "⏳ Хадгалж байна..." : "💌 Илгээх"}
        </button>
      </div>

      {/* All messages */}
      {messages.length > 0 && (
        <div className="mt-5">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2.5 rounded-xl border text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-all"
            style={{ borderColor: accentColor + "40", color: accentColor }}
          >
            {showAll
              ? "▲ Хураах"
              : `▼ Бүх сэтгэгдэл харах (${messages.length})`}
          </button>

          {showAll && (
            <div className="mt-3 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/60 rounded-2xl px-4 py-4 border"
                  style={{ borderColor: accentColor + "20" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-xs font-[Josefin_Sans,sans-serif] tracking-wide font-semibold"
                      style={{ color: accentColor }}
                    >
                      {m.sender_name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-[Josefin_Sans,sans-serif]">
                      {new Date(m.created_at).toLocaleDateString("mn-MN")}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed font-[Cormorant_Garamond,serif] italic text-stone-600">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
