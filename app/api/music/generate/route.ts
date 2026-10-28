import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_DURATIONS = new Set([30, 60, 120, 180, 240, 360]);
const ALLOWED_GENRES = new Set([
  "Afrobeats", "Amapiano", "Afro-fusion", "Hip-hop instrumental",
  "R&B instrumental", "Gospel instrumental", "Pop", "Electronic", "Nupe fusion",
]);
const ALLOWED_MOODS = new Set(["Uplifting", "Chill", "Emotional", "Energetic", "Romantic", "Epic"]);

type MurekaTask = {
  id?: string;
  status?: string;
  failed_reason?: string;
  choices?: Array<Record<string, unknown>>;
};

function errorMessage(status: number) {
  if (status === 401 || status === 403) return "Mureka rejected the API key. Check that MUREKA_API_KEY is correct in Vercel.";
  if (status === 402) return "Your Mureka API account may need credits. Check API billing before trying again.";
  if (status === 429) return "Mureka is receiving too many requests. Please wait a little and try again.";
  return "Mureka could not start the generation. Check the API account and try again.";
}

export async function POST(request: NextRequest) {
  // Keep locked until the owner deliberately enables generation after setup.
  if (process.env.MUSIC_GENERATION_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Music generation is not enabled yet. The site owner must finish configuring and testing Mureka first." },
      { status: 503 },
    );
  }

  const apiKey = process.env.MUREKA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "MUREKA_API_KEY is missing from the server environment." }, { status: 503 });
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

  if (prompt.length < 5 || prompt.length > 1000) {
    return NextResponse.json({ error: "Your description must be between 5 and 1,000 characters." }, { status: 400 });
  }

  // Mureka documents a 1,024-character prompt limit. Keep the assembled prompt within it.
  const promptPrefix = `${genre} instrumental. Mood: ${mood.toLowerCase()}. `;
  const promptSuffix = `. Instrumental only, no intelligible vocals. Aim for about ${duration} seconds where supported.`;
  const fullPrompt = `${promptPrefix}${prompt.slice(0, Math.max(5, 1024 - promptPrefix.length - promptSuffix.length))}${promptSuffix}`.slice(0, 1024);

  try {
    const start = await fetch("https://api.mureka.ai/v1/instrumental/generate", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "auto", prompt: fullPrompt, n: 1 }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    if (!start.ok) {
      const details = (await start.text()).slice(0, 1000);
      console.error("Mureka generation start failed", start.status, details);
      return NextResponse.json({ error: errorMessage(start.status) }, { status: start.status === 429 ? 429 : 502 });
    }

    const started = await start.json() as MurekaTask;
    if (!started.id) {
      console.error("Mureka response did not include a task ID", JSON.stringify(started).slice(0, 1000));
      return NextResponse.json({ error: "Mureka returned an unexpected response. Please try again later." }, { status: 502 });
    }

    // Poll briefly for completion. A timed-out poll never starts a second paid generation.
    const deadline = Date.now() + 210_000;
    let task: MurekaTask = started;
    while (Date.now() < deadline && !["succeeded", "failed", "timeouted", "cancelled"].includes(task.status || "")) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const check = await fetch(`https://api.mureka.ai/v1/instrumental/query/${encodeURIComponent(started.id)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      });
      if (!check.ok) {
        const details = (await check.text()).slice(0, 1000);
        console.error("Mureka task query failed", check.status, details);
        return NextResponse.json({ error: "The track was requested, but Mureka could not return its status. Check your Mureka task history before retrying to avoid duplicate charges." }, { status: 502 });
      }
      task = await check.json() as MurekaTask;
    }

    if (task.status !== "succeeded") {
      const timedOut = !["failed", "timeouted", "cancelled"].includes(task.status || "");
      return NextResponse.json({
        error: timedOut
          ? "Your track is still processing. Please check your Mureka task history before trying again, to avoid duplicate charges."
          : `Mureka could not complete the track. ${task.failed_reason || "Please try again later."}`,
      }, { status: timedOut ? 504 : 502 });
    }

    const choice = task.choices?.[0] || {};
    const audioUrl = [choice.url, choice.audio_url, choice.music_url, choice.download_url, choice.wav_url, choice.mp3_url]
      .find(value => typeof value === "string" && /^https:\/\//i.test(value as string)) as string | undefined;

    if (!audioUrl) {
      console.error("Mureka succeeded but no recognized audio URL was present", JSON.stringify(task).slice(0, 1500));
      return NextResponse.json({ error: "Mureka completed the task but returned an audio format this app does not recognize yet." }, { status: 502 });
    }

    // Proxy the result so the browser doesn't need the private Mureka API key.
    const audioResponse = await fetch(audioUrl, { cache: "no-store", signal: AbortSignal.timeout(45_000) });
    if (!audioResponse.ok) {
      return NextResponse.json({ error: "The track was generated, but its audio file could not be retrieved. Check your Mureka task history before retrying." }, { status: 502 });
    }
    const audio = await audioResponse.arrayBuffer();
    if (!audio.byteLength) return NextResponse.json({ error: "Mureka returned an empty audio file." }, { status: 502 });

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": audioResponse.headers.get("content-type") || "audio/mpeg",
        "Content-Disposition": 'attachment; filename="newskill-soniq-track.mp3"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Mureka request error", error);
    return NextResponse.json({ error: "The Mureka request timed out or could not connect. Check your Mureka task history before retrying to avoid duplicate charges." }, { status: 504 });
  }
}
