"use client";

import { useState } from "react";
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

const G = {
  gold: "#C9A15A",
  goldLight: "#E8D5A8",
  cream: "#FFFBF3",
};

function formatDateShort(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** усны дусал унаад, доор нь долгио тарааж байгаа шиг animation */
function WaterDrop() {
  return (
    <div className="relative w-16 h-24 mx-auto mb-6" aria-hidden="true">
      <style>{`
        @keyframes wdg-drop-fall {
          0%   { transform: translateY(-30px); opacity: 0; }
          35%  { opacity: 1; }
          62%  { transform: translateY(38px) scale(1); opacity: 1; }
          66%  { transform: translateY(42px) scaleX(1.6) scaleY(0.4); opacity: 0.8; }
          70%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes wdg-ripple {
          0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.55; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
        .wdg-drop { animation: wdg-drop-fall 2.6s cubic-bezier(0.55,0,0.2,1) infinite; }
        .wdg-ripple { animation: wdg-ripple 2.6s ease-out infinite; }
      `}</style>

      <svg
        className="wdg-drop absolute left-1/2 -translate-x-1/2 top-0"
        width="18"
        height="24"
        viewBox="0 0 18 24"
      >
        <path
          d="M9 0C9 0 0 12 0 17a9 9 0 0 0 18 0C18 12 9 0 9 0Z"
          fill={G.gold}
          opacity="0.9"
        />
      </svg>

      {[0, 0.55, 1.1].map((delay, i) => (
        <span
          key={i}
          className="wdg-ripple absolute left-1/2 top-[72px] rounded-full border"
          style={{
            width: 44,
            height: 12,
            borderColor: G.gold,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function LanguagePicker({
  wedding,
  onSelect,
}: {
  wedding: Wedding;
  onSelect: (lang: Lang) => void;
}) {
  const bg = wedding.main_photo_url || wedding.photo3_url || wedding.photo5_url;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Montserrat:wght@400;500;600&display=swap');`}</style>

      <div className="absolute inset-0 z-0">
        {bg ? (
          <div
            className="w-full h-full bg-cover bg-center scale-105"
            style={{ backgroundImage: `url('${bg}')`, filter: "blur(2px)" }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(160deg, ${G.cream} 0%, #f3ead9 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,12,0.55) 0%, rgba(20,16,12,0.72) 55%, rgba(20,16,12,0.85) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 text-center">
        <WaterDrop />

        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            color: G.goldLight,
            textTransform: "uppercase",
          }}
        >
          Онлайн урилга
        </p>

        <h1
          className="mt-3 mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: "clamp(1.8rem, 8vw, 2.4rem)",
            color: "#fff",
          }}
        >
          {(wedding.male_name || "...") +
            " & " +
            (wedding.female_name || "...")}
        </h1>

        {wedding.wedding_date && (
          <p
            className="mb-10"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {formatDateShort(wedding.wedding_date)}
          </p>
        )}

        <p
          className="mb-6"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Тілді таңдаңыз / Хэлээ сонгоно уу
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect("kk")}
            className="w-full py-4 rounded-full transition-transform active:scale-95"
            style={{
              background: `linear-gradient(90deg, ${G.gold}, ${G.goldLight})`,
              color: "#2b2420",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.06em",
              boxShadow: "0 12px 30px -8px rgba(201,161,90,0.55)",
            }}
          >
            Қазақша шақыру ашу
          </button>

          <button
            onClick={() => onSelect("mn")}
            className="w-full py-4 rounded-full border transition-transform active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.35)",
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.06em",
              backdropFilter: "blur(8px)",
            }}
          >
            Монгол хэлээр урилга нээх
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WeddingLanguageGate({ wedding }: { wedding: Wedding }) {
  const [lang, setLang] = useState<Lang | null>(null);

  if (!lang) {
    return <LanguagePicker wedding={wedding} onSelect={setLang} />;
  }

  return (
    <div className="relative">
      {wedding.template === "luxury" && (
        <Template2 wedding={wedding} defaultLang={lang} key={lang} />
      )}
      {wedding.template === "bohemian" && <Template3 wedding={wedding} />}
      {wedding.template === "azure" && <Template4 wedding={wedding} />}
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
