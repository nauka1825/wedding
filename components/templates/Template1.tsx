"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicMan from "../MusicMan";

// ─── IcCalendar — хуанли дурлалтай хурц ───
const IcCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {/* body */}
    <rect x="3" y="5" width="18" height="17" rx="4" fill="url(#cal-body)" />
    {/* header */}
    <rect x="3" y="5" width="18" height="7" rx="4" fill="url(#cal-head)" />
    <rect x="3" y="9" width="18" height="3" fill="url(#cal-head)" />
    {/* hooks */}
    <line
      x1="8"
      y1="3"
      x2="8"
      y2="7.5"
      stroke="#F9A8D4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="3"
      x2="16"
      y2="7.5"
      stroke="#F9A8D4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* dots */}
    <circle cx="8" cy="15" r="1.5" fill="#F472B6" />
    <circle cx="12" cy="15" r="1.5" fill="#EC4899" />
    <circle cx="16" cy="15" r="1.5" fill="#DB2777" />
    <circle cx="8" cy="19" r="1.5" fill="#F9A8D4" />
    <circle cx="12" cy="19" r="1.5" fill="#F472B6" />
    <defs>
      <linearGradient
        id="cal-body"
        x1="3"
        y1="5"
        x2="21"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </linearGradient>
      <linearGradient
        id="cal-head"
        x1="3"
        y1="5"
        x2="21"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── IcClock — дугуй цаг ───
const IcClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="url(#clk-bg)" />
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#F9A8D4"
      strokeWidth="0.8"
      fill="none"
    />
    {/* ticks */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const isMain = deg % 90 === 0;
      return (
        <line
          key={i}
          x1={12 + Math.cos(r) * 8.2}
          y1={12 + Math.sin(r) * 8.2}
          x2={12 + Math.cos(r) * (isMain ? 6.5 : 7.5)}
          y2={12 + Math.sin(r) * (isMain ? 6.5 : 7.5)}
          stroke={isMain ? "#DB2777" : "#F9A8D4"}
          strokeWidth={isMain ? "1.2" : "0.6"}
          strokeLinecap="round"
        />
      );
    })}
    {/* hands */}
    <line
      x1="12"
      y1="12"
      x2="12"
      y2="6"
      stroke="#BE185D"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="16.5"
      y2="14"
      stroke="#EC4899"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="1.8" fill="#BE185D" />
    <circle cx="12" cy="12" r="0.8" fill="#FFF0F5" />
    <defs>
      <radialGradient id="clk-bg" cx="40%" cy="35%" r="65%">
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </radialGradient>
    </defs>
  </svg>
);

// ─── IcMapPin — байршлын тэмдэг ───
const IcMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="22" rx="4" ry="1.2" fill="#F9A8D4" opacity="0.4" />
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="url(#pin-body)"
    />
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 1.5 0.4 3 1.1 4.3L12 22s0,0,0,0l5.9-8.7C18.6 12 19 10.5 19 9c0-3.87-3.13-7-7-7z"
      fill="url(#pin-shine)"
      opacity="0.4"
    />
    <circle cx="12" cy="9" r="4" fill="white" opacity="0.9" />
    <circle cx="12" cy="9" r="2.5" fill="url(#pin-dot)" />
    <circle cx="10.5" cy="7.5" r="1" fill="white" opacity="0.5" />
    <defs>
      <linearGradient
        id="pin-body"
        x1="5"
        y1="2"
        x2="19"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="0.5" stopColor="#EC4899" />
        <stop offset="1" stopColor="#9D174D" />
      </linearGradient>
      <linearGradient
        id="pin-shine"
        x1="5"
        y1="2"
        x2="15"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="pin-dot" cx="40%" cy="35%" r="65%">
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#BE185D" />
      </radialGradient>
    </defs>
  </svg>
);

// ─── IcMapPinTiny ───
const IcMapPinTiny = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginTop: 2, flexShrink: 0 }}
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="url(#pin-tiny)"
    />
    <circle cx="12" cy="9" r="3" fill="white" opacity="0.85" />
    <defs>
      <linearGradient
        id="pin-tiny"
        x1="5"
        y1="2"
        x2="19"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#9D174D" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── IcPhone — утасны дүрс ───
const IcPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="1" width="14" height="22" rx="3" fill="url(#ph-body)" />
    <rect x="5" y="1" width="14" height="8" rx="3" fill="url(#ph-top)" />
    <rect x="7" y="3" width="10" height="15" rx="1.5" fill="url(#ph-screen)" />
    {/* camera */}
    <circle cx="12" cy="2.8" r="1" fill="#F9A8D4" opacity="0.6" />
    {/* home button */}
    <circle cx="12" cy="20.5" r="1.2" fill="#F9A8D4" opacity="0.7" />
    {/* screen details */}
    <rect
      x="9"
      y="5.5"
      width="6"
      height="0.8"
      rx="0.4"
      fill="#F9A8D4"
      opacity="0.5"
    />
    <rect
      x="8.5"
      y="7.5"
      width="7"
      height="4"
      rx="0.8"
      fill="#F472B6"
      opacity="0.25"
    />
    <defs>
      <linearGradient
        id="ph-body"
        x1="5"
        y1="1"
        x2="19"
        y2="23"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE7F3" />
        <stop offset="1" stopColor="#F9A8D4" />
      </linearGradient>
      <linearGradient
        id="ph-top"
        x1="5"
        y1="1"
        x2="19"
        y2="9"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient
        id="ph-screen"
        x1="7"
        y1="3"
        x2="17"
        y2="18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF0F5" />
        <stop offset="1" stopColor="#FDDDE8" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── IcUsers — хүн дүрс ───
const IcUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    {/* shadow */}
    <ellipse cx="9" cy="22.5" rx="5.5" ry="1" fill="#F9A8D4" opacity="0.3" />
    {/* back person */}
    <circle cx="16" cy="8" r="3.5" fill="url(#usr-head2)" />
    <path d="M10 22c0-4.4 2.7-8 6-8s6 3.6 6 8" fill="url(#usr-body2)" />
    {/* front person */}
    <circle cx="9" cy="8" r="4" fill="url(#usr-head)" />
    <path d="M2 22c0-4.8 3.1-8.5 7-8.5s7 3.7 7 8.5" fill="url(#usr-body)" />
    {/* shine */}
    <circle cx="7.5" cy="6.5" r="1.2" fill="white" opacity="0.45" />
    <defs>
      <radialGradient id="usr-head" cx="40%" cy="35%" r="65%">
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#DB2777" />
      </radialGradient>
      <linearGradient
        id="usr-body"
        x1="2"
        y1="13.5"
        x2="16"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="usr-head2" cx="40%" cy="35%" r="65%">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </radialGradient>
      <linearGradient
        id="usr-body2"
        x1="10"
        y1="14"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCD34D" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── IcInstagram — Instagram ───
const IcInstagram = ({ white = false }: { white?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      fill={white ? "rgba(255,255,255,0.25)" : "url(#ig-bg)"}
    />
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      stroke={white ? "rgba(255,255,255,0.5)" : "url(#ig-border)"}
      strokeWidth="0.8"
    />
    <circle
      cx="12"
      cy="12"
      r="4.5"
      stroke={white ? "white" : "url(#ig-ring)"}
      strokeWidth="1.6"
      fill="none"
    />
    <circle
      cx="17.2"
      cy="6.8"
      r="1.4"
      fill={white ? "white" : "url(#ig-dot)"}
    />
    {!white && <circle cx="10" cy="10" r="1.2" fill="white" opacity="0.3" />}
    <defs>
      <linearGradient
        id="ig-bg"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE7F3" />
        <stop offset="1" stopColor="#FDE8D8" />
      </linearGradient>
      <linearGradient
        id="ig-border"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#FCA5A5" />
      </linearGradient>
      <linearGradient
        id="ig-ring"
        x1="7.5"
        y1="7.5"
        x2="16.5"
        y2="16.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EC4899" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
      <radialGradient id="ig-dot" cx="40%" cy="40%" r="60%">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
  </svg>
);

// ─── IcHeart — зүрх дурлалтай ───
const IcHeart = () => (
  <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
    <defs>
      <radialGradient id="hrt-fill" cx="50%" cy="40%" r="65%">
        <stop stopColor="#FDF2F8" />
        <stop offset="0.5" stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#EC4899" />
      </radialGradient>
      <radialGradient id="hrt-glow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#F9A8D4" stopOpacity="0.6" />
        <stop offset="1" stopColor="#F9A8D4" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* glow */}
    <ellipse cx="16" cy="15" rx="14" ry="12" fill="url(#hrt-glow)" />
    {/* heart */}
    <path
      d="M16 24 C16 24 2 15.5 2 8.5 C2 5 4.8 2.5 8.5 2.5 C11.2 2.5 13.5 4 16 6.2 C18.5 4 20.8 2.5 23.5 2.5 C27.2 2.5 30 5 30 8.5 C30 15.5 16 24 16 24Z"
      fill="url(#hrt-fill)"
      stroke="#F9A8D4"
      strokeWidth="0.8"
    />
    {/* inner shine */}
    <ellipse
      cx="11"
      cy="8"
      rx="4.5"
      ry="3"
      fill="white"
      opacity="0.3"
      transform="rotate(-20,11,8)"
    />
    {/* sparkles */}
    <circle cx="6" cy="5" r="1.2" fill="#FDE68A" opacity="0.8" />
    <circle cx="25" cy="5" r="0.9" fill="#FDE68A" opacity="0.7" />
    <circle cx="16" cy="2" r="0.8" fill="#FDE68A" opacity="0.6" />
    <path
      d="M4 3 L4.6 4.6 L6.2 5 L4.6 5.4 L4 7 L3.4 5.4 L1.8 5 L3.4 4.6Z"
      fill="#FEF3C7"
      opacity="0.85"
    />
  </svg>
);

