# MelodyForYou – Project Documentation

## Overview
MelodyForYou is a custom song e-commerce store. Customers fill out a 6-step form describing who the song is for, pay via Stripe ($34.99), and receive a professionally crafted, studio-quality custom song via email within 24–48 hours. Songs are produced manually using Suno AI.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe (PaymentElement + server-side webhook)
- **Orders DB**: Google Sheets API (`songOrdersV2` sheet)
- **Tracking**: Meta Pixel (client-side) + Meta Conversions API (server-side)
- **Deployment**: Vercel

## Project Structure
```
app/
  layout.tsx          — Root layout with MetaPixel
  page.tsx            — Landing page (imports all section components)
  create/page.tsx     — 6-step order form
  success/page.tsx    — Post-payment success page
  api/
    create-payment-intent/route.ts  — Creates Stripe PaymentIntent
    webhook/route.ts                — Stripe webhook handler

components/
  Header.tsx          — Fixed top nav with logo + CTA
  HeroSection.tsx     — Purple gradient hero
  SampleSongs.tsx     — Interactive music player with 5 sample songs
  Testimonials.tsx    — Customer reviews grid with expand/collapse
  WhyChooseUs.tsx     — 3-card feature section
  HowItWorks.tsx      — 4-step process section
  WatchReactions.tsx  — Video reaction thumbnails
  PricingCTA.tsx      — Price + CTA section
  FAQ.tsx             — Accordion FAQ
  Footer.tsx          — Footer with links
  MetaPixel.tsx       — Meta Pixel script + trackEvent helpers
  form/
    StepIndicator.tsx — 6-step progress bar
    StepCard.tsx      — Reusable step wrapper with nav buttons
    SelectField.tsx   — Custom dropdown with animated options
    CheckoutStep.tsx  — Stripe PaymentElement checkout

lib/
  types.ts            — Shared TypeScript types + constants
  stripe.ts           — Stripe client singleton
  googleSheets.ts     — Google Sheets append helper
  metaConversionsApi.ts — Meta CAPI server-side events
```

## Business Flow
1. Customer visits landing page
2. Clicks "Start Your Song" → `/create`
3. Fills 6-step form: Style → Recipient → Occasion → Story → Delivery (email) → Checkout
4. At step 5→6 transition: `InitiateCheckout` pixel fires + Stripe `PaymentIntent` created
5. Customer pays via Stripe Elements
6. On success: Stripe redirects to `/success?email=...&recipient=...&occasion=...`
7. `payment_intent.succeeded` webhook fires:
   - Appends full order to Google Sheet `songOrdersV2`
   - Sends server-side `Purchase` event to Meta CAPI
8. Team manually produces song using Suno AI and emails it to customer

## Environment Variables
See `.env.example` for full list. Required:
- `STRIPE_SECRET_KEY` — Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `GOOGLE_SHEET_ID` — Google Sheets ID (from URL)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — GCP service account email
- `GOOGLE_PRIVATE_KEY` — GCP private key (with `\n` escaped)
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID (test placeholder set)
- `META_ACCESS_TOKEN` — Meta Conversions API access token
- `NEXT_PUBLIC_APP_URL` — Full URL of deployment

## Google Sheets Setup
1. Create a new Google Sheet named `songOrdersV2`
2. Copy the Sheet ID from the URL
3. In Google Cloud Console: create a service account, generate JSON key
4. Share the Sheet with the service account email (Editor access)
5. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in env

Sheet columns (auto-created on first order):
`Timestamp | Payment Intent ID | Amount (USD) | Email | Style | Vocal Preference | Recipient Name | Relationship | Occasion | Story | Specific Lyrics | Status`

## Stripe Webhook Setup
For local dev:
```bash
npm install -g stripe
stripe listen --forward-to localhost:3000/api/webhook
```
For production: Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://yoursite.vercel.app/api/webhook`
- Event: `payment_intent.succeeded`

## Meta Pixel Configuration
- Test pixel ID placeholder: `TEST_PIXEL_ID_123456789`
- Replace `NEXT_PUBLIC_META_PIXEL_ID` with real pixel ID when ready
- Events fired:
  - `PageView` — on every page load
  - `InitiateCheckout` — when user moves from step 5 to step 6
  - `Purchase` — client-side on `/success` page
  - `Purchase` — server-side via Meta CAPI in Stripe webhook

## Pricing
- Current price: **$34.99 USD** (3499 cents)
- Change in `lib/types.ts`: `SONG_PRICE_CENTS` and `SONG_PRICE`

## Deployment to Vercel
1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Set all environment variables from `.env.example`
4. Deploy — Vercel auto-detects Next.js

## Local Development
```bash
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
# In separate terminal for webhook testing:
stripe listen --forward-to localhost:3000/api/webhook
```

## Design System
- **Primary purple**: `#7C3AED`
- **Dark purple**: `#5B21B6`
- **Light purple bg**: `#F8F7FF`
- **CTA amber**: `#D97706`
- **CTA hover**: `#B45309`
- **Text dark**: `#1F2937`
- **Font**: System `-apple-system, BlinkMacSystemFont, 'Segoe UI'`
