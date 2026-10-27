import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEWSKILL SONIQ AI | AI Music Studio",
  description: "Create your sound with NEWSKILL SONIQ AI, the music creation studio from NEWSKILL PRO. Explore Afrobeats, Amapiano, Nupe fusion and more.",
  applicationName: "NEWSKILL SONIQ AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
