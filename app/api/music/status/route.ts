import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const credentialsPresent = Boolean(process.env.STABILITY_API_KEY);
  const enabled = process.env.MUSIC_GENERATION_ENABLED === "true";
  return NextResponse.json({
    provider: "Stability AI",
    model: "stable-audio-3",
    credentialsPresent,
    generationEnabled: credentialsPresent && enabled,
    officialPortal: "https://platform.stability.ai/",
    message: credentialsPresent && enabled
      ? "Stable Audio is configured. Generation is enabled, but user authentication and usage limits should be added before public launch."
      : "Add STABILITY_API_KEY in your server environment and set MUSIC_GENERATION_ENABLED=true after testing. Generation stays disabled by default.",
  });
}
