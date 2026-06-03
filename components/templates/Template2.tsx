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
        @keyframes gold-progress {
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
              borderRadius: "2px",
              border:
                active === i
                  ? "1px solid rgba(201,168,76,0.6)"
                  : "1px solid rgba(201,168,76,0.2)",
              transition:
                "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 8px 40px rgba(201,168,76,0.18)"
                  : "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                opacity: active === i ? 0.85 : 0.55,
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
                background: "rgba(201,168,76,0.3)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#C9A84C",
                    animation: "gold-progress 5s linear forwards",
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

// ─── CORNER DECORATION ───
function Corners({
  size = 6,
  opacity = 0.5,
}: {
  size?: number;
  opacity?: number;
}) {
  const s = `${size * 4}px`;
  const style = { width: s, height: s, opacity };
  return (
    <>
      <div
        className="absolute top-0 left-0 border-t border-l border-amber-500"
        style={{ ...style, transform: "translate(-1px,-1px)" }}
      />
      <div
        className="absolute top-0 right-0 border-t border-r border-amber-500"
        style={{ ...style, transform: "translate(1px,-1px)" }}
      />
      <div
        className="absolute bottom-0 left-0 border-b border-l border-amber-500"
        style={{ ...style, transform: "translate(-1px,1px)" }}
      />
      <div
        className="absolute bottom-0 right-0 border-b border-r border-amber-500"
        style={{ ...style, transform: "translate(1px,1px)" }}
      />
    </>
  );
}

// ─── GOLD DIVIDER ───
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.45))",
        }}
      />
      <FaStar
        size={10}
        style={{ color: "rgba(201,168,76,0.65)", flexShrink: 0 }}
      />
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(201,168,76,0.45))",
        }}
      />
    </div>
  );
}

// ─── LABEL — unified size & style ───
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="uppercase mb-2"
      style={{
        fontSize: "9px",
        letterSpacing: "0.36em",
        fontFamily: "'Cinzel', serif",
        fontWeight: 400,
        color: "rgba(201,168,76,0.6)",
      }}
    >
      {children}
    </p>
  );
}

