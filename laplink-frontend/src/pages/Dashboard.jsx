import { useEffect, useState } from "react";
import api from "../lib/api";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { auth } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [laptopRequests, setLaptopRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      // Need accessToken in headers. 
      // Ideally use a useAxiosPrivate hook that adds interceptors.
      // For now, simpler implementation:
      if (!auth?.accessToken) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        };

        const [serviceRes, laptopRes] = await Promise.all([
          api.get("/api/service/me", config),
          api.get("/api/laptops/me", config)
        ]);

        setServiceRequests(serviceRes.data);
        setLaptopRequests(laptopRes.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) {
      fetchRequests();
    } else {
      // If not logged in redirect (handled by protected route wrapper usually)
      setLoading(false);
    }
  }, [auth]);

  if (!auth?.user) {
    return (
      <div className="min-h-screen bg-[#030014] text-white">
        <Navbar />
        <div className="p-8 text-center text-gray-400">
          Please <Link to="/login" className="text-indigo-400">login</Link> to view dashboard.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">My Dashboard</h1>
          <div className="space-x-4">
            <Link to="/service/request" className="tap-scale hover-raise bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20">
              + New Repair
            </Link>
            <Link to="/laptops/sell" className="tap-scale hover-raise bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-purple-500/20">
              + Sell Laptop
            </Link>
          </div>
        </div>

        {/* Quick Stats or Overview? Maybe later. For now List */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Requests */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Repair Requests</h2>
            {loading ? <p>Loading...</p> : serviceRequests.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl text-center text-gray-400">No repair requests yet.</div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map(req => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white">{req.brand} {req.model}</h3>
                        <p className="text-sm text-gray-400">{req.problems.join(", ")}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="mt-3 text-xs text-gray-500 flex justify-between">
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      <span>ID: {req._id.slice(-6)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Laptop Requests (Buy/Sell) */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Marketplace Requests</h2>
            {loading ? <p>Loading...</p> : laptopRequests.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl text-center text-gray-400">No marketplace requests yet.</div>
            ) : (
              <div className="space-y-4">
                {laptopRequests.map(req => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white">
                          {req.type === 'SELL' ? `Selling: ${req.brand} ${req.model}` : `Buying: ${req.purpose}`}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {req.type === 'SELL' ? `Expected: ₹${req.expectedPrice}` : `Budget: ${req.budgetRange}`}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="mt-3 text-xs text-gray-500 flex justify-between">
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      <span>ID: {req._id.slice(-6)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = "bg-gray-500/20 text-gray-300";
  if (['COMPLETED', 'DELIVERED', 'BOUGHT', 'READY'].includes(status)) color = "bg-green-500/20 text-green-300 border border-green-500/30";
  if (['IN_PROGRESS', 'DIAGNOSING', 'CONTACTED', 'OFFER_GIVEN'].includes(status)) color = "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  if (['REJECTED', 'CANCELLED'].includes(status)) color = "bg-red-500/20 text-red-300 border border-red-500/30";
  if (['NEW'].includes(status)) color = "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default Dashboard;
