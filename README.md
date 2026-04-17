# ResumeCremator

ResumeCremator is a Next.js app that analyzes resumes with Gemini, highlights ATS weaknesses, and suggests stronger rewrites.

## Local Development

1. Copy `.env.example` to `.env.local`
2. Set `GEMINI_API_KEY`
3. Run `npm ci`
4. Run `npm run dev`

## Scripts

- `npm run dev` starts the local dev server
- `npm run lint` runs ESLint
- `npm run build` creates a production build
- `npx tsc --noEmit` runs a TypeScript-only correctness check

## Security Notes

- Server responses from sensitive API routes use `Cache-Control: no-store`
- Resume analysis results are kept in in-memory client state instead of browser session storage
- Rate limiting supports a shared Upstash Redis backend through `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- GitHub Actions includes CI, CodeQL, and dependency review workflows

See [SECURITY.md](./SECURITY.md) for the vulnerability reporting policy.
