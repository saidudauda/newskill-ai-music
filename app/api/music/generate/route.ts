import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_DURATIONS = new Set([30, 60, 120, 180, 240, 360]);
const ALLOWED_GENRES = new Set([
  "Afrobeats", "Amapiano", "Afro-fusion", "Hip-hop instrumental",
  "R&B instrumental", "Gospel instrumental", "Pop", "Electronic", "Nupe fusion",
]);
const ALLOWED_MOODS = new Set(["Uplifting", "Chill", "Emotional", "Energetic", "Romantic", "Epic"]);

export async function POST(request: NextRequest) {
  // Safety lock: don't let a public, unauthenticated endpoint spend the owner's API credits by default.
  if (process.env.MUSIC_GENERATION_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Music generation is not enabled yet. The site owner must configure and test the provider first." },
      { status: 503 },
    );
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The music provider API key is not configured on the server." }, { status: 503 });
  }

  let body: { prompt?: unknown; genre?: unknown; mood?: unknown; duration?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON request." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const genre = typeof body.genre === "string" && ALLOWED_GENRES.has(body.genre) ? body.genre : "Afrobeats";
  const mood = typeof body.mood === "string" && ALLOWED_MOODS.has(body.mood) ? body.mood : "Uplifting";
  const duration = typeof body.duration === "number" && ALLOWED_DURATIONS.has(body.duration) ? body.duration : 30;

  if (prompt.length < 5 || prompt.length > 1200) {
    return NextResponse.json({ error: "Your description must be between 5 and 1,200 characters." }, { status: 400 });
  }

  // This provider is primarily instrumental. Don't pass user-entered lyrics as if vocals were supported.
  const fullPrompt = `${genre} instrumental. Mood: ${mood.toLowerCase()}. ${prompt}. Instrumental music only, no intelligible vocals.`;
  const form = new FormData();
  form.set("model", "stable-audio-3");
  form.set("prompt", fullPrompt);
  form.set("duration", String(duration));

  try {
    const upstream = await fetch("https://api.stability.ai/v2beta/audio/stable-audio/text-to-audio", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(240_000),
    });

    if (!upstream.ok) {
      const details = (await upstream.text()).slice(0, 1000);
      console.error("Stability AI generation failed", upstream.status, details);
      return NextResponse.json(
        { error: upstream.status === 401 || upstream.status === 403
          ? "The music provider rejected the API key or account access. Check your Stability AI account."
          : upstream.status === 402
            ? "The provider account needs more credits. Check your Stability AI billing page."
            : "The music provider could not generate this track. Check your account credits and try again." },
        { status: upstream.status === 429 ? 429 : 502 },
      );
    }

    const audio = await upstream.arrayBuffer();
    if (audio.byteLength === 0) {
      return NextResponse.json({ error: "The provider returned an empty audio file." }, { status: 502 });
    }

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
        "Content-Disposition": 'attachment; filename="newskill-soniq-track.mp3"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Stability AI request error", error);
    return NextResponse.json({ error: "The provider request timed out or could not connect. Please try again." }, { status: 504 });
  }
}
