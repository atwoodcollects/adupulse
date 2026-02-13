# ADU Pulse Monetization Blueprint

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Pricing Page → Stripe Checkout → Success Page       │
│  Town Pages → PaywallGate component (free vs Pro)    │
│  Comparison Tool → 2-town free cap                   │
│  Export buttons → Pro-only                           │
├─────────────────────────────────────────────────────┤
│                    AUTH (Clerk)                       │
│  Sign up / Sign in → middleware.ts protects routes   │
│  User metadata stores subscription tier              │
├─────────────────────────────────────────────────────┤
│                    PAYMENTS (Stripe)                  │
│  Products: Pro ($49/mo), Pro Annual ($468/yr)         │
│  Webhook → syncs subscription status to Clerk        │
│  Customer portal → manage/cancel subscriptions       │
├─────────────────────────────────────────────────────┤
│                    GATING LOGIC                       │
│  useSubscription() hook checks tier                  │
│  <PaywallGate> wraps premium content                 │
│  Server-side: middleware + API route protection       │
└─────────────────────────────────────────────────────┘
```

## Tech Stack Decisions

| Layer        | Choice     | Why                                                    |
|-------------|------------|--------------------------------------------------------|
| Auth        | **Clerk**  | 5-min setup, Vercel-native, handles OAuth/magic links, free tier generous (10K MAU). Stores custom metadata (subscription tier) on user object. |
| Payments    | **Stripe** | Industry standard. Checkout Sessions for payment, Customer Portal for self-service, Webhooks for sync. |
| Database    | **None yet** | Clerk user metadata stores subscription tier. No DB needed until you have 50+ paying users. Then add Supabase or Planetscale. |
| Gating      | **Client + Server** | Client-side `<PaywallGate>` for UX, server-side middleware for API protection. Belt and suspenders. |

## Setup Steps (Do These First)

### 1. Clerk Setup (~10 min)
1. Go to clerk.com → Create application → "ADU Pulse"
2. Enable Email + Google sign-in (covers 95% of users)
3. Copy your keys into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
   CLERK_SECRET_KEY=sk_live_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```
4. `npm install @clerk/nextjs`

### 2. Stripe Setup (~15 min)
1. Go to dashboard.stripe.com → Create account
2. Create two Products:
   - **ADU Pulse Pro Monthly** → $49/month (recurring)
   - **ADU Pulse Pro Annual** → $39/month billed annually ($468/year)
3. Copy Price IDs into `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   STRIPE_PRICE_MONTHLY=price_xxx
   STRIPE_PRICE_ANNUAL=price_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```
4. `npm install stripe`

### 3. Install Dependencies
```bash
npm install @clerk/nextjs stripe
```

## File Structure (What to Add to Your Project)

```
app/
├── layout.tsx               ← Wrap with ClerkProvider
├── middleware.ts             ← Auth + route protection
├── pricing/
│   └── page.tsx             ← Pricing page with Stripe checkout
├── sign-in/[[...sign-in]]/
│   └── page.tsx             ← Clerk sign-in page
├── sign-up/[[...sign-up]]/
│   └── page.tsx             ← Clerk sign-up page
├── api/
│   ├── checkout/
│   │   └── route.ts         ← Creates Stripe Checkout session
│   ├── webhooks/
│   │   └── stripe/
│   │       └── route.ts     ← Handles Stripe webhook events
│   └── portal/
│       └── route.ts         ← Stripe Customer Portal redirect
├── towns/[slug]/
│   └── page.tsx             ← Town page (uses PaywallGate)
components/
├── PaywallGate.tsx           ← Wraps premium content
├── UpgradeBanner.tsx         ← CTA shown to free users
├── PricingCard.tsx           ← Reusable pricing card
lib/
├── stripe.ts                 ← Stripe client init
└── subscription.ts           ← useSubscription() hook
```

## Gating Rules (What's Free vs Pro)

| Feature                          | Free          | Pro ($49/mo)     |
|---------------------------------|---------------|------------------|
| Town pages (summary stats)       | ✅ All towns  | ✅ All towns      |
| Permit table rows per town       | 5 sample rows | Full table        |
| Town comparison tool             | 2 towns max   | Unlimited         |
| Compliance tracker (summary)     | Badge only    | Full breakdown    |
| Export (CSV/PDF)                 | ❌            | ✅                |
| Email alerts                     | ❌            | ✅ (when built)   |
| Market opportunity scores        | Top 5 only    | All 221 ranked    |
| Buyers Club signup               | ✅ Free       | ✅ Free           |
| Builder demand data (by town)    | ❌            | ✅                |

## Revenue Math

| Subscribers | Monthly Rev | Annual Rev |
|-------------|------------|------------|
| 5           | $245       | $2,940     |
| 10          | $490       | $5,880     |
| 25          | $1,225     | $14,700    |
| 50          | $2,450     | $29,400    |

You need ~10 subscribers to cover basic operating costs + tools.
You need ~25 to justify this as a real revenue stream.
You need ~50 to start thinking about it as primary income.

## Launch Checklist

- [ ] Set up Clerk account + add keys to env
- [ ] Set up Stripe account + create products + add keys to env
- [ ] Add ClerkProvider to layout.tsx
- [ ] Add middleware.ts
- [ ] Deploy sign-in and sign-up pages
- [ ] Deploy pricing page
- [ ] Deploy API routes (checkout, webhook, portal)
- [ ] Add PaywallGate to town pages
- [ ] Test full flow: sign up → checkout → see premium content
- [ ] Set up Stripe webhook endpoint in dashboard
- [ ] Announce to builder contacts
