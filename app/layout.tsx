import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEWSKILL PRO AI MUSIC",
  description: "Create original music with AI. Your sound, your vision, powered by NEWSKILL PRO.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
