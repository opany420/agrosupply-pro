# AgroSupply Project Review Report

**Date:** March 11, 2026
**Reviewer:** GitHub Copilot
**Stack:** React 18 · Vite 5 · Tailwind CSS 3 · Supabase · Framer Motion · Recharts
**Deployment:** Vercel

---

## Overall Grade: C

The project has a clean visual design, good lazy-loading setup, and solid cart functionality. However it is held back by **unused abstractions** (`constants.js` is never imported), **dead code** (ChatWidget never rendered, App.css empty), **data inconsistencies** across files (emails, hours, thresholds), **zero tests**, **weak error handling** on most Supabase calls, and **missing core e-commerce features** (user accounts, order tracking, stock management).

---

## Scorecard

| Dimension | Grade | Trend vs. Last Review |
|-----------|:-----:|:---------------------:|
| Security | **C+** | ↑ improved |
| Code Quality | **C** | → same |
| Error Handling | **C−** | ↑ improved |
| Performance | **B−** | ↑ improved |
| Accessibility | **D+** | ↑ improved |
| UI/UX | **B** | ↑ improved |
| State Management | **B−** | → same |
| Routing | **C+** | → same |
| Database / API | **C** | → same |
| Testing | **F** | → same |
| SEO | **D** | → same |
| Deployment & DevOps | **C** | → same |

---

## 1. Security — C+

### What's Good
- Supabase credentials loaded from `import.meta.env` in `src/supabase.js`
- `.gitignore` covers `*.local`, keeping `.env.local` out of version control
- EmailJS keys loaded from env vars in `src/pages/Checkout.jsx`
- Image upload validates file type (JPEG/PNG/WebP/GIF whitelist) and size (5 MB max) in `src/pages/Dashboard.jsx`

### What Needs Work

| Issue | File | Severity |
|-------|------|:--------:|
| Reviews auto-approved on submit (`approved: true`) — no moderation, allows spam | `src/components/Reviews.jsx` | **High** |
| User input interpolated into WhatsApp URLs without `encodeURIComponent()` — special characters break URLs | `src/pages/Checkout.jsx`, `src/pages/Contact.jsx` | Medium |
| No evidence of Supabase Row Level Security (RLS) — any authenticated user could delete any record | `src/pages/Dashboard.jsx` (all CRUD) | **High** |
| Dashboard delete operations have zero confirmation dialogs — one accidental click destroys data | `src/pages/Dashboard.jsx` | Medium |
| No CSRF protection on form submissions | Checkout, Contact, Reviews | Low |

---

## 2. Code Quality — C

### What's Good
- `src/constants.js` exists with centralized company info, payment, WhatsApp, currency values
- `src/utils.js` provides shared `formatCurrency()` and `formatDate()` used across 6 files
- Consistent Tailwind utility patterns throughout
- Clean React.lazy setup in `src/App.jsx`
- Currency format is now consistent — **zero "KSh" remaining**, all use "KES"

### What Needs Work

| Issue | Location |
|-------|----------|
| **`constants.js` is completely unused** — `COMPANY`, `PAYMENT`, `WHATSAPP`, `CURRENCY` are never imported anywhere; all values remain hardcoded across components | Every file |
| `formatCurrency()` hardcodes `"KES"` instead of importing from `CURRENCY.symbol` in `constants.js` | `src/utils.js` |
| **`ChatWidget.jsx` is never imported or rendered** — ~160 lines of dead code | `src/components/ChatWidget.jsx` |
| **`App.css` is empty** (just a comment) — dead file | `src/App.css` |
| **`Dashboard.jsx` is 1,050+ lines** — one monolithic component with 15+ state vars, 3 entity CRUDs, 5 modals, analytics, and settings | `src/pages/Dashboard.jsx` |
| `ArrowDown` imported but never used | `src/pages/Dashboard.jsx` |
| Duplicate `<link rel="icon">` tags (vite.svg and favicon.png) | `index.html` |
| `addToCart` called in a loop instead of passing quantity directly — triggers N state updates | `src/pages/ProductDetail.jsx` |

### Data Inconsistencies Across Files

| Data Point | Value A | Value B | Files |
|------------|---------|---------|-------|
| Email | `info@chicagoagro.co.ke` | `rizikisuppliers@gmail.com` / `support@rizikisuppliers.com` | `constants.js` vs `Layout.jsx` / `Contact.jsx` |
| Working hours | `Mon - Sat: 8AM - 6PM` | `Mon - Fri: 8AM - 6PM / Sat: 9AM - 4PM` | `constants.js` vs `Contact.jsx` |
| Free delivery threshold | `KES 25,000` | `KES 2,000` | `ChatWidget.jsx` vs `FAQ.jsx` |
| Bulk discount tiers | `KES 65K / 129K / 645K` | `KES 50K / 100K / 500K` | `ChatWidget.jsx` vs `FAQ.jsx` |
| Order number format | `ORD-{timestamp}-{id}` | `ORD-001` sequential | `Checkout.jsx` vs `Dashboard.jsx` |
| Company name in HTML title | `Agro Supplies Pro` | `Chicago Agro Supplies` | `index.html` vs everything else |

