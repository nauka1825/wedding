"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

// ─── GALLERY SWIPER (Template4-аас авсан, romantic өнгөнд тохируулсан) ───
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
      <style>{`
        @keyframes gallery-progress {
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
              width: "72vw",
              maxWidth: "300px",
              height: "220px",
              borderRadius: "20px",
              border: "1px solid rgba(232,180,200,0.35)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: active === i ? "scale(1)" : "scale(0.93)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(196,160,176,0.35)"
                  : "0 2px 8px rgba(196,160,176,0.10)",
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

      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 rounded-full overflow-hidden relative"
              style={{
                width: active === i ? 20 : 7,
                height: 7,
                background: "#E8B4C8",
                opacity: active === i ? 1 : 0.45,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#C4A0B0",
                    animation: "gallery-progress 5s linear forwards",
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

// ─── ORNAMENTS ───
const OrnamentDivider = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 260 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: "100%", maxWidth: "260px", height: "28px" }}
  >
    <g opacity="0.7">
      <path
        d="M18 14 C18 14 22 6 30 10 C34 12 34 16 30 18 C26 20 22 16 26 13 C28 11 32 12 32 14"
        stroke="#C4A0B0"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 14 C10 14 6 8 2 12 C0 14 2 18 6 16 C9 15 10 11 7 10"
        stroke="#C4A0B0"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 14 L55 14"
        stroke="#C4A0B0"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M55 14 C57 10 61 9 64 11 C67 13 67 17 64 18 C61 20 57 18 58 15 C59 13 62 13 63 15"
        stroke="#C4A0B0"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M64 14 L90 14"
        stroke="#C4A0B0"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M90 14 Q95 14 100 14"
        stroke="#C4A0B0"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </g>
    <g transform="translate(115, 4)">
      <path
        d="M15 11 C15 5 8 1 4 5 C1 8 3 12 7 11 C10 10 10 7 8 6 C6 5 4 7 5 9 C6 11 9 12 11 11 C13 10 14 8 13 6 C12 4 10 4 9 5 C8 6 8 8 9 9 C10 10 12 10 13 9"
        stroke="#C4A0B0"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 11 C15 5 22 1 26 5 C29 8 27 12 23 11 C20 10 20 7 22 6 C24 5 26 7 25 9 C24 11 21 12 19 11 C17 10 16 8 17 6 C18 4 20 4 21 5 C22 6 22 8 21 9 C20 10 18 10 17 9"
        stroke="#C4A0B0"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="15" cy="13" r="2.5" fill="#E8B4C8" opacity="0.8" />
      <circle cx="15" cy="13" r="1.2" fill="#C4A0B0" />
    </g>
    <g opacity="0.7" transform="translate(170, 0)">
      <path
        d="M0 14 Q5 14 10 14"
        stroke="#C4A0B0"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M10 14 L36 14"
        stroke="#C4A0B0"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M36 14 C35 11 38 9 41 11 C44 13 44 17 41 18 C38 20 34 17 36 14"
        stroke="#C4A0B0"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M41 14 L64 14"
        stroke="#C4A0B0"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M64 14 C65 10 69 8 72 10 C75 12 74 16 71 17 C68 19 64 16 66 13 C68 11 71 12 71 14"
        stroke="#C4A0B0"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M72 14 L78 14"
        stroke="#C4A0B0"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M84 14 C84 14 78 6 70 10 C66 12 66 16 70 18 C74 20 78 16 74 13 C72 11 68 12 68 14"
        stroke="#C4A0B0"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        transform="scale(-1,1) translate(-152,0)"
      />
    </g>
  </svg>
);

const SmallOrnament = () => (
  <svg
    viewBox="0 0 120 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "120px", height: "16px" }}
  >
    <path
      d="M0 8 L40 8"
      stroke="#E8B4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <circle cx="44" cy="8" r="1.5" fill="#E8B4C8" opacity="0.6" />
    <circle
      cx="60"
      cy="8"
      r="3"
      fill="#F9D5E5"
      stroke="#E8B4C8"
      strokeWidth="1"
    />
    <circle cx="60" cy="8" r="1.2" fill="#C4A0B0" />
    <circle cx="76" cy="8" r="1.5" fill="#E8B4C8" opacity="0.6" />
    <path
      d="M80 8 L120 8"
      stroke="#E8B4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

const KazakhBorder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="300"
    height="15"
    fill="none"
    style={{ width: "100%", height: "15px" }}
  >
    <path
      fill="#C8A84B"
      d="M187.03 11.252c.044.08.046.176-.252.408a4.31 4.31 0 0 1-.717.45c-.086.043-.178.09-.277.142l-.158.077-.082.04c-.027.012-.056.025-.088.037-.237.098-.506.21-.815.327-.155.053-.321.107-.498.164-.176.057-.361.12-.561.167l-.632.159c-.225.05-.46.09-.708.138a16.34 16.34 0 0 1-3.62.218c-.712-.027-1.479-.129-2.298-.275l-.622-.138c-.105-.024-.21-.043-.317-.074l-.32-.09c-.107-.032-.216-.062-.325-.093-.11-.032-.221-.062-.33-.102l-.668-.234c-.114-.036-.221-.09-.334-.134l-.341-.143c-.113-.05-.231-.094-.344-.148-.114-.053-.229-.106-.34-.16-.458-.223-.91-.463-1.37-.705-.46-.242-.927-.484-1.41-.706-.242-.11-.487-.214-.739-.31a8.49 8.49 0 0 0-.765-.246 5.993 5.993 0 0 0-1.603-.201 4.852 4.852 0 0 0-.792.087 3.376 3.376 0 0 0-.738.246c-.056.029-.117.053-.172.086l-.166.097a2.178 2.178 0 0 0-.283.218 2.36 2.36 0 0 0-.458.582c-.248.438-.364.966-.286 1.43.04.231.128.442.258.622.135.179.313.323.526.426.424.207.995.229 1.508.07.256-.08.5-.2.708-.357.202-.151.389-.36.536-.59.3-.46.458-1.03.481-1.613a4.19 4.19 0 0 0-.061-.88 5.135 5.135 0 0 0-.248-.86 5.101 5.101 0 0 0-.975-1.539c-.832-.92-1.97-1.584-3.176-1.993a9.752 9.752 0 0 0-3.746-.494l-.471.036c-.157.017-.311.039-.466.057-.078.01-.156.019-.233.03l-.231.042c-.154.028-.307.046-.461.081-.609.12-1.203.279-1.785.454a35.794 35.794 0 0 0-3.328 1.231c-1.057.44-2.065.884-3.038 1.28-.97.398-1.905.742-2.794 1.012-.887.275-1.727.477-2.502.605-.773.132-1.479.197-2.099.2l-.227.001c-.075.005-.147-.002-.218-.004-.145-.006-.282-.012-.414-.016-.263-.018-.502-.049-.717-.067l-.565-.094c-.082-.012-.155-.03-.224-.047-.066-.014-.129-.03-.183-.042l-.334-.08.338.065c.055.01.115.023.185.035.067.014.141.03.225.037l.565.069c.214.01.451.03.714.039.13-.002.267-.002.41-.002.069-.002.143.002.216-.005l.225-.012c.611-.026 1.307-.12 2.063-.279a19.424 19.424 0 0 0 2.441-.692 33.373 33.373 0 0 0 2.723-1.103c.947-.43 1.935-.908 2.983-1.39a36.573 36.573 0 0 1 3.338-1.366c.595-.2 1.208-.385 1.841-.531.159-.041.321-.067.479-.102l.243-.05c.08-.015.162-.027.244-.04.164-.026.328-.053.494-.077.164-.018.332-.035.498-.055a10.576 10.576 0 0 1 4.103.42 9.35 9.35 0 0 1 1.953.844 7.77 7.77 0 0 1 1.316.945c.132.124.269.246.39.38a6.082 6.082 0 0 1 1.217 1.822c.141.338.256.688.332 1.054.075.363.111.735.107 1.11-.013.745-.193 1.511-.609 2.185a3.475 3.475 0 0 1-.797.907 3.494 3.494 0 0 1-1.082.575c-.388.126-.798.19-1.214.179a3.131 3.131 0 0 1-1.231-.276 2.701 2.701 0 0 1-1.008-.798 2.677 2.677 0 0 1-.502-1.143 3.2 3.2 0 0 1 .008-1.18c.076-.378.206-.738.391-1.072.18-.336.418-.643.701-.91.141-.132.297-.254.463-.362.079-.05.159-.098.239-.147.08-.047.166-.083.25-.126.336-.16.687-.279 1.038-.354a6.058 6.058 0 0 1 1.052-.124 7.01 7.01 0 0 1 1.019.055 8.294 8.294 0 0 1 1.874.478c.286.11.561.226.826.346.527.244 1.017.5 1.479.747.462.246.901.482 1.326.692.105.053.21.104.315.153.105.049.21.09.313.136.105.045.208.09.309.132.105.043.201.094.306.127l.61.22c.098.038.199.067.3.097.099.029.197.06.296.088l.292.087c.097.029.196.05.29.072l.569.135c.753.147 1.456.255 2.116.295 1.315.098 2.433.028 3.363-.086.234-.033.456-.059.666-.092l.599-.113c.191-.03.368-.076.538-.117.168-.039.328-.075.479-.112.3-.084.565-.157.798-.224.032-.006.059-.014.089-.022l.082-.029c.054-.016.107-.032.157-.05l.286-.09c.357-.1.599-.19.779-.228.362-.088.446-.033.49.048Z"
    />
    <path
      fill="#D4AF37"
      d="M176.961.041c.086.036.164.078.202.182.021.054.031.12.027.212-.004.09-.017.207-.061.346-.043.14-.098.314-.196.512-.049.1-.1.211-.168.326-.067.115-.14.24-.224.374-.09.128-.186.268-.296.417l-.179.221a5.61 5.61 0 0 1-.198.235c-.074.077-.147.158-.225.241a8.288 8.288 0 0 1-.249.25 5.26 5.26 0 0 0-.132.128 7.23 7.23 0 0 0-.143.125c-.098.085-.194.175-.304.258-.847.698-1.969 1.315-3.175 1.704-1.201.396-2.483.56-3.605.518a10.094 10.094 0 0 1-1.548-.178c-.231-.049-.447-.092-.645-.152-.1-.03-.196-.051-.288-.083-.089-.03-.175-.06-.259-.085-.165-.051-.306-.114-.432-.164-.064-.026-.123-.047-.176-.071l-.143-.065-.263-.125.284.071c.045.01.096.024.151.038.055.012.118.024.183.036.133.023.282.06.449.08l.263.038c.092.014.19.018.288.03.198.024.412.03.639.04.451.01.948-.009 1.469-.068a11.25 11.25 0 0 0 3.215-.893 12.15 12.15 0 0 0 2.72-1.679c.096-.07.177-.152.265-.225a4.71 4.71 0 0 0 .245-.217c.075-.074.153-.143.222-.212l.202-.202c.065-.065.127-.13.184-.195l.169-.184.292-.336c.086-.107.165-.208.241-.297.075-.09.136-.178.2-.255.128-.152.22-.28.312-.38.092-.098.161-.177.228-.233a.6.6 0 0 1 .178-.106.379.379 0 0 1 .281.023ZM112.97 11.25c-.045.082-.047.177.252.409.152.114.371.276.716.449.087.043.179.092.279.143.051.024.101.05.156.077l.083.041c.027.011.056.025.087.036.237.098.507.21.815.329.157.05.322.105.499.163.176.057.361.119.563.166.199.05.411.103.632.16.221.048.458.088.706.137.992.17 2.193.29 3.621.218.712-.026 1.478-.128 2.297-.275l.622-.137c.103-.026.212-.045.317-.075l.32-.09.326-.092c.11-.032.221-.062.328-.104.219-.075.442-.154.669-.233.114-.035.221-.088.336-.133.112-.047.225-.096.339-.143.115-.049.231-.094.345-.149.113-.052.229-.105.34-.161.456-.22.91-.46 1.37-.703.46-.243.925-.485 1.408-.707.243-.11.489-.214.739-.308.255-.094.505-.179.765-.247.262-.065.528-.12.795-.156.27-.032.54-.05.809-.045.268.006.534.034.792.087.258.052.506.137.737.244.058.03.119.055.173.087l.167.097c.099.066.192.137.283.218.177.166.336.363.456.583.25.438.365.964.287 1.43a1.49 1.49 0 0 1-.258.623 1.457 1.457 0 0 1-.526.425c-.423.206-.995.229-1.507.07a2.3 2.3 0 0 1-.708-.358 2.304 2.304 0 0 1-.538-.59c-.299-.459-.458-1.03-.481-1.613-.01-.291.01-.588.062-.88.053-.287.142-.579.248-.859.227-.56.555-1.085.974-1.54.833-.92 1.972-1.584 3.178-1.992a9.707 9.707 0 0 1 3.745-.494c.159.01.314.022.471.035.157.017.313.038.466.057.079.011.157.018.233.032l.231.04c.153.027.308.048.459.082.61.12 1.205.28 1.787.453 1.164.357 2.272.79 3.328 1.231 1.057.44 2.066.884 3.038 1.28.972.399 1.905.74 2.794 1.013.886.273 1.726.476 2.502.606.773.13 1.481.195 2.1.197l.227.004c.073.002.147-.004.219-.006l.413-.015c.262-.019.501-.049.716-.068l.565-.093c.081-.012.155-.03.225-.047l.182-.044.334-.079-.338.066c-.054.01-.116.02-.184.034-.068.015-.142.03-.225.038-.163.018-.351.043-.565.07-.215.008-.454.027-.714.037-.132-.002-.267-.002-.409-.002-.072-.002-.144.002-.217-.004-.074-.004-.15-.01-.225-.013a13.041 13.041 0 0 1-2.065-.278 19.15 19.15 0 0 1-2.44-.692 33.452 33.452 0 0 1-2.722-1.103c-.947-.43-1.937-.908-2.984-1.39a36.543 36.543 0 0 0-3.339-1.368 20.529 20.529 0 0 0-1.84-.53c-.159-.04-.32-.068-.479-.102l-.242-.05c-.08-.015-.163-.027-.245-.04a38.138 38.138 0 0 0-.493-.077c-.165-.017-.331-.034-.498-.055a10.603 10.603 0 0 0-4.106.42 9.468 9.468 0 0 0-1.951.844 8.031 8.031 0 0 0-1.316.945c-.134.124-.267.246-.39.38a6.12 6.12 0 0 0-1.216 1.821 5.205 5.205 0 0 0-.439 2.164c.01.745.192 1.513.608 2.186.209.337.465.645.797.906.324.258.693.45 1.081.575.388.127.799.19 1.214.181.415-.01.838-.096 1.232-.276.39-.18.747-.457 1.009-.8.262-.341.429-.742.503-1.142.073-.4.062-.8-.01-1.179a3.682 3.682 0 0 0-.39-1.073 3.56 3.56 0 0 0-1.164-1.273c-.08-.049-.159-.096-.241-.144-.079-.05-.165-.085-.248-.128a4.822 4.822 0 0 0-1.04-.356 6.136 6.136 0 0 0-1.052-.122 7.267 7.267 0 0 0-1.988.243 9.403 9.403 0 0 0-.902.291 13.62 13.62 0 0 0-.827.346c-.528.244-1.017.5-1.48.746-.462.247-.9.483-1.325.692-.107.055-.21.103-.315.152-.104.051-.211.092-.314.137l-.308.134c-.105.043-.202.092-.307.126l-.609.22c-.099.037-.2.066-.301.096l-.297.088-.291.087c-.097.03-.196.048-.291.073-.194.045-.384.092-.57.135a16.51 16.51 0 0 1-2.113.295 16.899 16.899 0 0 1-3.364-.086c-.233-.034-.456-.06-.666-.092-.211-.04-.411-.08-.599-.113-.192-.032-.369-.077-.538-.117-.168-.041-.327-.077-.481-.112l-.797-.224a1.149 1.149 0 0 1-.087-.024l-.084-.027-.157-.05c-.101-.033-.194-.063-.283-.09-.359-.1-.6-.19-.782-.23-.359-.087-.444-.03-.489.049Z"
    />
    <path
      fill="#D4AF37"
      d="M123.039.041c-.085.036-.164.078-.203.183a.496.496 0 0 0-.027.211c.004.09.016.208.061.347.043.14.098.313.196.512.048.1.1.21.168.327.066.114.141.238.225.372.088.13.186.27.295.417l.178.223c.063.076.127.156.2.233l.224.243c.076.081.162.162.248.247l.132.128.145.126c.096.083.192.177.301.258.849.7 1.972 1.315 3.175 1.705 1.204.394 2.485.56 3.608.517a10.042 10.042 0 0 0 1.546-.177c.232-.05.449-.093.647-.152.1-.031.196-.052.285-.083l.259-.086c.166-.05.309-.115.434-.163.063-.026.124-.047.175-.071l.143-.068.265-.122-.284.07c-.047.011-.097.023-.152.039-.056.012-.118.022-.184.036-.132.022-.279.059-.448.08l-.265.038c-.091.013-.187.019-.287.029-.198.023-.413.03-.638.04-.45.009-.948-.007-1.469-.068a11.182 11.182 0 0 1-3.215-.892 12.145 12.145 0 0 1-2.72-1.679c-.096-.072-.178-.154-.266-.225a7.03 7.03 0 0 1-.126-.109c-.04-.038-.077-.074-.117-.109-.076-.074-.153-.142-.225-.21a9.18 9.18 0 0 0-.201-.203 5.092 5.092 0 0 1-.182-.196c-.059-.064-.117-.124-.17-.183l-.293-.338a8.818 8.818 0 0 0-.241-.295c-.075-.09-.136-.179-.198-.255-.129-.152-.222-.282-.313-.38-.091-.099-.161-.177-.228-.232a.573.573 0 0 0-.177-.108.37.37 0 0 0-.281.023ZM299.997 8.05c-9.02.19-18.038.318-27.059.45l-13.53.17-13.527.12-3.383.038-3.383.051-6.766.12c-2.252.034-4.509.049-6.763.035a316.064 316.064 0 0 1-6.761-.116 475.257 475.257 0 0 1-13.527-.57c-2.252-.131-4.506-.278-6.76-.452-1.126-.088-2.252-.18-3.378-.284-1.126-.1-2.254-.213-3.38-.34l.003-.323c1.128-.112 2.257-.209 3.383-.294 1.128-.086 2.257-.161 3.386-.234 2.254-.142 4.508-.255 6.766-.354 4.511-.192 9.02-.313 13.529-.376 2.255-.03 4.509-.037 6.767-.019 2.251.02 4.506.067 6.76.134l6.764.216 3.38.102 3.383.086 13.524.314 13.527.364c9.015.263 18.033.52 27.048.84l-.003.323ZM108.218 8.05c-9.02.19-18.04.318-27.06.452l-13.529.167-13.528.12-3.383.039-3.383.051-6.766.12c-2.253.034-4.508.05-6.763.035a324.308 324.308 0 0 1-6.762-.116 475.9 475.9 0 0 1-13.525-.57 376.336 376.336 0 0 1-6.76-.451c-1.127-.09-2.253-.18-3.38-.284C2.253 7.513 1.126 7.4 0 7.272l.002-.323a144.91 144.91 0 0 1 3.384-.293c1.128-.086 2.257-.161 3.385-.235 2.255-.141 4.51-.255 6.767-.354 4.51-.191 9.02-.313 13.53-.376a324.49 324.49 0 0 1 6.764-.019c2.255.019 4.509.067 6.763.133l6.763.218 3.38.1 3.382.086 13.526.315 13.525.364c9.017.263 18.032.52 27.049.84l-.002.322Z"
    />
  </svg>
);

const KazakhCardTop = () => (
  <svg
    viewBox="0 0 340 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "36px" }}
  >
    <g opacity="0.35">
      <path
        d="M0 18 Q20 6 40 18 Q60 30 80 18 Q100 6 120 18 Q140 30 160 18 Q180 6 200 18 Q220 30 240 18 Q260 6 280 18 Q300 30 320 18 Q340 6 360 18"
        stroke="#C4A0B0"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M0 22 Q20 10 40 22 Q60 34 80 22 Q100 10 120 22 Q140 34 160 22 Q180 10 200 22 Q220 34 240 22 Q260 10 280 22 Q300 34 320 22 Q340 10 360 22"
        stroke="#E8B4C8"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
      />
    </g>
    {[40, 80, 120, 160, 200, 240, 280].map((x, i) => (
      <circle key={i} cx={x} cy="18" r="2" fill="#E8B4C8" opacity="0.5" />
    ))}
    <circle
      cx="170"
      cy="18"
      r="5"
      fill="#F9D5E5"
      stroke="#C4A0B0"
      strokeWidth="0.8"
      opacity="0.8"
    />
    <circle cx="170" cy="18" r="2.2" fill="#C4A0B0" opacity="0.7" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="#C4A0B0" />
    <circle cx="12" cy="15" r="1" fill="#C4A0B0" />
    <circle cx="16" cy="15" r="1" fill="#C4A0B0" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const GuestsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const InstagramIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill={color} stroke="none" />
  </svg>
);

// ─── MAIN TEMPLATE ───
export default function Template1({ wedding }: { wedding: Wedding }) {
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
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 40%, #F5F0FD 100%)",
      }}
    >
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.25s; }
        .fade-up-3 { animation-delay: 0.4s; }
      `}</style>

      {/* ═══ БАСТЫ ФОТО ═══ */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Басты сурет"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #F9D5E5 0%, #FDF6F0 50%, #E5D5F9 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="15" cy="15" r="1" fill="#C4A0B0" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle
                  cx="28"
                  cy="44"
                  r="18"
                  stroke="#C8A84B"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="44"
                  r="12"
                  stroke="#E8C96A"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle
                  cx="52"
                  cy="36"
                  r="18"
                  stroke="#C8A84B"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="52"
                  cy="36"
                  r="12"
                  stroke="#E8C96A"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M52 20 L53.5 15 L55 20 L60 21.5 L55 23 L53.5 28 L52 23 L47 21.5 Z"
                  fill="#F5D878"
                  opacity="0.9"
                />
              </svg>
              <p className="text-rose-300/50 text-[10px] tracking-[0.4em] uppercase font-[Josefin_Sans,sans-serif]">
                Үйлену тойы
              </p>
            </div>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #FDF0F5 0%, transparent 55%)",
          }}
        />
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

      {/* ═══ ЕСІМДЕР ═══ */}
      <div className="text-center px-6 -mt-14 relative z-10">
        <div
          className="fade-up fade-up-1 inline-flex items-center justify-center mb-4 bg-white/70 backdrop-blur-sm p-2.5 rounded-full border border-yellow-200/60"
          style={{ boxShadow: "0 2px 12px rgba(212,175,55,0.18)" }}
        >
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
            <circle
              cx="17"
              cy="27"
              r="11"
              stroke="#C8A84B"
              strokeWidth="2.2"
              fill="none"
            />
            <circle
              cx="17"
              cy="27"
              r="7.5"
              stroke="#E8C96A"
              strokeWidth="1.2"
              fill="none"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={17 + 9.5 * Math.cos(rad)}
                  cy={27 + 9.5 * Math.sin(rad)}
                  r="0.9"
                  fill="#D4AF37"
                  opacity="0.8"
                />
              );
            })}
            <circle
              cx="31"
              cy="21"
              r="11"
              stroke="#C8A84B"
              strokeWidth="2.2"
              fill="none"
            />
            <circle
              cx="31"
              cy="21"
              r="7.5"
              stroke="#E8C96A"
              strokeWidth="1.2"
              fill="none"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={31 + 9.5 * Math.cos(rad)}
                  cy={21 + 9.5 * Math.sin(rad)}
                  r="0.9"
                  fill="#D4AF37"
                  opacity="0.8"
                />
              );
            })}
            <path
              d="M31 13 L32 10 L33 13 L36 14 L33 15 L32 18 L31 15 L28 14 Z"
              fill="#F5D878"
              opacity="0.9"
            />
          </svg>
        </div>

        <h1
          className="fade-up fade-up-1 text-[#7B3F5E] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.2rem, 10vw, 3rem)" }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-up-2 flex items-center justify-center gap-3 my-4">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
            <path
              d="M14 21 C14 21 3 14 3 8 C3 4.5 6 2 9.5 2 C11.5 2 13 3 14 4.5 C15 3 16.5 2 18.5 2 C22 2 25 4.5 25 8 C25 14 14 21 14 21Z"
              fill="#F9D5E5"
              stroke="#E8B4C8"
              strokeWidth="1"
            />
          </svg>
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #E8B4C8)",
            }}
          />
        </div>

        <h1
          className="fade-up fade-up-2 text-[#7B3F5E] font-light italic leading-tight"
          style={{ fontSize: "clamp(2.2rem, 10vw, 3rem)" }}
        >
          {wedding.female_name}
        </h1>

        <div className="fade-up fade-up-3 flex justify-center mt-4">
          <OrnamentDivider />
        </div>
      </div>

      {/* ═══ ШАҚЫРУ МӘТІНІ + ТОЙ ИЕЛЕРІ ═══ */}
      {(wedding.description1 || wedding.organizer) && (
        <div className="mx-5 mt-7">
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(232,180,200,0.45)",
              boxShadow:
                "0 8px 32px rgba(196,160,176,0.18), 0 2px 8px rgba(196,160,176,0.10)",
            }}
          >
            <div className="pt-2 px-2">
              <KazakhCardTop />
            </div>

            {wedding.description1 && (
              <div className="px-6 pt-2 pb-4 text-center relative">
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  className="mx-auto mb-2 opacity-40"
                >
                  <path
                    d="M0 16 C0 10 2 6 6 4 L8 0 C2 2 0 7 0 16Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M12 16 C12 10 14 6 18 4 L20 0 C14 2 12 7 12 16Z"
                    fill="#C4A0B0"
                  />
                </svg>
                <p
                  className="text-[#9B6B7E] text-[15px] leading-[1.85] text-center font-[Cormorant_Garamond,serif] italic"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {wedding.description1}
                </p>
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  className="mx-auto mt-2 opacity-40 rotate-180"
                >
                  <path
                    d="M0 16 C0 10 2 6 6 4 L8 0 C2 2 0 7 0 16Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M12 16 C12 10 14 6 18 4 L20 0 C14 2 12 7 12 16Z"
                    fill="#C4A0B0"
                  />
                </svg>
              </div>
            )}

            {wedding.description1 && wedding.organizer && (
              <div className="px-6">
                <KazakhBorder />
              </div>
            )}

            {wedding.organizer && (
              <div className="px-6 py-4">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="1"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="1"
                      y="7"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="7"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <circle cx="6" cy="6" r="1.2" fill="#E8B4C8" />
                  </svg>
                  <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif]">
                    Той иелері
                  </p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="1"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="1"
                      y="7"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="7"
                      width="4"
                      height="4"
                      stroke="#C4A0B0"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <circle cx="6" cy="6" r="1.2" fill="#E8B4C8" />
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #F9D5E5, #FDF0F5)",
                      border: "1px solid rgba(232,180,200,0.5)",
                    }}
                  >
                    <GuestsIcon />
                  </div>
                  <p
                    className="text-[#9B6B7E] text-[15px] font-[Cormorant_Garamond,serif] font-light text-center"
                    style={{ wordBreak: "break-word" }}
                  >
                    {wedding.organizer}
                  </p>
                </div>
              </div>
            )}

            <div className="pb-2 px-2 rotate-180">
              <KazakhCardTop />
            </div>
          </div>
        </div>
      )}

      {/* ═══ ФОТОАЛЬБОМ — GallerySwiper ═══ */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-8">
          <div className="flex items-center gap-3 px-5 mb-4">
            <div className="h-px flex-1 bg-rose-100" />
            <p className="text-rose-300 text-[10px] tracking-[0.3em] uppercase font-[Josefin_Sans,sans-serif]">
              Фотоальбом
            </p>
            <div className="h-px flex-1 bg-rose-100" />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ═══ ҚОСЫМША МӘТІН ═══ */}
      {wedding.description2 && (
        <div className="mx-5 mt-7">
          <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-5 border border-rose-100/40 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{
                background: "linear-gradient(to bottom, #F9D5E5, #E8B4C8)",
                borderRadius: "24px 0 0 24px",
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

      {/* ═══ ЖҰПТЫҢ СУРЕТТЕРІ ═══ */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-rose-100" />
            <SmallOrnament />
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

      {/* ═══ INSTAGRAM СІЛТЕМЕЛЕРІ ═══ */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-7 flex flex-row gap-5">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(196,160,176,0.4)",
                color: "#9B6B7E",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              <InstagramIcon />
              Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-[Josefin_Sans,sans-serif] text-xs tracking-widest uppercase transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7B3F5E, #C4A0B0)",
              }}
            >
              <InstagramIcon color="white" />
              Instagram
            </a>
          )}
        </div>
      )}

      {/* ═══ ТОЙ МӘЛІМЕТТЕРІ КАРТАСЫ ═══ */}
      <div className="mx-5 mt-8 mb-2">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(232,180,200,0.45)",
            boxShadow:
              "0 8px 32px rgba(196,160,176,0.18), 0 2px 8px rgba(196,160,176,0.10)",
          }}
        >
          <div
            className="h-1"
            style={{
              background:
                "linear-gradient(to right, #F9D5E5, #C4A0B0, #D5D5F9)",
            }}
          />
          <div className="px-2 pt-1">
            <KazakhBorder />
          </div>

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
                  <CalendarIcon />
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
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C4A0B0"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
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
                  <LocationIcon />
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
                    <div className="flex items-start gap-1 mt-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C4A0B0"
                        strokeWidth="2"
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <p
                        className="text-rose-400 text-xs font-[Josefin_Sans,sans-serif] leading-relaxed"
                        style={{ wordBreak: "break-word" }}
                      >
                        {wedding.venue_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Байланыс (телефон) */}
            {wedding.phone && (
              <div className="flex items-center gap-4 pt-3 border-t border-rose-50">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #F9D5E5, #FDF0F5)",
                  }}
                >
                  <PhoneIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-rose-300 text-[10px] tracking-[0.25em] uppercase font-[Josefin_Sans,sans-serif]">
                    Байланыс
                  </p>
                  <a
                    href={`tel:${wedding.phone}`}
                    className="text-[#7B3F5E] text-base font-light italic mt-0.5 hover:underline block"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    {wedding.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Қосымша ақпарат */}
            {extras.length > 0 && (
              <div className="pt-3 border-t border-rose-50 space-y-2.5">
                {extras.map((e, i) => (
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

          <div className="px-2 pb-1 rotate-180">
            <KazakhBorder />
          </div>
        </div>
      </div>

      {/* ═══ ПІКІРЛЕР ═══ */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B3F5E"
        lightColor="#FDF0F5"
        borderColor="border-rose-100"
      />

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-10 mt-4">
        <div className="flex justify-center mb-4">
          <OrnamentDivider />
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
