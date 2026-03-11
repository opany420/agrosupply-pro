# 📋 AgroSupply — Project Review Report

**Date:** March 11, 2026  
**Project:** AgroSupply (E-Commerce Platform for Agricultural Supplies)  
**Stack:** React 18 + Vite + Tailwind CSS + Supabase  
**Reviewer:** GitHub Copilot (Automated Code Review)

---

## 1. Executive Summary

AgroSupply is a React-based e-commerce web application for agricultural products, targeting the Kenyan market. It uses Supabase for backend services (auth + database), Tailwind CSS for styling, Framer Motion for animations, and deploys on Vercel.

The project has a solid UI foundation with responsive design and modern React patterns, but it suffers from **critical security issues**, **inconsistent data sourcing** (mix of hardcoded and database-driven content), **incomplete features**, and **missing error handling**. The platform currently relies on WhatsApp for order processing with no actual payment gateway integration.

### Overall Grade: **C+**

| Area              | Rating     |
| ----------------- | ---------- |
| UI/UX Design      | ⭐⭐⭐⭐     |
| Code Quality      | ⭐⭐⭐       |
| Security          | ⭐          |
| Performance       | ⭐⭐        |
| Error Handling    | ⭐          |
| Scalability       | ⭐⭐        |
| Feature Completeness | ⭐⭐⭐   |
| Accessibility     | ⭐⭐        |

---

## 2. Tech Stack & Dependencies

| Category        | Technology                        | Version   |
| --------------- | --------------------------------- | --------- |
| Framework       | React                             | 18.3.1    |
| Build Tool      | Vite                              | 5.4.10    |
| Routing         | React Router DOM                  | 7.13.1    |
| Styling         | Tailwind CSS                      | 3.4.19    |
| Animations      | Framer Motion                     | 12.35.0   |
| Backend         | Supabase (Auth + DB)              | 2.99.0    |
| Icons           | Lucide React                      | 0.577.0   |
| Data Fetching   | TanStack React Query *(unused)*   | 5.90.21   |
| UI Utilities    | clsx, tailwind-merge, class-variance-authority | — |
| Deployment      | Vercel                            | —         |

### Dependency Issues

- **@tanstack/react-query** — Installed but **never imported or used anywhere** in the codebase. Adds ~88KB to the bundle for no reason. Should be removed or properly integrated.
- **@radix-ui/react-slot**, **class-variance-authority**, **tailwind-merge** — UI utility libraries installed, likely for a component library (shadcn/ui pattern), but usage is minimal.

---

## 3. Project Architecture

```
src/
├── main.jsx              → App entry point (React root)
├── App.jsx               → Router + ProtectedRoute + Providers
├── Layout.jsx            → Header, Footer, Navigation, WhatsApp FAB
├── CartContext.jsx        → Shopping cart state (Context API)
├── supabase.js           → Supabase client initialization
├── components/
│   ├── Cart.jsx           → Cart drawer UI
│   ├── ChatWidget.jsx     → In-app keyword chatbot
│   └── Reviews.jsx        → Customer testimonials
└── pages/
    ├── Home.jsx           → Landing page (hero, features, categories)
    ├── Products.jsx       → Product listing with search/filter
    ├── ProductDetail.jsx  → Individual product page (hardcoded data!)
    ├── Checkout.jsx       → Multi-step checkout (WhatsApp-based)
    ├── Login.jsx          → Admin auth (email/password)
    ├── Dashboard.jsx      → Admin panel (orders, products, clients)
    ├── About.jsx          → Company info / team
    ├── Contact.jsx        → Contact form (WhatsApp only)
    └── FAQ.jsx            → Searchable FAQ section
```

### Architecture Diagram

```
QueryClientProvider (unused)
  └── CartProvider (Context API)
        └── BrowserRouter
              ├── Layout (Header + Footer wrapper)
              │     ├── / .................. Home
              │     ├── /products .......... Products
              │     ├── /products/:id ...... ProductDetail
              │     ├── /checkout .......... Checkout
              │     ├── /about ............. About
              │     ├── /contact ........... Contact
              │     ├── /faq ............... FAQ
              │     └── /login ............. Login
              └── ProtectedRoute
                    └── /dashboard ......... Dashboard (Admin)
```