> **Fix:** Import and use `constants.js` everywhere. This would eliminate all inconsistencies in one pass.

---

## 3. Error Handling — C−

### What's Good
- `ErrorBoundary` component wraps the entire app (`src/components/ErrorBoundary.jsx`)
- Products page has error state + retry button (`src/pages/Products.jsx`)
- ProductDetail handles "not found" gracefully (`src/pages/ProductDetail.jsx`)
- Cart context uses try/catch for localStorage parsing (`src/CartContext.jsx`)
- Login shows auth errors (`src/pages/Login.jsx`)
- Image upload has try/catch with user-facing alert (`src/pages/Dashboard.jsx`)

### What Needs Work

| Issue | File |
|-------|------|
| `fetchReviews()` ignores Supabase error response | `src/components/Reviews.jsx` |
| `handleLike()` ignores update error | `src/components/Reviews.jsx` |
| Review `handleSubmit` — no error handling; form resets even if insert fails | `src/components/Reviews.jsx` |
| Dashboard `fetchOrders`/`fetchProducts`/`fetchClients` silently ignore errors | `src/pages/Dashboard.jsx` |
| All Dashboard CRUD operations have no error handling — local state updated optimistically with no rollback | `src/pages/Dashboard.jsx` |
| Checkout inserts each cart item in a loop with no try/catch — partial orders possible | `src/pages/Checkout.jsx` |
| `ErrorBoundary` doesn't log errors (no `componentDidCatch`) | `src/components/ErrorBoundary.jsx` |

---

## 4. Performance — B−

### What's Good
- All 9 pages lazy-loaded with `React.lazy()` + `Suspense` (reduced initial bundle from 626 KB → 506 KB)
- `loading="lazy"` on product images in Products, ProductDetail, Dashboard
- Client-side pagination (12 per page) on Products
- `viewport={{ once: true }}` on Framer Motion scroll animations

### What Needs Work

| Issue | File |
|-------|------|
| No image optimization — no `srcset`, no `width`/`height` attributes, no WebP; hero images at full resolution for all viewports | `src/pages/Home.jsx` |
| External images from unreliable third-party domains (farmbizafrica.com, seedpro.co.ke, pinimg.com) | `src/pages/Home.jsx` |
| Reviews fetches ALL records on every Home page load — no limit or pagination | `src/components/Reviews.jsx` |
| Products page fetches ALL products then filters client-side — won't scale | `src/pages/Products.jsx` |
| Dashboard fetches ALL orders, products, clients with no pagination | `src/pages/Dashboard.jsx` |
| `framer-motion` adds ~150 KB to dependencies; used on every page for minor transitions | Across all pages |
| Dashboard chunk is 441 KB — could be split further | `src/pages/Dashboard.jsx` |

---

## 5. Accessibility (a11y) — D+

### What's Good
- `aria-label` on cart buttons and WhatsApp FAB (`src/Layout.jsx`)
- `aria-expanded` on mobile menu toggle (`src/Layout.jsx`)
- `lang="en"` on root HTML element
- Semantic elements: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- Descriptive alt text on hero images (`Home.jsx`, `About.jsx`)
- Form inputs have associated labels

### What Needs Work

| Issue | File |
|-------|------|
| No skip-to-content link for keyboard navigation | `src/Layout.jsx` |
| Cart drawer has no focus trap — keyboard users tab behind overlay | `src/components/Cart.jsx` |
| Dashboard modals (5 of them) have no focus trap and no Escape-to-close | `src/pages/Dashboard.jsx` |
| FAQ accordion has no ARIA roles (`role="region"`, `aria-expanded`, `aria-controls`) | `src/pages/FAQ.jsx` |
| Star rating buttons in review form have no `aria-label` | `src/components/Reviews.jsx` |
| No `<h1>` on some pages; heading levels skip in places | Various |
| Color contrast not verified — emerald-600 on white may fall below 4.5:1 in some cases | Various |

---

## 6. UI/UX — B

### What's Good
- Consistent emerald/green design language throughout
- Loading spinners on all async operations
- Empty states in Cart, Products, Orders
- Multi-step checkout with visual progress indicator
- Responsive layout with mobile hamburger menu
- Form validation with inline error messages (Checkout email, phone, required fields)
- Forgot password flow on Login
- Product image upload button alongside URL input (Dashboard)
- Order confirmation page with payment instructions
- Email confirmation via EmailJS (best-effort, non-blocking)

