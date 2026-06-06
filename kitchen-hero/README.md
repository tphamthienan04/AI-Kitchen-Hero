# 🍳 Kitchen Hero — AI-Powered Cooking App

> Scan your fridge. Get AI recipes. Never waste food again.

**USP**: AI fridge/receipt scanning + personalised recipe generation — two features no mainstream cooking app combines.

---

## Project structure

```
kitchen-hero/
├── src/
│   ├── pages/
│   │   ├── AuthPage.tsx          # Login + Register
│   │   ├── DashboardPage.tsx     # Home with stats & expiry alerts
│   │   ├── FridgePage.tsx        # Ingredient management
│   │   ├── AIChefPage.tsx        # AI recipe generation
│   │   └── RecipesPage.tsx       # Saved recipes
│   ├── components/
│   │   ├── AppLayout.tsx         # Top nav + bottom tab bar
│   │   ├── ProtectedRoute.tsx    # Auth guard
│   │   ├── ScanModal.tsx         # AI fridge/receipt scanner
│   │   └── AddItemModal.tsx      # Manual ingredient entry
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state (Supabase + demo mode)
│   │   ├── FridgeContext.tsx     # Fridge items state
│   │   └── RecipeContext.tsx     # Recipe state
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client + DB helpers
│   │   └── ai.ts                 # Anthropic API calls
│   └── types/index.ts            # TypeScript types
├── supabase/
│   └── functions/ai-chef/        # Edge Function (production AI calls)
├── supabase_schema.sql           # Database schema — run in SQL Editor
├── .env.example                  # Copy to .env.local and fill in keys
└── vercel.json                   # Vercel SPA routing config
```

---

## Phase 1 — Frontend ✅ (Already done)

You built the React + Vite + Tailwind frontend.

---

## Phase 2 — Backend Foundation (Do this next)

### 2.1 Database setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste `supabase_schema.sql` → Run
3. This creates: `fridge_items`, `recipes`, `meal_plans`, `profiles` with RLS

### 2.2 Authentication

1. In Supabase dashboard → **Authentication** → **Email** is enabled by default
2. Optionally enable Google OAuth under Providers
3. Copy your project URL and anon key to `.env.local`

```bash
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### 2.3 Run locally

```bash
npm install
npm run dev
```

App runs in **demo mode** without Supabase keys (all data in memory).

---

## Phase 3 — AI Integration

### Option A: Local dev (quick, less secure)
Add `VITE_ANTHROPIC_API_KEY` to `.env.local`. The app calls Claude directly from the browser.
⚠️ **Never deploy with this approach** — your API key would be exposed.

### Option B: Production (secure)
Deploy the Supabase Edge Function:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
supabase functions deploy ai-chef
```

Then update `src/lib/ai.ts` to call your Edge Function instead of the API directly:

```ts
const response = await supabase.functions.invoke('ai-chef', {
  body: { action: 'generate-recipes', payload: { ingredients, preferences } }
})
```

---

## Phase 4 — Merge & Launch

### Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (No Anthropic key — use Edge Functions for that)
4. Build command: `npm run build`, Output: `dist`
5. Deploy 🚀

### Production checklist
- [ ] `.env.local` is in `.gitignore`
- [ ] RLS enabled on all Supabase tables ✅ (done in schema)
- [ ] Anthropic API key only in Edge Function secrets, never in frontend
- [ ] `vercel.json` rewrite rule added ✅
- [ ] Custom domain set in Vercel (optional)
- [ ] Enable Supabase email confirmation for production

---

## AI features summary

| Feature | How it works |
|---|---|
| **Recipe generation** | Sends selected fridge items to Claude → returns 3 structured recipes |
| **Fridge scan** | Photo → Claude Vision → identifies food items, quantities, categories |
| **Receipt scan** | Photo of grocery bill → Claude Vision → extracts all purchased items |
| **Ingredient matching** | Generated recipes show which ingredients you already have (green) vs need to buy (red) |

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Auth | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude (vision + text) |
| Backend logic | Supabase Edge Functions (Deno) |
| Deployment | Vercel (frontend) + Supabase (backend) |
