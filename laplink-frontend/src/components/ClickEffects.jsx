import { useEffect } from "react";

const ClickEffects = () => {
  useEffect(() => {
    const spawnRipple = (x, y) => {
      const el = document.createElement("div");
      el.className = "interaction-ripple";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      const size = 140;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };

    const onClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      spawnRipple(x, y);
    };
    const onTouch = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      spawnRipple(touch.clientX, touch.clientY);
    };

    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return null;
};

export default ClickEffects;
