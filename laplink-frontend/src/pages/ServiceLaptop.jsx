import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const ServiceLaptop = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    if (!auth?.user) {
        // Simple protection, ideally use wrapper
        return <div className="text-white text-center mt-20">Please login to request service.</div>
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            await api.post("/api/service", data, config);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030014] text-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-2xl"
                >
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">Repair Request</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Brand<span className="text-red-500 ml-1">*</span></label>
                                <input {...register("brand", { required: true })} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Dell, HP, Apple..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Model <span className="text-gray-500">(Optional)</span></label>
                                <input {...register("model")} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="XPS 15, MacBook Air... (Optional)" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Describe the Issue<span className="text-red-500 ml-1">*</span></label>
                            <textarea {...register("customProblem", { required: true })} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 min-h-[100px]" placeholder="Screen is flickering, keyboard not working..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Service Type <span className="text-gray-500">(Optional)</span></label>
                                <select {...register("preferredServiceType")} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-[#030014]">
                                    <option value="PICKUP_DROP">Pickup & Drop</option>
                                    <option value="CARRY_IN">Carry In</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Preferred Time <span className="text-gray-500">(Optional)</span></label>
                                <select {...register("preferredTimeSlot")} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-[#030014]">
                                    <option value="MORNING">Morning (9AM - 12PM)</option>
                                    <option value="AFTERNOON">Afternoon (12PM - 4PM)</option>
                                    <option value="EVENING">Evening (4PM - 8PM)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name<span className="text-red-500 ml-1">*</span></label>
                                <input {...register("name", { required: true })} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone<span className="text-red-500 ml-1">*</span></label>
                                <input {...register("phone", { required: true })} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Phone Number" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Address / City <span className="text-gray-500">(Optional)</span></label>
                            <input {...register("address")} className="input-field w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Full Address with City (Optional)" />
                            <input type="hidden" {...register("city")} value="" />
                        </div>

                                        <button type="submit" disabled={loading} className="tap-scale hover-raise w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default ServiceLaptop;
