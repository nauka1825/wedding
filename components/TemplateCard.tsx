"use client";
import Image from "next/image";
import { Wedding } from "@/lib/supabase";

const TEMPLATE_STYLES = {
  romantic: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    name: "bg-rose-100 text-rose-600",
    title: "text-rose-800",
    sub: "text-rose-500",
    badge: "Romantic",
    dot: "bg-rose-400",
  },
  luxury: {
    bg: "bg-neutral-900",
    border: "border-amber-800/40",
    name: "bg-amber-900/40 text-amber-400",
    title: "text-amber-200",
    sub: "text-amber-600",
    badge: "Luxury",
    dot: "bg-amber-400",
  },
  bohemian: {
    bg: "bg-stone-100",
    border: "border-emerald-200",
    name: "bg-emerald-50 text-emerald-700",
    title: "text-stone-800",
    sub: "text-stone-500",
    badge: "Bohemian",
    dot: "bg-emerald-500",
  },
  azure: {
    bg: "bg-stone-100",
    border: "border-emerald-200",
    name: "bg-emerald-50 text-emerald-700",
    title: "text-stone-800",
    sub: "text-stone-500",
    badge: "Azure",
    dot: "bg-emerald-500",
  },
};

export default function TemplateCard({ wedding }: { wedding: Wedding }) {
  // const style = TEMPLATE_STYLES.[wedding.template || "romantic"];
  const date = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow`}

      // className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${style.bg} ${style.border}`}
    >
      {/* <div className="relative w-full h-48 overflow-hidden">
        {wedding.main_photo_url ? (
          <Image
            src={wedding.main_photo_url}
            alt="Гол зураг"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${style.bg}`}
          >
            <span className="text-5xl opacity-30">💍</span>
          </div>
        )}
     
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs px-2 py-1 rounded-full font-[Josefin_Sans,sans-serif] tracking-wide ${style.name}`}
          >
            {style.badge}
          </span>
        </div>
      </div>

     
      <div className="p-4">
      
        <h2
          className={`font-[Playfair_Display,serif] text-xl font-light ${style.title}`}
        >
          {wedding.male_name} & {wedding.female_name}
        </h2>

      
        {date && (
          <p
            className={`text-xs mt-1 font-[Josefin_Sans,sans-serif] tracking-wide ${style.sub}`}
          >
            📅 {date}
          </p>
        )}
        {wedding.venue_name && (
          <p
            className={`text-xs mt-0.5 font-[Josefin_Sans,sans-serif] ${style.sub}`}
          >
            📍 {wedding.venue_name}
          </p>
        )}

     
        <div className={`h-px my-3 ${style.border} border-t`} />

       
        <div className="space-y-1">
          <p
            className={`text-xs font-[Josefin_Sans,sans-serif] ${style.sub} truncate`}
          >
            <span className="opacity-60">ID: </span>
            {wedding.id}
          </p>
          {wedding.phone && (
            <p
              className={`text-xs font-[Josefin_Sans,sans-serif] ${style.sub}`}
            >
              <span className="opacity-60">Утас: </span>
              {wedding.phone}
            </p>
          )}
        </div> */}

      <a
        href={`/weddings/${wedding.id}`}
        className={`mt-4 block text-center text-xs py-2 px-4 rounded-lg border font-[Josefin_Sans,sans-serif] tracking-widest uppercase transition-opacity hover:opacity-70`}
      >
        Дэлгэрэнгүй харах →
      </a>
      {/* </div> */}
    </div>
  );
}