---

## 4. 🔴 Critical Security Issues

### 4.1 Supabase Credentials Exposed in Source Code

**File:** `src/supabase.js`  
**Severity:** 🔴 CRITICAL

```javascript
const supabaseUrl = 'https://xdhtdqiqoqcimlomrleu.supabase.co'
const supabaseKey = 'sb_publishable_zvmErwzMooP3H9mwazb57w_yuRbroAH'
```

The Supabase URL and API key are **hardcoded directly in the source code**. This means:
- Anyone can view these credentials via browser dev tools or source code
- Attackers can connect to your Supabase instance directly
- All public data is accessible without going through your app
- If Row Level Security (RLS) is not properly configured, data could be manipulated

**Required Fix:**
1. Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Use `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`
3. Add `.env.local` to `.gitignore`
4. **Rotate the exposed key immediately** in the Supabase console
5. Ensure Row Level Security (RLS) is enabled on all tables

### 4.2 No Input Validation

**Affected:** Checkout forms, Contact form, Login form, Dashboard forms  
**Severity:** 🟠 HIGH

- No email format validation
- No phone number validation
- No address sanitization
- No form validation library in use

**Recommendation:** Add Zod or Yup for schema-based validation.

### 4.3 No Rate Limiting on Auth

**File:** `src/pages/Login.jsx`  
**Severity:** 🟠 HIGH

- Login attempts are unlimited — vulnerable to brute force attacks
- No CAPTCHA or lockout mechanism
- No "Forgot Password" flow

### 4.4 Hardcoded Sensitive Data Throughout Codebase

Phone numbers, payment details (Equity Paybill: 247247, A/C: 1310267633827), and business info are hardcoded across multiple files. These should be centralized in environment variables or a config file.

---

## 5. ⚠️ Functional Issues

### 5.1 Inconsistent Data Sourcing

| Data             | Source                | Issue                                      |
| ---------------- | --------------------- | ------------------------------------------ |
| Product listing  | Supabase DB           | ✅ Correct approach                         |
| Product details  | **Hardcoded in code** | ❌ 12 products hardcoded in ProductDetail.jsx |
| Orders           | Supabase DB           | ✅ Correct approach                         |
| Reviews          | **Hardcoded**         | ❌ Not from database, submit form is non-functional |
| FAQ              | **Hardcoded**         | ⚠️ Acceptable for static content            |
| Team members     | **Hardcoded**         | ⚠️ Acceptable for static content            |

### 5.2 No Payment Processing

The checkout flow sends orders via **WhatsApp message** and records them as "Pending" in Supabase. There is no actual payment gateway (M-Pesa, Stripe, or otherwise). Payment details (Equity Paybill) are displayed for manual bank transfers only.

### 5.3 Cart Not Persisted

`CartContext.jsx` stores cart state in memory only. A page refresh completely clears the cart. Should persist to `localStorage` at minimum.

### 5.4 Order Number Generation is Fragile

```javascript
const order_number = `ORD-${String(orders.length + 1).padStart(3, "0")}`
```

This generates order numbers based on array length. If orders are deleted, **duplicate order numbers** will be created. Should use auto-incrementing IDs from the database instead.

### 5.5 Reviews Component is Non-Functional

- Review submission form exists but doesn't save to any backend
- "Moderate" button has no real functionality
- All displayed reviews are hardcoded

### 5.6 ChatWidget Uses Static Responses

The chat widget uses basic keyword matching with hardcoded responses. Contains an outdated phone number (`+254 712 345 678`) that differs from the actual business number (`+254 757 790 379`).

### 5.7 Analytics Tab Empty

The Dashboard has an Analytics tab but it shows no data or charts.

---

## 6. Performance Issues