// ─── IcRing — БООДИТ БӨГ (realistic wedding rings) ───
const IcRing = () => (
  <svg width="52" height="52" viewBox="0 0 60 60" fill="none">
    <defs>
      {/* Алтан gradient — бодит алт өнгө */}
      <linearGradient id="gold-main" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="25%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="75%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="gold-shine" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#FDE68A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#92400E" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="gold-edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      {/* Мөнгөн/цагаан алт gradient */}
      <linearGradient id="silver-main" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5F5F4" />
        <stop offset="25%" stopColor="#D6D3D1" />
        <stop offset="50%" stopColor="#A8A29E" />
        <stop offset="75%" stopColor="#E7E5E4" />
        <stop offset="100%" stopColor="#78716C" />
      </linearGradient>
      <linearGradient id="silver-shine" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.95" />
        <stop offset="35%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      {/* Алмаз/чулуу */}
      <radialGradient id="diamond" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="white" />
        <stop offset="30%" stopColor="#E0F2FE" />
        <stop offset="60%" stopColor="#7DD3FC" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      {/* Жижиг чулуунууд */}
      <radialGradient id="gem-pink" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FDF2F8" />
        <stop offset="50%" stopColor="#F9A8D4" />
        <stop offset="100%" stopColor="#BE185D" />
      </radialGradient>
      {/* Гялбаа (glow) */}
      <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>
      {/* Shadow */}
      <radialGradient id="ring-shadow" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stopColor="#92400E" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Тунгалаг гялбаа - гэрлийн эффект */}
    <ellipse cx="26" cy="55" rx="18" ry="3.5" fill="url(#ring-shadow)" />

    {/* ── АРЫН БӨГ: Алтан эрэгтэй бөг ── */}
    {/* Гадна тойрог - алтан хүрээ */}
    <circle cx="21" cy="34" r="14.5" fill="url(#gold-main)" />
    {/* Гаднах захын тод зураас */}
    <circle
      cx="21"
      cy="34"
      r="14.5"
      stroke="#FDE68A"
      strokeWidth="0.5"
      fill="none"
      opacity="0.6"
    />
    {/* Дотор сүүдэр - гүн эффект */}
    <circle cx="21" cy="34" r="11" fill="#6B2D1A" opacity="0.85" />
    {/* Алтан дотоод хүрээ */}
    <circle
      cx="21"
      cy="34"
      r="11"
      stroke="#D97706"
      strokeWidth="0.4"
      fill="none"
      opacity="0.8"
    />
    {/* Дотор нүх - харанхуй */}
    <circle cx="21" cy="34" r="9.5" fill="#2D1810" opacity="0.95" />
    {/* Гялбааны тусгал - дээд хэсэг */}
    <ellipse
      cx="17"
      cy="25"
      rx="6"
      ry="3.5"
      fill="url(#gold-shine)"
      transform="rotate(-25,17,25)"
    />
    {/* Доод сүүдэр */}
    <ellipse
      cx="25"
      cy="42"
      rx="5"
      ry="2.5"
      fill="#92400E"
      opacity="0.4"
      transform="rotate(-15,25,42)"
    />
    {/* Хажуугийн гялбаа */}
    <ellipse cx="8" cy="34" rx="2" ry="5" fill="#FEF3C7" opacity="0.35" />
    {/* Дизайн мөр - алтан бөгийн хэвлэл */}
    <circle
      cx="21"
      cy="34"
      r="12.8"
      stroke="#FBBF24"
      strokeWidth="0.3"
      strokeDasharray="2 3"
      fill="none"
      opacity="0.5"
    />

    {/* ── УРДАХ БӨГ: Цагаан алтан эмэгтэй бөг + алмаз ── */}
    {/* Сүүдэр */}
    <ellipse cx="39" cy="27.5" rx="14" ry="2.5" fill="#78716C" opacity="0.2" />
    {/* Гадна тойрог */}
    <circle cx="39" cy="26" r="13.5" fill="url(#silver-main)" />
    <circle
      cx="39"
      cy="26"
      r="13.5"
      stroke="#E7E5E4"
      strokeWidth="0.5"
      fill="none"
      opacity="0.7"
    />
    {/* Дотор - гүн */}
    <circle cx="39" cy="26" r="10.2" fill="#3D3532" opacity="0.88" />
    <circle
      cx="39"
      cy="26"
      r="10.2"
      stroke="#A8A29E"
      strokeWidth="0.3"
      fill="none"
      opacity="0.6"
    />
    {/* Нүх */}
    <circle cx="39" cy="26" r="8.8" fill="#1C1917" opacity="0.95" />
    {/* Гялбаа */}
    <ellipse
      cx="35"
      cy="17.5"
      rx="5.5"
      ry="3"
      fill="url(#silver-shine)"
      transform="rotate(-20,35,17.5)"
    />
    {/* Хажуугийн гялбаа */}
    <ellipse cx="27.5" cy="26" rx="1.8" ry="5" fill="white" opacity="0.3" />

    {/* Алмаз чулуу - дээд хэсэгт */}
    {/* Алмазны суурь - crown setting */}
    <path d="M39 10 L36 14.5 L39 13 L42 14.5Z" fill="#D97706" />
    <path d="M36 14.5 L39 13 L42 14.5 L39 16.5Z" fill="#FBBF24" />
    {/* Прониус (prong) - алмазны барьцаа */}
    <rect
      x="38.2"
      y="9"
      width="1.6"
      height="3.5"
      rx="0.8"
      fill="url(#silver-main)"
    />
    <rect
      x="35.5"
      y="11.5"
      width="1.4"
      height="3"
      rx="0.7"
      fill="url(#silver-main)"
      transform="rotate(-35,36.2,13)"
    />
    <rect
      x="41"
      y="11.5"
      width="1.4"
      height="3"
      rx="0.7"
      fill="url(#silver-main)"
      transform="rotate(35,41.7,13)"
    />
    {/* Алмазны биет - олон талт тусгал */}
    <polygon
      points="39,8 36.5,11 37.5,15.5 40.5,15.5 41.5,11"
      fill="url(#diamond)"
    />
    <polygon points="39,8 36.5,11 39,12.5" fill="white" opacity="0.6" />
    <polygon points="39,8 41.5,11 39,12.5" fill="#BFDBFE" opacity="0.5" />
    <polygon points="36.5,11 37.5,15.5 39,12.5" fill="#7DD3FC" opacity="0.4" />
    <polygon points="41.5,11 40.5,15.5 39,12.5" fill="#0EA5E9" opacity="0.3" />
    {/* Алмазны гялбаа */}
    <circle cx="37.8" cy="9.5" r="0.7" fill="white" opacity="0.95" />
    <circle cx="40.5" cy="10" r="0.4" fill="white" opacity="0.8" />

    {/* Жижиг алмазнууд - хажуудаа */}
    {[-28, -14, 14, 28].map((ang, i) => {
      const r = (ang * Math.PI) / 180;
      const cx = 39 + Math.cos(r - Math.PI / 2) * 12;
      const cy = 26 + Math.sin(r - Math.PI / 2) * 12;
      return (
        <g key={i}>
          <circle cx={cx} cy={cy} r="1.6" fill="url(#gem-pink)" />
          <circle
            cx={cx - 0.4}
            cy={cy - 0.4}
            r="0.5"
            fill="white"
            opacity="0.8"
          />
        </g>
      );
    })}

    {/* Мөнгөн нарийн хэвлэлийн шугам */}
    <circle
      cx="39"
      cy="26"
      r="11.8"
      stroke="#D6D3D1"
      strokeWidth="0.3"
      strokeDasharray="1.5 2.5"
      fill="none"
      opacity="0.6"
    />

    {/* ── Нийлсэн газрын гялбаа ── */}
    <ellipse
      cx="30"
      cy="30"
      rx="3"
      ry="1.5"
      fill="#FDE68A"
      opacity="0.2"
      transform="rotate(-10,30,30)"
    />

    {/* Гэрлийн цацраг - дурлалтай эффект */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={39 + Math.cos(r) * 7}
          y1={8 + Math.sin(r) * 7}
          x2={39 + Math.cos(r) * 9}
          y2={8 + Math.sin(r) * 9}
          stroke="#FEF9C3"
          strokeWidth="0.6"
          opacity={i % 2 === 0 ? 0.7 : 0.4}
          strokeLinecap="round"
        />
      );
    })}

    {/* Тоос - sparkle эффект */}
    <circle cx="10" cy="15" r="1" fill="#FDE68A" opacity="0.6" />
    <circle cx="52" cy="18" r="0.8" fill="#FDE68A" opacity="0.5" />
    <circle cx="6" cy="42" r="0.7" fill="#F9A8D4" opacity="0.5" />
    <circle cx="55" cy="38" r="1" fill="#FDE68A" opacity="0.4" />
    <path
      d="M8 12 L8.6 13.8 L10.5 14 L8.6 14.2 L8 16 L7.4 14.2 L5.5 14 L7.4 13.8Z"
      fill="#FEF3C7"
      opacity="0.75"
    />
    <path
      d="M51 15 L51.5 16.5 L53 16.7 L51.5 16.9 L51 18.5 L50.5 16.9 L49 16.7 L50.5 16.5Z"
      fill="#FEF3C7"
      opacity="0.65"
    />
  </svg>
);

