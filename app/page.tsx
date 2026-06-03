"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      r: number;
      speed: number;
      opacity: number;
      drift: number;
    }[] = [];
    for (let i = 0; i < 38; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.35 + 0.05,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #B8DEFF 0%, #7EC8F0 25%, #4AABDC 55%, #1E7DB5 80%, #0D5A8E 100%)",
      }}
    >
      {/* Animated particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Soft cloud-like glow blobs */}
      <div
        className="absolute top-[-80px] left-[-60px] w-[340px] h-[280px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        className="absolute bottom-[120px] right-[-40px] w-[260px] h-[200px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-14 pb-4 text-center px-5">
        {/* Logo mark */}
        <div className="flex justify-center mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.30)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C9.5 8 3 9.5 3 12s6.5 4 9 9c2.5-5 9-6.5 9-9S14.5 8 12 3z"
                fill="rgba(255,255,255,0.85)"
              />
            </svg>
          </div>
        </div>

        <h1
          className="text-4xl md:text-5xl font-light text-white mb-2 leading-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.01em",
          }}
        >
          Шақыру жасау
        </h1>
        <p
          className="text-white/65 text-sm tracking-[0.25em] uppercase"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          Іс-шара түрін таңдаңыз
        </p>

        {/* Thin decorative line */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div
            className="h-px w-16"
            style={{ background: "rgba(255,255,255,0.25)" }}
          />
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div
            className="h-px w-16"
            style={{ background: "rgba(255,255,255,0.25)" }}
          />
        </div>
      </header>

      {/* Cards */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-5 py-6">
        <div className="w-full max-w-sm space-y-4">
          {/* Wedding card */}
          <button
            onClick={() => (window.location.href = "/toi")}
            className="group relative w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 active:scale-[0.97] hover:scale-[1.02] hover:shadow-sky-900/40"
            style={{ height: 168 }}
          >
            {/* BG image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('/images/uilenu_toi.jpg')" }}
            />
            {/* Overlays */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(7,40,70,0.82) 0%, rgba(7,40,70,0.45) 55%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)",
              }}
            />

            {/* Glass pill badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <span
                className="text-white/90 text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                Шақыру
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-end p-5">
              <div className="flex items-end justify-between w-full">
                <div>
                  <h2
                    className="text-2xl font-light text-white leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Үйлену тойы
                  </h2>
                  <p
                    className="text-white/60 text-xs mt-0.5 tracking-wide"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    Той шақыруын жасау
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>

          {/* Uzatu card */}
          <button
            onClick={() => (window.location.href = "/uzatu")}
            className="group relative w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 active:scale-[0.97] hover:scale-[1.02] hover:shadow-sky-900/40"
            style={{ height: 168 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('/images/khiz_uzatu.jpeg')" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(7,40,70,0.82) 0%, rgba(7,40,70,0.45) 55%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)",
              }}
            />

            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <span
                className="text-white/90 text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                Шақыру
              </span>
            </div>

            <div className="relative z-10 flex h-full items-end p-5">
              <div className="flex items-end justify-between w-full">
                <div>
                  <h2
                    className="text-2xl font-light text-white leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Қыз ұзату
                  </h2>
                  <p
                    className="text-white/60 text-xs mt-0.5 tracking-wide"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    Ұзату кеші шақыруын жасау
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto">
        <div
          className="px-5 pt-8 pb-8 text-center"
          style={{
            background:
              "linear-gradient(to top, rgba(5,35,65,0.70) 0%, transparent 100%)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: "rgba(255,255,255,0.20)" }}
            />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C9.5 8 3 9.5 3 12s6.5 4 9 9c2.5-5 9-6.5 9-9S14.5 8 12 3z"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
            <div
              className="h-px w-12"
              style={{ background: "rgba(255,255,255,0.20)" }}
            />
          </div>
          <p
            className="text-white/80 text-base font-light mb-1 tracking-wide"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
            }}
          >
            Қазақтың тойы бітпесін
          </p>
          <p
            className="text-white/45 text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            +976 9952 1825
          </p>
        </div>
      </footer>
    </main>
  );
}
