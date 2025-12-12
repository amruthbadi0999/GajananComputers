import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const SellLaptop = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    if (!auth?.user) return <div className="text-white text-center mt-20">Please login.</div>;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            // Add type = SELL
            const payload = { ...data, type: "SELL" };
            await axios.post("http://localhost:3000/api/laptops", payload, config);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to submit");
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
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">Sell Your Laptop</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Brand</label>
                                <input {...register("brand", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Apple, Dell..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
                                <input {...register("model", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Model Name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Processor</label>
                                <input {...register("processor")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="i5, M1..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">RAM</label>
                                <input {...register("ram")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="8GB, 16GB" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Storage</label>
                                <input {...register("storage")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="256GB SSD" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Condition</label>
                            <select {...register("condition")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-[#030014]">
                                <option value="GOOD">Good (Minor scratches)</option>
                                <option value="EXCELLENT">Excellent (Like New)</option>
                                <option value="AVERAGE">Average (Visible wear)</option>
                                <option value="NEEDS_REPAIR">Needs Repair</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Expected Price (₹)</label>
                            <input type="number" {...register("expectedPrice", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="25000" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
                                <input {...register("name", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input {...register("phone", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" />
                            </div>
                        </div>
                        <input type="hidden" {...register("city")} value="Unknown" />

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                            {loading ? "Submitting..." : "Submit for Review"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default SellLaptop;
