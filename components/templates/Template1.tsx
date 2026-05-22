"use client";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

export default function Template1({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  return (
    <div
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 50%, #F0F5FD 100%)",
      }}
    >
      {/* Hero зураг */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #F9D5E5 0%, #FDF6F0 50%, #D5E5F9 100%)",
            }}
          >
            <span className="text-8xl opacity-30">🌸</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #FDF0F5 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Нэр */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <p className="text-rose-300 tracking-[0.4em] text-[10px] uppercase font-[Josefin_Sans,sans-serif] mb-4">
          Wedding Invitation
        </p>
        <h1 className="text-[#7B3F5E] text-5xl font-light italic leading-tight">
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-14"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <span className="text-rose-300 text-2xl">❧</span>
          <div
            className="h-px w-14"
            style={{
              background: "linear-gradient(to left, transparent, #E8B4C8)",
            }}
          />
        </div>
        <h1 className="text-[#7B3F5E] text-5xl font-light italic leading-tight">
          {wedding.female_name}
        </h1>
      </div>

      {/* Тайлбар 1 */}
      {wedding.description1 && (
        <div className="mx-5 mt-8 text-center">
          <span className="text-rose-200 text-5xl font-serif leading-none">
            "
          </span>
          <p className="text-[#9B6B7E] text-lg leading-relaxed italic -mt-3 px-2">
            {wedding.description1}
          </p>
          <span className="text-rose-200 text-5xl font-serif leading-none rotate-180 block">
            "
          </span>
        </div>
      )}

      {/* Хурмын эзэд аав ээж */}
      {wedding.organizer && (
        <div className="mx-5 mt-7 text-center">
          <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-2">
            Хурмын эзэд аав ээж
          </p>
          <div className="bg-white/50 backdrop-blur rounded-2xl px-5 py-4 border border-rose-100/60">
            <p className="text-[#9B6B7E] text-base font-light leading-relaxed">
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* Gallery — Horizontal Swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Зургийн цомог
          </p>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[75vw] max-w-[320px] h-52 overflow-hidden rounded-2xl border border-rose-100/50 shadow-sm"
              >
                <img
                  src={url}
                  alt={`зураг ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Scroll indicator dots */}
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-rose-300 ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5 opacity-30"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Тайлбар 2 */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="bg-white/50 backdrop-blur rounded-2xl p-5 border-l-4 border-rose-200">
            <p className="text-[#9B6B7E] text-sm leading-relaxed">
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* Хосын зургууд — Зураг 3 & 4 */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Хосын зургууд
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div className="overflow-hidden rounded-2xl aspect-[3/4] border border-rose-100/50 shadow-sm">
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div className="overflow-hidden rounded-2xl aspect-[3/4] border border-rose-100/50 shadow-sm">
                <img
                  src={wedding.photo4_url}
                  alt="Эмэгтэй"
                  className="w-full h-full object-cover"
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
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-rose-200 text-[#9B6B7E] font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase hover:bg-rose-50 transition-colors"
            >
              <span>📸</span> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#7B3F5E] text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              <span>📸</span> Instagram →
            </a>
          )}
        </div>
      )}

      {/* Footer — Ордон, огноо, цаг */}
      <div className="mx-5 mt-10 mb-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-rose-200/50" />
          <span className="text-rose-300 text-lg">❀</span>
          <div className="h-px flex-1 bg-rose-200/50" />
        </div>

        <div className="bg-white/60 backdrop-blur rounded-3xl p-6 border border-rose-100/60 space-y-4">
          {/* Огноо & Цаг */}
          {(date || time) && (
            <div className="text-center">
              <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Огноо & Цаг
              </p>
              {date && (
                <p className="text-[#7B3F5E] text-xl font-light italic">
                  {date}
                </p>
              )}
              {time && (
                <div className="mt-2 inline-flex items-center gap-2 bg-rose-50 rounded-full px-4 py-1.5 border border-rose-100">
                  <span className="text-rose-300 text-xs">⏰</span>
                  <p className="text-[#9B6B7E] text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-widest">
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ордон */}
          {(wedding.venue_name || wedding.venue_address) && (
            <div className="text-center border-t border-rose-100/50 pt-4">
              <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Хурмын байр
              </p>
              {wedding.venue_name && (
                <p className="text-[#7B3F5E] text-xl font-light italic">
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <p className="text-rose-400 text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide">
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
            <div className="border-t border-rose-100/50 pt-4 space-y-2">
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
                    <span className="text-rose-300 text-xs mt-0.5 flex-shrink-0">
                      ✦
                    </span>
                    <p className="text-[#9B6B7E] text-sm font-[Josefin_Sans,sans-serif] leading-relaxed">
                      {e}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Нэмэлт зураг */}
          {wedding.photo5_url && (
            <div className="border-t border-rose-100/50 pt-4">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={wedding.photo5_url}
                  alt="Нэмэлт зураг"
                  className="w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Сэтгэгдэл */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B3F5E"
        lightColor="#FDF0F5"
        borderColor="border-rose-100"
      />

      {/* Footer signature */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <span className="text-rose-300">❀</span>
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to left, transparent, #E8B4C8)",
            }}
          />
        </div>
        <p className="text-rose-300 text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase">
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p className="text-rose-200 text-xs mt-1 font-[Josefin_Sans,sans-serif]">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
