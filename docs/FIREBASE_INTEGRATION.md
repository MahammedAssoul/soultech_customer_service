# Firebase Integration Report — Soultech Vending Customer Portal

## A. Features discovered (full audit)

| Feature | Route / entry point |
|---------|---------------------|
| Home page + machine selector (EN/AR, RTL) | `/` |
| Contact Us (call / WhatsApp / email) | `/` |
| Hidden admin entry (5 logo taps → passcode `19992001`) | `/` → `/admin` |
| Machine page (report issue / request product) | `/machine/:machineId` |
| Machine visit tracking (1 per browser per machine) | `/machine/:machineId` |
| Issue reporting (with optional photo + phone) | `/machine/:machineId/issue` |
| Requested products list + voting (vote/unvote) | `/machine/:machineId/request` |
| Request a new product (duplicate detection per machine) | `/machine/:machineId/request/new` |
| Track submission by reference (`ST-xxxx` / `PR-xxxx`) | `/track/:reference` |
| Admin panel (Issues / Requests / Requested Products / Machines tabs) | `/admin` |
| Admin machine CRUD + visitor counts | `/admin` (Machines tab) |
| Admin requested-product edit (status, admin note, photo) | `/admin` (Requested Products tab) |

## B. Firebase collections created

| Collection | Purpose |
|------------|---------|
| `machines` | Vending machines (code = public identifier `ST-001`) |
| `products` | Product catalog (searchable, active flag) |
| `issues` | Customer issue reports (`referenceNumber`, `machineId`, `issueType`, `status`, …) |
| `productRequests` | Legacy product-request tracking records with `PR-xxxx` references |
| `requestedProducts` | Voteable product suggestions per machine (`voteCount`, `adminNote`, `status`, …) |
| `productRequestVotes` | One document per vote; id = `${productRequestId}_${voterId}` (structurally unique) |
| `machineVisits` | Visitor analytics events (readable by admins only) |
| `admins` | Admin UID registry (doc id = auth uid) |

Note: `referenceNumber`, `adminNote`, `voteCount`, `status`, and photos are
**admin-controlled** (see rules). Customers cannot modify them.

## C. Firebase Storage paths

| Path | Access |
|------|--------|
| `issues/{uid}/{timestamp}-{uuid}.jpg` | Customer upload (own uid subfolder, max 8 MB, image/*) |
| `requestedProducts/**` | Admin write only (photo uploads for requested products) |
| `machines/**`, `products/**` | Admin write only |

## D. Authentication

- Customers use **Firebase Anonymous Authentication** — no login screen.
- `ensureAnonymousAuth()` signs in invisibly on first Firebase-backed operation and returns the UID.
- The anonymous UID is used as `voterId` for voting and as the uploader for storage paths.
- Mock mode never touches Firebase Auth.

## E. Security Rules summary

**Customers (any signed-in anonymous user):**
- read: `machines`, `products`, `issues`, `productRequests`, `requestedProducts`, own `productRequestVotes`
- create: `issues`, `productRequests`, `requestedProducts` (with `status == 'new'`, `voteCount == 0` constraints)
- create/delete: **own** votes only (`voterId == auth.uid`; document id encodes the voter)
- update: denied on all admin-controlled fields

**Admins (uid present in `admins` collection):**
- full read/write on everything (`machineVisits` read too)

**Storage:** customers can write only `issues/{uid}/...`; everything else is admin-write.

## E2. Composite indexes

**None required.** All Firestore queries use single-field filters only (auto-indexed
by Firestore); any sorting is done in memory by the service layer
(`firestore.indexes.json` is intentionally empty).

## F. Mock mode

- `src/config/appConfig.ts` → `export const isMockService = true` is the **single** toggle.
- `true` → all services resolve to `src/services/mock/*` (localStorage-backed, offline, no Firebase).
- `false` → all services resolve to `src/services/firebase/*`.
- The UI never knows the source; dynamic imports keep Firebase out of the mock bundle.

## G. Additional data structures (beyond the prompt's minimum)

- `machineVisits` — visitor-count analytics used by the admin Machines tab.
- `admins` — admin authorization registry for security rules.
- `nameAr` field on machines — Arabic display name for the home page selector in Arabic mode (discovered feature).

## H. Files changed

**New:**
- `src/firebase/firebaseConfig.ts`, `firebaseAuth.ts`, `firebaseFirestore.ts`, `firebaseStorage.ts`
- `src/services/firebase/machineService.ts`, `productService.ts`, `issueService.ts`, `photoService.ts`, `requestService.ts`, `mappers.ts`
- `firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`
- `scripts/seedFirebase.mjs`

**Modified:**
- `src/services/index.ts` (mock ↔ firebase loader)
- `src/services/photoService.ts` (mock ↔ firebase photo upload)
- `src/services/mock/mockRequestService.ts` + `supabase/requestService.ts` (`getVoterId` now async — signature parity with Firebase)
- `.env.example`, `.gitignore`, `package.json` (`firebase`, `firebase-admin`, `seed:firebase` script), `README.md`

**Supabase remains:** the old `src/services/supabase/*` files were left intact but are no longer referenced by `index.ts`; `supabase/*.sql` files retained for reference.

## I. Testing

- `npm run build` → ✅ passes (`tsc -b && vite build`)
- `npm run lint` → ✅ clean
- Mock mode (isMockService = true) verified in browser: home, machine selection, requested-products list, voting (vote count 42 → 43), admin page.
- Firebase mode: requires real `VITE_FIREBASE_*` env vars + deployed rules; not runtime-tested without a configured project (would need credentials).