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
        {/* NOTE: the old manual preload for /profile.jpg was removed.
            Hero.tsx's <Image> uses next/image's normal optimizer (not
            `unoptimized`), so the real request goes to
            /_next/image?url=%2Fprofile.jpg&... — not the raw /profile.jpg
            path. The old preload was fetching a URL nothing on the page
            actually used, wasting bandwidth and competing with the real
            image request on the LCP-critical path.
            next/image already inserts the correct preload <link> for us
            automatically because Hero.tsx sets `priority` on that image —
            no manual tag needed. */}

        {/* Preconnect to Supabase so the DNS lookup + TLS handshake happen
            during initial page load instead of when the chat widget / Hero
            stats first call the API — PageSpeed flagged this as an
            ~300ms LCP saving ("Preconnect candidates"). */}
        <link rel="preconnect" href="https://prycvptyrzqzyuthsejh.supabase.co" />
        <link rel="dns-prefetch" href="https://prycvptyrzqzyuthsejh.supabase.co" />
      </head>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <JsonLd schemas={homeSchemas} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}