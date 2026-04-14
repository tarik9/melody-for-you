# MelodyForYou

A personalized song e-commerce store. Customers fill out a 6-step form, pay via Stripe ($34.99), and receive a custom studio-quality song within 24–48 hours.

Built with Next.js 14 · Tailwind CSS · Stripe · Google Sheets · Meta Pixel

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `GOOGLE_SHEET_ID` | Google Sheets document ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | GCP service account email |
| `GOOGLE_PRIVATE_KEY` | GCP private key |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `META_ACCESS_TOKEN` | Meta Conversions API token |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL |

## Stripe Webhook (Local Testing)

```bash
# Install Stripe CLI
npm install -g stripe

# Forward events to local server
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## Google Sheets Setup

1. Create Google Sheet `songOrdersV2`
2. Create service account in Google Cloud Console
3. Share sheet with service account email (Editor)
4. Set credentials in `.env.local`

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add all environment variables
4. Add Stripe webhook endpoint: `https://yoursite.vercel.app/api/webhook`

For full documentation see [CLAUDE.md](./CLAUDE.md).
