# Soultech Vending — Customer Support Portal

A mobile-first, customer-facing web portal for **Soultech Vending**. Customers scan a QR code on a vending machine and can:

1. **Report an issue** with the machine (with optional photo)
2. **Request a product** they'd like to see in the machine
3. **Vote** on products already requested for that machine
4. **Track** their submission by reference number

No account or login required — the whole flow takes under 30 seconds.

---

## Product Request Voting

Clicking **Request a Product** on a machine now opens the **Requested Products**
list for that machine (e.g. `/machine/ST-001/request`). Customers can:

- See products already requested for **that machine only**, sorted by votes.
- **Tap a product card to vote** (tap again to remove the vote — a toggle).
- See a prominent **Soultech Note** (admin note) on each product.
- Tap **+ Request a New Product** to suggest a product not yet on the list.

Duplicate requests are prevented per machine — if a product is already
requested, the customer is told and encouraged to vote instead.

Votes are tied to an anonymous `soultech_voter_id` stored in `localStorage`, so
a customer can't inflate counts and their votes persist across refreshes.

---

## Mock Service Mode

The application ships with a **mock service mode** enabled by default so it runs
completely offline with realistic data — no Supabase account, credentials, or
network required.

```ts
// src/config/appConfig.ts
export const isMockService = true
```

- `true` → all data comes from local mock services (machines, products, issues,
  product requests, requested products, votes). Photos use local object URLs.
  Newly submitted issues/requests and votes are persisted in `localStorage`
  (`soultech_mock_issues`, `soultech_mock_product_requests`,
  `soultech_mock_requested_products`, `soultech_product_votes`) so they survive
  refreshes.
- `false` → the real Supabase services are used (requires `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY`). Votes are stored in the `product_request_votes`
  table (see `supabase/voting.sql`) with a unique `(product_request_id, voter_id)`
  constraint.

The UI never knows which implementation is active — everything goes through the
central service layer in `src/services/index.ts`. In mock mode the Supabase
client is **not imported or initialized** (dynamic imports keep it out of the
bundle entirely).

---

## Tech Stack

- **React 19 + TypeScript** (strict mode)
- **Vite 8**
- **Tailwind CSS v4** (custom Soultech brand theme)
- **React Router v7**
- **Supabase** (Postgres + Storage + Row Level Security)
- Fully responsive, **mobile-first**, **English + Arabic (RTL)**

---

## Project Structure

```
src/
  config/            appConfig.ts — the single isMockService flag
  services/          Central service layer (UI only imports from here)
    mock/            Mock implementations (machines, products, issues, requests, votes, photos)
    supabase/        Real Supabase implementations
    index.ts         Service selector — picks mock or supabase per isMockService
  data/              mockData.ts — realistic mock machines/products/issues/requests/requested products
  components/        Design-system UI (Logo, PageLayout, MachineHeader, ActionCard,
                     IssueTypeCard, RequestedProductCard, FileUploader, PhoneInput,
                     SubmitButton, SuccessScreen, StatusTimeline, LanguageSwitcher,
                     LoadingState (skeletons), ErrorState)
  i18n/              Translations (EN/AR), language context, RTL handling
  lib/               Supabase client, API layer, image compression, reference generator
  pages/             Home, Machine, Issue, Request, RequestNewProduct, Track (FormLayout shell)
  types/             Strong TypeScript types matching the Supabase schema
  App.tsx            Routes
supabase/
  schema.sql         Tables + RLS + storage bucket
  voting.sql         requested_products + product_request_votes + RLS + unique index
  seed.sql           Optional sample machines/products
```

The portal uses a custom **Soultech design system** built on Tailwind v4 theme
tokens (`brand` blue + `accent` orange) and shared `@layer components` classes
(`.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge`, `.page-shell`)
defined in `src/index.css` — plus skeleton loaders, gradient backgrounds, and
subtle animations for a premium commercial feel, all mobile-first (360px+) with
full RTL parity.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates:
   - `machines`, `products`, `customer_issues`, `product_requests`
   - Row Level Security policies (public read of active machines/products, public insert of issues/requests, read-by-reference)
   - A public `customer-photos` storage bucket with upload/read policies
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to add sample machines and products.
4. Add your machines to the `machines` table. `machine_code` (e.g. `ST-001`) is the **public identifier** used in QR codes — keep it stable.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> Use the **anon/publishable** key only. Never expose the service-role key in frontend code.

## 4. Run locally

```bash
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173`).

## 5. Build

```bash
npm run build
```

The production build runs `tsc -b` (type check) then `vite build`. Output goes to `dist/`.

## 6. Deploy to Cloudflare Pages

**Option A — Wrangler CLI:**

```bash
npm i -g wrangler
wrangler pages deploy dist --project-name soultech-support
```

**Option B — Git integration:**

1. Push this repo to GitHub/GitLab.
2. In Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in **Settings → Environment variables**.

SPA routing is handled by [`public/_redirects`](public/_redirects):

```
/* /index.html 200
```

so routes like `/machine/ST-001` and `/track/ST-1042` work when opened directly.

## 7. Configure a custom domain

In Cloudflare Pages → your project → **Custom domains**, add e.g. `support.soultech.ly` and follow the DNS instructions.

## 8. Generate QR codes for machines

Each machine gets a QR code pointing to its stable URL:

```
https://support.soultech.ly/machine/ST-001
```

Generate one per machine (any QR generator works, e.g. `qrencode`):

```bash
qrencode -o st-001.png "https://support.soultech.ly/machine/ST-001"
```

Print and attach the sticker to the machine. The URL uses the **machine code**, not the database ID, so stickers stay valid even if internal IDs change.

---

## Reference Numbers

- Issues: `ST-1001`, `ST-1002`, … (prefix `ST-`)
- Product requests: `PR-1001`, `PR-1002`, … (prefix `PR-`)

References are generated client-side as random 4-digit numbers and are unique via a database constraint. Database IDs are never exposed to customers.

## Security

- Row Level Security is enabled on all tables.
- Anonymous users can only: read active machines/products, insert issues/requests, and read a submission by its reference number.
- No update/delete policies exist for anonymous users.
- Only the anon key is used in the frontend.

## Analytics-ready schema

`customer_issues` and `product_requests` store `machine_id`, `issue_type`/`product_id`, `product_name`, and `status`, with indexes on the columns needed to compute:

- Most requested products (overall and per machine)
- Most common issues
- Issues per machine / per location

The existing Soultech management application can query these tables directly.

---

## Assumptions & Decisions

- **No existing backend was found** in this workspace, so the Supabase schema from the spec was created (`supabase/schema.sql`). If the Soultech management app already has `machines`/`products` tables, reuse those instead and skip the matching `create table` statements.
- **Brand colors**: Soultech brand palette — professional blue (`#274ce4`) + orange (`#f94d16`) — is defined in `src/index.css` (`@theme`). Swap the hex values there to match official branding.
- **Logo**: the official Soultech logo lives at `src/assets/squared_logo.png` and is used in the header (`src/components/Logo.tsx`), on the homepage hero, and as the favicon (`public/favicon.png`).
- **Photo uploads** are compressed client-side (max 1280px, JPEG ~80%) before uploading to Supabase Storage. If the upload fails, the customer can still submit without the photo.
- **Language preference** is stored in `localStorage`; English is the default.
- **Reference collisions** are handled by the unique constraint; the form shows a retryable error if one occurs.
