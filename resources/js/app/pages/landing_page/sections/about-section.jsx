import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const fadeLeft = {
    hidden: { opacity: 0, x: -36, scale: 0.98 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const fadeRight = {
    hidden: { opacity: 0, x: 36 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.75,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

function useCountUp(target, active, duration = 1600) {
    const [value, setValue] = useState("0");
    const raf = useRef(null);

    useEffect(() => {
        if (!active) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.floor(eased * num).toLocaleString() + suffix);
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [active, target, duration]);

    return value;
}

function StatCard({ value, label, delay }) {
    const [active, setActive] = useState(false);
    const animated = useCountUp(value, active);

    useEffect(() => {
        const t = setTimeout(() => setActive(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <>
            <style>{`
                .sc {
                    position: relative;
                    border-radius: 18px;
                    padding: 26px 16px 22px;
                    text-align: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    overflow: hidden;
                    transition: transform .35s cubic-bezier(.34,1.56,.64,1),
                                border-color .3s ease,
                                background .3s ease,
                                box-shadow .3s ease;
                    animation: sc-in .6s cubic-bezier(.22,1,.36,1) both;
                }
                .sc::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: radial-gradient(ellipse at 50% 0%, rgba(168,85,247,.1) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity .3s ease;
                    pointer-events: none;
                }
                .sc:hover { transform: translateY(-5px); border-color: rgba(255,255,255,.13); background: rgba(255,255,255,.055); box-shadow: 0 16px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(168,85,247,.1); }
                .sc:hover::before { opacity: 1; }
                .sc-accent {
                    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                    width: 28px; height: 2px; border-radius: 999px;
                    background: linear-gradient(to right, rgba(168,85,247,.7), rgba(99,102,241,.7));
                    transition: width .3s ease, opacity .3s ease; opacity: 0;
                }
                .sc:hover .sc-accent { width: 52px; opacity: 1; }
                .sc-val { font-size: clamp(1.6rem, 2.5vw, 2.4rem); font-weight: 700; color: #fff; letter-spacing: -.02em; line-height: 1; margin-bottom: 7px; }
                .sc-lbl { font-size: .68rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.36); }
                @keyframes sc-in { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
            <div className="sc" style={{ animationDelay: `${delay}ms` }}>
                <div className="sc-val">{active ? animated : "0"}</div>
                <div className="sc-lbl">{label}</div>
                <div className="sc-accent" />
            </div>
        </>
    );
}

const stats = [
    { value: "6,500+", label: "Satisfied Clients" },
    { value: "600+",   label: "Finished Projects" },
    { value: "250+",   label: "Skilled Experts"   },
    { value: "1,000+", label: "Media Posts"        },
];

const features = [
    "Innovative Technology Solutions",
    "Expert Team of Professionals",
    "Guaranteed Business Growth",
];

export default function AboutSection() {
    return (
        <section
            id="about-us"
            className="relative overflow-hidden"
            style={{ height: "100vh", display: "flex", flexDirection: "column" }}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <video src="/video/about.mp4" autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "rgba(172,145,95,0.35)" }} />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-20 pb-4 grid md:grid-cols-2 gap-10 items-center">

                {/* Left — image */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    variants={fadeLeft}
                    custom={0.15}
                    className="flex justify-center md:justify-start"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.35 }}
                        transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl w-full"
                        style={{ maxWidth: 580, border: "1px solid rgba(255,255,255,0.1)" }}>
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                            alt="Team collaborating"
                            className="w-full object-cover"
                            style={{ height: "46vh", minHeight: 260 }}
                        />
                        <div className="absolute inset-0"
                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    </motion.div>
                </motion.div>

                {/* Right — text */}
                <div className="space-y-5">
                    <motion.span
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.8 }}
                        variants={fadeUp}
                        custom={0.18}
                        className="text-xs font-semibold tracking-[.2em] uppercase"
                        style={{ color: "rgba(255,255,255,0.45)" }}>
                        About Company
                    </motion.span>

                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.6 }}
                        variants={fadeUp}
                        custom={0.28}
                        className="text-4xl md:text-5xl font-bold text-white leading-tight"
                    >
                        We Help Clients With
                        <span className="block" style={{
                            background: "linear-gradient(135deg, #a78bfa, #818cf8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            The Right Solutions
                        </span>
                    </motion.h2>

                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.65 }}
                        variants={fadeUp}
                        custom={0.38}
                        className="leading-relaxed max-w-lg text-sm"
                        style={{ color: "rgba(255,255,255,0.6)" }}>
                        At EmpireOne, we believe in the power of technology to transform
                        businesses. Our mission is to provide scalable, secure, and
                        innovative IT solutions that drive growth and efficiency globally.
                    </motion.p>

                    <ul className="space-y-2.5 pt-1">
                        {features.map((f, index) => (
                            <motion.li
                                key={f}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.7 }}
                                variants={fadeRight}
                                custom={0.46 + index * 0.08}
                                className="flex items-center gap-3 text-sm font-medium text-white"
                            >
                                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#a78bfa" }} />
                                {f}
                            </motion.li>
                        ))}
                    </ul>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.7 }}
                        variants={fadeUp}
                        custom={0.72}
                        className="flex flex-wrap gap-3 pt-2"
                    >
                        <motion.button
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:brightness-110"
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            Explore More
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{
                                background: "rgba(167,139,250,0.15)",
                                border: "1px solid rgba(167,139,250,0.35)",
                                color: "#c4b5fd",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeUp}
                custom={0.84}
                className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                {stats.map((s, i) => (
                    <StatCard key={s.label} value={s.value} label={s.label} delay={i * 100} />
                ))}
            </motion.div>
        </section>
    );
}