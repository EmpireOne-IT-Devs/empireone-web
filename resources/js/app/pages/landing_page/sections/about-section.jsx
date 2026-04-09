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
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid rgba(0,0,0,0.08);
                    overflow: hidden;
                    transition: transform .35s cubic-bezier(.34,1.56,.64,1),
                                border-color .3s ease,
                                background .3s ease,
                                box-shadow .3s ease;
                    animation: sc-in .6s cubic-bezier(.22,1,.36,1) both;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                .sc::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: radial-gradient(ellipse at 50% 0%, rgba(168,85,247,.08) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity .3s ease;
                    pointer-events: none;
                }
                .sc:hover { transform: translateY(-5px); border-color: rgba(168,85,247,0.3); background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); box-shadow: 0 16px 32px rgba(0,0,0,.15), 0 0 0 1px rgba(168,85,247,.15); }
                .sc:hover::before { opacity: 1; }
                .sc-accent {
                    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                    width: 28px; height: 2px; border-radius: 999px;
                    background: linear-gradient(to right, rgba(168,85,247,.7), rgba(99,102,241,.7));
                    transition: width .3s ease, opacity .3s ease; opacity: 0;
                }
                .sc:hover .sc-accent { width: 52px; opacity: 1; }
                .sc-val { font-size: clamp(1.6rem, 2.5vw, 2.4rem); font-weight: 700; color: #1e293b; letter-spacing: -.02em; line-height: 1; margin-bottom: 7px; }
                .sc-lbl { font-size: .68rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: #64748b; }
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
    { value: "100+", label: "Satisfied Clients" },
    { value: "10+",   label: "Finished Projects" },
    { value: "250+",   label: "Skilled Experts"   },
    { value: "1,000+", label: "Media Posts"        },
];

const features = [
    "24/7 Customer Support Services",
    "Expert BPO & Back-Office Solutions",
    "Scalable Business Process Management",
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
                            src="/images/image-200.png"
                            alt="Team collaborating"
                            className="w-full object-cover"
                            style={{ height: "48vh", minHeight: 260 }}
                        />
                        <div className="absolute inset-0"
                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    </motion.div>
                </motion.div>

                {/* Right — text */}
                <div className="space-y-5">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.8 }}
                        variants={fadeUp}
                        custom={0.18}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[.12em] uppercase"
                        style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#ffffff",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" style={{ boxShadow: "0 0 8px rgba(168,85,247,0.6)" }} />
                        About EmpireOne BPO
                    </motion.div>

                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.6 }}
                        variants={fadeUp}
                        custom={0.28}
                        className="text-4xl md:text-5xl font-bold text-white leading-tight"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }}
                    >
                        <span style={{ whiteSpace: "nowrap" }}>Your Trusted Partner in</span>
                        <span className="block" style={{
                            background: "linear-gradient(135deg, #a78bfa, #818cf8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            Business Excellence
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
                        At EmpireOne, we deliver world-class BPO solutions that help businesses
                        optimize operations, reduce costs, and scale efficiently. From customer
                        support to back-office operations, we're your partner in achieving
                        operational excellence across the globe.
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
                                background: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            Explore More
                        </motion.button>
                        <motion.a
                            href="#contact"
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                                border: "1px solid rgba(167,139,250,0.3)",
                                color: "#ffffff",
                            }}
                        >
                            Contact Us
                        </motion.a>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeUp}
                custom={0.84}
                className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-3 "
            >
                {stats.map((s, i) => (
                    <StatCard key={s.label} value={s.value} label={s.label} delay={i * 100} />
                ))}
            </motion.div>
        </section>
    );
}