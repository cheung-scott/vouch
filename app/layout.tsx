import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Vouch - voice-confirmed payments",
  description:
    "Every deal, kept. Voice-confirmed payments for freelancers and high-value peer-to-peer sales. Vera, your AI mediator, captures the agreement. Stripe holds the funds. 2.9% per deal, zero markup on Stripe.",
  metadataBase: new URL("https://vouch.fund"),
  openGraph: {
    title: "Vouch - voice-confirmed payments",
    description:
      "Every deal, kept. Voice-recorded contracts mean disputes resolve in minutes, not weeks.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vouch - voice-confirmed payments",
    description:
      "Every deal, kept. Built on Stripe + ElevenLabs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
