import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../lib/api";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMsg({ type: "", text: "" });
    try {
      await api.post("/api/auth/forgot-password", data);
      setServerMsg({ type: "success", text: "OTP sent to your email. Check inbox." });
    } catch (err) {
      setServerMsg({ type: "error", text: err.response?.data?.message || "Request failed" });
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
          className="w-full max-w-sm glass-panel p-8 rounded-2xl border border-white/10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Forgot Password?</h2>
            <p className="text-gray-400 text-sm mt-1">Enter email to receive OTP</p>
          </div>

          {serverMsg.text && (
            <div className={`p-2 rounded mb-4 text-sm ${serverMsg.type === 'error' ? 'bg-red-500/10 text-red-200 border border-red-500/50' : 'bg-green-500/10 text-green-200 border border-green-500/50'}`}>
              {serverMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-xs text-indigo-400 hover:text-indigo-300">
              Received OTP? Reset Password →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
