import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"], // important for Kazakh text
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https:ulgiitoi.mn"),
  title: "Online шақыру",
  description: "Үйлену тойына арналған шақыру жасау қызметі",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      {/* <head>
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
      </head> */}
      <body className={`bg-[#F3F4F6] min-h-screen ${inter.className}`}>
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-[480px] bg-[#F3F4F6] min-h-screen shadow-blue-400 shadow-lg relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
