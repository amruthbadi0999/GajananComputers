import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "../lib/toast.jsx";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(auth?.user);
  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 tracking-tight"
          >
            Gajanan Computers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Laptop software and hardware solutions. Repair, Sell, or Buy with confidence and style.
          </motion.p>
        </div>

        {/* Centered Login button when logged out */}
        {!isLoggedIn && (
          <div className="flex justify-center mb-10">
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-500/50">
              Login
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Repair */}
          <CTA_Card
            title="Repair My Laptop"
            desc="Expert technicians for hardware and software issues. Pickup & Drop available."
            onClick={() => {
              if (isLoggedIn) return navigate("/service/request");
              toast.error("Please login first to continue.");
              navigate("/login");
            }}
            color="from-blue-500 to-cyan-500"
            delay={0.2}
          />

          {/* Card 2: Sell */}
          <CTA_Card
            title="Sell My Laptop"
            desc="Get the best fair price for your used device. Instant quotes, quick payment."
            onClick={() => {
              if (isLoggedIn) return navigate("/laptops/sell");
              toast.error("Please login first to continue.");
              navigate("/login");
            }}
            color="from-purple-500 to-pink-500"
            delay={0.3}
          />

          {/* Card 3: Buy */}
          <CTA_Card
            title="I Need a Laptop"
            desc="Tell us your requirements and budget. We find the perfect match for you."
            onClick={() => {
              if (isLoggedIn) return navigate("/laptops/buy");
              toast.error("Please login first to continue.");
              navigate("/login");
            }}
            color="from-amber-400 to-orange-500"
            delay={0.4}
          />
        </div>
      </main>
    </div>
  );
};

const CTA_Card = ({ title, desc, onClick, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button onClick={onClick} className="block h-full w-full text-left"
        aria-label={title}
      >
        <div className="h-full glass-panel p-8 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-white/20 transition-all">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition-opacity duration-500`} />

          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
            {title}
          </h3>
          <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
            {desc}
          </p>

          <div className="mt-6 flex items-center text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">
            Get Started <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default Home;
