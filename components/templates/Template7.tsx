"use client";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

export default function Template7({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  return (
    <div
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #0A0E1A 0%, #0D1525 50%, #0A0E1A 100%)",
      }}
    >
      {/* Top stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3D5A8A, #7B9CC0, #3D5A8A)",
        }}
      />

      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 60 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #1A2540 0%, #0A0E1A 50%, #1A2540 100%)",
            }}
          >
            <span className="text-8xl opacity-20">🌙</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #0A0E1A 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Нэр */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to right, transparent, #7B9CC0)",
            }}
          />
          <p
            className="tracking-[0.4em] text-[9px] uppercase font-[Josefin_Sans,sans-serif]"
            style={{ color: "#7B9CC080" }}
          >
            Wedding Invitation
          </p>
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(to left, transparent, #7B9CC0)",
            }}
          />
        </div>

        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ color: "#C5D8F0" }}
        >
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #3D5A8A60)",
            }}
          />
          <span className="text-xl" style={{ color: "#7B9CC0" }}>
            ✦
          </span>
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #3D5A8A60)",
            }}
          />
        </div>
        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ color: "#C5D8F0" }}
        >
          {wedding.female_name}
        </h1>
      </div>

      {/* Тайлбар 1 */}
      {wedding.description1 && (
        <div className="mx-5 mt-8 text-center">
          <span
            className="text-5xl font-serif leading-none"
            style={{ color: "#3D5A8A40" }}
          >
            "
          </span>
          <p
            className="text-lg leading-relaxed italic -mt-3 px-2"
            style={{ color: "#A0BCD8" }}
          >
            {wedding.description1}
          </p>
          <span
            className="text-5xl font-serif leading-none rotate-180 block"
            style={{ color: "#3D5A8A40" }}
          >
            "
          </span>
        </div>
      )}

      {/* Хурмын эзэд аав ээж */}
      {wedding.organizer && (
        <div className="mx-5 mt-7 text-center">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-2"
            style={{ color: "#7B9CC060" }}
          >
            Хурмын эзэд аав ээж
          </p>
          <div
            className="relative px-5 py-4"
            style={{ border: "1px solid #3D5A8A40", borderRadius: "4px" }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 border-t border-l"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 border-t border-r"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 border-b border-l"
              style={{ borderColor: "#7B9CC060" }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b border-r"
              style={{ borderColor: "#7B9CC060" }}
            />
            <p
              className="text-base font-light leading-relaxed"
              style={{ color: "#A0BCD8" }}
            >
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* Gallery swiper */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3"
            style={{ color: "#7B9CC060" }}
          >
            Зургийн цомог
          </p>
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {wedding.gallery_urls.map((url, i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[75vw] max-w-[320px] h-52 overflow-hidden"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={url}
                  alt={`зураг ${i + 1}`}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            ))}
          </div>
          {wedding.gallery_urls.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {wedding.gallery_urls.map((_, i) => (
                <div
                  key={i}
                  style={{ background: "#7B9CC0", opacity: i === 0 ? 1 : 0.3 }}
                  className={`rounded-full ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Тайлбар 2 */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="p-5" style={{ borderLeft: "3px solid #3D5A8A60" }}>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#A0BCD880" }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* Хосын зургууд */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] text-center mb-3"
            style={{ color: "#7B9CC060" }}
          >
            Хосын зургууд
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Эмэгтэй"
                  className="w-full h-full object-cover opacity-70"
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
              className="flex items-center justify-center gap-2 py-3 font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-colors"
              style={{
                border: "1px solid #3D5A8A60",
                color: "#7B9CC0",
                borderRadius: "4px",
              }}
            >
              <span>📸</span> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1A2E50, #3D5A8A)",
                borderRadius: "4px",
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
          <div className="h-px flex-1" style={{ background: "#3D5A8A30" }} />
          <span style={{ color: "#7B9CC060" }}>🌙</span>
          <div className="h-px flex-1" style={{ background: "#3D5A8A30" }} />
        </div>

        <div
          className="relative p-6 space-y-5"
          style={{ border: "1px solid #3D5A8A40", borderRadius: "4px" }}
        >
          <div
            className="absolute top-0 left-0 w-5 h-5 border-t border-l"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute top-0 right-0 w-5 h-5 border-t border-r"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute bottom-0 left-0 w-5 h-5 border-b border-l"
            style={{ borderColor: "#7B9CC060" }}
          />
          <div
            className="absolute bottom-0 right-0 w-5 h-5 border-b border-r"
            style={{ borderColor: "#7B9CC060" }}
          />

          {/* Огноо & Цаг */}
          {(date || time) && (
            <div className="text-center">
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1"
                style={{ color: "#7B9CC060" }}
              >
                Огноо & Цаг
              </p>
              {date && (
                <p
                  className="text-xl font-light italic"
                  style={{ color: "#C5D8F0" }}
                >
                  {date}
                </p>
              )}
              {time && (
                <div
                  className="mt-2 inline-flex items-center gap-2 px-4 py-1.5"
                  style={{
                    background: "#1A2540",
                    border: "1px solid #3D5A8A40",
                    borderRadius: "100px",
                  }}
                >
                  <span className="text-xs" style={{ color: "#7B9CC0" }}>
                    ⏰
                  </span>
                  <p
                    className="text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-widest"
                    style={{ color: "#C5D8F0" }}
                  >
                    {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ордон */}
          {(wedding.venue_name || wedding.venue_address) && (
            <div
              className="text-center pt-4"
              style={{ borderTop: "1px solid #3D5A8A30" }}
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif] mb-1"
                style={{ color: "#7B9CC060" }}
              >
                Хурмын байр
              </p>
              {wedding.venue_name && (
                <p
                  className="text-xl font-light italic"
                  style={{ color: "#C5D8F0" }}
                >
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <p
                  className="text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide"
                  style={{ color: "#7B9CC060" }}
                >
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
            <div
              className="pt-4 space-y-2"
              style={{ borderTop: "1px solid #3D5A8A30" }}
            >
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
                    <span
                      className="text-xs mt-0.5 flex-shrink-0"
                      style={{ color: "#7B9CC060" }}
                    >
                      ✦
                    </span>
                    <p
                      className="text-sm font-[Josefin_Sans,sans-serif] leading-relaxed"
                      style={{ color: "#A0BCD880" }}
                    >
                      {e}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Нэмэлт зураг */}
          {wedding.photo5_url && (
            <div className="pt-4" style={{ borderTop: "1px solid #3D5A8A30" }}>
              <div
                className="overflow-hidden"
                style={{ borderRadius: "8px", border: "1px solid #3D5A8A40" }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Нэмэлт зураг"
                  className="w-full object-cover opacity-70"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Сэтгэгдэл */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B9CC0"
        lightColor="#0D1525"
        borderColor="border-blue-900"
      />

      {/* Footer signature */}
      <div className="text-center py-10 mt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10" style={{ background: "#3D5A8A30" }} />
          <span style={{ color: "#7B9CC040" }}>🌙</span>
          <div className="h-px w-10" style={{ background: "#3D5A8A30" }} />
        </div>
        <p
          className="text-xs font-[Josefin_Sans,sans-serif] tracking-widest uppercase"
          style={{ color: "#7B9CC060" }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            className="text-xs mt-1 font-[Josefin_Sans,sans-serif]"
            style={{ color: "#3D5A8A40" }}
          >
            {date}
          </p>
        )}
      </div>

      {/* Bottom stripe */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(to right, #3D5A8A, #7B9CC0, #3D5A8A)",
        }}
      />
    </div>
  );
}
