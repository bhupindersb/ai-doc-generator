# Docs AI

Docs AI turns source code into developer documentation, including README drafts, API references, annotated source code and combined documentation.

## Current stack

- Next.js 14 App Router and TypeScript
- NextAuth.js with GitHub sign-in
- Prisma and PostgreSQL (the project currently uses Supabase PostgreSQL)
- Groq API with Llama 3.3 70B for generation
- Razorpay Subscriptions for paid plans
- Vercel deployment

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in the environment variables before running the app:

- `GROQ_API_KEY` — server-side AI provider key
- `DATABASE_URL` and `DIRECT_URL` (if configured separately) — PostgreSQL connection
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — browser-visible Razorpay key ID only
- `RAZORPAY_PLAN_SOLO` and `RAZORPAY_PLAN_TEAM` — plan IDs created in the Razorpay dashboard

Generate the Prisma client and sync a development database:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Do not run `prisma db push` against production without first reviewing the schema diff and taking a database backup. For production, use a reviewed Prisma migration and deploy it before deploying application code that depends on the new schema.

## Razorpay setup

Create the Solo and Team subscription plans in the Beveez Tech Razorpay account, then add their plan IDs to the environment variables above. Configure the webhook endpoint:

```
https://aidocs.beveeztech.com/api/webhook
```

Subscribe to the subscription lifecycle events used by the application, including:

- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `subscription.completed`
- `subscription.halted`
- `subscription.paused`
- `subscription.resumed`

The webhook secret must match `RAZORPAY_WEBHOOK_SECRET`. Keep all secret values in Vercel environment variables; never commit them to Git.

Razorpay checkout signature verification confirms the checkout response. The signed subscription webhook is the source of truth for activating or changing a paid subscription.

**Account note:** Docs AI is intended to use the Beveez Tech Razorpay account. Confirm with Razorpay that the Docs AI domain and its subscription business model are approved on that merchant account. UNLIVO must use its separate merchant credentials and must not share these environment variables.

## Documentation generation

The authenticated endpoint is:

```
POST /api/generate
```

JSON body:

```json
{
  "code": "source code to document",
  "language": "typescript",
  "docType": "full"
}
```

Supported output types: `full`, `readme`, `api`, and `inline`.

The endpoint requires a signed-in user, validates the language and output type, enforces the monthly plan limit server-side, stores the generated document and records token usage.

The current language selector supports 22 languages: TypeScript, JavaScript, Python, PHP, Go, Rust, Java, C++, C#, Ruby, Swift, Kotlin, Bash, SQL, HTML, CSS, R, Scala, Dart, Elixir, Lua and Perl.

## Payment and deployment checklist

Before production rollout:

1. Confirm the Razorpay merchant account has approval for the Docs AI domain, currency and subscription plans.
2. Configure the live Razorpay key ID, key secret, webhook secret and plan IDs in Vercel.
3. Apply the reviewed Prisma schema migration to the production database.
4. Configure the webhook URL and required subscription events in Razorpay.
5. Test successful checkout, invalid signatures, duplicate webhook delivery, cancellation and renewal in test mode.
6. Verify the production build and perform a controlled live-mode test after approval.

The GitHub Action/API-key automation and customer-managed API key issuance are not yet considered production-ready; do not advertise them as generally available until that workflow is implemented and tested.
