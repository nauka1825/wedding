"use client";

import { useState, useRef, useEffect } from "react";
import type { Wedding } from "@/lib/supabase";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import Template6 from "@/components/templates/Template6";
import Template7 from "@/components/templates/Template7";
import Template8 from "@/components/templates/Template8";

type Lang = "kk" | "mn";

function formatDateShort(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LanguagePicker({
  wedding,
  onSelect,
}: {
  wedding: Wedding;
  onSelect: (lang: Lang) => void;
}) {
  const G = { gold: "#C9A15A", goldLight: "#E8D5A8" };
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maleName = wedding.male_name;
  const femaleName = wedding.female_name;
  const mainPhoto =
    wedding.main_photo_url || wedding.photo3_url || wedding.photo5_url || null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const heartPath = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.bezierCurveTo(
        size * 0.5,
        -size * 0.35,
        size * 1.15,
        size * 0.25,
        0,
        size * 1.05,
      );
      ctx.bezierCurveTo(
        -size * 1.15,
        size * 0.25,
        -size * 0.5,
        -size * 0.35,
        0,
        size * 0.35,
      );
      ctx.closePath();
    };

    // Hearts rise from the very bottom of the screen and fade out by the
    // time they reach the "Шақыру · Урилға" label, roughly 30% down from
    // the top — then they respawn at the bottom.
    const fadeZoneTop = () => canvas.height * 0.3;

    const hearts: {
      x: number;
      y: number;
      size: number;
      speed: number;
      baseOpacity: number;
      drift: number;
    }[] = [];
    for (let i = 0; i < 22; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height * 0.5,
        size: Math.random() * 5 + 3,
        speed: Math.random() * 0.5 + 0.25,
        baseOpacity: Math.random() * 0.35 + 0.35,
        drift: (Math.random() - 0.5) * 0.35,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const zoneTop = fadeZoneTop();
      for (const h of hearts) {
        // Fully visible below the fade zone, fades to 0 as it crosses it.
        let opacity = h.baseOpacity;
        if (h.y < zoneTop) {
          const fade = Math.max(0, h.y / zoneTop);
          opacity = h.baseOpacity * fade;
        }

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.fillStyle = `rgba(80,200,120,${opacity})`;
        heartPath(h.size);
        ctx.fill();
        ctx.restore();

        h.y -= h.speed;
        h.x += h.drift;

        // Once it's faded out above the zone, respawn at the bottom.
        if (h.y < zoneTop * 0.15) {
          h.y = canvas.height + Math.random() * 40;
          h.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,500&family=Montserrat:wght@400;500;600;700&display=swap');

        @keyframes plp-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .plp-fade-1 { animation: plp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .plp-fade-2 { animation: plp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .plp-fade-3 { animation: plp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .plp-fade-4 { animation: plp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .plp-fade-5 { animation: plp-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s both; }

        .plp-btn-primary {
          position: relative;
          overflow: hidden;
        }
        .plp-btn-primary::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .plp-btn-primary:hover::after { transform: translateX(100%); }
      `}</style>

      {/* Full-bleed couple photo */}
      <div className="absolute inset-0 z-0">
        {mainPhoto ? (
          <img src={mainPhoto} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(160deg, #3a2f22 0%, #14100c 100%)",
            }}
          />
        )}
        {/* Gradient for text legibility — darkest at the bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,8,6,0.05) 0%, rgba(10,8,6,0.15) 38%, rgba(10,8,6,0.55) 62%, rgba(8,6,4,0.88) 82%, rgba(6,4,3,0.96) 100%)",
          }}
        />
      </div>

      {/* Rising green hearts, fading out near the label */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      />

      {/* Content, bottom-anchored over the photo */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end items-center text-center px-8 pb-9 pt-24">
        {/* 1. Шақыру · Урилға */}
        <p
          className="plp-fade-1"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: G.goldLight,
            textTransform: "uppercase",
          }}
        >
          Шақыру &nbsp;·&nbsp; Урилға
        </p>

        {/* 2-4. Names with & between, italic script */}
        <h1
          className="plp-fade-2 mt-3 leading-[1.05]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(2.4rem, 12vw, 3.1rem)",
            color: "#fff",
          }}
        >
          {maleName || "..."}
        </h1>
        <span
          className="plp-fade-3 block leading-none my-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(1.5rem, 7vw, 1.9rem)",
            color: G.goldLight,
          }}
        >
          &amp;
        </span>
        <h1
          className="plp-fade-4 leading-[1.05] mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(2.4rem, 12vw, 3.1rem)",
            color: "#fff",
          }}
        >
          {femaleName || "..."}
        </h1>

        {/* 5. Үйлену тойы · Хурим */}
        <p
          className="plp-fade-5"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          Үйлену тойы &nbsp;·&nbsp; Хурим
        </p>

        {/* 5b. Date, if available */}
        {wedding.wedding_date && (
          <p
            className="plp-fade-5 mt-1.5"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {formatDateShort(wedding.wedding_date)}
          </p>
        )}

        {/* 6. Тілді таңдаңыз · Хэлээ сонгоно уу */}
        <p
          className="plp-fade-5 mt-1.5 mb-7"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          Тілді таңдаңыз &nbsp;·&nbsp; Хэлээ сонгоно уу
        </p>

        {/* 7. Language buttons */}
        <div className="plp-fade-5 flex w-full max-w-xs gap-3">
          <button
            onClick={() => onSelect("kk")}
            className="plp-btn-primary flex-1 py-4 rounded-2xl transition-transform active:scale-[0.96]"
            style={{
              background: G.goldLight,
              color: "#2b2420",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: "0.02em",
              boxShadow: "0 12px 26px -10px rgba(232,213,168,0.55)",
            }}
          >
            Қазақша
          </button>

          <button
            onClick={() => onSelect("mn")}
            className="flex-1 py-4 rounded-2xl border-2 transition-all active:scale-[0.96] hover:bg-white/10"
            style={{
              background: "rgba(20,16,12,0.35)",
              borderColor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: "0.02em",
            }}
          >
            Монгол
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WeddingLanguageGate({ wedding }: { wedding: Wedding }) {
  const [lang, setLang] = useState<Lang | null>(null);

  // Template4 (azure) doesn't use the language picker — open it directly.
  if (wedding.template === "azure") {
    return (
      <div className="relative">
        <Template4 wedding={wedding} />
      </div>
    );
  }

  if (!lang) {
    return <LanguagePicker wedding={wedding} onSelect={setLang} />;
  }

  return (
    <div className="relative">
      {wedding.template === "luxury" && (
        <Template2 wedding={wedding} defaultLang={lang} key={lang} />
      )}
      {wedding.template === "bohemian" && <Template3 wedding={wedding} />}
      {wedding.template === "sage" && (
        <Template5 wedding={wedding} defaultLang={lang} key={lang} />
      )}
      {wedding.template === "blush" && (
        <Template6 wedding={wedding} defaultLang={lang} key={lang} />
      )}
      {wedding.template === "midnight" && <Template7 wedding={wedding} />}
      {wedding.template === "terracotta" && <Template8 wedding={wedding} />}
      {(wedding.template === "romantic" || !wedding.template) && (
        <Template1 wedding={wedding} defaultLang={lang} key={lang} />
      )}
    </div>
  );
}
