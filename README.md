# NEWSKILL SONIQ AI

**Your ideas. Your sound.** An AI-assisted music creation web app from the NEWSKILL PRO brand.

## Current features
- Responsive black and dark-yellow studio interface
- Music prompt, genre, mood, and duration controls
- Instrumental-generation API route designed for Stability AI Stable Audio
- Audio playback and download when the provider returns a track
- Contact links for support

## Local development
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Run `npm run dev` and open `http://localhost:3000`.

## Music API configuration
The generation route is deliberately disabled by default. To enable it, configure a valid `STABILITY_API_KEY` and test the current provider endpoint and account access before setting `MUSIC_GENERATION_ENABLED=true`. Do not commit secrets or expose provider keys in client-side code.

## Not implemented yet
User authentication, persistent track library, subscription checkout, usage/credit metering, full vocal-song generation, and verified production deployment still require implementation and credentials. The current UI is not a claim that these services are live.

## Deployment
This is a Next.js app suitable for a Vercel deployment. Import this repository into Vercel, set the required environment variables there, deploy, then test the live URL and music-generation endpoint.
