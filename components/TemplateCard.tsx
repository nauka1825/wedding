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
      className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${style.bg} ${style.border}`}
    >
      {/* Colored left accent bar via top strip */}
      <div className={`h-1 w-full ${style.accent} opacity-60`} />

      {/* Photo */}
      {wedding.main_photo_url && (
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={wedding.main_photo_url}
            alt="Гол зураг"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] px-2 py-1 rounded-full font-josefin tracking-wide backdrop-blur-sm ${style.name}`}
            >
              {style.badge}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        {/* Names */}
        <h2
          className={`font-playfair text-xl font-light leading-tight ${style.title}`}
        >
          {wedding.male_name} & {wedding.female_name}
        </h2>

        {/* Date & Venue */}
        <div className="mt-1.5 space-y-0.5">
          {date && (
            <p className={`text-xs font-josefin tracking-wide ${style.sub}`}>
              📅 {date}
            </p>
          )}
          {wedding.venue_name && (
            <p className={`text-xs font-josefin ${style.sub}`}>
              📍 {wedding.venue_name}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className={`h-px my-3 border-t ${style.border}`} />

        {/* Meta info */}
        <div className="space-y-1">
          <p className={`text-xs font-josefin ${style.sub} truncate`}>
            <span className="opacity-50">ID: </span>
            {wedding.id}
          </p>
          {wedding.phone && (
            <p className={`text-xs font-josefin ${style.sub}`}>
              <span className="opacity-50">📞 </span>
              {wedding.phone}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => router.push(`/weddings/${wedding.id}`)}
          className={`mt-4 w-full text-center text-[11px] py-2.5 px-4 rounded-xl border font-josefin tracking-widest uppercase transition-colors ${style.btn}`}
        >
          Дэлгэрэнгүй харах →
        </button>
      </div>
    </div>
  );
}
