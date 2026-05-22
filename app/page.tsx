"use client";
import WeddingForm from "@/components/WeddingForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-rose-100/50 px-5 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-rose-300 text-lg">✿</span>
            <span className="font-playfair text-stone-700 text-lg font-light tracking-wide">
              Хурмын бүртгэл
            </span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
            <span className="text-xs">💍</span>
          </div>
        </nav>

        {/* Hero banner */}
        <div className="mx-4 mt-5 mb-4 rounded-3xl overflow-hidden bg-gradient-to-br from-[#7B3F5E] via-[#9B6B7E] to-[#C4A0B0] p-6 relative">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-3 right-6 text-6xl rotate-12">🌸</div>
            <div className="absolute bottom-3 left-4 text-5xl -rotate-12">
              ❀
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-josefin text-rose-200 text-[10px] tracking-[0.4em] uppercase mb-2">
              Wedding Registry
            </p>
            <h1 className="font-playfair text-white text-2xl font-light leading-snug">
              Хурмын урилга
              <br />
              <span className="italic">бүртгэлийн систем</span>
            </h1>
            <p className="font-josefin text-rose-200/80 text-xs mt-3 tracking-wide">
              Мэдээллээ оруулж загвараа сонгоорой
            </p>
          </div>
        </div>

        <WeddingForm onSuccess={() => {}} />
      </div>
    </main>
  );
}