// ─── FloralDivider ───
const FloralDivider = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 32"
    fill="none"
    className={className}
    style={{ width: "100%", maxWidth: 280, height: 32 }}
  >
    <defs>
      <linearGradient id="vine-l" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="0" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="vine-r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="1" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 16 Q15 16 25 16"
      stroke="url(#vine-l)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M25 16 Q30 16 35 14 Q40 12 42 16 Q40 20 35 18 Q30 16 35 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M42 16 Q52 16 60 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M60 16 Q64 16 66 13 Q70 8 73 11 Q75 14 72 17 Q69 20 66 17 Q64 16 66 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="37" cy="10" r="1.2" fill="#E8C0D0" opacity="0.7" />
    <circle cx="69" cy="22" r="1" fill="#E8C0D0" opacity="0.6" />
    <path
      d="M73 16 Q88 16 96 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M96 16 Q100 16 102 14 Q105 10 108 13 Q110 16 107 19 Q104 21 101 18 Q100 16 102 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M108 16 Q118 16 124 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <g transform="translate(128,6)">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 7}
            cy={10 + Math.sin(r) * 7}
            rx="3.5"
            ry="5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 7},${10 + Math.sin(r) * 7})`}
            fill="#F2C8DC"
            opacity="0.55"
          />
        );
      })}
      {[30, 90, 150, 210, 270, 330].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 4}
            cy={10 + Math.sin(r) * 4}
            rx="2.2"
            ry="3.5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
            fill="#E8A8C4"
            opacity="0.65"
          />
        );
      })}
      <circle cx="12" cy="10" r="3" fill="#D4809C" opacity="0.8" />
      <circle cx="12" cy="10" r="1.5" fill="#C06080" opacity="0.9" />
      <circle cx="4" cy="2" r="1" fill="#F2C8DC" opacity="0.5" />
      <circle cx="20" cy="2" r="0.8" fill="#F2C8DC" opacity="0.4" />
      <circle cx="4" cy="19" r="0.8" fill="#F2C8DC" opacity="0.4" />
      <circle cx="20" cy="19" r="1" fill="#F2C8DC" opacity="0.5" />
    </g>
    <path
      d="M156 16 Q162 16 172 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <path
      d="M172 16 Q176 16 178 18 Q181 22 184 19 Q186 16 183 13 Q180 10 177 14 Q176 16 178 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="180" cy="22" r="1" fill="#E8C0D0" opacity="0.6" />
    <path
      d="M184 16 Q192 16 207 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M207 16 Q211 16 213 14 Q216 10 219 13 Q221 16 218 19 Q215 21 212 18 Q211 16 213 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="211" cy="10" r="1.2" fill="#E8C0D0" opacity="0.7" />
    <path
      d="M219 16 Q227 16 238 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M238 16 Q243 16 245 14 Q248 9 251 12 Q253 16 250 18 Q247 21 244 17 Q243 16 245 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="244" cy="22" r="1" fill="#E8C0D0" opacity="0.5" />
    <path
      d="M251 16 Q261 16 280 16"
      stroke="url(#vine-r)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

