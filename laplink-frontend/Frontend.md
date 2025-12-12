# Frontend Documentation – Gajanan Computers

## 1. Overview

The frontend is a Vite-powered React SPA styled with Tailwind CSS. It implements Home, OTP Login/Verify Email, Dashboard, Admin Panel, Service (Repair) form, Buy/Sell marketplace, and Accessories with cart. It includes mobile-first micro-interactions and global ripple effects.

## 2. Tech stack & key libraries

- React 18 + Vite
- Routing: `react-router-dom`
- Forms & validation: `react-hook-form`
- Network: `axios` (preconfigured instance with `withCredentials`)
- UI/animation: Tailwind CSS, `react-icons`, `framer-motion`
- Notifications: custom wrapper over `react-toastify`

## 3. Directory structure

```text
laplink-frontend/
├─ package.json
└─ src/
   ├─ assets/                  # logos, illustrations
   ├─ components/
   │  ├─ dashboard/            # Stats cards, personal info, social links
   │  └─ layout/               # Navbar, Footer, ProtectedRoute
   ├─ hooks/                   # useAuth, request hooks
   ├─ lib/                     # api.js (axios), toast.jsx, helpers
   ├─ pages/
   │  ├─ Home.jsx
   │  ├─ OtpLogin.jsx
   │  ├─ VerifyEmail.jsx
   │  ├─ ForgotPassword.jsx
   │  ├─ ResetPassword.jsx
   │  └─ Dashboard.jsx
   ├─ routes/                  # route definitions
   ├─ App.jsx / main.jsx       # SPA entry
   └─ styles/ (Tailwind config via Vite plugin)
```

## 4. Styling system & theming

- Tailwind CSS configured via `@tailwindcss/vite` plugin; global styles defined in `src/index.css`.
- Theme references an indigo/purple neon palette with gradient accents and glassmorphism.
- Components use utility classes with glassmorphism cards, soft shadows, and subtle blur.
- Toast notifications use a custom `MotionToast` component (`src/lib/toast.jsx`) combining react-toastify + framer-motion transitions.

## 5. Routing and navigation

- Public routes: `/` (Home), `/login`, `/verify-email`, `/forgot-password`, `/reset-password`, `/accessories`.
- Authenticated: `/dashboard`, `/service/request`, `/laptops/sell`, `/laptops/buy`, `/admin`.

## 6. Pages & features

### Home

- Hero with mission statement, stats, CTA buttons directing to register with role query params.
- Highlights of donor-recipient flow.

### Auth (OTP)

- **OtpLogin**: email-only OTP flow; send and verify endpoints; clears OTP field on transition.
- **VerifyEmail**: OTP submission/resend logic; toasts for feedback.
- **ForgotPassword / ResetPassword**: OTP-based reset flow.

### Dashboard

- Lists my Service and Marketplace requests with status chips.
- Quick actions to create repair or sell requests.
### Admin Panel
- Lists Service and Marketplace requests; supports status updates.

## 7. State management & hooks

- `useAuth` (if present): handles user info, token refresh, logout.
- `useRequests`: fetches and formats request lists for dashboard components (grouping, computed fields).
- Global Cart context for Accessories; add/remove/clear/total APIs.
- Local component state is managed with `useState`/`useEffect`; forms depend on `useForm`.

## 8. API integration

- `src/lib/api.js` configures axios base URL from `VITE_API_BASE_URL`.
- Components call axios directly or via helpers; toasts display feedback.

## 9. Testing checklist (frontend)

1. Run `npm run dev` and ensure Vite serves app on `http://localhost:5173`.
2. Test OTP login, verify email, and dashboard listing.
3. Create Service and Marketplace requests; verify toasts.
4. Accessories: add items to cart; see fly-to-cart animation and cart badge.
5. Resize viewport / test on mobile emulator to confirm responsive layout (Tailwind breakpoints).
6. Confirm toasts and modal states behave correctly for both success and error scenarios.

## 10. Build & deploy

- Production build: `npm run build` (generates `/dist`).
- Preview: `npm run preview`.
- Deploy via static hosting (Vercel, Netlify) with `VITE_API_BASE_URL` set to your backend `/api`. Ensure backend CORS allows deployed domain.

Keep this document aligned with UI changes. When new pages/components are added, update the relevant sections above.
