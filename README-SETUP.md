# NEWSKILL PRO AI MUSIC

A Next.js starter for a branded AI music creation platform.

## Current status
- Branded responsive music studio interface
- Song / instrumental mode, prompt, optional lyrics, genre and mood controls
- Setup template for provider, database, auth and payment environment variables
- **Not yet a production music generator:** no real audio-generation provider, authentication, database, payments, credits, or deployment has been connected.

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in credentials only after selecting providers.
4. Run `npm run dev` and open http://localhost:3000.

## Next implementation milestones
1. Select an AI music API whose terms permit this commercial use; implement server-side generation, task polling, error handling and secure audio delivery.
2. Add authentication and a database for users, jobs, tracks and credit ledger.
3. Add Paystack checkout and verified webhooks before granting subscription credits. Never trust client-side payment success.
4. Add user library, download controls, moderation, rate limits, usage tracking and an admin dashboard.
5. Deploy to a supported host and configure production environment variables.

## Security notes
- Never expose provider or payment secret keys in client code.
- Never commit real credentials to Git.
- Verify payment webhooks server-side and make credit grants idempotent.
- Show provider usage, licensing and commercial-use terms clearly to users.
