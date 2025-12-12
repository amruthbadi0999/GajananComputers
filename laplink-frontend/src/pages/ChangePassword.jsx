import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import api from "../lib/api";
import useAuth from "../hooks/useAuth";

const ChangePassword = () => {
  const { auth } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await api.post("/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMsg("Password changed successfully.");
      reset();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.user) {
    return <div className="text-white text-center mt-20">Please login.</div>;
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">Change Password</h1>
          {msg && <div className="mb-4 text-sm bg-white/5 border border-white/10 rounded p-3 text-gray-200">{msg}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Current Password</label>
              <input {...register("currentPassword", { required: true })} type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">New Password</label>
              <input {...register("newPassword", { required: true, minLength: 6 })} type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Confirm Password</label>
              <input {...register("confirmPassword", { required: true })} type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3" />
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
