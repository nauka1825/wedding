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
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 40%, #F5F0FD 100%)",
      }}
    >
      {/* Hero */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Басты сурет"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #F9D5E5 0%, #FDF6F0 50%, #E5D5F9 100%)",
            }}
          >
            <span className="text-8xl opacity-20">🌸</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #FDF0F5 0%, transparent 55%)",
          }}
        />

        {/* Top decoration */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.5))",
            }}
          />
          <span className="text-white/60 text-xs font-[Josefin_Sans,sans-serif] tracking-[0.4em] uppercase">
            Үйлену тойы
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(255,255,255,0.5))",
            }}
          />
        </div>
      </div>

      {/* Аттар */}
      <div className="text-center px-6 -mt-14 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-rose-100/60">
          <div className="w-1 h-1 rounded-full bg-rose-300" />
          <p className="text-rose-400 tracking-[0.35em] text-[9px] uppercase font-[Josefin_Sans,sans-serif]">
            Online шақыру
          </p>
          <div className="w-1 h-1 rounded-full bg-rose-300" />
        </div>

        <h1
          className="text-[#7B3F5E] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.2rem, 10vw, 3rem)" }}
        >
          {wedding.male_name}
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              fill="#F9D5E5"
            />
            <path
              d="M12 6c0 0-4 3-4 6s4 6 4 6 4-3 4-6-4-6-4-6z"
              fill="#E8B4C8"
            />
          </svg>
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to left, transparent, #E8B4C8)",
            }}
          />
        </div>

        <h1
          className="text-[#7B3F5E] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.2rem, 10vw, 3rem)" }}
        >
          {wedding.female_name}
        </h1>
      </div>

      {/* Шақыру мәтіні */}
      {wedding.description1 && (
        <div className="mx-5 mt-8 relative">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-5 border border-rose-100/50">
            {/* Quote mark */}
            <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
              <span className="text-rose-400 text-xs font-serif leading-none">
                "
              </span>
            </div>
            <p
              className="text-[#9B6B7E] text-[15px] leading-[1.8] text-center pt-1"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {wedding.description1}
            </p>
          </div>
        </div>
      )}

      {/* Той иелері */}
      {wedding.organizer && (
        <div className="mx-5 mt-6">
          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3.5 border border-rose-100/40">
            <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C4A0B0"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-rose-300 text-[10px] tracking-[0.25em] uppercase font-[Josefin_Sans,sans-serif]">
                Той иелері
              </p>
              <p
                className="text-[#9B6B7E] text-sm font-light mt-0.5"
                style={{ wordBreak: "break-word" }}
              >
                {wedding.organizer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <div className="flex items-center gap-3 px-5 mb-3">
            <div className="h-px flex-1 bg-rose-100" />
            <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif]">
              Фотоальбом
            </p>
            <div className="h-px flex-1 bg-rose-100" />
          </div>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 overflow-hidden shadow-md shadow-rose-100"
                style={{
                  width: "72vw",
                  maxWidth: "300px",
                  height: "220px",
                  borderRadius: "20px",
                  border: "1px solid rgba(232,180,200,0.3)",
                }}
              >
                <img
                  src={url}
                  alt={`сурет ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-1">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  style={{ background: "#E8B4C8", opacity: i === 0 ? 1 : 0.3 }}
                  className={`rounded-full transition-all ${i === 0 ? "w-5 h-1.5" : "w-1.5 h-1.5"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Қосымша мәтін */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-5 border border-rose-100/40 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
              style={{
                background: "linear-gradient(to bottom, #F9D5E5, #E8B4C8)",
              }}
            />
            <p
              className="text-[#9B6B7E] text-[14px] leading-[1.8] pl-2"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* Жұптың суреттері */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-rose-100" />
            <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif]">
              Жұптың суреттері
            </p>
            <div className="h-px flex-1 bg-rose-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden shadow-md shadow-rose-100/50"
                style={{
                  borderRadius: "20px",
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Жігіт"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden shadow-md shadow-rose-100/50"
                style={{
                  borderRadius: "20px",
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Қыз"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instagram */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-7 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(196,160,176,0.4)",
                color: "#9B6B7E",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7B3F5E, #C4A0B0)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" />
              </svg>
              Instagram →
            </a>
          )}
        </div>
      )}

      {/* Footer карт */}
      <div className="mx-5 mt-8 mb-2">
        <div className="relative bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden border border-rose-100/50 shadow-lg shadow-rose-100/30">
          {/* Gradient top bar */}
          <div
            className="h-1"
            style={{
              background:
                "linear-gradient(to right, #F9D5E5, #C4A0B0, #D5D5F9)",
            }}
          />

          <div className="p-5 space-y-4">
            {/* Күні & Уақыты */}
            {(date || time) && (
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #F9D5E5, #FDF0F5)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4A0B0"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-rose-300 text-[10px] tracking-[0.25em] uppercase font-[Josefin_Sans,sans-serif]">
                    Күні & Уақыты
                  </p>
                  {date && (
                    <p className="text-[#7B3F5E] text-base font-light italic mt-0.5 truncate">
                      {date}
                    </p>
                  )}
                  {time && (
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-rose-50 rounded-full px-3 py-1 border border-rose-100">
                      <span className="text-rose-300 text-[10px]">⏰</span>
                      <p className="text-[#9B6B7E] text-xs font-[Josefin_Sans,sans-serif] font-semibold tracking-widest">
                        {time}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Той залы */}
            {(wedding.venue_name || wedding.venue_address) && (
              <div className="flex items-start gap-4 pt-3 border-t border-rose-50">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "linear-gradient(135deg, #F9D5E5, #FDF0F5)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4A0B0"
                    strokeWidth="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-rose-300 text-[10px] tracking-[0.25em] uppercase font-[Josefin_Sans,sans-serif]">
                    Той залы
                  </p>
                  {wedding.venue_name && (
                    <p
                      className="text-[#7B3F5E] text-base font-light italic mt-0.5"
                      style={{ wordBreak: "break-word" }}
                    >
                      {wedding.venue_name}
                    </p>
                  )}
                  {wedding.venue_address && (
                    <p
                      className="text-rose-400 text-xs mt-1 font-[Josefin_Sans,sans-serif] leading-relaxed"
                      style={{ wordBreak: "break-word" }}
                    >
                      📍 {wedding.venue_address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Қосымша ақпарат */}
            {[
              wedding.extra1,
              wedding.extra2,
              wedding.extra3,
              wedding.extra4,
              wedding.extra5,
            ].filter(Boolean).length > 0 && (
              <div className="pt-3 border-t border-rose-50 space-y-2.5">
                {[
                  wedding.extra1,
                  wedding.extra2,
                  wedding.extra3,
                  wedding.extra4,
                  wedding.extra5,
                ]
                  .filter(Boolean)
                  .map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                      </div>
                      <p
                        className="text-[#9B6B7E] text-[13px] font-[Josefin_Sans,sans-serif] leading-relaxed flex-1"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {e}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {/* Қосымша сурет */}
            {wedding.photo5_url && (
              <div className="pt-3 border-t border-rose-50">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={wedding.photo5_url}
                    alt="Қосымша сурет"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Сэтгэгдэл */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B3F5E"
        lightColor="#FDF0F5"
        borderColor="border-rose-100"
      />

      {/* Footer */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill="#F9D5E5"
              stroke="#E8B4C8"
              strokeWidth="1"
            />
          </svg>
          <div
            className="h-px w-8"
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
