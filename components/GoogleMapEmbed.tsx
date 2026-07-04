"use client";

export default function GoogleMapEmbed({
  address,
  latitude,
  longitude,
  zoom = 15,
  height = 220,
  className = "",
  accentColor = "#602846",
}: {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
  height?: number;
  className?: string;
  accentColor?: string;
}) {
  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const query = hasCoords
    ? `${latitude},${longitude}`
    : encodeURIComponent(address || "Алматы, Қазақстан");

  const src = `https://www.google.com/maps?q=${query}&z=${zoom}&output=embed`;

  const externalHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(196,160,176,0.25)",
        boxShadow: "0 4px 20px rgba(96,40,70,0.12)",
        background: "#f3ede7",
      }}
    >
      <iframe
        title="Той өтетін орынның картасы"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,248,242,0.95)",
          color: accentColor,
          fontFamily: "'Montserrat',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          padding: "7px 14px",
          borderRadius: 999,
          textDecoration: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 14, lineHeight: 1 }}
        >
          open_in_new
        </span>
        Google Maps
      </a>
    </div>
  );
}