// ─── MAIN ───
export default function Template2({ wedding }: { wedding: Wedding }) {
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
      className="min-h-screen bg-gradient-to-br from-neutral-800 to-amber-900"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        @keyframes shimmer-gold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #C9943A 20%, #F5E08A 45%, #E0BC60 55%, #C9943A 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-gold 5s linear infinite;
        }
        .fade-up { animation: fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1 { animation-delay: 0.1s; }
        .fade-2 { animation-delay: 0.25s; }
        .fade-3 { animation-delay: 0.4s; }
      `}</style>

      {/* Top decorative bar */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.7), rgba(240,208,96,0.5), rgba(201,168,76,0.7), transparent)",
        }}
      />
      <div
        className="h-px w-full mt-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.18), transparent)",
        }}
      />

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Негізгі сурет"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.6) saturate(0.85)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900/50">
            <FaHeart size={36} style={{ color: "rgba(201,168,76,0.3)" }} />
          </div>
        )}

        {/* Gradient overlay — matches new bg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #78350f 0%, rgba(40,20,5,0.4) 45%, rgba(40,20,5,0.15) 100%)",
          }}
        />

        {/* Top label */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.4))",
            }}
          />
          <span
            className="uppercase"
            style={{
              fontSize: "8px",
              letterSpacing: "0.55em",
              fontFamily: "'Cinzel', serif",
              color: "rgba(240,210,120,0.6)",
            }}
          >
            Той шақыру
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.4))",
            }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-amber-400/30" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-amber-400/30" />
        <div className="absolute bottom-16 left-4 w-5 h-5 border-b border-l border-amber-400/20" />
        <div className="absolute bottom-16 right-4 w-5 h-5 border-b border-r border-amber-400/20" />
      </div>

      {/* ─── NAMES ─── */}
      <div className="text-center px-6 -mt-16 relative z-10">
        <h1
          className="fade-up fade-1 shimmer-gold font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-2 flex items-center justify-center gap-4 my-4">
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
            }}
          />
          <FaHeart size={14} style={{ color: "rgba(201,168,76,0.65)" }} />
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
            }}
          />
        </div>

        <h1
          className="fade-up fade-2 shimmer-gold font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.female_name}
        </h1>

        {date && (
          <p
            className="fade-up fade-3 mt-4 uppercase"
            style={{
              fontSize: "9px",
              letterSpacing: "0.42em",
              fontFamily: "'Cinzel', serif",
              color: "rgba(220,185,100,0.55)",
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
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.18)",
            }}
          >
            <Corners size={5} opacity={0.35} />
            <BsQuote
              size={32}
              style={{
                color: "rgba(201,168,76,0.35)",
                position: "absolute",
                top: "10px",
                left: "12px",
              }}
            />
            <p
              className="italic relative z-10 mt-2 leading-[1.95]"
              style={{ fontSize: "17px", color: "rgba(253,230,170,0.82)" }}
            >
              {wedding.description1}
            </p>
            <BsQuote
              size={32}
              style={{
                color: "rgba(201,168,76,0.35)",
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
          <GoldDivider className="mb-6" />
          <div
            className="relative px-5 py-5 text-center"
            style={{
              border: "1px solid rgba(201,168,76,0.18)",
              background: "rgba(201,168,76,0.05)",
            }}
          >
            <Corners size={4} opacity={0.35} />
            <Label>Той иелері</Label>
            <p
              className="font-light leading-relaxed"
              style={{
                fontSize: "17px",
                wordBreak: "break-word",
                color: "rgba(253,230,170,0.82)",
              }}
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
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.3))",
              }}
            />
            <p
              className="uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.36em",
                fontFamily: "'Cinzel', serif",
                color: "rgba(220,185,100,0.55)",
              }}
            >
              Фото альбом
            </p>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.3))",
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
            className="relative px-6 py-5 text-center"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(201,168,76,0.12)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <p
              className="leading-[1.9]"
              style={{
                fontSize: "14px",
                wordBreak: "break-word",
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                color: "rgba(240,215,155,0.7)",
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
          <GoldDivider className="mb-5" />
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Ер"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.72) saturate(0.82)" }}
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Әйел"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.72) saturate(0.82)" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── INSTAGRAM LINKS ─── */}
      {(wedding.link1 || wedding.link2) && (
        <div className="px-5 mt-8 flex gap-3 w-full justify-center">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 px-5 uppercase transition-all hover:opacity-75 relative"
              style={{
                color: "#D4A84C",
                fontSize: "9px",
                letterSpacing: "0.35em",
                fontFamily: "'Cinzel', serif",
              }}
            >
              <Corners size={3} opacity={0.35} />
              <FaInstagram size={14} />
              Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 px-5 uppercase transition-all hover:opacity-80 relative"
              style={{
                color: "#D4A84C",
                fontSize: "9px",
                letterSpacing: "0.35em",
                fontFamily: "'Cinzel', serif",
              }}
            >
              <Corners size={3} opacity={0.35} />
              <FaInstagram size={14} />
              Instagram
            </a>
          )}
        </div>
      )}

      {/* ─── INFO CARD ─── */}
      <div className="mx-5 mt-10 mb-2">
        <GoldDivider className="mb-6" />

        <div
          className="relative p-6 space-y-5"
          // style={{
          //   background: "rgba(0,0,0,0.25)",
          //   boxShadow:
          //     "0 12px 48px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
          // }}
        >
          <Corners size={5} opacity={0.45} />

          {/* Date & Time */}
          {(date || time) && (
            <div className="text-center">
              <Label>Күні & Уақыты</Label>
              {date && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaCalendarAlt
                    size={12}
                    style={{ color: "rgba(201,168,76,0.55)" }}
                  />
                  <p
                    className="font-light italic"
                    style={{
                      fontSize: "22px",
                      color: "rgba(253,230,170,0.88)",
                    }}
                  >
                    {date}
                  </p>
                </div>
              )}
              {time && (
                <div className="mt-2.5 inline-flex items-center gap-2">
                  <FaClock size={11} style={{ color: "#C9A84C" }} />
                  <p
                    className="font-semibold"
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.22em",
                      color: "#E0C060",
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <Label>Той өтетін орын</Label>
              {wedding.venue_name && (
                <p
                  className="font-light italic"
                  style={{
                    fontSize: "22px",
                    wordBreak: "break-word",
                    color: "rgba(253,230,170,0.88)",
                  }}
                >
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <FaMapMarkerAlt
                    size={10}
                    style={{ color: "rgba(201,168,76,0.6)", flexShrink: 0 }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                      letterSpacing: "0.04em",
                      color: "rgba(201,168,76,0.65)",
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <Label>Байланыс</Label>
              <a
                href={`tel:${wedding.phone}`}
                className="inline-flex items-center gap-2 font-light transition-opacity hover:opacity-80"
                style={{
                  fontSize: "18px",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.12em",
                  color: "rgba(240,210,140,0.8)",
                }}
              >
                <FaPhone size={13} style={{ color: "rgba(201,168,76,0.55)" }} />
                {wedding.phone}
              </a>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div
              className="border-t pt-5 space-y-2.5"
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaStar
                    size={9}
                    style={{
                      color: "rgba(201,168,76,0.5)",
                      flexShrink: 0,
                      marginTop: "4px",
                    }}
                  />
                  <p
                    className="leading-relaxed"
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                      color: "rgba(240,210,140,0.7)",
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <div
                className="overflow-hidden"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Қосымша сурет"
                  className="w-full object-cover"
                  style={{ filter: "brightness(0.72) saturate(0.82)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#3c3c3c"
        lightColor="#2A1A08"
        borderColor="border-amber-800"
      />

      {/* ─── FOOTER ─── */}
      <div className="text-center py-12 mt-4">
        <GoldDivider className="mb-6 mx-8" />
        <p
          className="shimmer-gold uppercase"
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
            className="mt-2"
            style={{
              fontSize: "11px",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.22em",
              color: "rgba(201,168,76,0.35)",
            }}
          >
            {date}
          </p>
        )}
      </div>

      {/* Bottom bars */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.18), transparent)",
        }}
      />
      <div
        className="h-px w-full mt-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.7), rgba(240,208,96,0.5), rgba(201,168,76,0.7), transparent)",
        }}
      />
    </div>
  );
}
