# DocAI — AI-Powered Code Documentation SaaS

> Generate beautiful READMEs, API references, and inline comments for any codebase — powered by Claude AI.

---

## 🗂 Project Structure

```
ai-doc-generator/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout + metadata
│   ├── globals.css               # Design tokens + animations
│   ├── dashboard/
│   │   └── page.tsx              # Protected dashboard (server component)
│   └── api/
│       ├── generate/route.ts     # POST — generate docs via Claude
│       ├── subscribe/route.ts    # POST — create Razorpay subscription
│       ├── subscribe/verify/     # POST — verify payment signature
│       ├── webhook/route.ts      # POST — Razorpay webhook handler
│       └── auth/[...nextauth]/   # NextAuth.js handler
│
├── components/
│   ├── Providers.tsx             # NextAuth SessionProvider
│   ├── Navbar.tsx                # Top nav with auth
│   ├── PricingTable.tsx          # Plans + Razorpay checkout
│   ├── DashboardClient.tsx       # Dashboard UI (client)
│   ├── CodeUploader.tsx          # Code input + language selector
│   └── DocPreview.tsx            # Generated doc viewer + download
│
├── lib/
│   ├── claude.ts                 # Anthropic SDK wrapper
│   ├── razorpay.ts               # Razorpay SDK + helpers
│   ├── db.ts                     # Prisma client singleton
│   └── auth.ts                   # NextAuth config
│
├── prisma/
│   └── schema.prisma             # DB schema (User, Subscription, etc.)
│
├── .github/workflows/
│   ├── deploy.yml                # CI → Vercel auto-deploy
│   └── auto-docs.yml             # Team plan: auto-docs on PR
│
├── .env.example                  # All required env vars (with comments)
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-doc-generator.git
cd ai-doc-generator
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Fill in all values — see instructions below
```

### 3. Set Up Database (Supabase)

```bash
npx prisma db push       # Creates all tables in Supabase
npx prisma studio        # Optional: browse data in browser
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Credentials You Need

### Anthropic (Claude API)
1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Create a new API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Razorpay
1. Login to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. **API Keys** → Settings → API Keys → Generate Key Pair
   - Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` (same as KEY_ID)
3. **Create Plans** → Subscriptions → Plans → Create Plan
   - Create "Solo" plan: ₹999/month, monthly interval
   - Create "Team" plan: ₹3999/month, monthly interval
   - Add plan IDs as `RAZORPAY_PLAN_SOLO` and `RAZORPAY_PLAN_TEAM`
4. **Webhook** → Settings → Webhooks → Add New Webhook
   - URL: `https://your-domain.vercel.app/api/webhook`
   - Events: `subscription.*`
   - Copy the secret → `RAZORPAY_WEBHOOK_SECRET`

### Supabase (Database)
1. Create project at [supabase.com](https://supabase.com)
2. Settings → API → copy `URL` and `anon key` and `service_role key`
3. Settings → Database → copy connection string → `DATABASE_URL`

### GitHub OAuth (Sign in with GitHub)
1. [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID + Secret → `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Vercel (Deployment)
1. Import GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Add all `.env.local` variables in Vercel Dashboard → Settings → Environment Variables
3. For GitHub Actions auto-deploy:
   - Get token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Add to GitHub repo Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - (Find Org ID and Project ID in `.vercel/project.json` after `vercel link`)

---

## 📦 Tech Stack

| Layer        | Technology              |
|-------------|-------------------------|
| Framework   | Next.js 14 (App Router) |
| Language    | TypeScript              |
| Styling     | Tailwind CSS            |
| Auth        | NextAuth.js (GitHub)    |
| Database    | Supabase (PostgreSQL)   |
| ORM         | Prisma                  |
| Payments    | Razorpay Subscriptions  |
| AI          | Anthropic Claude API    |
| Hosting     | Vercel                  |
| CI/CD       | GitHub Actions          |

---

## 💰 Pricing Tiers

| Plan       | Price     | Docs/Month | Features                          |
|-----------|-----------|------------|-----------------------------------|
| Free      | ₹0        | 5          | Basic docs, 3 languages           |
| Solo      | ₹999/mo   | 50         | All types, 20+ languages          |
| Team      | ₹3,999/mo | Unlimited  | GitHub Action, API access, team   |

---

## 🔄 CI/CD Pipeline

Every push to `main`:
1. GitHub Actions runs lint + type check
2. On success, builds and deploys to Vercel production
3. Pull requests get a preview URL commented automatically

---

## 📌 Next Steps

- [ ] Add Google OAuth as second sign-in option
- [ ] Build public API with API key management
- [ ] Add GitHub App for org-level integration
- [ ] Add Slack notification on doc generation
- [ ] Build analytics dashboard (docs generated, revenue, churn)
