import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getSeoSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const siteUrl = "https://venuzen.com";

// next/font self-hosts the font at build time (no external Google Fonts
// request), inlines the @font-face, and avoids render-blocking network
// calls. This alone usually saves 200-400ms off FCP.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VENUZEN | FozlulHoque — Creative Digital Specialist",
    template: "%s | VENUZEN",
  },
  description:
    "VENUZEN is a creative digital studio by FozlulHoque delivering premium Graphic Design, modern Web Development, and cinematic Video Editing. We transform ideas into high-converting visuals that help brands grow, sell & stand out.",
  keywords: [
    "VENUZEN",
    "graphic design",
    "web development",
    "video editing",
    "UI/UX design",
    "branding",
    "brand specialist",
    "digital products",
    "freelance designer",
    "website templates",
    "FozlulHoque",
  ],
  authors: [{ name: "FozlulHoque" }],
  creator: "FozlulHoque",
  publisher: "VENUZEN",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "VENUZEN",
    title: "VENUZEN | Creative Digital Specialist",
    description:
      "Premium Graphic Design, Web Development & Video Editing. I transform ideas into high-converting visuals that help brands grow, sell & stand out.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VENUZEN — Creative Digital Specialist",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "VENUZEN | Creative Digital Specialist",
    description:
      "Premium Graphic Design, Web Development & Video Editing. I transform ideas into high-converting visuals.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const homeSchemas = await getSeoSchema("/");

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload the Hero's LCP image so the browser starts fetching it
            immediately, without waiting for JS to parse/hydrate first. */}
        {/* This now matches the raw file exactly because Hero.tsx's <Image>
            uses `unoptimized` — see the Hero.tsx change below. */}
        <link
          rel="preload"
          as="image"
          href="/profile.jpg"
          fetchPriority="high"
        />
        {/* If you keep next/image's optimizer instead of `unoptimized`,
            delete this preload — it won't match the real request URL and
            does nothing. */}
      </head>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <JsonLd schemas={homeSchemas} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}