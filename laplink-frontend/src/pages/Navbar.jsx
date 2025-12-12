import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { clearAccessToken } from "../lib/auth";
import toast from "../lib/toast.jsx";
import useCart from "../context/CartProvider";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const user = auth?.user || null;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { items, removeAt, clear, total } = useCart();

  const handleLogout = () => {
    clearAccessToken();
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Gajanan Computers
              </h1>
            </Link>
          </div>
          <div className="block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <button
                onClick={() => {
                  if (user) return navigate("/service/request");
                  toast.error("Please login first to continue.");
                  navigate("/login");
                }}
                className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Repair
              </button>
              <button
                onClick={() => {
                  if (user) return navigate("/laptops/sell");
                  toast.error("Please login first to continue.");
                  navigate("/login");
                }}
                className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sell
              </button>
              <button
                onClick={() => {
                  if (user) return navigate("/laptops/buy");
                  toast.error("Please login first to continue.");
                  navigate("/login");
                }}
                className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Buy
              </button>
              <Link to="/accessories" className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Accessories
              </Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="tap-scale hover-raise text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  { /* Settings removed per request */ }
                  {user.role === 'admin' && (
                    <Link to="/admin" className="tap-scale hover-raise text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="tap-scale hover-raise bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500/50"
                  >
                    Logout
                  </button>
                  {/* Cart Drawer Trigger (only shows badge when logged in) */}
                  <button
                    id="cart-icon"
                    onClick={() => setIsOpen((v) => !v)}
                    className="tap-scale hover-raise relative text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    aria-label="Cart"
                  >
                    <FiShoppingCart className="inline-block align-middle" />
                    {items.length > 0 && (
                      <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5">
                        {items.length}
                      </span>
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {/* Cart Drawer */}
        {isOpen && (
          <div className="absolute right-4 top-16 w-80 glass-panel rounded-xl border border-white/10 shadow-xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="font-semibold text-white">Cart</div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm">Close</button>
            </div>
            <div className="max-h-64 overflow-auto">
              {items.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">Your cart is empty.</div>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between border-b border-white/5">
                    <div>
                      <div className="text-white text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-gray-400">₹{it.price}</div>
                    </div>
                    <button onClick={() => removeAt(idx)} className="text-red-400 hover:text-red-300" aria-label="Remove">
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-gray-300">Total</div>
              <div className="text-white font-semibold">₹{total}</div>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <button onClick={clear} className="w-1/2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg border border-white/10">Clear</button>
              <button className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg">Checkout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