### What Needs Work

| Issue | File |
|-------|------|
| **ChatWidget is never rendered** — exists in code but not in Layout or App | `src/components/ChatWidget.jsx` |
| Header always shows "Sign In" even when user is logged in — no auth awareness | `src/Layout.jsx` |
| Settings "Save Changes" button in Dashboard does nothing — uses `defaultValue` with no state tracking | `src/pages/Dashboard.jsx` |
| No confirmation dialogs for destructive operations (delete order / product / client) | `src/pages/Dashboard.jsx` |
| Footer copyright says "© 2025" — should be 2026 or dynamic | `src/Layout.jsx` |
| "Showing 1–12 of X" shows "1–0 of 0" when filtered list is empty | `src/pages/Products.jsx` |
| Dashboard sidebar doesn't collapse responsively on mobile — fixed position overlaps content | `src/pages/Dashboard.jsx` |

---

## 7. State Management — B−

### What's Good
- Cart context well-implemented with provider pattern (`src/CartContext.jsx`)
- Cart persisted to localStorage; loads on init, syncs on every change
- Derived values (`totalItems`, `totalPrice`) computed inline, not stored separately
- Local state used appropriately in most page components

### What Needs Work

| Issue | File |
|-------|------|
| **No shared auth context** — `ProtectedRoute` creates its own listener, Dashboard has its own sign-out, header has no auth info | `src/App.jsx`, `src/pages/Dashboard.jsx`, `src/Layout.jsx` |
| Dashboard has 15+ `useState` hooks in one component | `src/pages/Dashboard.jsx` |
| Dashboard `stats` is derived data but manually kept in sync with fragile `setStats(prev => ...)` calls when adding/deleting | `src/pages/Dashboard.jsx` |
| Review `liked` array is ephemeral — lost on page navigation, so users can re-like after navigating away | `src/components/Reviews.jsx` |

---

## 8. Routing — C+

### What's Good
- Lazy-loaded routes with Suspense + loading fallback
- `ProtectedRoute` guards `/dashboard` with Supabase auth listener
- Vercel SPA rewrites configured (`vercel.json`)
- Clean URL structure (`/products/:id`)

### What Needs Work

| Issue | File |
|-------|------|
| **No 404 catch-all route** — navigating to `/nonexistent` shows a blank page | `src/App.jsx` |
| Login page renders even when user is already authenticated — no redirect to `/dashboard` | `src/pages/Login.jsx` |
| **No scroll-to-top on route changes** — navigating between pages preserves scroll position | `src/App.jsx` |

---

## 9. Database / API — C

### What's Good
- Supabase used consistently for all data (orders, products, clients, reviews)
- Products ordered by `created_at` desc
- Reviews filtered by `approved: true` on read
- Related products queried by category in ProductDetail
- Image upload to Supabase Storage with public URL retrieval

### What Needs Work

| Issue | File |
|-------|------|
| **Order amount stored as formatted string** (e.g., `"KES 2,500"`) instead of numeric — revenue calc has to regex-parse it | `src/pages/Checkout.jsx`, `src/pages/Dashboard.jsx` |
| **Like count race condition**: reads current likes, increments +1, writes — concurrent users lose likes; should use Postgres `increment` via `.rpc()` | `src/components/Reviews.jsx` |
| **Two different order number formats**: Checkout uses `ORD-{timestamp}-{id}`, Dashboard uses `ORD-001` sequential | `src/pages/Checkout.jsx` vs `src/pages/Dashboard.jsx` |
| Multi-item orders inserted in a loop with no transaction — partial order possible on failure | `src/pages/Checkout.jsx` |
| No server-side pagination on any query — all records fetched | Products, Orders, Clients, Reviews |
| No input validation before Supabase inserts in Dashboard (negative prices, empty strings accepted) | `src/pages/Dashboard.jsx` |
| Product stock is never decremented when an order is placed | `src/pages/Checkout.jsx` |

---

## 10. Testing — F

- **Zero test files exist** in the entire project
- No testing libraries installed (no vitest, jest, cypress, or @testing-library)
- No test scripts in `package.json`
- No test configuration

---

## 11. SEO — D

### What's Good
- Meta description present in `index.html`
- `lang="en"` on root element

### What Needs Work

| Issue |
|-------|
| Static page title `"Products | Agro Supplies Pro"` on ALL pages — wrong company name |
| No per-page dynamic `<title>` or meta tags (no react-helmet or equivalent) |
| No Open Graph tags |
| No Twitter Card tags |
| No structured data (JSON-LD) for products |
| No `sitemap.xml` |
| No `robots.txt` |
| SPA with no SSR/SSG — Google may not fully index client-rendered content |

---

## 12. Deployment & DevOps — C

