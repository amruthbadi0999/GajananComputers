import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const BuyLaptop = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    if (!auth?.user) return <div className="text-white text-center mt-20">Please login.</div>;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const payload = { ...data, type: "BUY_REQUIREMENT", brand: "Any", city: "Any" }; // Defaults
            await api.post("/api/laptops", payload, config);
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
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400 mb-6">Find me a Laptop</h2>
                    <p className="text-gray-400 mb-6">Tell us what you need, and we'll find the best deal for you.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Primary Usage</label>
                            <input {...register("purpose", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" placeholder="Coding, Gaming, Office work..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Budget Range</label>
                            <select {...register("budgetRange")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-[#030014]">
                                <option value="15k-25k">₹15,000 - ₹25,000</option>
                                <option value="25k-40k">₹25,000 - ₹40,000</option>
                                <option value="40k-60k">₹40,000 - ₹60,000</option>
                                <option value="60k+">₹60,000+</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Urgency</label>
                            <select {...register("urgency")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-[#030014]">
                                <option value="THIS_WEEK">This Week</option>
                                <option value="THIS_MONTH">This Month</option>
                                <option value="URGENT">Urgent (Today/Tomorrow)</option>
                            </select>
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

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                            {loading ? "Submitting..." : "Submit Requirement"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default BuyLaptop;
