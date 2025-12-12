import express from "express";
import {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginOTP,
  verifyLoginOTP,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/send-otp", sendLoginOTP);
router.post("/verify-otp-login", verifyLoginOTP);
router.post("/resend-otp", sendLoginOTP);

// We can add profile routes later if needed
// router.get("/profile", protect, getProfile);

export default router;