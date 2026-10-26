import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const hasCredentials = Boolean(
    process.env.SUNO_API_BASE_URL &&
    process.env.SUNO_API_KEY &&
    process.env.SUNO_API_MODEL
  );
  const accessConfirmed = process.env.SUNO_API_ACCESS_CONFIRMED === "true";

  return NextResponse.json({
    provider: "Suno",
    officialPortal: "https://platform.suno.com/",
    credentialsPresent: hasCredentials,
    officialAccessConfirmed: accessConfirmed,
    generationEnabled: false,
    message: hasCredentials && accessConfirmed
      ? "Credentials are present, but generation remains disabled until the official account-specific API contract is implemented and tested."
      : "Official Suno API access is not configured. Sign in to the official Suno API portal and follow the documentation available to your account.",
  });
}
