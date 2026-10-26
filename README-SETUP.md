# NEWSKILL PRO AI MUSIC

A Next.js starter for a branded AI music creation platform.

## Current status

- Branded responsive music studio interface with song/instrumental modes, prompt, optional lyrics, genre and mood controls.
- GitHub Actions build workflow configured.
- Environment-variable template for Suno API access, database/auth and Paystack.
- **Not yet a production music generator:** official Suno API credentials and provider-specific API documentation have not been configured; authentication, database, payments, credit accounting and deployment are not connected.

## Official Suno integration

Suno now has an official API portal: https://platform.suno.com/ . Sign in with the account linked to your Suno account and check whether API access, API credentials and technical documentation are available for your account. Access may require approval or an enabled API account.

Do not use an unofficial wrapper or reverse-engineered endpoint as if it were Suno's official API. The integration must follow the base URL, authentication scheme, request/response formats, usage limits and commercial terms provided in your official account documentation.

When Suno has enabled access, add the supplied values to your deployment environment as `SUNO_API_BASE_URL`, `SUNO_API_KEY`, and `SUNO_API_MODEL`. Set `SUNO_API_ACCESS_CONFIRMED=true` only after confirming the access and terms in the official account. Never commit actual credentials.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in credentials only after selecting/receiving the relevant providers.
4. Run `npm run dev` and open http://localhost:3000.

## Vercel deployment

1. Sign in to https://vercel.com/ using GitHub.
2. Import **saidudauda/newskill-ai-music** as a new Vercel project. Do not import or modify the existing `newskill.com` repository.
3. Keep the framework preset as Next.js and the root directory as `./`.
4. Add API credentials as Vercel Environment Variables only after official Suno access is enabled; never put secret keys in `NEXT_PUBLIC_*` variables.
5. Deploy and check the build log and resulting URL. A deployment is only successful once Vercel reports it as Ready.

No Vercel project has been linked and no deployment URL has been verified yet.

## Next implementation milestones

1. Implement the exact official Suno API request, task polling/callbacks and audio delivery after the account docs are available.
2. Add authentication and a database for users, jobs, tracks and a transactional credit ledger.
3. Add Paystack checkout and verified webhooks before granting subscription credits. Never trust client-side payment success.
4. Add user library, download controls, moderation, rate limits, usage tracking and an admin dashboard.
5. Test generation costs, retry behavior, licensing and commercial-use terms before selling subscriptions.

## Security notes

- Never expose provider or payment secret keys in client code.
- Never commit real credentials to Git.
- Verify payment webhooks server-side and make credit grants idempotent.
- Clearly disclose provider usage, licensing and commercial-use terms to users.