// ─── CardWaveDecor ───
const CardWaveDecor = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 360 28"
    fill="none"
    style={{
      width: "100%",
      height: 28,
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  >
    <defs>
      <linearGradient id={`wave-grad-${flip}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#E8B4C8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M0 20 Q30 8 60 20 Q90 32 120 20 Q150 8 180 20 Q210 32 240 20 Q270 8 300 20 Q330 32 360 20"
      stroke={`url(#wave-grad-${flip})`}
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M0 24 Q30 12 60 24 Q90 36 120 24 Q150 12 180 24 Q210 36 240 24 Q270 12 300 24 Q330 36 360 24"
      stroke="#F2C8DC"
      strokeWidth="0.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.3"
    />
    {[60, 120, 180, 240, 300].map((x, i) => (
      <g key={i} transform={`translate(${x},20)`}>
        <path d="M0-3 L2 0 L0 3 L-2 0Z" fill="#DDA8C0" opacity="0.55" />
      </g>
    ))}
    <g transform="translate(180,14)">
      <path d="M0-5 L3 0 L0 5 L-3 0Z" fill="#CC8EAA" opacity="0.7" />
      <circle cx="0" cy="0" r="1.5" fill="#B87090" opacity="0.8" />
    </g>
  </svg>
);

// ─── SmallDivider ───
const SmallDivider = () => (
  <svg viewBox="0 0 160 20" fill="none" style={{ width: 160, height: 20 }}>
    <defs>
      <linearGradient id="sdiv-l" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="sdiv-r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="1" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 10 L55 10"
      stroke="url(#sdiv-l)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <circle cx="62" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
    {[0, 72, 144, 216, 288].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={80 + Math.cos(r) * 4}
          cy={10 + Math.sin(r) * 4}
          rx="2"
          ry="3"
          transform={`rotate(${deg + 90},${80 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
          fill="#EEBAD0"
          opacity="0.5"
        />
      );
    })}
    <circle cx="80" cy="10" r="2.2" fill="#D4809C" opacity="0.8" />
    <circle cx="80" cy="10" r="1" fill="#C06080" opacity="0.9" />
    <circle cx="98" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
    <path
      d="M105 10 L160 10"
      stroke="url(#sdiv-r)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

// ─── GALLERY ───
function GallerySwiper({ urls }: { urls: string[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child)
      el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
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
              maxWidth: 300,
              height: 220,
              borderRadius: 20,
              border: `1px solid ${active === i ? "rgba(232,180,200,0.6)" : "rgba(232,180,200,0.25)"}`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: active === i ? "scale(1)" : "scale(0.93)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(196,160,176,0.32)"
                  : "0 2px 8px rgba(196,160,176,0.08)",
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

// ─── MAIN ───
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
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg,#FDF0F5 0%,#FDF6F0 40%,#F5F0FD 100%)",
        fontFamily: "'Cormorant Garamond','Georgia',serif",
      }}
    >
      <MusicMan />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing:border-box; }
        @keyframes gallery-progress { from{width:0%} to{width:100%} }
        @keyframes fade-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes petal-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .fade-up { animation:fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1  { animation-delay:0.1s; }
        .fade-2  { animation-delay:0.28s; }
        .fade-3  { animation-delay:0.46s; }
        .label-sm { font-family:'Jost',sans-serif; font-weight:400; letter-spacing:0.32em; text-transform:uppercase; font-size:9px; color:rgba(196,160,176,0.9); }
        .glass-card {
          background:rgba(255,255,255,0.62); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          border:1px solid rgba(232,180,200,0.38); border-radius:24px;
          box-shadow:0 8px 32px rgba(196,160,176,0.16),0 1px 0 rgba(255,255,255,0.9) inset,0 -1px 0 rgba(232,180,200,0.12) inset;
        }
        .icon-box {
          width:40px; height:40px; border-radius:16px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg,#F9D5E5 0%,#FDF0F5 100%);
          box-shadow:0 2px 8px rgba(196,160,176,0.18);
        }
      `}</style>

      {/* ═══ HERO ═══ */}
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
                "linear-gradient(135deg,#F9D5E5 0%,#FDF6F0 50%,#E5D5F9 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
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
            <div className="relative flex items-center justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ animation: "petal-spin 30s linear infinite" }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                  (deg, i) => {
                    const r = (deg * Math.PI) / 180;
                    return (
                      <ellipse
                        key={i}
                        cx={60 + Math.cos(r) * 28}
                        cy={60 + Math.sin(r) * 28}
                        rx="9"
                        ry="14"
                        transform={`rotate(${deg + 90},${60 + Math.cos(r) * 28},${60 + Math.sin(r) * 28})`}
                        fill="#F2C8DC"
                        opacity="0.35"
                      />
                    );
                  },
                )}
              </svg>
              <div className="absolute">
                <IcRing />
              </div>
            </div>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top,#FDF0F5 0%,transparent 55%)",
          }}
        />
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right,transparent,rgba(255,255,255,0.5))",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Jost',sans-serif",
              fontSize: 9,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
            }}
          >
            Үйлену тойы
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left,transparent,rgba(255,255,255,0.5))",
            }}
          />
        </div>
      </div>

      {/* ═══ NAMES ═══ */}
      <div className="text-center px-6 -mt-14 relative z-10">
        <div
          className="fade-up fade-1 inline-flex items-center justify-center mb-5 bg-white/70 backdrop-blur-sm p-3 rounded-full border border-yellow-200/50"
          style={{
            boxShadow:
              "0 2px 16px rgba(212,175,55,0.18),0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          <IcRing />
        </div>
        <h1
          className="fade-up fade-1 font-light italic leading-tight"
          style={{
            fontFamily: "'Playfair Display',serif",
            color: "#7B3F5E",
            fontSize: "clamp(2.4rem,10vw,3.2rem)",
          }}
        >
          {wedding.male_name}
        </h1>
        <div className="fade-up fade-2 flex items-center justify-center gap-3 my-5">
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to right,transparent,#E8B4C8)",
            }}
          />
          <IcHeart />
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to left,transparent,#E8B4C8)",
            }}
          />
        </div>
        <h1
          className="fade-up fade-2 font-light italic leading-tight"
          style={{
            fontFamily: "'Playfair Display',serif",
            color: "#7B3F5E",
            fontSize: "clamp(2.4rem,10vw,3.2rem)",
          }}
        >
          {wedding.female_name}
        </h1>
        <div className="fade-up fade-3 flex justify-center mt-5">
          <FloralDivider />
        </div>
      </div>

      {/* ═══ DESCRIPTION + ORGANIZER CARD ═══ */}
      {(wedding.description1 || wedding.organizer) && (
        <div className="mx-5 mt-7">
          <div className="glass-card relative overflow-hidden">
            <div className="pt-2 px-2">
              <CardWaveDecor />
            </div>
            {wedding.description1 && (
              <div className="px-6 pt-3 pb-5 text-center relative">
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="mx-auto mb-2 opacity-30"
                >
                  <path
                    d="M0 20 C0 12 3 7 8 4.5 L10 0 C3 2.5 0 9 0 20Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M16 20 C16 12 19 7 24 4.5 L26 0 C19 2.5 16 9 16 20Z"
                    fill="#C4A0B0"
                  />
                </svg>
                <p
                  className="text-[#9B6B7E] text-[16px] leading-[1.9] italic"
                  style={{ wordBreak: "break-word" }}
                >
                  {wedding.description1}
                </p>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="mx-auto mt-2 opacity-30 rotate-180"
                >
                  <path
                    d="M0 20 C0 12 3 7 8 4.5 L10 0 C3 2.5 0 9 0 20Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M16 20 C16 12 19 7 24 4.5 L26 0 C19 2.5 16 9 16 20Z"
                    fill="#C4A0B0"
                  />
                </svg>
              </div>
            )}
            {wedding.description1 && wedding.organizer && (
              <div className="px-5 py-1">
                <svg
                  viewBox="0 0 320 16"
                  fill="none"
                  style={{ width: "100%", height: 16 }}
                >
                  <defs>
                    <linearGradient id="sep-l" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0" />
                      <stop
                        offset="100%"
                        stopColor="#E8B4C8"
                        stopOpacity="0.7"
                      />
                    </linearGradient>
                    <linearGradient id="sep-r" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 8 L100 8"
                    stroke="url(#sep-l)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="108"
                    cy="8"
                    r="1.8"
                    fill="#F2C8DC"
                    opacity="0.6"
                  />
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                    const r2 = (deg * Math.PI) / 180;
                    return (
                      <ellipse
                        key={i}
                        cx={160 + Math.cos(r2) * 5}
                        cy={8 + Math.sin(r2) * 5}
                        rx="2"
                        ry="3.5"
                        transform={`rotate(${deg + 90},${160 + Math.cos(r2) * 5},${8 + Math.sin(r2) * 5})`}
                        fill="#EEB8D0"
                        opacity="0.5"
                      />
                    );
                  })}
                  <circle
                    cx="160"
                    cy="8"
                    r="2.5"
                    fill="#D4809C"
                    opacity="0.8"
                  />
                  <circle
                    cx="212"
                    cy="8"
                    r="1.8"
                    fill="#F2C8DC"
                    opacity="0.6"
                  />
                  <path
                    d="M220 8 L320 8"
                    stroke="url(#sep-r)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
            {wedding.organizer && (
              <div className="px-6 py-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(to right,transparent,#E8B4C8)",
                    }}
                  />
                  <p className="label-sm">Той иелері</p>
                  <div
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(to left,transparent,#E8B4C8)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2.5">
                  <div className="icon-box">
                    <IcUsers />
                  </div>
                  <p
                    className="text-[#9B6B7E] text-[16px] font-light text-center italic"
                    style={{ wordBreak: "break-word" }}
                  >
                    {wedding.organizer}
                  </p>
                </div>
              </div>
            )}
            <div className="pb-2 px-2">
              <CardWaveDecor flip />
            </div>
          </div>
        </div>
      )}

      {/* ═══ GALLERY ═══ */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-9">
          <div className="flex items-center gap-3 px-5 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right,transparent,#E8B4C8)",
              }}
            />
            <p className="label-sm">Фотоальбом</p>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left,transparent,#E8B4C8)",
              }}
            />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ═══ DESCRIPTION 2 ═══ */}
      {wedding.description2 && (
        <div className="mx-5 mt-8">
          <div
            className="relative rounded-3xl p-5 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(232,180,200,0.25)",
              boxShadow: "0 4px 20px rgba(196,160,176,0.1)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
              style={{
                background:
                  "linear-gradient(to bottom,#F9D5E5,#E8B4C8,#F9D5E5)",
              }}
            />
            <p
              className="text-[#9B6B7E] text-[14px] leading-[1.85] pl-3"
              style={{ wordBreak: "break-word" }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* ═══ COUPLE PHOTOS ═══ */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right,transparent,#E8B4C8)",
              }}
            />
            <SmallDivider />
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left,transparent,#E8B4C8)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
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
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
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

      {/* ═══ INSTAGRAM ═══ */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-8 flex gap-4">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(196,160,176,0.38)",
                color: "#9B6B7E",
                background: "rgba(255,255,255,0.5)",
                fontFamily: "'Jost',sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                boxShadow: "0 2px 12px rgba(196,160,176,0.1)",
              }}
            >
              <IcInstagram /> Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg,#7B3F5E,#C4A0B0)",
                boxShadow: "0 4px 16px rgba(123,63,94,0.28)",
                fontFamily: "'Jost',sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              <IcInstagram white /> Instagram
            </a>
          )}
        </div>
      )}

      {/* ═══ INFO CARD ═══ */}
      <div className="mx-5 mt-9 mb-2">
        <div className="glass-card relative overflow-hidden">
          <div
            className="h-[2px]"
            style={{
              background:
                "linear-gradient(to right,#F9D5E5,#C4A0B0,#D5D5F9,#C4A0B0,#F9D5E5)",
            }}
          />
          <div className="px-2 pt-1">
            <CardWaveDecor />
          </div>
          <div className="p-5 space-y-4">
            {(date || time) && (
              <div className="flex items-center gap-4">
                <div className="icon-box">
                  <IcCalendar />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Күні & Уақыты</p>
                  {date && (
                    <p
                      className="font-light italic mt-0.5 truncate"
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: "#7B3F5E",
                        fontSize: 16,
                      }}
                    >
                      {date}
                    </p>
                  )}
                  {time && (
                    <div
                      className="inline-flex items-center gap-1.5 mt-1 rounded-full px-3 py-1"
                      style={{
                        background: "rgba(249,213,229,0.4)",
                        border: "1px solid rgba(232,180,200,0.35)",
                      }}
                    >
                      <IcClock />
                      <p
                        style={{
                          color: "#9B6B7E",
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 500,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {time}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(wedding.venue_name || wedding.venue_address) && (
              <div
                className="flex items-start gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div className="icon-box mt-0.5">
                  <IcMapPin />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Той залы</p>
                  {wedding.venue_name && (
                    <p
                      className="font-light italic mt-0.5"
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: "#7B3F5E",
                        fontSize: 16,
                        wordBreak: "break-word",
                      }}
                    >
                      {wedding.venue_name}
                    </p>
                  )}
                  {wedding.venue_address && (
                    <div className="flex items-start gap-1 mt-1">
                      <IcMapPinTiny />
                      <p
                        style={{
                          color: "#C4A0B0",
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          lineHeight: 1.6,
                          wordBreak: "break-word",
                        }}
                      >
                        {wedding.venue_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {wedding.phone && (
              <div
                className="flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div className="icon-box">
                  <IcPhone />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Байланыс</p>
                  <a
                    href={`tel:${wedding.phone}`}
                    className="font-light italic mt-0.5 hover:underline block"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "#7B3F5E",
                      fontSize: 16,
                    }}
                  >
                    {wedding.phone}
                  </a>
                </div>
              </div>
            )}
            {extras.length > 0 && (
              <div
                className="pt-3 border-t space-y-2.5"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                {extras.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(249,213,229,0.5)",
                        border: "1px solid rgba(232,180,200,0.35)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#C4A0B0" }}
                      />
                    </div>
                    <p
                      style={{
                        color: "#9B6B7E",
                        fontSize: 13,
                        fontFamily: "'Jost',sans-serif",
                        lineHeight: 1.75,
                        wordBreak: "break-word",
                      }}
                    >
                      {e}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {wedding.photo5_url && (
              <div
                className="pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{ boxShadow: "0 4px 16px rgba(196,160,176,0.15)" }}
                >
                  <img
                    src={wedding.photo5_url}
                    alt="Қосымша сурет"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="px-2 pb-2">
            <CardWaveDecor flip />
          </div>
        </div>
      </div>

      {/* ═══ MESSAGES ═══ */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B3F5E"
        lightColor="#FDF0F5"
        borderColor="border-rose-100"
      />

      <div className="text-center py-12 mt-4">
        <div className="flex justify-center mb-5">
          <FloralDivider />
        </div>
        <p
          style={{
            color: "#C4A0B0",
            fontFamily: "'Jost',sans-serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            style={{
              color: "#DDB4C8",
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              marginTop: 6,
            }}
          >
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
