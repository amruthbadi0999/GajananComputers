# Gajanan Computers (LapLink)

Bridge between users and laptop technicians — repair requests, buy/sell listings, and admin management. Passwordless OTP login via email. Mobile-first UI with premium micro-interactions, fly-to-cart animations, and global ripple effects.

## Overview
LapLink is a real-time MERN stack web application where users can:
- **Raise Service Requests**: Book repairs for hardware/software issues.
- **Sell Laptops**: List used laptops for sale with condition details.
- **Buy Requirements**: Post requirements to find a suitable used laptop.
- **Admin Dashboard**: Technicians can manage all requests, update status, and track workflow.

Inspired by **Zumy**'s request-based model but adapted for laptop services.

## Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion, React Toastify
- Backend: Node.js, Express, JWT, Nodemailer
- Database: MongoDB (Mongoose)

## Repository Structure
```
root/
├── laplink-backend/          # Server-side Code
│   ├── src/
│   │   ├── config/           # DB & Env setup
│   │   ├── controllers/      # Auth, Laptop, Service
│   │   ├── models/           # User.js, LaptopRequest.js, ServiceRequest.js
│   │   ├── routes/           # Api Routes
│   │   ├── services/         # Email Service
│   │   └── server.js         # Entry point
│   └── package.json
│
├── laplink-frontend/         # Client-side Code
│   ├── src/
│   │   ├── components/       # UI Components (MouseFollower, Navbar)
│   │   ├── context/          # Auth Context
│   │   ├── hooks/            # useAuth
│   │   ├── pages/            # Home, Login, Dashboard, AdminPanel, Forms
│   │   └── main.jsx          # Entry point
│   └── package.json
│
└── Readme.md                 # This file
```

## Environment Variables

Create `.env` files for both backend and frontend.

Backend (`laplink-backend/.env`):
```
NODE_ENV=production
PORT=3000
MONGO_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<strong_random_secret>
SMTP_HOST=<smtp_host>
SMTP_PORT=587
SMTP_USER=<smtp_username>
SMTP_PASS=<smtp_password>
SMTP_FROM=<from_email@example.com>
APP_BASE_URL=https://<your-frontend-domain>
ADMIN_EMAIL=<admin_email@example.com>
```

Frontend (`laplink-frontend/.env`):
```
VITE_API_BASE_URL=https://<your-backend-domain>/api
```

Also provided examples:
- Backend: `laplink-backend/.env.example`
- Frontend: `laplink-frontend/.env.example`

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or cloud)

### Backend Setup
1. `cd laplink-backend`
2. `npm install`
3. Configure `.env`:
   ```env
  PORT=3000
  MONGO_URI=mongodb://127.0.0.1:27017/laplink
  JWT_SECRET=supersecretlap
  # SMTP (use your provider credentials)
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your_email@example.com
  SMTP_PASS=your_app_password
  SMTP_FROM=LapLink <your_email@example.com>
   ```
4. `npm run dev` (Runs on port 3000)

### Frontend Setup
1. `cd laplink-frontend`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

Create a `laplink-frontend/.env` for API base if you prefer:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Verification
- Open http://localhost:5173
- Register a new user (OTP will be sent to email/console).
- Verify email and login.
- Create a Service Request via "Repair My Laptop".
- Check Dashboard to see the request.
- (Optional) Access `/admin` to manage requests (requires `role: 'admin'` in DB).

## Features Implemented
- **Advanced Auth**: Register, Login, Verify Email (OTP), Forgot/Reset Password.
- **Change Password**: Authenticated users can change password via `/api/auth/change-password`.
- **Premium UI**: Custom mouse follower, glassmorphism design.
- **Complete Workflow**: Users can created Buy/Sell/Repair requests and track them.
- **Admin Panel**: centralized control for technicians.

## Deployment

Choose any combination that’s easiest for you:

### Option A: Backend on Render, Frontend on Vercel
- Backend (Render)
   - Create a new Web Service from `laplink-backend`.
   - Runtime: Node
   - Start command: `node src/server.js`
   - Environment variables: set all from Backend `.env` section.
   - CORS: ensure your frontend domain is allowed.
- Frontend (Vercel)
   - Import `laplink-frontend`.
   - Env: `VITE_API_BASE_URL=https://<render-service-domain>/api`
   - Build: `npm run build`; Output: `dist`.

### Option B: Backend on Railway, Frontend on Netlify
- Backend (Railway)
   - Create a Node.js service from `laplink-backend`.
   - Start: `node src/server.js`.
   - Env: same as Backend `.env` section.
- Frontend (Netlify)
   - Site from `laplink-frontend`.
   - Build: `npm run build`; Publish: `dist`.
   - Env: `VITE_API_BASE_URL=https://<railway-service-domain>/api`.

### Email (SMTP)
- Verify SMTP credentials (`SMTP_USER`, `SMTP_PASS`) and `SMTP_FROM` is authorized.
- Test OTP flow and admin notifications after deploy.

### CORS
- Backend restricts origins; add your deployed frontend domain.

### Admin Promotion
Promote a user via mongosh:
```js
// In mongosh
use <your_db>
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
```
Re-login to refresh JWT with new role.
# GajananComputers
