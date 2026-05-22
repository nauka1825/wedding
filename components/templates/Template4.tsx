"use client";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

export default function Template4({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  return (
    <div
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #F0F7FF 0%, #FAFCFF 50%, #EEF5FF 100%)",
      }}
    >
      {/* Top stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #B8D8F0, #7AB8E0, #B8D8F0)",
        }}
      />

      {/* Hero */}
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
                "linear-gradient(135deg, #C8E6F7 0%, #F0F7FF 50%, #C8E6F7 100%)",
            }}
          >
            <span className="text-8xl opacity-20">🕊️</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #F0F7FF 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Нэр */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-300" />
          <p className="text-sky-400/80 tracking-[0.4em] text-[9px] uppercase font-[Josefin_Sans,sans-serif]">
            Wedding Invitation
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-300" />
        </div>

        <h1 className="text-[#2C5F7A] text-5xl font-light italic leading-tight">
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #B8D8F0)",
            }}
          />
          <span className="text-sky-400 text-xl">✦</span>
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #B8D8F0)",
            }}
          />
        </div>
        <h1 className="text-[#2C5F7A] text-5xl font-light italic leading-tight">
          {wedding.female_name}
        </h1>
      </div>

      {/* Тайлбар 1 */}
      {wedding.description1 && (
        <div className="mx-5 mt-8 text-center">
          <span className="text-sky-200 text-5xl font-serif leading-none">
            "
          </span>
          <p className="text-[#4A7D9A] text-lg leading-relaxed italic -mt-3 px-2">
            {wedding.description1}
          </p>
          <span className="text-sky-200 text-5xl font-serif leading-none rotate-180 block">
            "
          </span>
        </div>
      )}

      {/* Хурмын эзэд аав ээж */}
      {wedding.organizer && (
        <div className="mx-5 mt-7 text-center">
          <p className="text-sky-400/70 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-2">
            Хурмын эзэд аав ээж
          </p>
          <div className="bg-white/70 backdrop-blur rounded-2xl px-5 py-4 border border-sky-100 shadow-sm shadow-sky-100/50">
            <p className="text-[#4A7D9A] text-base font-light leading-relaxed">
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* Gallery swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <p className="text-sky-400/70 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Зургийн цомог
          </p>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[75vw] max-w-[320px] h-52 overflow-hidden rounded-2xl border border-sky-100 shadow-sm"
              >
                <img
                  src={url}
                  alt={`зураг ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-sky-400 ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5 opacity-30"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Тайлбар 2 */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="bg-white/50 backdrop-blur rounded-2xl p-5 border-l-4 border-sky-200">
            <p className="text-[#4A7D9A] text-sm leading-relaxed">
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* Хосын зургууд */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <p className="text-sky-400/70 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3">
            Хосын зургууд
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div className="overflow-hidden rounded-2xl aspect-[3/4] border border-sky-100 shadow-sm">
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div className="overflow-hidden rounded-2xl aspect-[3/4] border border-sky-100 shadow-sm">
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
              className="flex items-center justify-center gap-2 py-3 border border-sky-200 text-sky-600 rounded-2xl font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase hover:bg-sky-50 transition-colors"
            >
              <span>📸</span> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #5A9EC0, #7AB8E0)",
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
          <div className="h-px flex-1 bg-sky-200/60" />
          <span className="text-sky-300 text-lg">🕊️</span>
          <div className="h-px flex-1 bg-sky-200/60" />
        </div>

        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 border border-sky-100 shadow-sm shadow-sky-100/30 space-y-5">
          {/* Огноо & Цаг */}
          {(date || time) && (
            <div className="text-center">
              <p className="text-sky-400/70 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Огноо & Цаг
              </p>
              {date && (
                <p className="text-[#2C5F7A] text-xl font-light italic">
                  {date}
                </p>
              )}
              {time && (
                <div className="mt-2 inline-flex items-center gap-2 bg-sky-50 rounded-full px-4 py-1.5 border border-sky-100">
                  <span className="text-sky-400 text-xs">⏰</span>
                  <p className="text-sky-700 text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-widest">
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ордон */}
          {(wedding.venue_name || wedding.venue_address) && (
            <div className="text-center border-t border-sky-100 pt-4">
              <p className="text-sky-400/70 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1">
                Хурмын байр
              </p>
              {wedding.venue_name && (
                <p className="text-[#2C5F7A] text-xl font-light italic">
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <p className="text-sky-500/70 text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide">
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
            <div className="border-t border-sky-100 pt-4 space-y-2">
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
                    <span className="text-sky-300 text-xs mt-0.5 flex-shrink-0">
                      ✦
                    </span>
                    <p className="text-[#4A7D9A] text-sm font-[Josefin_Sans,sans-serif] leading-relaxed">
                      {e}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Нэмэлт зураг */}
          {wedding.photo5_url && (
            <div className="border-t border-sky-100 pt-4">
              <div className="overflow-hidden rounded-2xl border border-sky-100">
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
        accentColor="#2C5F7A"
        lightColor="#F0F7FF"
        borderColor="border-sky-100"
      />

      {/* Footer signature */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 bg-sky-200/60" />
          <span className="text-sky-300">🕊️</span>
          <div className="h-px w-10 bg-sky-200/60" />
        </div>
        <p className="text-sky-400/60 text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase">
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p className="text-sky-300/40 text-xs mt-1 font-[Josefin_Sans,sans-serif]">
            {date}
          </p>
        )}
      </div>

      {/* Bottom stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #B8D8F0, #7AB8E0, #B8D8F0)",
        }}
      />
    </div>
  );
}
