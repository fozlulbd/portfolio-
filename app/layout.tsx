import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "FozlulHoque | SevenXP — Creative Digital Specialist",
  description: "Premium Graphic Design, Web Development & Video Editing. I transform ideas into high-converting visuals.",
  keywords: ["graphic design", "web development", "video editing", "UI/UX", "branding"],
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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
