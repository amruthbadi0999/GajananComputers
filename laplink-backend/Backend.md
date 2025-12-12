# Backend Documentation – Gajanan Computers

## 1. Overview

The backend is an Express + MongoDB (Mongoose) API powering laptop repair and marketplace flows. It exposes authentication, service requests, buy/sell requests, admin management, handles OTP email delivery, and issues access JWT tokens.

## 2. Tech stack & dependencies

- Runtime: Node.js 18+
- Framework: Express 4
- Database: MongoDB via Mongoose 8
- Auth: jsonwebtoken (access + refresh tokens)
- Validation & Security: express-validator, helmet, cors, cookie-parser
- Utilities: bcryptjs, morgan, nodemailer, dotenv

## 3. Project structure

```text
jeevansetu-backend/
├─ package.json
└─ src/
   ├─ config/            # db.js (Mongoose connection), env loaders
  ├─ controllers/       # authController.js, serviceController.js, laptopController.js
   ├─ middleware/        # auth/protect middleware, error handlers
  ├─ models/            # User.js, ServiceRequest.js, LaptopRequest.js
  ├─ routes/            # authRoutes.js, serviceRoutes.js, laptopRoutes.js, adminRoutes.js
   ├─ utils/             # sendEmail.js, token helpers, logger utilities
   └─ server.js          # Express bootstrap and CORS configuration
```

## 4. Environment variables

Create `jeevansetu-backend/.env` using the template below. All secrets are required for production; for local testing, dummy values work if email sending is mocked.

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/laplink
JWT_SECRET=your_access_secret
# SMTP (Email for OTP/notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@example.com
APP_BASE_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
```

## 5. Scripts & local run

```bash
cd jeevansetu-backend
npm install
npm run dev    # nodemon server.js
```

Ensure MongoDB is running locally or update `MONGO_URI` to point to Atlas.

## 6. Authentication flow

1. **Register (`POST /api/auth/register`)** – hashes password, stores user, returns access token; refresh token set via HttpOnly cookie.
2. **Login (`POST /api/auth/login`)** – verifies credentials, issues new tokens.
3. **Protected routes** – `protect` middleware reads `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, and attaches `req.user`.
4. **Refresh token** – `POST /api/auth/refresh-token` reads the HttpOnly cookie, validates via `JWT_REFRESH_SECRET`, and rotates tokens.
5. **Logout** – `POST /api/auth/logout` clears refresh cookie.

Tokens use short-lived access (e.g., 15m) and longer refresh (e.g., 7d) windows. Revocation is handled by deleting/rotating refresh cookies.

## 7. API surface

Base URL: `http://localhost:3000/api`

| Area   | Endpoints                                              | Notes                                     |
|--------|--------------------------------------------------------|-------------------------------------------|
| Auth   | `POST /auth/send-otp`, `POST /auth/verify-otp-login`  | Email-only OTP login flow                 |
| Service| `POST /service`, `GET /service/me`                     | Create repair, list my repair requests    |
| Market | `POST /laptops`, `GET /laptops/me`                     | Create buy/sell, list my marketplace reqs |
| Admin  | `GET /admin/service`, `GET /admin/laptops`, `PATCH`    | Admin listing and status updates          |

## 8. Data models (summary)

- **User**: core identity (name, email, role), contact info, address, social handles.
- **ServiceRequest**: brand, model, problems/customProblem, preferredServiceType, preferredTimeSlot, name, phone, address, city, status.
- **LaptopRequest**: type (SELL | BUY_REQUIREMENT), brand/model, expectedPrice or budgetRange, purpose, name, phone, status.

## 9. Services & utilities

- `services/email.service.js`: nodemailer transporter for OTP and admin notifications; uses SMTP envs.
- `utils/generateTokens.js`: creates access tokens.
- `middleware/authMiddleware.js`: verifies JWT, enforces admin where required.

## 10. Testing guidelines

- Use the sample accounts defined in the root README to seed donors and recipients before integration testing.
- For API-level verification, import a Postman collection with the endpoints above and set environment variables (`BASE_URL`, `ACCESS_TOKEN`).
- Exercise critical flows:
  1. Register donor + recipient.
  2. Create request (`POST /requests`).
  3. Match request as donor (`POST /requests/:id/match`).
  4. Fulfill request (`PATCH /requests/:id/status` with `status=fulfilled`) and confirm a Donation record is created.
  5. Fetch `/donations/me` to ensure new donation appears.
- Test error handling by submitting invalid blood groups or missing required fields; server should return `400` with validation errors.

## 11. Deployment considerations

- Set `NODE_ENV=production`; serve over HTTPS.
- Configure CORS to allow the frontend origin.
- Use MongoDB Atlas and restrict IPs.
- Store secrets (JWT, SMTP) in provider’s secret manager.

This backend document stays in sync with the main README; update both if endpoints or flows change.
