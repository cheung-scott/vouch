import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./experiment.css";

// Experiment-only fonts, scoped to this route segment so the
// production landing keeps Fraunces/Inter/JetBrains untouched.
const archivo = Archivo({
  variable: "--font-xp-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-xp-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vouch - the ledger cut (design experiment)",
  description:
    "A side exploration of the Vouch landing page. Voice-confirmed payment protection, drawn as a paper record.",
  robots: { index: false },
};

export default function ExperimentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`xp ${archivo.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
