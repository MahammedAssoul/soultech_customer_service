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
- `false` → the real **Firebase** services are used (requires the `VITE_FIREBASE_*`
  environment variables). Firestore + Firebase Storage + anonymous auth.

The UI never knows which implementation is active — everything goes through the
central service layer in `src/services/index.ts`. In mock mode the Firebase SDK
is **not imported or initialized** (dynamic imports keep it out of the bundle
entirely).

---

## Tech Stack

- **React 19 + TypeScript** (strict mode)
- **Vite 8**
- **Tailwind CSS v4** (custom Soultech brand theme)
- **React Router v7**
- **Firebase** (Cloud Firestore + Storage + Auth + Security Rules)
- Fully responsive, **mobile-first**, **English + Arabic (RTL)**

---

## Project Structure

```
src/
  config/            appConfig.ts — the single isMockService flag
  services/          Central service layer (UI only imports from here)
    mock/            Mock implementations (machines, products, issues, requests, votes, photos)
    firebase/        Real Firebase implementations (Firestore + Storage)
    index.ts         Service selector — picks mock or firebase per isMockService
  firebase/          Firebase config layer (app, auth, firestore, storage)
  data/              mockData.ts — realistic mock data
  components/        Design-system UI (Logo, PageLayout, MachineHeader, ActionCard,
                     IssueTypeCard, RequestedProductCard, FileUploader, PhoneInput,
                     SubmitButton, SuccessScreen, StatusTimeline, LanguageSwitcher,
                     LoadingState (skeletons), ErrorState)
  i18n/              Translations (EN/AR), language context, RTL handling
  lib/               Reference generator
  pages/             Home, Machine, Issue, Request, RequestNewProduct, Track, Admin
  types/             Strong TypeScript types shared by mock + firebase services
  App.tsx            Routes
firebase.json        Firebase config (rules + indexes)
firestore.rules      Firestore security rules
firestore.indexes.json  Composite indexes
storage.rules        Storage security rules
scripts/
  seedFirebase.mjs   Optional Firebase seed script (documented below)
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

## 2. Configure Firebase (production mode)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. In **Project settings → Your apps → Web**, register a web app and copy the SDK config.
3. Enable **Anonymous authentication** under **Authentication → Sign-in method**.
4. Deploy the security rules:

```bash
npx firebase deploy --only firestore:rules,storage
```

5. (Optional) Seed the database:

```bash
# Set your Firebase service-account path + project id
export FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
export VITE_FIREBASE_PROJECT_ID=my-project
export FIREBASE_ADMIN_UIDS=uid1,uid2   # admin UIDs (from Auth → Users)
npm run seed:firebase
```

The seed script mirrors the mock data (machines, products, issues, product
requests, requested products) and is idempotent — it never deletes or
overwrites existing documents.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the `VITE_FIREBASE_*` values from the Firebase console:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Only the publishable web config is used in the frontend. Never commit the
> real `.env` or any service-account key.

## 4. Run locally

```bash
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173`). With `isMockService = true`
the app runs fully offline; flip it to `false` to use Firebase.

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
5. Add the `VITE_FIREBASE_*` environment variables in **Settings → Environment variables**.

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

- Firestore Security Rules are enforced on all collections (see `firestore.rules`).
- Customers (anonymous Firebase Auth users) can only:
  - read machines/products/requests/requested products
  - create issues and product requests
  - create/delete **their own** votes (vote id is `${productRequestId}_${voterId}`, so duplicates are structurally impossible; `voteCount`, `adminNote`, `status`, `photoUrl` are admin-only).
- Admins are identified by a document in the `admins` collection (uid = document id) and can read/write everything.
- Firebase Storage rules (`storage.rules`) limit customer uploads to `issues/{uid}/...`; admin assets (requested-product photos, machine images) are admin-write only.
- No Firebase internal error details are exposed to customers.

## Analytics-ready schema

`issues`, `productRequests`, and `requestedProducts` store `machineId`,
`issueType`/`productId`, `productName`, and `status`, with queries designed for:

- Most requested products (overall and per machine)
- Most common issues
- Issues per machine / per location

The existing Soultech management application can query Firestore directly
(using admin credentials).

---

## Assumptions & Decisions

- **No existing backend was found** in this workspace, so the Firebase
  data model was created from the application audit (see the final
  Firebase report in `docs/FIREBASE_INTEGRATION.md`).
- **Brand colors**: Soultech brand palette — professional blue (`#274ce4`) + orange (`#f94d16`) — is defined in `src/index.css` (`@theme`). Swap the hex values there to match official branding.
- **Logo**: the official Soultech logo lives at `src/assets/squared_logo.png` and is used in the header (`src/components/Logo.tsx`), on the homepage hero, and as the favicon (`public/favicon.png`).
- **Photo uploads** are compressed client-side (max 1280px, JPEG ~80%) before uploading to Firebase Storage. If the upload fails, the customer can still submit without the photo.
- **Language preference** is stored in `localStorage`; Arabic is the default.
- **Reference collisions** are handled by the unique constraint; the form shows a retryable error if one occurs.
