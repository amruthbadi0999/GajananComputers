import Navbar from "./Navbar";
import { motion } from "framer-motion";
import toast from "../lib/toast.jsx";
import useCart from "../context/CartProvider";
import { useRef } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const items = [
  { id: 1, name: "SanDisk 64GB Pendrive", price: 599, color: "from-indigo-500 to-purple-500" },
  { id: 2, name: "Logitech Wireless Mouse", price: 999, color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "HP USB Keyboard", price: 899, color: "from-amber-500 to-orange-500" },
  { id: 4, name: "Laptop Sleeve 15.6\"", price: 799, color: "from-pink-500 to-rose-500" },
];

const Accessories = () => {
  const { add } = useCart();
  const { auth } = useAuth();
  const user = auth?.user || null;
  const navigate = useNavigate();

  // Creates a temporary flying clone that animates towards the navbar cart icon
  const flyToCart = (sourceEl) => {
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon || !sourceEl) return;

    const srcRect = sourceEl.getBoundingClientRect();
    const dstRect = cartIcon.getBoundingClientRect();

    const clone = sourceEl.cloneNode(true);
    const style = clone.style;
    style.position = "fixed";
    style.left = `${srcRect.left}px`;
    style.top = `${srcRect.top}px`;
    style.width = `${srcRect.width}px`;
    style.height = `${srcRect.height}px`;
    style.zIndex = 9999;
    style.opacity = "0.85";
    style.pointerEvents = "none";
    document.body.appendChild(clone);

    const keyframes = [
      { transform: "translate(0,0) scale(1)", opacity: 0.85 },
      {
        transform: `translate(${dstRect.left - srcRect.left}px, ${dstRect.top - srcRect.top}px) scale(0.2)`,
        opacity: 0.2,
      },
    ];
    const timing = { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
    const anim = clone.animate(keyframes, timing);
    anim.onfinish = () => clone.remove();
  };

  const addToCart = (item, imgRef) => {
    if (!user) {
      toast.error("Please login first to continue.");
      navigate("/login");
      return;
    }
    add(item);
    toast.success(`${item.name} added to cart`);
    if (imgRef?.current) flyToCart(imgRef.current);
  };
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">Accessories Store</h1>
        <p className="text-gray-400 mb-8">Curated essentials to level up your setup.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => {
            const imgRef = useRef(null);
            return (
              <motion.div key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-panel p-5 rounded-xl border border-white/10">
                <div ref={imgRef} className={`h-32 rounded-lg mb-4 bg-gradient-to-r ${it.color} opacity-20`} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-gray-400 text-sm">₹{it.price}</div>
                </div>
                <button
                  onClick={() => addToCart(it, imgRef)}
                  disabled={!user}
                  className={`tap-scale hover-raise px-3 py-2 text-sm rounded-lg ${user ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 cursor-not-allowed opacity-60"}`}
                >
                  Add to Cart
                </button>
              </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Accessories;
