# AgroSupply Project Review Report

**Date:** March 12, 2026
**Reviewer:** GitHub Copilot
**Stack:** React 18 · Vite 5 · Tailwind CSS 3 · Supabase · Framer Motion · Recharts
**Deployment:** Vercel

---

## Overall Grade: B−

The project has undergone significant improvement since the last review. Core architecture issues have been resolved: shared AuthContext, Dashboard split into sub-components, constants centralized, server-side pagination added, proper error handling on Supabase calls, 404 routing, scroll-to-top, per-page SEO titles, CI pipeline, and review moderation. The main remaining gaps are **zero tests**, **data inconsistencies in ChatWidget.jsx**, **order amounts stored as formatted strings**, and **accessibility gaps** (focus traps, skip link).

---

## Scorecard

| Dimension | Grade | Prev | Trend |
|-----------|:-----:|:----:|:-----:|
| Security | **B** | C+ | ↑ |
| Code Quality | **B** | C | ↑↑ |
| Error Handling | **B−** | C− | ↑↑ |
| Performance | **B−** | B− | → |
| Accessibility | **C** | D+ | ↑ |
| UI/UX | **B+** | B | ↑ |
| State Management | **B** | B− | ↑ |
| Routing | **A** | C+ | ↑↑↑ |
| Database / API | **C+** | C | ↑ |
| Testing | **F** | F | → |
| SEO | **B** | D | ↑↑↑ |
| Deployment & DevOps | **B−** | C | ↑↑ |

---

## 1. Security — B

### What's Good
- Supabase credentials loaded from `import.meta.env`
- `.gitignore` covers `*.local`; `.env.example` documents required vars
- EmailJS keys loaded from env vars
- Image upload validates file type (JPEG/PNG/WebP/GIF) and size (5 MB max)
- Reviews submit with `approved: false` — moderation required before display
- `encodeURIComponent()` used on all WhatsApp URL user input
- Delete operations protected by `window.confirm()` dialogs

### PENDING Issues

