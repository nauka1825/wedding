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
        @keyframes pink-progress {
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
              borderRadius: "20px",
              border:
                active === i
                  ? "1px solid rgba(244,167,185,0.7)"
                  : "1px solid rgba(244,167,185,0.25)",
              transition:
                "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(196,84,122,0.18)"
                  : "0 2px 10px rgba(196,84,122,0.07)",
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
              className="transition-all duration-300 overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                borderRadius: "2px",
                background: "rgba(244,167,185,0.3)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#F4A7B9",
                    animation: "pink-progress 5s linear forwards",
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

// ─── PINK DIVIDER ───
function PinkDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(244,167,185,0.5))",
        }}
      />
      <FaHeart
        size={9}
        style={{ color: "rgba(244,167,185,0.7)", flexShrink: 0 }}
      />
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(244,167,185,0.5))",
        }}
      />
    </div>
  );
}

// ─── LABEL — unified ───
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="uppercase mb-2"
      style={{
        fontSize: "9px",
        letterSpacing: "0.36em",
        fontFamily: "'Cinzel', serif",
        fontWeight: 400,
        color: "#E8789A",
      }}
    >
      {children}
    </p>
  );
}

// ─── MAIN ───
export default function Template6({ wedding }: { wedding: Wedding }) {
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
        background:
          "linear-gradient(135deg, #FFF0F3 0%, #FFF5F7 50%, #FFF0F5 100%)",
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
          background: "linear-gradient(to right, #F4A7B9, #F9C5D0, #F4A7B9)",
        }}
      />

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Негізгі сурет"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.92) saturate(0.95)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #FDD5DF 0%, #FFF0F3 50%, #FDD5DF 100%)",
            }}
          >
            <FaHeart size={36} style={{ color: "rgba(244,167,185,0.4)" }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #FFF0F3 0%, transparent 55%)",
          }}
        />

        {/* Top label */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(244,167,185,0.45))",
            }}
          />
          <span
            className="uppercase"
            style={{
              fontSize: "8px",
              letterSpacing: "0.55em",
              fontFamily: "'Cinzel', serif",
              color: "rgba(232,120,154,0.65)",
            }}
          >
            Той шақыру
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(244,167,185,0.45))",
            }}
          />
        </div>
      </div>

      {/* ─── NAMES ─── */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <h1
          className="fade-up fade-1 font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)", color: "#C4547A" }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-2 flex items-center justify-center gap-4 my-4">
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(244,167,185,0.55))",
            }}
          />
          <FaHeart size={13} style={{ color: "rgba(244,167,185,0.75)" }} />
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(244,167,185,0.55))",
            }}
          />
        </div>

        <h1
          className="fade-up fade-2 font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)", color: "#C4547A" }}
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
              color: "rgba(232,120,154,0.55)",
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
              background: "rgba(253,213,223,0.25)",
              border: "1px solid rgba(244,167,185,0.3)",
              borderRadius: "16px",
            }}
          >
            <BsQuote
              size={30}
              style={{
                color: "rgba(244,167,185,0.5)",
                position: "absolute",
                top: "10px",
                left: "12px",
              }}
            />
            <p
              className="italic relative z-10 mt-2 leading-[1.95]"
              style={{ fontSize: "17px", color: "#C4547A" }}
            >
              {wedding.description1}
            </p>
            <BsQuote
              size={30}
              style={{
                color: "rgba(244,167,185,0.5)",
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
          <PinkDivider className="mb-6" />
          <div
            className="relative px-5 py-5 text-center"
            style={{
              border: "1px solid rgba(244,167,185,0.3)",
              background: "rgba(255,255,255,0.65)",
              borderRadius: "16px",
            }}
          >
            <Label>Той иелерінің ата-анасы</Label>
            <p
              className="font-light leading-relaxed"
              style={{
                fontSize: "17px",
                wordBreak: "break-word",
                color: "#C4547A",
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
                  "linear-gradient(to right, transparent, rgba(244,167,185,0.35))",
              }}
            />
            <p
              className="uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.36em",
                fontFamily: "'Cinzel', serif",
                color: "rgba(232,120,154,0.6)",
              }}
            >
              Фото альбом
            </p>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(244,167,185,0.35))",
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
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(244,167,185,0.28)",
              borderRadius: "16px",
              boxShadow:
                "0 8px 28px rgba(196,84,122,0.1), 0 2px 8px rgba(196,84,122,0.07)",
            }}
          >
            <p
              className="leading-[1.9]"
              style={{
                fontSize: "14px",
                wordBreak: "break-word",
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                color: "#C4789A",
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
          <PinkDivider className="mb-5" />
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{
                  borderRadius: "20px",
                  border: "1px solid rgba(244,167,185,0.35)",
                }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Ер"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.94) saturate(0.9)" }}
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{
                  borderRadius: "20px",
                  border: "1px solid rgba(244,167,185,0.35)",
                }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Әйел"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.94) saturate(0.9)" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── INSTAGRAM LINKS — flex row ─── */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-8 flex flex-row gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 uppercase transition-all hover:opacity-75"
              style={{
                border: "1px solid rgba(244,167,185,0.5)",
                color: "#D4789A",
                fontSize: "9px",
                letterSpacing: "0.3em",
                fontFamily: "'Cinzel', serif",
                borderRadius: "100px",
              }}
            >
              <FaInstagram size={13} />
              Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 uppercase transition-all hover:opacity-85"
              style={{
                background: "linear-gradient(135deg, #C4547A, #E8789A)",
                color: "#fff",
                fontSize: "9px",
                letterSpacing: "0.3em",
                fontFamily: "'Cinzel', serif",
                borderRadius: "100px",
              }}
            >
              <FaInstagram size={13} />
              Instagram
            </a>
          )}
        </div>
      )}

      {/* ─── INFO CARD ─── */}
      <div className="mx-5 mt-10 mb-2">
        <PinkDivider className="mb-6" />

        <div
          className="relative p-6 space-y-5"
          style={{
            border: "1px solid rgba(244,167,185,0.3)",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(196,84,122,0.08)",
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
                    style={{ color: "rgba(244,167,185,0.7)" }}
                  />
                  <p
                    className="font-light italic"
                    style={{ fontSize: "22px", color: "#C4547A" }}
                  >
                    {date}
                  </p>
                </div>
              )}
              {time && (
                <div
                  className="mt-2.5 inline-flex items-center gap-2"
                  style={{
                    border: "1px solid rgba(244,167,185,0.4)",
                    padding: "6px 16px",
                    borderRadius: "100px",
                    background: "#FFF0F3",
                  }}
                >
                  <FaClock size={11} style={{ color: "#F4A7B9" }} />
                  <p
                    className="font-semibold"
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.22em",
                      color: "#C4547A",
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
              style={{ borderColor: "rgba(244,167,185,0.2)" }}
            >
              <Label>Той өтетін орын</Label>
              {wedding.venue_name && (
                <p
                  className="font-light italic"
                  style={{
                    fontSize: "22px",
                    wordBreak: "break-word",
                    color: "#C4547A",
                  }}
                >
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <FaMapMarkerAlt
                    size={10}
                    style={{ color: "#E8789A", flexShrink: 0 }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                      letterSpacing: "0.04em",
                      color: "#E8789A",
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
              style={{ borderColor: "rgba(244,167,185,0.2)" }}
            >
              <Label>Байланыс</Label>
              <a
                href={`tel:${wedding.phone}`}
                className="inline-flex items-center gap-2 font-light transition-opacity hover:opacity-75"
                style={{
                  fontSize: "18px",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.12em",
                  color: "#C4547A",
                }}
              >
                <FaPhone size={13} style={{ color: "rgba(244,167,185,0.7)" }} />
                {wedding.phone}
              </a>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div
              className="border-t pt-5 space-y-2.5"
              style={{ borderColor: "rgba(244,167,185,0.2)" }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaStar
                    size={9}
                    style={{
                      color: "rgba(244,167,185,0.6)",
                      flexShrink: 0,
                      marginTop: "4px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Cinzel', serif",
                      wordBreak: "break-word",
                      color: "#C4789A",
                      lineHeight: "1.7",
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
              style={{ borderColor: "rgba(244,167,185,0.2)" }}
            >
              <div
                className="overflow-hidden"
                style={{
                  border: "1px solid rgba(244,167,185,0.3)",
                  borderRadius: "14px",
                }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Қосымша сурет"
                  className="w-full object-cover"
                  style={{ filter: "brightness(0.94) saturate(0.9)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#C4547A"
        lightColor="#FFF0F3"
        borderColor="border-pink-100"
      />

      {/* ─── FOOTER ─── */}
      <div className="text-center py-12 mt-4">
        <PinkDivider className="mb-6 mx-8" />
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.38em",
            color: "#E8789A",
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
              color: "rgba(244,167,185,0.5)",
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
          background: "linear-gradient(to right, #F4A7B9, #F9C5D0, #F4A7B9)",
        }}
      />
    </div>
  );
}
