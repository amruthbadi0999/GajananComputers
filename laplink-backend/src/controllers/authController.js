import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTP, sendWelcomeEmail } from "../services/email.service.js";
import { sendSMS } from "../services/sms.service.js";
import crypto from "crypto";
import generateTokens from "../utils/generateTokens.js"; // You might need to check if this exists or implement it

// Utility to generate numeric OTP
const generateNumericOTP = (length = 6) => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Passwordless: send OTP to email or phone
export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Provide email" });
    }

    const otp = generateNumericOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // find by email or phone
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: email,
        email,
        phone: null,
        password: await bcrypt.hash(generateNumericOTP(), 10), // placeholder password
        isEmailVerified: true,
      });
    }

    // Rate limit: 45s cooldown between OTP sends
    const lastSentAt = user.emailVerification?.lastSentAt ? new Date(user.emailVerification.lastSentAt) : null;
    const now = new Date();
    if (lastSentAt && now.getTime() - lastSentAt.getTime() < 45 * 1000) {
      const waitMs = 45 * 1000 - (now.getTime() - lastSentAt.getTime());
      const waitSec = Math.ceil(waitMs / 1000);
      return res.status(429).json({ message: `Please wait ${waitSec}s before requesting a new OTP.` });
    }

    user.emailVerification = {
      otpHash,
      expiresAt,
      lastSentAt: now,
    };
    await user.save();

    await sendOTP(email, otp, "Login");

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const user = await User.findOne({ email }).select("+emailVerification.otpHash +password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { otpHash, expiresAt } = user.emailVerification || {};
    if (!otpHash || !expiresAt || new Date() > expiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isEmailVerified = true;
    user.emailVerification = {};
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);
    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but not verified, maybe resend OTP?
      // For now, simpler: throw error
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateNumericOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = new User({
      name,
      email,
      password, // Pre-save hook will hash this
      phone,
      role: role || "user",
      isEmailVerified: false,
      emailVerification: {
        otpHash,
        expiresAt,
        lastSentAt: new Date(),
      },
    });

    await newUser.save();

    // Send OTP
    await sendOTP(email, otp, "Account Verification");

    res.status(201).json({
      message: "Registration successful. Please verify OTP sent to email.",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+emailVerification.otpHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified. Please login." });
    }

    const { otpHash, expiresAt } = user.emailVerification || {};

    if (!otpHash || !expiresAt || new Date() > expiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid. Request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.emailVerification.otpHash = null;
    user.emailVerification.verifiedAt = new Date();
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password to compare
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Send tokens in HTTP-only cookies (optional but secure) or just response body
    // Here returning in body for simplicity as requested by MERN typically
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateNumericOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.passwordReset = {
      otpHash,
      expiresAt,
      requestedAt: new Date()
    };
    await user.save();

    await sendOTP(email, otp, "Password Reset");

    res.status(200).json({ message: "Password reset OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+passwordReset.otpHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { otpHash, expiresAt } = user.passwordReset || {};
    if (!otpHash || !expiresAt || new Date() > expiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }

    const isMatch = await bcrypt.compare(otp, otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = newPassword; // Pre-save will hash
    user.passwordReset = {};
    await user.save();

    res.status(200).json({ message: "Password reset successfully. Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id || req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword; // will be hashed by pre-save
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