| Issue                          | Impact        | Recommendation                                   |
| ------------------------------ | ------------- | ------------------------------------------------ |
| React Query installed but unused | +88KB bundle  | Remove package or integrate it for data fetching |
| No code splitting              | Large initial JS bundle | Use `React.lazy()` for route-level splitting |
| All products loaded at once    | Slow for large catalogs | Add pagination or infinite scroll |
| External images (Unsplash)     | Blocked by network | Use local/optimized images or proper CDN |
| Scroll event listener (Layout) | Fires every frame | Throttle or use `IntersectionObserver` |
| No image lazy loading          | Slow initial paint | Add `loading="lazy"` to images |
| No caching strategy            | Repeated API calls | Implement React Query or SWR caching |
| Hardcoded products in ProductDetail | Memory waste | Fetch from Supabase |
| Leftover CSS in App.css        | Unused styles | Remove Vite default demo styles |

---

## 7. Code Quality

### Strengths ✅

- Modern React patterns (hooks, functional components, context)
- Consistent component structure across pages
- Good use of Tailwind CSS utility classes
- Responsive design works well on mobile
- Framer Motion animations add polish
- Proper route protection for admin dashboard
- Clean file organization

### Weaknesses ❌

- **Dashboard.jsx is 1000+ lines** — needs to be split into sub-components (DashboardOrders, DashboardProducts, DashboardClients, DashboardAnalytics)
- **15+ useState hooks in Dashboard** — should use `useReducer` for complex state
- **No error boundaries** — a single component crash takes down the entire app
- **No loading states** for many async operations (Supabase fetches)
- **Inconsistent currency format** — some files use "KES", others use "KSh"
- **Magic strings repeated** — phone numbers, URLs, paybill codes duplicated across files
- **No constants/config file** — all values hardcoded inline
- **No PropTypes or TypeScript** — no type safety whatsoever
- **App.css contains unused Vite demo styles** (`.read-the-docs`, `.card`, logo animations)
- **No utility functions file** — `formatDate` defined locally in Dashboard instead of shared

---

## 8. Accessibility Issues

| Issue                                            | Severity |
| ------------------------------------------------ | -------- |
| WhatsApp FAB button missing `aria-label`         | Medium   |
| Mobile menu button missing `aria-expanded`       | Medium   |
| Some images missing meaningful `alt` text        | Medium   |
| Icon-only buttons without text labels            | Medium   |
| Color contrast (white on emerald-600) borderline | Low      |
| No keyboard navigation for mobile menu           | Medium   |
| Form labels not always explicitly associated     | Low      |
| No skip-to-content link                          | Low      |

---

## 9. Missing Features

| Feature                     | Priority | Notes                                           |
| --------------------------- | -------- | ----------------------------------------------- |
| Payment gateway (M-Pesa)    | 🔴 HIGH  | Currently WhatsApp-only, no real payments        |
| Cart persistence            | 🔴 HIGH  | Cart lost on refresh                             |
| Product image upload        | 🟠 HIGH  | Dashboard requires manual URL entry              |
| Email notifications         | 🟠 HIGH  | Only WhatsApp integration exists                 |
| Error boundaries            | 🟠 HIGH  | App crashes entirely on component errors         |
| Form validation             | 🟠 HIGH  | No validation on any forms                       |
| Order tracking for users    | 🟡 MED   | Customers can't track their orders               |
| Inventory/stock management  | 🟡 MED   | Stock levels are hardcoded, not synced           |
| Functional reviews system   | 🟡 MED   | Component exists but doesn't persist data        |
| Password reset flow         | 🟡 MED   | No forgot-password functionality                 |
| Dashboard analytics         | 🟡 MED   | Tab exists but is empty                          |
| Pagination on products      | 🟡 MED   | All products load at once                        |
| Search analytics            | 🟢 LOW   | No tracking of user search behavior              |
| Multi-language (i18n)       | 🟢 LOW   | All content in English only                      |
| Dark mode                   | 🟢 LOW   | Nice-to-have                                     |
| Wishlist                    | 🟢 LOW   | Nice-to-have                                     |

---

## 10. Recommendations & Roadmap

### Phase 1 — Security & Stability (Urgent)

