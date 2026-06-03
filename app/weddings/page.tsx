"use client";
import { useEffect, useState } from "react";
import { supabase, Wedding } from "@/lib/supabase";
import TemplateCard from "@/components/TemplateCard";
import Link from "next/link";

const ADMIN_PASSWORD = "nauka2026";

export default function WeddingsPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [filtered, setFiltered] = useState<Wedding[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth state
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [shake, setShake] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  function handleLogin() {
    if (passInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
      setPassError(false);
    } else {
      setPassError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassInput("");
    }
  }

  useEffect(() => {
    if (authed) fetchWeddings();
  }, [authed]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(weddings);
      return;
    }
    setFiltered(
      weddings.filter(
        (w) =>
          w.id.toLowerCase().includes(q) ||
          (w.phone || "").toLowerCase().includes(q) ||
          w.male_name.toLowerCase().includes(q) ||
          w.female_name.toLowerCase().includes(q),
      ),
    );
  }, [search, weddings]);

  async function fetchWeddings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("weddings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setWeddings(data);
      setFiltered(data);
    }
    setLoading(false);
  }

  // ─── PASSWORD GATE ───
  if (!authed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8"
        style={{
          background:
            "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 50%, #F0F5FD 100%)",
        }}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
          }
          .shake { animation: shake 0.45s ease; }
        `}</style>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(244,194,210,0.5)",
            boxShadow: "0 4px 20px rgba(244,154,184,0.12)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4849E"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontSize: "22px",
            color: "#7A4F5A",
            marginBottom: "6px",
            fontWeight: 400,
          }}
        >
          Нууц үг оруулна уу
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(180,130,145,0.7)",
            letterSpacing: "0.06em",
            marginBottom: "28px",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          Зөвхөн админд зориулсан хуудас
        </p>

        <div className={`w-full max-w-[280px] ${shake ? "shake" : ""}`}>
          <input
            type="password"
            value={passInput}
            onChange={(e) => {
              setPassInput(e.target.value);
              setPassError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "14px",
              border: passError
                ? "1px solid rgba(220,100,120,0.6)"
                : "1px solid rgba(244,194,210,0.5)",
              background: "rgba(255,255,255,0.85)",
              fontSize: "16px",
              outline: "none",
              letterSpacing: "0.15em",
              color: "#7A4F5A",
              fontFamily: "'Jost', sans-serif",
              textAlign: "center",
              marginBottom: "10px",
              boxShadow: passError
                ? "0 0 0 3px rgba(220,100,120,0.1)"
                : "0 2px 12px rgba(244,154,184,0.08)",
            }}
          />

          {passError && (
            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "rgba(200,80,100,0.8)",
                letterSpacing: "0.05em",
                fontFamily: "'Jost', sans-serif",
                marginBottom: "10px",
              }}
            >
              Нууц үг буруу байна
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #E8A0B4 0%, #D4849E 100%)",
              color: "#fff",
              fontSize: "12px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(212,132,158,0.3)",
            }}
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN PAGE ───
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 50%, #F0F5FD 100%)",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100/50 px-4 py-3.5">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-rose-300">✿</span>
            <span className="font-playfair text-stone-700 text-base font-light">
              Хурмын бүртгэл
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_authed");
                setAuthed(false);
              }}
              className="text-[11px] tracking-widest uppercase text-stone-300 hover:text-stone-500 transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Гарах
            </button>
            <Link
              href="/"
              className="text-[11px] tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              + Нэмэх
            </Link>
          </div>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ID эсвэл утасны дугаараар хайх..."
          className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-300 bg-white/80 placeholder:text-stone-300"
          style={{ fontFamily: "'Jost', sans-serif" }}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-5 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
            <p
              className="text-stone-400 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Ачаалж байна...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl opacity-30">💍</span>
            <p
              className="text-stone-400 text-xs tracking-widest uppercase text-center"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {search ? "Хайлтын үр дүн олдсонгүй" : "Бүртгэл байхгүй байна"}
            </p>
            {!search && (
              <Link
                href="/"
                className="mt-2 px-5 py-2.5 bg-stone-800 text-white rounded-xl text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                + Шинэ бүртгэл
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-stone-400 text-xs tracking-wide"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Нийт{" "}
                <span className="text-stone-600 font-semibold">
                  {filtered.length}
                </span>{" "}
                бүртгэл
              </p>
              <button
                onClick={fetchWeddings}
                className="text-xs tracking-wide text-stone-400 hover:text-stone-600 transition-colors"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                ↻ Шинэчлэх
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((w) => (
                <TemplateCard key={w.id} wedding={w} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
