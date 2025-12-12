import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../lib/api";
import Navbar from "./Navbar";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <p>No email provided. <Link to="/register" className="text-indigo-400">Register first</Link></p>
      </div>
    )
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    setSuccessMsg("");
    try {
      await api.post("/api/auth/verify-otp", { email, otp: data.otp });
      setSuccessMsg("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm glass-panel p-8 rounded-2xl border border-white/10 text-center"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
            <p className="text-gray-400 text-sm">We sent a code to <span className="text-indigo-300">{email}</span></p>
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-2 rounded mb-4 text-sm">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-2 rounded mb-4 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register("otp", { required: "OTP is required", minLength: 6, maxLength: 6 })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                placeholder="XXXXXX"
                maxLength={6}
              />
              {errors.otp && <p className="text-red-400 text-xs mt-1">{errors.otp.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
