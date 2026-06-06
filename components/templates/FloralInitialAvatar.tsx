function GoldCircleSVG() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="70"
        cy="70"
        r="64"
        fill="rgba(201,168,76,0.09)"
        stroke="rgba(201,168,76,0.22)"
        strokeWidth="0.8"
      />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="rgba(201,168,76,0.12)"
        strokeWidth="0.5"
      />
      <g opacity="0.68">
        <path
          d="M70,98 C70,98 43,80 43,58 C43,46 53,38 64,43 C68,45 70,50 70,53 C70,50 72,45 76,43 C87,38 97,46 97,58 C97,80 70,98 70,98Z"
          fill="rgba(201,168,76,0.08)"
          stroke="rgba(201,168,76,0.5)"
          strokeWidth="1.1"
        />
        <path
          d="M60,50 C62,47 66,45 70,47"
          stroke="rgba(240,210,120,0.55)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g opacity="0.55">
        <path
          d="M36,42 C38,38 35,34 32,36 C29,38 30,42 33,43 C31,39 34,37 36,40Z"
          fill="rgba(201,168,76,0.6)"
        />
        <path
          d="M104,44 C106,40 103,36 100,38 C97,40 98,44 101,44Z"
          fill="rgba(201,168,76,0.5)"
        />
        <path
          d="M34,94 C36,90 33,87 31,89 C29,91 30,94 32,94Z"
          fill="rgba(201,168,76,0.5)"
        />
        <path
          d="M106,92 C108,88 105,85 103,87 C101,89 102,92 104,92Z"
          fill="rgba(201,168,76,0.45)"
        />
        <path
          d="M56,20 C57,18 56,15 54,17 C53,19 54,21 56,21Z"
          fill="rgba(201,168,76,0.5)"
        />
        <path
          d="M86,20 C87,18 86,15 84,17 C83,19 84,21 86,21Z"
          fill="rgba(201,168,76,0.45)"
        />
      </g>
      <circle cx="50" cy="28" r="1.8" fill="#C9A84C" opacity="0.65" />
      <circle cx="92" cy="28" r="2" fill="#C9A84C" opacity="0.6" />
      <circle cx="112" cy="72" r="1.5" fill="#C9A84C" opacity="0.55" />
      <circle cx="70" cy="108" r="2" fill="#C9A84C" opacity="0.6" />
      <circle cx="28" cy="72" r="1.5" fill="#C9A84C" opacity="0.55" />
      <circle cx="36" cy="100" r="1.6" fill="#C9A84C" opacity="0.5" />
      <circle cx="104" cy="100" r="1.6" fill="#C9A84C" opacity="0.5" />
      <path
        d="M48,26 L48.7,28.2 L51,28 L48.7,28.8 L48,31 L47.3,28.8 L45,28 L47.3,28.2Z"
        fill="#EAC84A"
        opacity="0.6"
      />
      <path
        d="M93,24 L93.5,26 L95.5,25.8 L93.5,26.6 L93,28.5 L92.5,26.6 L90.5,25.8 L92.5,26Z"
        fill="#EAC84A"
        opacity="0.5"
      />
    </svg>
  );
}

interface FloralInitialCardProps {
  letter: string;
  name: string;
}

function FloralInitialCard({ letter, name }: FloralInitialCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%", // ← хоёулаа дугуй
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <GoldCircleSVG /> {/* ← нэг л SVG компонент */}
        <span
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1,
            background:
              "linear-gradient(135deg,#BF953F 0%,#FCF6BA 30%,#B38728 55%,#FBF5B7 75%,#AA771C 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer-gold 5s linear infinite",
            position: "relative",
            zIndex: 2,
            userSelect: "none",
            filter: "drop-shadow(0 2px 8px rgba(170,119,28,0.22))",
          }}
        >
          {letter}
        </span>
      </div>
      <h1
        className="fade-up fade-1 shimmer-gold font-light italic leading-tight"
        style={{ fontSize: "clamp(2.6rem,11vw,3.6rem)" }}
      >
        {name}
      </h1>
    </div>
  );
}

interface FloralInitialAvatarProps {
  maleName: string;
  femaleName: string;
}

export default function FloralInitialAvatar({
  maleName,
  femaleName,
}: FloralInitialAvatarProps) {
  const mLetter = maleName?.trim().charAt(0).toUpperCase() || "О";
  const fLetter = femaleName?.trim().charAt(0).toUpperCase() || "Б";
  const mFirst = maleName?.split(" ")[0] || maleName || "";
  const fFirst = femaleName?.split(" ")[0] || femaleName || "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cinzel:wght@400&display=swap');
        @keyframes fi-fadein {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer-gold {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        .fi-card-anim { animation: fi-fadein 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fi-card-anim:nth-child(1) { animation-delay:0.05s; }
        .fi-card-anim:nth-child(3) { animation-delay:0.2s; }
      `}</style>

      <div
        style={{
          display: "flex",
          gap: "clamp(28px,8vw,60px)",
          justifyContent: "center",
          alignItems: "center",
          padding: "clamp(28px,6vw,52px) 20px",
          background: "transparent",
        }}
      >
        <div className="fi-card-anim">
          <FloralInitialCard letter={mLetter} name={mFirst} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            opacity: 0.7,
            marginTop: "-4px",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "32px",
              background:
                "linear-gradient(to bottom,transparent,rgba(201,168,76,0.5),transparent)",
            }}
          />
          <span
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#C9A84C",
              lineHeight: 1,
            }}
          >
            &amp;
          </span>
          <div
            style={{
              width: "1px",
              height: "32px",
              background:
                "linear-gradient(to bottom,transparent,rgba(201,168,76,0.5),transparent)",
            }}
          />
        </div>

        <div className="fi-card-anim">
          <FloralInitialCard letter={fLetter} name={fFirst} />
        </div>
      </div>
    </>
  );
}
