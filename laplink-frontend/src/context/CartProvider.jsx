import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart.items");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart.items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (item) => setItems((prev) => [...prev, item]);
  const removeAt = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, it) => sum + (it.price || 0), 0), [items]);

  const value = { items, add, removeAt, clear, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);
export default useCart;
