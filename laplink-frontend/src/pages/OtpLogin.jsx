import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { setAccessToken } from "../lib/auth";

const OtpLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: send, 2: verify
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const [cooldown, setCooldown] = useState(0);

  const onSend = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {};
      if (data.email) { payload.email = data.email; setEmail(data.email); }
      if (!payload.email) throw new Error("Provide email");
      await api.post("/api/auth/send-otp", payload);
      setStep(2);
      // Ensure OTP input starts empty upon moving to verification step
      reset({ otp: "" });
      setMessage("OTP sent. Check your inbox.");
      setCooldown(45);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const payload = { otp: data.otp };
      if (email) payload.email = email;
      const res = await api.post("/api/auth/verify-otp-login", payload);
      const { user, accessToken, refreshToken } = res.data;
      setAccessToken(accessToken);
      login({ user, accessToken, refreshToken });
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">Continue with OTP</h1>

          {message && (
            <div className="mb-4 text-sm bg-white/5 border border-white/10 rounded p-3 text-gray-200">{message}</div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit(onSend)} className="space-y-4">
              <input
                {...register("email", { required: true })}
                type="email"
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3"
                placeholder="Email"
              />
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
              <input
                {...register("otp", { required: true })}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 tracking-widest text-center text-xl"
                placeholder="Enter OTP"
              />
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg">
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={() => onSend({ email })}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg border border-white/10"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OtpLogin;
