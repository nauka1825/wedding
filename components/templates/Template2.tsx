"use client";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

export default function Template2({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  return (
    <div
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #0D0D0D 0%, #1A1208 50%, #0D0D0D 100%)",
      }}
    >
      {/* Top gold line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C, transparent)",
        }}
      />

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1A1208 0%, #0D0D0D 50%, #1A1208 100%)",
            }}
          >
            <span className="text-8xl opacity-20">✦</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #0D0D0D 0%, transparent 50%)",
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-amber-500/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-500/40" />
      </div>

      {/* Нэр */}
      <div className="text-center px-6 -mt-14 relative z-10">
        <div className="inline-flex items-center gap-3 mb-5">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to right, transparent, #C9A84C)",
            }}
          />
          <p className="text-amber-400/70 tracking-[0.4em] text-[9px] uppercase font-[Josefin_Sans,sans-serif]">
            Wedding Invitation
          </p>
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to left, transparent, #C9A84C)",
            }}
          />
        </div>

        <h1 className="text-amber-100 text-5xl font-light italic leading-tight">
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #C9A84C60)",
            }}
          />
          <span className="text-amber-500 text-xl">✦</span>
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #C9A84C60)",
            }}
          />
        </div>
        <h1 className="text-amber-100 text-5xl font-light italic leading-tight">
          {wedding.female_name}
        </h1>
      </div>

      {/* Тайлбар 1 */}
      {wedding.description1 && (
        <div className="mx-5 mt-10 text-center">
          <span className="text-amber-800/60 text-5xl font-serif leading-none">
            "
          </span>
          <p className="text-amber-200/70 text-lg leading-relaxed italic -mt-3 px-2">
            {wedding.description1}
          </p>
          <span className="text-amber-800/60 text-5xl font-serif leading-none rotate-180 block">
            "
          </span>
        </div>
      )}

      {/* Хурмын эзэд аав ээж */}
      {wedding.organizer && (
        <div className="mx-5 mt-7 text-center">
          <p className="text-amber-600/60 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-2">
            Хурмын эзэд аав ээж
          </p>
          <div className="relative px-5 py-4 border border-amber-800/30 rounded-sm">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-500/50 -translate-x-0.5 -translate-y-0.5" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-500/50 translate-x-0.5 -translate-y-0.5" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-500/50 -translate-x-0.5 translate-y-0.5" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-500/50 translate-x-0.5 translate-y-0.5" />
            <p className="text-amber-200/80 text-base font-light leading-relaxed">
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* Gallery swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <p className="text-amber-600/60 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Зургийн цомог
          </p>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[75vw] max-w-[320px] h-52 overflow-hidden rounded-sm border border-amber-800/30 shadow-lg"
              >
                <img
                  src={url}
                  alt={`зураг ${i + 1}`}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            ))}
          </div>
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-amber-500 ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5 opacity-30"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Тайлбар 2 */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="border-l-2 border-amber-700/40 pl-4 py-1">
            <p className="text-amber-200/60 text-sm leading-relaxed">
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* Хосын зургууд */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <p className="text-amber-600/60 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Хосын зургууд
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div className="overflow-hidden rounded-sm aspect-[3/4] border border-amber-800/30">
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div className="overflow-hidden rounded-sm aspect-[3/4] border border-amber-800/30">
                <img
                  src={wedding.photo4_url}
                  alt="Эмэгтэй"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instagram линкүүд */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-7 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 border border-amber-700/40 text-amber-400/80 font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase hover:bg-amber-900/20 transition-colors"
            >
              <span>📸</span> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-colors"
              style={{
                background: "linear-gradient(135deg, #C9A84C20, #C9A84C40)",
                color: "#C9A84C",
              }}
            >
              <span>📸</span> Instagram →
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mx-5 mt-10 mb-2">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="h-px flex-1"
            style={{
              background: "linear-gradient(to right, transparent, #C9A84C40)",
            }}
          />
          <span className="text-amber-600/50 text-lg">✦</span>
          <div
            className="h-px flex-1"
            style={{
              background: "linear-gradient(to left, transparent, #C9A84C40)",
            }}
          />
        </div>

        <div className="relative border border-amber-800/30 p-6 space-y-5">
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-amber-500/40 -translate-x-0.5 -translate-y-0.5" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-amber-500/40 translate-x-0.5 -translate-y-0.5" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-amber-500/40 -translate-x-0.5 translate-y-0.5" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-amber-500/40 translate-x-0.5 translate-y-0.5" />

          {/* Огноо & Цаг */}
          {(date || time) && (
            <div className="text-center">
              <p className="text-amber-600/50 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Огноо & Цаг
              </p>
              {date && (
                <p className="text-amber-200/80 text-xl font-light italic">
                  {date}
                </p>
              )}
              {time && (
                <div className="mt-2 inline-flex items-center gap-2 border border-amber-700/30 px-4 py-1.5">
                  <span className="text-amber-500/60 text-xs">⏰</span>
                  <p className="text-amber-400 text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-widest">
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ордон */}
          {(wedding.venue_name || wedding.venue_address) && (
            <div className="text-center border-t border-amber-800/20 pt-4">
              <p className="text-amber-600/50 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Хурмын байр
              </p>
              {wedding.venue_name && (
                <p className="text-amber-200/80 text-xl font-light italic">
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <p className="text-amber-600/60 text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide">
                  📍 {wedding.venue_address}
                </p>
              )}
            </div>
          )}

          {/* Нэмэлт мэдээлэл */}
          {[
            wedding.extra1,
            wedding.extra2,
            wedding.extra3,
            wedding.extra4,
            wedding.extra5,
          ].filter(Boolean).length > 0 && (
            <div className="border-t border-amber-800/20 pt-4 space-y-2">
              {[
                wedding.extra1,
                wedding.extra2,
                wedding.extra3,
                wedding.extra4,
                wedding.extra5,
              ]
                .filter(Boolean)
                .map((e, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-600/50 text-xs mt-0.5 flex-shrink-0">
                      ✦
                    </span>
                    <p className="text-amber-200/60 text-sm font-[Josefin_Sans,sans-serif] leading-relaxed">
                      {e}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Нэмэлт зураг */}
          {wedding.photo5_url && (
            <div className="border-t border-amber-800/20 pt-4">
              <div className="overflow-hidden rounded-sm border border-amber-800/30">
                <img
                  src={wedding.photo5_url}
                  alt="Нэмэлт зураг"
                  className="w-full object-cover opacity-80"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Сэтгэгдэл */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#C9A84C"
        lightColor="#1A1208"
        borderColor="border-amber-800"
      />

      {/* Footer signature */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to right, transparent, #C9A84C40)",
            }}
          />
          <span className="text-amber-600/50">✦</span>
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to left, transparent, #C9A84C40)",
            }}
          />
        </div>
        <p className="text-amber-600/50 text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase">
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p className="text-amber-800/40 text-xs mt-1 font-[Josefin_Sans,sans-serif]">
            {date}
          </p>
        )}
      </div>

      {/* Bottom gold line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C, transparent)",
        }}
      />
    </div>
  );
}
