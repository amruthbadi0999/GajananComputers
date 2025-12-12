import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OtpLogin from "./pages/OtpLogin";
// import Register from "./pages/Register"; // removed from routing for passwordless UX
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ServiceLaptop from "./pages/ServiceLaptop";
import SellLaptop from "./pages/SellLaptop";
import BuyLaptop from "./pages/BuyLaptop";
import AdminPanel from "./pages/AdminPanel";
import MouseFollower from "./components/MouseFollower";
import Footer from "./pages/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartProvider";
import Accessories from "./pages/Accessories";
import ChangePassword from "./pages/ChangePassword";
import ClickEffects from "./components/ClickEffects";

// Placeholder for now
const NotFound = () => <div className="text-white text-center mt-20">404 - Page Not Found</div>;

function App() {
  const location = useLocation();

  return (
    <CartProvider>
      <MouseFollower />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<OtpLogin />} />
          {/* Registration removed — passwordless OTP login only */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes (Need to wrap with RequireAuth later) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/service/request" element={<ServiceLaptop />} />
          <Route path="/laptops/sell" element={<SellLaptop />} />
          <Route path="/laptops/buy" element={<BuyLaptop />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/settings" element={<ChangePassword />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ToastContainer position="top-center" newestOnTop closeOnClick theme="dark" limit={3} />
      <ClickEffects />
    </CartProvider>
  );
}

export default App;
