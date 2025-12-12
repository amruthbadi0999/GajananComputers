import { useEffect, useState } from "react";
import api from "../lib/api";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AdminPanel = () => {
    const { auth } = useAuth();
    const [requests, setRequests] = useState({ services: [], laptops: [] });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL"); // ALL, SERVICE, SELL, BUY

    const fetchAll = async () => {
        if (!auth?.accessToken) return;
        try {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const [svcRes, lapRes] = await Promise.all([
                api.get("/api/admin/service", config),
                api.get("/api/admin/laptops", config)
            ]);
            setRequests({ services: svcRes.data, laptops: lapRes.data });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [auth]);

    const updateStatus = async (type, id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
            const endpoint = type === 'SERVICE'
                ? `/api/admin/service/${id}`
                : `/api/admin/laptops/${id}`;

            await api.patch(endpoint, { status: newStatus }, config);
            fetchAll(); // Refresh
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (auth?.user?.role !== 'admin') {
        return <div className="text-white text-center mt-20">Access Denied</div>;
    }

    const allItems = [
        ...requests.services.map(r => ({ ...r, category: 'SERVICE' })),
        ...requests.laptops.map(r => ({ ...r, category: r.type }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredItems = filter === 'ALL'
        ? allItems
        : allItems.filter(i => {
            if (filter === 'SERVICE') return i.category === 'SERVICE';
            if (filter === 'SELL') return i.category === 'SELL';
            if (filter === 'BUY') return i.category === 'BUY_REQUIREMENT';
            return true;
        });

    return (
        <div className="min-h-screen bg-[#030014] text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Admin Command Center</h1>
                    <div className="space-x-2">
                        {['ALL', 'SERVICE', 'SELL', 'BUY'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`tap-scale hover-raise px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-300">
                                <tr>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Details</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr> :
                                    filteredItems.map(item => (
                                        <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${item.category === 'SERVICE' ? 'bg-blue-500/20 text-blue-300' :
                                                        item.category === 'SELL' ? 'bg-purple-500/20 text-purple-300' :
                                                            'bg-amber-500/20 text-amber-300'}`}>
                                                    {item.category === 'BUY_REQUIREMENT' ? 'BUY REQ' : item.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-white">{item.userId?.name || item.name}</div>
                                                <div className="text-xs text-gray-500">{item.phone}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-300">
                                                {item.category === 'SERVICE' && (
                                                    <>
                                                        <div className="font-semibold text-white">{item.brand} {item.model}</div>
                                                        <div>{item.problems.join(", ")}</div>
                                                    </>
                                                )}
                                                {item.category === 'SELL' && (
                                                    <>
                                                        <div className="font-semibold text-white">{item.brand} {item.model}</div>
                                                        <div>Expected: ₹{item.expectedPrice} | {item.condition}</div>
                                                    </>
                                                )}
                                                {item.category === 'BUY_REQUIREMENT' && (
                                                    <>
                                                        <div className="font-semibold text-white">For: {item.purpose}</div>
                                                        <div>Budget: {item.budgetRange}</div>
                                                    </>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300 border border-gray-600">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    className="bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                                                    value={item.status}
                                                    onChange={(e) => updateStatus(item.category === 'SERVICE' ? 'SERVICE' : 'LAPTOP', item._id, e.target.value)}
                                                >
                                                    {item.category === 'SERVICE' ? (
                                                        <>
                                                            <option value="NEW">NEW</option>
                                                            <option value="DIAGNOSING">DIAGNOSING</option>
                                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                            <option value="READY">READY</option>
                                                            <option value="DELIVERED">DELIVERED</option>
                                                            <option value="CANCELLED">CANCELLED</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option value="NEW">NEW</option>
                                                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                                            <option value="CONTACTED">CONTACTED</option>
                                                            <option value="OFFER_GIVEN">OFFER_GIVEN</option>
                                                            <option value="COMPLETED">COMPLETED</option>
                                                            <option value="REJECTED">REJECTED</option>
                                                        </>
                                                    )}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
