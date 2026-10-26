# NEWSKILL PRO AI MUSIC

A Next.js music-generation app starter. The first generation engine is **Stability AI Stable Audio 3.0**, selected because it has a documented, self-serve API. It is primarily an instrumental music engine, not a drop-in replacement for Suno's vocal-song generation.

## Implemented

- Responsive NEWSKILL PRO studio UI with genre, mood, prompt and duration controls.
- Server-side API route for Stable Audio 3.0 text-to-audio generation.
- Audio response playback and MP3 download in the browser.
- Server-side API key handling and a feature flag that disables generation by default.
- GitHub Actions build workflow.

## Engine capabilities and cost

Stable Audio 3.0 supports text-to-audio and audio-to-audio, and can generate up to six minutes of audio. Stability AI's published API pricing currently lists Stable Audio 3.0 at 26 credits per generation; 1 credit is $0.01, so treat this as approximately $0.26 per request before any taxes or pricing changes. Check the live pricing before setting customer subscription limits. The API account advertises 25 free credits for new accounts; that is not enough for one 26-credit generation unless the account's credit balance is topped up.

Official links:
- API platform: https://platform.stability.ai/
- API docs / text-to-audio: https://platform.stability.ai/
- Pricing: https://platform.stability.ai/pricing
- Commercial and usage licensing: https://kb.stability.ai/knowledge-base/stable-audio-commerical-and-usage-licensing

Stable Audio is designed primarily for instrumental work and is not intended to generate intelligible vocals. Do not advertise vocal-song generation until a suitable licensed provider is integrated. Check current terms, pricing and account permissions before selling access.

## Configure locally

1. Create a Stability AI account and API key at https://platform.stability.ai/.
2. Copy `.env.example` to `.env.local`.
3. Set `STABILITY_API_KEY` to your secret key.
4. Run `npm install` and `npm run dev`.
5. Test the generation API privately first. Only then set `MUSIC_GENERATION_ENABLED=true`.

**Important:** Generation is disabled by default. The current starter does not yet include user login, per-user quotas, rate limiting, persistent track storage or payment verification. Do not enable public generation on a public deployment until those protections are implemented, otherwise an unauthenticated visitor could spend your API credits.

## Vercel deployment

1. Sign in to https://vercel.com/ with GitHub.
2. Import **saidudauda/newskill-ai-music** as a new project; do not alter the existing `newskill.com` repository.
3. Keep Next.js as the framework and `./` as root directory.
4. Add `STABILITY_API_KEY` as a server-side Vercel Environment Variable. Do not use a `NEXT_PUBLIC_` prefix for secrets.
5. Keep `MUSIC_GENERATION_ENABLED=false` until authentication, limits and payment protections are ready.
6. Deploy and confirm Vercel reports the deployment as Ready.

No Vercel deployment has been created or verified yet.

## Not yet implemented

- Authentication and database-backed users / track library.
- User quotas, credits, abuse protection and job history.
- Paystack checkout, verified webhooks and subscription management.
- Admin dashboard, monitoring and production error handling.
- Vocal generation or exact Suno feature parity.

## Security

- Never commit real credentials.
- Never expose API secrets in client-side code.
- Add authentication, per-user limits and server-side billing checks before allowing public generation.
- Do not grant subscription credits based only on client-side payment status.