### What's Good
- Vite for fast builds
- Vercel SPA rewrites configured
- ESLint configured with React rules
- `.gitignore` is comprehensive
- Build currently passes

### What Needs Work

| Issue |
|-------|
| No `.env.example` to document required environment variables for new developers |
| No CI/CD pipeline config (GitHub Actions, Vercel build hooks, etc.) |
| No Prettier or formatter configured |
| `package.json` version is `"0.0.0"` |
| No build/lint/test validation in any pre-commit hook or pipeline |

---

## Priority Fix Recommendations

### Phase 5 — Critical Fixes (do first)

| # | Task | Impact |
|---|------|--------|
| 1 | **Wire up `constants.js`** — import `COMPANY`, `PAYMENT`, `WHATSAPP`, `CURRENCY` in every file and replace all hardcoded emails, phones, hours, thresholds. This fixes ALL data inconsistencies in one pass. Have `formatCurrency()` in `utils.js` import from `CURRENCY` instead of hardcoding `"KES"`. | Eliminates 6+ inconsistencies |
| 2 | **Add 404 catch-all route** + **scroll-to-top on navigation** | Routing |
| 3 | **Create shared `AuthContext`** — single auth listener, expose `user`/`signOut` to Layout (show user name, "Sign Out" instead of "Sign In") and use in ProtectedRoute | Auth + UX |
| 4 | **Add error handling to all Supabase calls** in Dashboard, Reviews, Checkout — wrap in try/catch, show toast/alert on failure, rollback optimistic state | Reliability |
| 5 | **Add delete confirmation dialogs** in Dashboard before removing orders / products / clients | Data safety |

### Phase 6 — Quality & Polish

| # | Task | Impact |
|---|------|--------|
| 6 | **Render or remove `ChatWidget`** — either integrate it into Layout or delete the dead file | Code hygiene |
| 7 | **Delete empty `App.css`** and remove its import from `App.jsx` | Code hygiene |
| 8 | **Fix review moderation** — set `approved: false` on submit, show "pending review" message | Security |
| 9 | **Add FAQ accordion ARIA** (`aria-expanded`, `aria-controls`, `role="region"`) and focus trap to Cart drawer + Dashboard modals | Accessibility |
| 10 | **Fix index.html** — correct page title to "Chicago Agro Supplies", remove duplicate favicon link, add OG tags | SEO |

### Phase 7 — Architecture & Scale

| # | Task | Impact |
|---|------|--------|
| 11 | **Split Dashboard.jsx** into sub-components (OrdersTab, ProductsTab, ClientsTab, AnalyticsTab, SettingsTab) | Maintainability |
| 12 | **Store order amounts as numbers** in Supabase, format on display only | Data integrity |
| 13 | **Unify order number generation** — pick one format and use everywhere | Consistency |
| 14 | **Add server-side pagination** to products and dashboard queries using Supabase `.range()` | Scalability |
| 15 | **Set up Vitest + @testing-library/react** and write tests for CartContext, utils.js, and key user flows | Quality assurance |

### Phase 8 — Production Readiness

| # | Task | Impact |
|---|------|--------|
| 16 | Create `.env.example` documenting all required env vars | Onboarding |
| 17 | Add `robots.txt` and `sitemap.xml` | SEO |
| 18 | Configure Supabase Row Level Security (RLS) policies | Security |
| 19 | Add `react-helmet-async` for per-page titles and meta tags | SEO |
| 20 | Set up a basic GitHub Actions CI workflow (lint + build + test) | DevOps |

---

## What Improved Since Last Review (from C+ to C)

> Note: The overall letter grade dropped from C+ to C because this review evaluates more dimensions and applies stricter criteria. In absolute terms, the codebase is meaningfully better.

- ✅ Supabase credentials moved to `.env.local` (was hardcoded)
- ✅ Cart persisted to localStorage (was lost on refresh)
- ✅ ErrorBoundary wrapping all routes (didn't exist)
- ✅ React.lazy code splitting on all 9 pages (626 KB → 506 KB)
- ✅ Products pagination (12 per page)
- ✅ Form validation on Checkout (email, phone, required fields)
- ✅ Forgot password flow on Login
- ✅ Dashboard analytics with real charts (recharts)
- ✅ Product image upload via Supabase Storage (was URL-only)
- ✅ `formatCurrency()` and `formatDate()` in shared `src/utils.js` (was inline everywhere)
- ✅ Currency format unified to "KES" everywhere (was mix of "KES" / "KSh")
- ✅ EmailJS integration for order confirmation emails
- ✅ Accessibility: aria-labels on interactive elements, descriptive alt text on images
- ✅ `loading="lazy"` on product images
- ✅ Removed unused `@tanstack/react-query` dependency

---

*Report generated by GitHub Copilot — March 11, 2026*
