import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STAR_COUNT = 12;

const MouseFollower = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    // Color cycle for central sparkle
    const colors = [
        "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(168,85,247,0.95) 40%, rgba(99,102,241,0.85) 70%, rgba(0,0,0,0) 100%)",
        "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(59,130,246,0.95) 40%, rgba(56,189,248,0.85) 70%, rgba(0,0,0,0) 100%)",
        "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(244,114,182,0.95) 40%, rgba(167,139,250,0.85) 70%, rgba(0,0,0,0) 100%)",
    ];
    const [ci, setCi] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setCi((i) => (i + 1) % colors.length), 1500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            <motion.div
                animate={{ x: pos.x, y: pos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.4 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
            >
                {/* central sparkle */}
                <motion.span
                    initial={{ opacity: 0.8, scale: 0.9 }}
                    animate={{ opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="block h-[10px] w-[10px] rounded-sm"
                    style={{
                        background: colors[ci],
                        filter: "drop-shadow(0 0 10px rgba(167,139,250,1))",
                    }}
                />

                {/* orbiting starlets */}
                <div className="relative">
                    {[...Array(STAR_COUNT)].map((_, i) => {
                        const angle = (i / STAR_COUNT) * Math.PI * 2;
                        const radius = 16 + (i % 3) * 8;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const delay = i * 0.04;
                        return (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0.7, scale: 0.7 }}
                                animate={{ opacity: [0.7, 1, 0.7], scale: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.6, delay, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute block"
                                style={{ left: x, top: y }}
                            >
                                <span
                                    className="block h-[6px] w-[6px] rounded-sm"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(244,114,182,0.9) 40%, rgba(99,102,241,0.8) 75%, rgba(0,0,0,0) 100%)",
                                        filter: "drop-shadow(0 0 8px rgba(244,114,182,0.9))",
                                    }}
                                />
                            </motion.span>
                        );
                    })}
                </div>

                {/* comet trail */}
                <div className="relative">
                    {[...Array(10)].map((_, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{ opacity: [0.6, 0], x: -10 * (i + 1), y: 4 * (i % 2 ? 1 : -1), scale: [1, 0.8, 0.6] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
                            className="absolute block"
                        >
                            <span
                                className="block h-[3px] w-[3px] rounded-sm"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(59,130,246,0.8) 50%, rgba(0,0,0,0) 100%)",
                                    filter: "drop-shadow(0 0 6px rgba(59,130,246,0.8))",
                                }}
                            />
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default MouseFollower;
