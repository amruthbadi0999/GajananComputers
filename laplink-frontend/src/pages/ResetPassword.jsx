import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../lib/api";
import Navbar from "./Navbar";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setServerMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setServerMsg({ type: "", text: "" });
    try {
      await api.post("/api/auth/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      });
      setServerMsg({ type: "success", text: "Password reset successful! Redirecting..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerMsg({ type: "error", text: err.response?.data?.message || "Reset failed" });
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
          className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Reset Password</h2>
            <p className="text-gray-400 text-sm mt-1">Enter OTP and new password</p>
          </div>

          {serverMsg.text && (
            <div className={`p-2 rounded mb-4 text-sm ${serverMsg.type === 'error' ? 'bg-red-500/10 text-red-200 border border-red-500/50' : 'bg-green-500/10 text-green-200 border border-green-500/50'}`}>
              {serverMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">OTP</label>
              <input
                {...register("otp", { required: "OTP is required" })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 tracking-widest"
                placeholder="XXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">New Password</label>
              <input
                {...register("newPassword", { required: "Required", minLength: 6 })}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="New Password"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Confirm Password</label>
              <input
                {...register("confirmPassword", { required: "Required" })}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