| Issue | File | Severity |
|-------|------|:--------:|
| No evidence of Supabase Row Level Security (RLS) policies — any authenticated user could CRUD any record | Supabase config (external) | **High** |
| No CSRF protection on form submissions (mitigated by Supabase's built-in auth headers) | Checkout, Contact, Reviews | Low |

---

## 2. Code Quality — B

### What's Good
- `constants.js` imported and used in 8+ files (Dashboard, Layout, Checkout, Home, Contact, FAQ, ChatWidget, SettingsTab)
- `formatCurrency()` in `utils.js` uses `CURRENCY.symbol` from constants
- Dashboard split into 6 sub-components (911 lines down from 1,050+)
- `ChatWidget.jsx` is rendered in Layout
- `App.css` deleted — no dead files
- No unused imports (ArrowDown removed)
- Single favicon link in `index.html`
- Currency format unified to "KES" everywhere

### PENDING Issues

| Issue | File |
|-------|------|
| ChatWidget hardcodes free delivery threshold as KES 25,000; FAQ says KES 2,000 | `ChatWidget.jsx` vs `FAQ.jsx` |
| ChatWidget hardcodes bulk discount tiers as KES 65K/129K/645K; FAQ says KES 50K/100K/500K | `ChatWidget.jsx` vs `FAQ.jsx` |
| ChatWidget says "delivery within Nairobi"; FAQ/About say Kisumu/Ahero | `ChatWidget.jsx` |
| `addToCart` called in a loop (`for (let i = 0; i < quantity; i++)`) — triggers N state updates instead of passing quantity directly | `ProductDetail.jsx` |
| Dashboard.jsx still has 28 `useState` hooks — could benefit from `useReducer` | `Dashboard.jsx` |

---

## 3. Error Handling — B−

### What's Good
- `ErrorBoundary` component wraps entire app
- Reviews: try/catch on `fetchReviews`, `handleLike` (with rollback), `handleSubmit` (with alert)
- Dashboard: try/catch + alert on all fetch functions and all CRUD operations
- Checkout: try/catch wrapping the order insert loop with error alert
- Products/ProductDetail: error states with retry buttons
- Cart: try/catch on localStorage parsing
- Login: auth error display

### PENDING Issues

| Issue | File |
|-------|------|
| `ErrorBoundary` uses `getDerivedStateFromError` but not `componentDidCatch` — errors not logged | `ErrorBoundary.jsx` |

---

## 4. Performance — B−

### What's Good
- All 9 pages lazy-loaded with `React.lazy()` + `Suspense`
- `loading="lazy"` on product images
- Server-side pagination (10 per page) on Dashboard orders, products, clients
- Client-side pagination (12 per page) on Products
- `viewport={{ once: true }}` on scroll animations

### PENDING Issues

| Issue | File |
|-------|------|
| No image optimization — no `srcset`, `width`/`height`, or WebP; hero images at full resolution | `Home.jsx` |
| Reviews fetches ALL approved records with no `.limit()` — won't scale | `Reviews.jsx` |
| Products page fetches ALL products then filters client-side — should use server-side filtering | `Products.jsx` |
| `framer-motion` adds ~150 KB; used on every page for minor transitions | All pages |

---

## 5. Accessibility — C

### What's Good
- `aria-label` on cart buttons and WhatsApp FAB
- `aria-expanded` on mobile menu toggle
- `lang="en"` on root element
- Semantic elements: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- Descriptive alt text on images
- Form inputs have labels
- FAQ accordion has `aria-expanded`, `aria-controls`, `role="region"`

### PENDING Issues

| Issue | File |
|-------|------|
| No skip-to-content link for keyboard navigation | `Layout.jsx` |
| Cart drawer has no focus trap — keyboard users tab behind overlay | `Cart.jsx` |
| Dashboard modals (5) have no focus trap and no Escape-to-close | `Dashboard.jsx` |
| Star rating buttons in review form have no `aria-label` | `Reviews.jsx` |
| Color contrast not verified — emerald-600 on white may fall below 4.5:1 | Various |

---

## 6. UI/UX — B+

### What's Good
- Consistent emerald/green design language
- Loading spinners on all async operations
- Empty states in Cart, Products, Orders
- Multi-step checkout with visual progress indicator
- Responsive layout with mobile hamburger menu
- Dashboard sidebar responsive with mobile slide-in/out + backdrop
- Form validation with inline error messages
- Forgot password flow
- Product image upload alongside URL input
- Order confirmation with payment instructions
- Email confirmation via EmailJS
- ChatWidget rendered and accessible
- Header shows Sign In / Sign Out based on auth state
- Delete operations have confirmation dialogs
- Footer copyright is dynamic (`new Date().getFullYear()`)
- Products pagination display handles empty state correctly

### PENDING Issues

| Issue | File |
|-------|------|
| Settings "Save Changes" button has no `onClick` handler — uses `defaultValue` with no state tracking, button does nothing | `SettingsTab.jsx` |

---

## 7. State Management — B

### What's Good
- Shared `AuthContext` with single Supabase listener, used in ProtectedRoute, Dashboard, Layout, Login
- Cart context well-implemented with provider pattern, persisted to localStorage
- Derived values computed inline, not stored separately

### PENDING Issues

| Issue | File |
|-------|------|
| Dashboard has 28 `useState` hooks — could benefit from `useReducer` or extracted custom hooks | `Dashboard.jsx` |
| Review `liked` array is ephemeral — lost on page navigation, users can re-like after reload | `Reviews.jsx` |

---

## 8. Routing — A

### What's Good
- Lazy-loaded routes with Suspense + loading fallback
- `ProtectedRoute` guards `/dashboard` using `useAuth()`
- 404 catch-all route renders `<NotFound />` component
- `ScrollToTop` runs on every route change
- Login redirects to `/dashboard` if user is already authenticated
- Vercel SPA rewrites configured
- Clean URL structure (`/products/:id`)

### PENDING Issues

None.

---

## 9. Database / API — C+

### What's Good
- Supabase used consistently for all data
- Products ordered by `created_at` desc
- Reviews filtered by `approved: true` on read; `approved: false` on submit
- Related products queried by category
- Image upload to Supabase Storage with public URL retrieval
- Server-side pagination with `.range()` and `{ count: 'exact' }` on Dashboard
- Order number format unified to `ORD-{timestamp}`

### PENDING Issues

| Issue | File | Severity |
|-------|------|:--------:|
| Order amount stored as formatted string (e.g., `"KES 2,500"`) instead of numeric — revenue calc must regex-parse | `Checkout.jsx` | **High** |
| Like count race condition: read → increment → write; concurrent users lose likes; should use `.rpc()` for atomic increment | `Reviews.jsx` | Medium |
| Multi-item orders inserted in a loop — no database transaction; partial orders possible on mid-loop failure | `Checkout.jsx` | Medium |
| No input validation before Dashboard inserts (negative prices, empty strings accepted) | `Dashboard.jsx` | Medium |
| Product stock is never decremented when an order is placed | `Checkout.jsx` | Medium |

---

## 10. Testing — F

- Zero test files in the entire project
- No testing libraries installed (no vitest, jest, cypress, or @testing-library)
- No test scripts in `package.json`

---

## 11. SEO — B

### What's Good
- `react-helmet-async` with `<HelmetProvider>` in main.jsx
- Per-page `<title>` on all 8 pages (Home, Products, ProductDetail dynamic, About, Contact, FAQ, Checkout, Login)
- Meta description in `index.html`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- `sitemap.xml` with 5 routes
- `robots.txt` disallowing `/dashboard`
- Correct page title: "Chicago Agro Supplies"

### PENDING Issues

| Issue |
|-------|
| No Twitter Card meta tags |
| No structured data (JSON-LD) for products or organization |
| SPA with no SSR/SSG — Google may not fully index client-rendered content |

---

## 12. Deployment & DevOps — B−

### What's Good
- Vite for fast builds
- Vercel SPA rewrites configured
- ESLint configured with React rules
- `.gitignore` is comprehensive
- `.env.example` documents all required env vars
- GitHub Actions CI workflow (lint + build) on push/PR to main
- Build passes

### PENDING Issues

| Issue |
|-------|
| No Prettier or formatter configured |
| `package.json` version is `"0.0.0"` — should reflect actual release |
| No pre-commit hooks (husky/lint-staged) |
| CI does not run tests (none exist) |

---

## Priority Roadmap to Reach A Rating

### High Priority

| # | Task | Dimensions Affected |
|---|------|---------------------|
| 1 | **Set up Vitest + @testing-library/react** — write tests for `CartContext`, `utils.js`, `AuthContext`, and key page renders | Testing (F→C), DevOps |
| 2 | **Store order amounts as numbers** in Supabase, format on display only; fix revenue calculation | Database (C+→B) |
| 3 | **Fix ChatWidget data inconsistencies** — align free delivery threshold and bulk discount tiers with FAQ values; fix location references | Code Quality (B→B+) |
| 4 | **Configure Supabase RLS policies** — restrict CRUD to authenticated admin users | Security (B→A−) |
| 5 | **Add focus traps** to Cart drawer and Dashboard modals; add Escape-to-close on modals | Accessibility (C→B) |

### Medium Priority

| # | Task | Dimensions Affected |
|---|------|---------------------|
| 6 | **Add skip-to-content link** in Layout.jsx | Accessibility |
| 7 | **Fix like count race condition** — use Supabase `.rpc()` for atomic increment | Database |
| 8 | **Add input validation** on Dashboard forms before Supabase inserts | Database, Security |
| 9 | **Make Settings Save button functional** — track form state and persist to constants/DB | UI/UX |
| 10 | **Add `aria-label` to star rating buttons** in Reviews | Accessibility |
| 11 | **Fix `addToCart` loop** in ProductDetail — pass quantity directly instead of looping | Code Quality, Performance |
| 12 | **Add `.limit()` to Reviews query** to prevent unbounded fetch | Performance |

### Low Priority

| # | Task | Dimensions Affected |
|---|------|---------------------|
| 13 | Add Twitter Card meta tags and JSON-LD structured data | SEO |
| 14 | Add server-side filtering on Products (currently fetches all, filters client-side) | Performance |
| 15 | Configure Prettier + husky pre-commit hooks | DevOps |
| 16 | Decrement product stock on order placement | Database |
| 17 | Add `componentDidCatch` to ErrorBoundary for error logging | Error Handling |
| 18 | Use `useReducer` or custom hooks to reduce Dashboard state count (28 hooks) | State Management |
| 19 | Add `width`/`height` attributes and `srcset` to images | Performance |
| 20 | Bump `package.json` version to `"1.0.0"` | DevOps |

---

## Changes Since Last Review (March 11 → March 12)

| Fix | Status |
|-----|--------|
| Reviews moderation (`approved: false` on submit, pending message, admin approval tab) | ✅ Fixed |
| WhatsApp URLs use `encodeURIComponent()` | ✅ Fixed |
| Delete confirmation dialogs on all Dashboard operations | ✅ Fixed |
| `constants.js` imported and used across 8+ files | ✅ Fixed |
| `formatCurrency()` uses `CURRENCY.symbol` | ✅ Fixed |
| ChatWidget rendered in Layout | ✅ Fixed |
| `App.css` deleted | ✅ Fixed |
| Dashboard split into 6 sub-components (1,050→911 lines) | ✅ Fixed |
| Unused imports removed | ✅ Fixed |
| Duplicate favicon removed | ✅ Fixed |
| Error handling on Reviews (fetch, like, submit) | ✅ Fixed |
| Error handling on all Dashboard fetches and CRUD | ✅ Fixed |
| Checkout order loop wrapped in try/catch | ✅ Fixed |
| FAQ ARIA roles (`aria-expanded`, `aria-controls`, `role="region"`) | ✅ Fixed |
| Header shows Sign In / Sign Out based on auth | ✅ Fixed |
| Footer copyright dynamic | ✅ Fixed |
| Products pagination display fixed | ✅ Fixed |
| Dashboard sidebar responsive (mobile slide-in) | ✅ Fixed |
| Shared `AuthContext` (single listener, used across app) | ✅ Fixed |
| 404 catch-all route | ✅ Fixed |
| Login redirects authenticated users to `/dashboard` | ✅ Fixed |
| Scroll-to-top on route change | ✅ Fixed |
| Order number format unified to `ORD-{timestamp}` | ✅ Fixed |
| Server-side pagination on Dashboard (orders, products, clients) | ✅ Fixed |
| `react-helmet-async` with per-page titles on all 8 pages | ✅ Fixed |
| Open Graph tags in `index.html` | ✅ Fixed |
| `sitemap.xml` and `robots.txt` created | ✅ Fixed |
| `.env.example` created | ✅ Fixed |
| GitHub Actions CI workflow (lint + build) | ✅ Fixed |
| `index.html` title corrected to "Chicago Agro Supplies" | ✅ Fixed |

**Issues resolved: 41/63 (65%) — Grade improved from C to B−**

---

*Report generated by GitHub Copilot — March 12, 2026*
