import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Хурмын урилга бүртгэл",
  description: "Хосуудын хурмын урилга бүртгэлийн систем",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F0EBE8] min-h-screen">
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-[480px] bg-[#F8F4F0] min-h-screen shadow-2xl shadow-stone-300/50 relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
