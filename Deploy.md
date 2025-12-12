# Deployment Guide (Step-by-Step)

This guide walks you through deploying the LapLink (Gajanan Computers) app — backend API and frontend SPA — with working OTP emails and admin notifications.

## Prerequisites
- MongoDB Atlas account and a database
- SMTP account (e.g., Gmail with App Password, Brevo, Mailgun, etc.)
- GitHub repo connected to both services

## Environments to Prepare
- Backend (`laplink-backend/.env`): See `laplink-backend/.env.example`
- Frontend (`laplink-frontend/.env`): See `laplink-frontend/.env.example`

Key backend vars:
- `MONGO_URI`, `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `APP_BASE_URL` (the final frontend URL)
- `ADMIN_EMAIL`

Key frontend vars:
- `VITE_API_BASE_URL` (points to backend `/api`)

---

## Option A: Render (Backend) + Vercel (Frontend)

### 1) Deploy Backend on Render
1. Login to Render and click "New +" → Web Service.
2. Connect your GitHub repo and select `laplink-backend` folder.
3. Set build settings:
   - Runtime: Node
   - Start command: `node src/server.js`
4. Set Environment Variables (from `laplink-backend/.env.example`):
   - `NODE_ENV=production`
   - `PORT=3000`
   - `MONGO_URI=<your Atlas URI>`
   - `JWT_SECRET=<strong secret>`
   - `SMTP_HOST=<smtp host>`
   - `SMTP_PORT=587`
   - `SMTP_USER=<smtp user>`
   - `SMTP_PASS=<smtp pass>`
   - `SMTP_FROM=<from@example.com>`
   - Temporarily set `APP_BASE_URL=http://localhost:5173` (update later after frontend deploy)
   - `ADMIN_EMAIL=<admin@example.com>`
5. Deploy and wait until "Live". Note the backend URL, e.g., `https://your-backend.onrender.com`.

### 2) Deploy Frontend on Vercel
1. Login to Vercel → New Project → Import your repo and select `laplink-frontend`.
2. Framework preset: Vite
3. Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
4. Build command: `npm run build`
5. Output folder: `dist`
6. Deploy and wait until "Production" gives a URL, e.g., `https://your-frontend.vercel.app`.

### 3) Finalize Backend `APP_BASE_URL`
- Go to Render backend service → Environment → update `APP_BASE_URL=https://your-frontend.vercel.app`
- Re-deploy backend.

### 4) Verify
- OTP login: Use your email → receive OTP from `SMTP_FROM`.
- Create a repair request: Check `ADMIN_EMAIL` inbox for notification.
- Access `/admin`: Promote your user to admin in DB, then re-login.

---

## Option B: Railway (Backend) + Netlify (Frontend)

### 1) Deploy Backend on Railway
1. Login to Railway → New Project → Deploy from GitHub → select `laplink-backend`.
2. Service settings:
   - Start command: `node src/server.js`
3. Add Environment Variables (same list as above under Render).
4. Deploy and note backend URL, e.g., `https://your-backend.up.railway.app`.

### 2) Deploy Frontend on Netlify
1. Login to Netlify → Add New Site → Import from Git.
2. Select `laplink-frontend` folder.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.up.railway.app/api`
5. Deploy and note the final URL, e.g., `https://your-frontend.netlify.app`.

### 3) Finalize Backend `APP_BASE_URL`
- Update Railway Environment variable `APP_BASE_URL=https://your-frontend.netlify.app` and redeploy.

### 4) Verify
- OTP login works and emails arrive from `SMTP_FROM`.
- Admin notification email on new repair request reaches `ADMIN_EMAIL`.

---

## MongoDB Atlas Setup (Once)
1. Create a free Cluster.
2. Create a Database and User.
3. Copy the connection string and replace user/pass/db in `MONGO_URI`.
4. Allow access from your hosting IPs or set "Allow from Anywhere" (for testing only).

---

## Admin Role Promotion (mongosh)
Run the following in your Atlas DB:
```js
use <your_db>
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
```
Then log out and log back in to refresh the JWT claims.

---

## SMTP Notes
- Gmail: use App Passwords (requires 2FA). `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`.
- Brevo: `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORT=587`.
- Ensure `SMTP_FROM` is authorized to send.

---

## CORS
- Backend allows local origins; for production, add your frontend domain.
- If you add `ALLOWED_ORIGINS` support, set it to your frontend URL.

---

## Troubleshooting Checklist
- 401/403: Ensure `Authorization: Bearer <accessToken>` is present; re-login to refresh.
- Emails not sending: Verify SMTP credentials; check provider logs; confirm `SMTP_FROM` is verified.
- Admin panel access: Ensure the user role is `admin` and the token was refreshed.
- Mixed content: Use HTTPS for both frontend and backend.

---

## Quick Rollback / Redeploy
- Edit envs, save, and trigger redeploy from the platform dashboard.
- Keep `.env` values in platform secrets; do not commit real secrets.

---

## Final Notes
- Refer to `Readme.md` and `.env.example` files for detailed configuration.
- Keep `APP_BASE_URL` accurate so links in emails point to the correct frontend.