1. **Move Supabase credentials to `.env.local`** and rotate exposed keys
2. **Add form validation** (Zod or Yup) across all forms
3. **Add React Error Boundaries** to prevent full-app crashes
4. **Remove unused dependencies** (`@tanstack/react-query` or integrate it)
5. **Clean up `App.css`** — remove leftover Vite demo styles
6. **Create a `constants.js`** file for phone numbers, paybill codes, URLs
7. **Persist cart to `localStorage`**

### Phase 2 — Core Feature Completion

1. **Integrate M-Pesa / payment gateway** for actual payment processing
2. **Move product detail data to Supabase** (remove hardcoded products)
3. **Implement proper error handling** with user-friendly error messages
4. **Add loading states** to all data-fetching operations
5. **Fix order number generation** — use DB auto-increment
6. **Connect Reviews component to Supabase** for real user reviews
7. **Implement forgot-password flow** via Supabase auth

### Phase 3 — Optimization & Scalability

1. **Split `Dashboard.jsx`** into sub-components (Orders, Products, Clients, Analytics)
2. **Add code splitting** with `React.lazy()` for route-level loading
3. **Implement pagination** on Products page
4. **Add image optimization** — local assets or CDN with lazy loading
5. **Implement React Query** for caching and smart refetching
6. **Add order tracking** for customers
7. **Build out Dashboard Analytics** tab with charts

### Phase 4 — Polish & Enhancement

1. Improve accessibility (aria labels, keyboard nav, contrast)
2. Add email notifications (order confirmation, shipping)
3. Implement product image upload in Dashboard
4. Add search analytics and user behavior tracking
5. Consider i18n for multi-language support

---

## 11. File-by-File Summary

| File                            | Status | Key Issue                                     |
| ------------------------------- | ------ | --------------------------------------------- |
| `package.json`                  | ⚠️     | Unused React Query dependency                 |
| `vite.config.js`               | ⚠️     | Minimal config, no optimization               |
| `tailwind.config.js`           | ✅     | Functional, could use custom theme            |
| `eslint.config.js`             | ✅     | Properly configured                           |
| `vercel.json`                  | ✅     | Correct SPA routing                           |
| `src/supabase.js`              | 🔴     | **Hardcoded API keys — CRITICAL**             |
| `src/App.jsx`                  | ⚠️     | No error boundaries, unused QueryClient       |
| `src/Layout.jsx`               | ⚠️     | Large file, external image, missing aria      |
| `src/CartContext.jsx`           | ⚠️     | No persistence, no max quantity               |
| `src/App.css`                  | ⚠️     | Contains unused Vite demo styles              |
| `src/pages/Home.jsx`           | ⚠️     | External images, hardcoded contact            |
| `src/pages/Products.jsx`       | ⚠️     | No error handling, no pagination              |
| `src/pages/ProductDetail.jsx`  | 🔴     | **12 products hardcoded instead of from DB**  |
| `src/pages/Checkout.jsx`       | ⚠️     | WhatsApp-only, no validation, no real payment |
| `src/pages/Login.jsx`          | ⚠️     | No rate limiting, no forgot password          |
| `src/pages/Dashboard.jsx`      | ⚠️     | 1000+ lines, fragile order numbers            |
| `src/pages/About.jsx`          | ✅     | Static content, acceptable                    |
| `src/pages/Contact.jsx`        | ⚠️     | WhatsApp-only, no validation                  |
| `src/pages/FAQ.jsx`            | ✅     | Well-implemented                              |
| `src/components/Cart.jsx`      | ⚠️     | Inconsistent currency format                  |
| `src/components/ChatWidget.jsx`| ⚠️     | Static responses, wrong phone number          |
| `src/components/Reviews.jsx`   | ⚠️     | Non-functional submit, all hardcoded          |

---

## 12. Conclusion

AgroSupply has a **strong visual foundation** with a modern React stack and polished UI. However, it needs significant work on **security** (exposed credentials), **reliability** (error handling, validation), and **feature completeness** (payment processing, data persistence) before it can be considered production-ready.

The most urgent action is **securing the Supabase credentials** and implementing proper environment variable management. Following that, adding form validation, error boundaries, and a real payment flow would bring the application to a viable production state.

---

*Report generated by GitHub Copilot — March 11, 2026*
