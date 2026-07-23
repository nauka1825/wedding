"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicMan from "../MusicMan";
import {
  FaInstagram,
  FaHeart,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { BsQuote } from "react-icons/bs";
export type Lang = "kk" | "mn";
// ─── GALLERY SWIPER ───
function GallerySwiper({ urls }: { urls: string[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child) {
      el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
    setActive(i);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % urls.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    if (urls.length <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [urls.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.offsetWidth / 2;
    let closest = 0,
      minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  };

  return (
    <div>
      <MusicMan />
      <style>{`
        @keyframes green-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 overflow-hidden"
            style={{
              width: "75vw",
              maxWidth: "320px",
              height: "220px",
              borderRadius: "16px",
              border:
                active === i
                  ? "1px solid rgba(74,124,89,0.5)"
                  : "1px solid rgba(74,124,89,0.15)",
              transition:
                "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(74,124,89,0.18)"
                  : "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                opacity: active === i ? 1 : 0.65,
                transition: "opacity 0.35s ease",
              }}
            />
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 rounded-none overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                background: "rgba(74,124,89,0.25)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#4A7C59",
                    animation: "green-progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GREEN DIVIDER ───
function GreenDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(74,124,89,0.35))",
        }}
      />
      <FaStar
        size={9}
        style={{ color: "rgba(74,124,89,0.5)", flexShrink: 0 }}
      />
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(74,124,89,0.35))",
        }}
      />
    </div>
  );
}

// ─── LABEL — unified ───
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-emerald-600/55 uppercase mb-2"
      style={{
        fontSize: "9px",
        letterSpacing: "0.36em",
        fontFamily: "'Cinzel', serif",
        fontWeight: 400,
      }}
    >
      {children}
    </p>
  );
}

// ─── MAIN ───

export default function Template3({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
    wedding.extra5,
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F4F0EA",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1 { animation-delay: 0.1s; }
        .fade-2 { animation-delay: 0.25s; }
        .fade-3 { animation-delay: 0.4s; }
      `}</style>

      {/* Top stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3A6B48, #7FA370, #3A6B48)",
        }}
      />

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Негізгі сурет"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.88) saturate(0.9)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "#D8EAD8" }}
          >
            <FaHeart size={36} style={{ color: "rgba(74,124,89,0.3)" }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #F4F0EA 0%, rgba(244,240,234,0.2) 55%, transparent 100%)",
          }}
        />

        {/* Top label */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(74,124,89,0.3))",
            }}
          />
          <span
            className="text-emerald-700/45 uppercase"
            style={{
              fontSize: "8px",
              letterSpacing: "0.55em",
              fontFamily: "'Cinzel', serif",
            }}
          >
            Той шақыру
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(74,124,89,0.3))",
            }}
          />
        </div>
      </div>

      {/* ─── NAMES ─── */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <h1
          className="fade-up fade-1 text-[#2D5A3D] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-2 flex items-center justify-center gap-4 my-4">
          <div
            className="h-px w-12"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(74,124,89,0.4))",
            }}
          />
          <FaHeart size={13} style={{ color: "rgba(74,124,89,0.5)" }} />
          <div
            className="h-px w-12"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(74,124,89,0.4))",
            }}
          />
        </div>

        <h1
          className="fade-up fade-2 text-[#2D5A3D] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.female_name}
        </h1>

        {date && (
          <p
            className="fade-up fade-3 mt-4 text-emerald-600/40 uppercase"
            style={{
              fontSize: "9px",
              letterSpacing: "0.42em",
              fontFamily: "'Cinzel', serif",
            }}
          >
            {date}
          </p>
        )}
      </div>

      {/* ─── DESCRIPTION 1 ─── */}
      {wedding.description1 && (
        <div className="mx-5 mt-10">
          <div
            className="relative px-7 py-6 text-center"
            style={{
              background: "rgba(74,124,89,0.04)",
              border: "1px solid rgba(74,124,89,0.12)",
              borderRadius: "16px",
            }}
          >
            <BsQuote
              size={30}
              style={{
                color: "rgba(74,124,89,0.25)",
                position: "absolute",
                top: "10px",
                left: "12px",
              }}
            />
            <p
              className="text-[#4A7C59] italic relative z-10 mt-2 leading-[1.95]"
              style={{ fontSize: "17px" }}
            >
              {wedding.description1}
            </p>
            <BsQuote
              size={30}
              style={{
                color: "rgba(74,124,89,0.25)",
                position: "absolute",
                bottom: "6px",
                right: "12px",
                transform: "rotate(180deg)",
              }}
            />
          </div>
        </div>
      )}

      {/* ─── ORGANIZER ─── */}
      {wedding.organizer && (
        <div className="mx-5 mt-8">
          <GreenDivider className="mb-6" />

          <div
            className="relative px-5 py-5 text-center"
            style={{
              border: "1px solid rgba(74,124,89,0.14)",
              background: "rgba(255,255,255,0.55)",
              borderRadius: "16px",
            }}
          >
            <Label>Той иелері</Label>
            <p
              className="text-[#2D5A3D] font-light leading-relaxed"
              style={{ fontSize: "17px", wordBreak: "break-word" }}
            >
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* ─── GALLERY ─── */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-10">
          <div className="flex items-center gap-3 px-5 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(74,124,89,0.25))",
              }}
            />
            <p
              className="text-emerald-600/45 uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.36em",
                fontFamily: "'Cinzel', serif",
              }}
            >
              Фото альбом
            </p>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(74,124,89,0.25))",
              }}
            />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ─── DESCRIPTION 2 ─── */}
      {wedding.description2 && (
        <div className="mx-5 mt-8">
          <div
            className="border-l-2 border-emerald-300/50 pl-5 py-1"
            style={{ borderRadius: "0 8px 8px 0" }}
          >
            <p
              className="text-[#4A7C59]/70 leading-[1.9]"
              style={{
                fontSize: "14px",
                wordBreak: "break-word",
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
              }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* ─── COUPLE PHOTOS ─── */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-8">
          <GreenDivider className="mb-5" />
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{
                  border: "1px solid rgba(74,124,89,0.18)",
                  borderRadius: "14px",
                }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Ер"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.9) saturate(0.88)" }}
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{
                  border: "1px solid rgba(74,124,89,0.18)",
                  borderRadius: "14px",
                }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Әйел"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.9) saturate(0.88)" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── INSTAGRAM LINKS ─── */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-8 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 uppercase transition-all hover:opacity-75"
              style={{
                border: "1px solid rgba(74,124,89,0.25)",
                color: "#4A7C59",
                fontSize: "9px",
                letterSpacing: "0.35em",
                fontFamily: "'Cinzel', serif",
                borderRadius: "12px",
              }}
            >
              <FaInstagram size={14} />
              Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 uppercase transition-all hover:opacity-85"
              style={{
                background: "#2D5A3D",
                color: "#fff",
                fontSize: "9px",
                letterSpacing: "0.35em",
                fontFamily: "'Cinzel', serif",
                borderRadius: "12px",
              }}
            >
              <FaInstagram size={14} />
              Instagram
            </a>
          )}
        </div>
      )}

      {/* ─── INFO CARD ─── */}
      <div className="mx-5 mt-10 mb-2">
        <GreenDivider className="mb-6" />

        <div
          className="relative p-6 space-y-5"
          style={{
            border: "1px solid rgba(74,124,89,0.15)",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "20px",
          }}
        >
          {/* Date & Time */}
          {(date || time) && (
            <div className="text-center">
              <Label>Күні & Уақыты</Label>
              {date && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaCalendarAlt
                    size={12}
                    style={{ color: "rgba(74,124,89,0.45)" }}
                  />
                  <p
                    className="text-[#2D5A3D] font-light italic"
                    style={{ fontSize: "22px" }}
                  >
                    {date}
                  </p>
                </div>
              )}
              {time && (
                <div
                  className="mt-2.5 inline-flex items-center gap-2"
                  style={{
                    border: "1px solid rgba(74,124,89,0.2)",
                    padding: "6px 16px",
                    borderRadius: "100px",
                    background: "rgba(74,124,89,0.05)",
                  }}
                >
                  <FaClock size={11} style={{ color: "#4A7C59" }} />
                  <p
                    className="text-emerald-700 font-semibold"
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.22em",
                    }}
                  >
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Venue */}
          {(wedding.venue_name || wedding.venue_address) && (
            <div
              className="text-center border-t pt-5"
              style={{ borderColor: "rgba(74,124,89,0.1)" }}
            >
              <Label>Той өтетін орын</Label>
              {wedding.venue_name && (
                <p
                  className="text-[#2D5A3D] font-light italic"
                  style={{ fontSize: "22px", wordBreak: "break-word" }}
                >
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <FaMapMarkerAlt
                    size={10}
                    style={{ color: "#4A7C59", flexShrink: 0 }}
                  />
                  <p
                    className="text-emerald-600/60"
                    style={{
                      fontSize: "12px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {wedding.venue_address}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Phone */}
          {wedding.phone && (
            <div
              className="text-center border-t pt-5"
              style={{ borderColor: "rgba(74,124,89,0.1)" }}
            >
              <Label>Байланыс</Label>
              <a
                href={`tel:${wedding.phone}`}
                className="inline-flex items-center gap-2 text-[#2D5A3D]/75 font-light hover:text-[#2D5A3D] transition-colors"
                style={{
                  fontSize: "18px",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.12em",
                }}
              >
                <FaPhone size={13} style={{ color: "rgba(74,124,89,0.45)" }} />
                {wedding.phone}
              </a>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div
              className="border-t pt-5 space-y-2.5"
              style={{ borderColor: "rgba(74,124,89,0.1)" }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaStar
                    size={9}
                    style={{
                      color: "rgba(74,124,89,0.4)",
                      flexShrink: 0,
                      marginTop: "4px",
                    }}
                  />
                  <p
                    className="text-[#4A7C59]/65 leading-relaxed"
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                    }}
                  >
                    {e}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Extra photo */}
          {wedding.photo5_url && (
            <div
              className="border-t pt-5"
              style={{ borderColor: "rgba(74,124,89,0.1)" }}
            >
              <div
                className="overflow-hidden"
                style={{
                  border: "1px solid rgba(74,124,89,0.15)",
                  borderRadius: "14px",
                }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Қосымша сурет"
                  className="w-full object-cover"
                  style={{ filter: "brightness(0.9) saturate(0.88)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#2D5A3D"
        lightColor="#EFF5F0"
        borderColor="border-emerald-100"
      />

      {/* ─── FOOTER ─── */}
      <div className="text-center py-12 mt-4">
        <GreenDivider className="mb-6 mx-8" />
        <p
          className="text-emerald-700/55 uppercase"
          style={{
            fontSize: "11px",
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.38em",
          }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            className="text-emerald-500/35 mt-2"
            style={{
              fontSize: "11px",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.22em",
            }}
          >
            {date}
          </p>
        )}
      </div>

      {/* Bottom stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3A6B48, #7FA370, #3A6B48)",
        }}
      />
    </div>
  );
}
