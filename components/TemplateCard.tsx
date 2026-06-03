"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Wedding } from "@/lib/supabase";

const TEMPLATE_STYLES = {
  romantic: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-400",
    name: "bg-rose-100 text-rose-600",
    title: "text-rose-800",
    sub: "text-rose-400",
    badge: "Romantic",
    btn: "border-rose-200 text-rose-700 hover:bg-rose-100",
  },
  luxury: {
    bg: "bg-neutral-900",
    border: "border-amber-800/40",
    accent: "bg-amber-400",
    name: "bg-amber-900/40 text-amber-400",
    title: "text-amber-200",
    sub: "text-amber-600",
    badge: "Luxury",
    btn: "border-amber-800/40 text-amber-400 hover:bg-amber-900/20",
  },
  bohemian: {
    bg: "bg-stone-50",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    name: "bg-emerald-50 text-emerald-700",
    title: "text-stone-800",
    sub: "text-stone-500",
    badge: "Bohemian",
    btn: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
  },
  azure: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    accent: "bg-sky-400",
    name: "bg-sky-100 text-sky-700",
    title: "text-sky-900",
    sub: "text-sky-500",
    badge: "Azure",
    btn: "border-sky-200 text-sky-700 hover:bg-sky-100",
  },
  sage: {
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "bg-green-400",
    name: "bg-green-100 text-green-700",
    title: "text-green-900",
    sub: "text-green-500",
    badge: "Sage",
    btn: "border-green-200 text-green-700 hover:bg-green-50",
  },
  blush: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "bg-pink-400",
    name: "bg-pink-100 text-pink-600",
    title: "text-pink-900",
    sub: "text-pink-400",
    badge: "Blush",
    btn: "border-pink-200 text-pink-700 hover:bg-pink-100",
  },
  midnight: {
    bg: "bg-slate-900",
    border: "border-slate-700",
    accent: "bg-indigo-400",
    name: "bg-slate-800 text-indigo-300",
    title: "text-slate-100",
    sub: "text-slate-400",
    badge: "Midnight",
    btn: "border-slate-700 text-slate-300 hover:bg-slate-800",
  },
  terracotta: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "bg-orange-400",
    name: "bg-orange-100 text-orange-700",
    title: "text-orange-900",
    sub: "text-orange-500",
    badge: "Terracotta",
    btn: "border-orange-200 text-orange-700 hover:bg-orange-50",
  },
};

export default function TemplateCard({ wedding }: { wedding: Wedding }) {
  const router = useRouter();
  const style =
    TEMPLATE_STYLES[
      (wedding.template as keyof typeof TEMPLATE_STYLES) ?? "romantic"
    ] ?? TEMPLATE_STYLES.romantic;

  const date = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={`rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] ${style.bg} ${style.border}`}
      onClick={() => router.push(`/weddings/${wedding.id}`)}
    >
      {/* Top accent */}
      <div className={`h-0.5 w-full ${style.accent} opacity-70`} />

      {/* Photo */}
      {wedding.main_photo_url ? (
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={wedding.main_photo_url}
            alt="Гол зураг"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
          {/* Badge over image */}
          <div className="absolute top-2 right-2">
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold tracking-wide ${style.name}`}
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {style.badge}
            </span>
          </div>
        </div>
      ) : (
        /* No photo placeholder */
        <div
          className={`w-full aspect-[4/3] flex items-center justify-center ${style.accent} opacity-10`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="opacity-40"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )}

      {/* Body */}
      <div className="p-2.5">
        {/* Names */}
        <h2
          className={`font-light leading-tight truncate ${style.title}`}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontSize: "13px",
          }}
        >
          {wedding.female_name || wedding.male_name}
        </h2>

        {/* Date */}
        {date && (
          <p
            className={`mt-0.5 truncate ${style.sub}`}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.02em",
            }}
          >
            {date}
          </p>
        )}

        {/* Venue */}
        {wedding.venue_name && (
          <p
            className={`truncate ${style.sub}`}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px" }}
          >
            {wedding.venue_name}
          </p>
        )}

        {/* View button */}
        <div
          className={`mt-2 w-full text-center py-1.5 rounded-lg border text-[9px] tracking-widest uppercase transition-colors ${style.btn}`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Харах →
        </div>
      </div>
    </div>
  );
}
