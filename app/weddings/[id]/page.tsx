import { supabase } from "@/lib/supabase";
import WeddingLanguageGate from "@/components/WeddingLanguageGate";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Used whenever a wedding has no uploaded photo yet, and as the last-resort
// fallback so og:image is NEVER empty — Facebook/Telegram/WhatsApp will
// simply omit the image preview entirely if this array is empty, so an
// empty array is worse than a generic placeholder.
const DEFAULT_SHARE_IMAGE = "https://your-actual-domain.com/default-share.jpg";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  noStore();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!wedding) {
    return {
      title: "Онлайн урилга",
      description: "Хуримын урилга",
      openGraph: {
        title: "Онлайн урилга",
        description: "Хуримын урилга",
        images: [
          {
            url: DEFAULT_SHARE_IMAGE,
            width: 1200,
            height: 630,
            alt: "Онлайн урилга",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: [DEFAULT_SHARE_IMAGE],
      },
    };
  }

  const title = `${wedding.male_name} & ${wedding.female_name}`;
  const description = "Хуримын урилга";

  // Prefer the main cover photo, then any other uploaded photo, then the
  // static fallback shipped in /public — this guarantees the images array
  // below is never empty, which is required for crawlers to render a
  // preview image at all.
  const image =
    wedding.main_photo_url ||
    wedding.photo3_url ||
    wedding.photo5_url ||
    DEFAULT_SHARE_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-actual-domain.com/weddings/${wedding.id}`,
      siteName: title,
      type: "website",
      locale: "mn_MN",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function WeddingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !wedding) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{
          background:
            "linear-gradient(160deg, #EAF6FF 0%, #F5FBFF 40%, #DDEEFA 100%)",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Jost:wght@300;400&display=swap');`}</style>

        <div className="relative flex items-center justify-center mb-2">
          <div
            className="absolute w-24 h-24 rounded-full border"
            style={{
              borderColor: "rgba(168,216,240,0.35)",
              animation: "spin 20s linear infinite",
            }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border"
            style={{
              borderColor: "rgba(168,216,240,0.25)",
              animation: "spin 14s linear infinite reverse",
            }}
          />
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(168,216,240,0.4)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="#A8D8F0"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "22px",
            color: "#2F6E91",
            fontWeight: 400,
          }}
        >
          Тіркеме табылмады
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(107,184,216,0.8)",
            letterSpacing: "0.06em",
            fontWeight: 300,
            textAlign: "center",
          }}
        >
          Сілтеме қате немесе мазмұн жойылған болуы мүмкін
        </p>
        <a
          href="/"
          style={{
            fontSize: "11px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#2F6E91",
            fontWeight: 400,
            padding: "10px 24px",
            borderRadius: "999px",
            border: "1px solid rgba(168,216,240,0.5)",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(12px)",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          ← қайта бастаңыз.
        </a>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <WeddingLanguageGate wedding={wedding} />;
}
