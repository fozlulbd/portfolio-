import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = "https://venuzen.com";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
