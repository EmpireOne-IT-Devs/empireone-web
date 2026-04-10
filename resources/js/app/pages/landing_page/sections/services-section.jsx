import {
    Monitor,
    Smartphone,
    TrendingUp,
    Database,
    Cloud,
    Shield,
} from "lucide-react";
import { motion } from "framer-motion";

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

const fadeScale = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

// ─── BACKGROUND IMAGE ───────────────────────────────────────────────────────
const BG_IMAGE_SRC = "/images/empireone-background.jpg";
// ────────────────────────────────────────────────────────────────────────────

// ─── CENTER DECORATIVE IMAGE ─────────────────────────────────────────────────
const CENTER_IMAGE_SRC = "/images/empireone-background.jpg";
// ────────────────────────────────────────────────────────────────────────────

const services = [
    {
        Icon: Monitor,
        title: "IT Consultancy",
        desc: "Strategic IT guidance to align technology with your business goals and drive digital transformation.",
        accent: "#6366f1",
        bg: "rgba(99,102,241,0.08)",
    },
    {
        Icon: Smartphone,
        title: "App Development",
        desc: "Custom mobile and web applications built with modern frameworks for optimal performance.",
        accent: "#3b82f6",
        bg: "rgba(59,130,246,0.08)",
    },
    {
        Icon: TrendingUp,
        title: "Data Analysis",
        desc: "Transform raw data into actionable insights to make informed, data-driven business decisions.",
        accent: "#10b981",
        bg: "rgba(16,185,129,0.08)",
    },
    {
        Icon: Database,
        title: "Database Security",
        desc: "Robust security measures to protect your sensitive data from unauthorized access and breaches.",
        accent: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
    },
    {
        Icon: Cloud,
        title: "Cloud Computing",
        desc: "Scalable cloud infrastructure solutions for improved collaboration and reduced operational costs.",
        accent: "#06b6d4",
        bg: "rgba(6,182,212,0.08)",
    },
    {
        Icon: Shield,
        title: "Cyber Security",
        desc: "Comprehensive cybersecurity protocols to safeguard your digital assets against evolving threats.",
        accent: "#ec4899",
        bg: "rgba(236,72,153,0.08)",
    },
];

export default function ServicesSection() {
    return (
        <section
            id="services"
            className="relative flex flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
            style={{
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                backgroundImage: `url('${BG_IMAGE_SRC}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* ── WHITE OVERLAY ── */}
            <div
                className="absolute inset-0 z-0"
                style={{ background: "rgba(255, 255, 255, 0.88)" }}
            />

            {/* ── SUBTLE GRID TEXTURE ── */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ── TOP GRADIENT WASH ── */}
            <div
                className="absolute top-0 left-0 right-0 h-64 z-0 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(238,242,255,0.7), transparent)",
                }}
            />

            {/* ── CENTER DECORATIVE IMAGE ── */}
            <img
                src={CENTER_IMAGE_SRC}
                alt=""
                aria-hidden="true"
                className="absolute z-0 hidden pointer-events-none select-none md:block"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 440,
                    opacity: 0.06,
                    objectFit: "contain",
                    filter: "grayscale(100%)",
                }}
            />

            {/* ── CONTENT ── */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8">

                {/* HEADER ROW */}
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.35 }}
                        variants={fadeUp}
                        custom={0.05}
                        style={{ maxWidth: 640 }}
                    >
                        {/* eyebrow */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.6 }}
                            variants={fadeUp}
                            custom={0.1}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[.12em] uppercase mb-4"
                            style={{
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                color: "#6366f1",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" style={{ boxShadow: "0 0 8px rgba(99,102,241,0.6)" }} />
                            Our Services
                        </motion.div>

                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.5 }}
                            variants={fadeUp}
                            custom={0.18}
                            className="font-extrabold leading-[1.1]"
                            style={{
                                color: "#0a0f1e",
                                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                            }}
                        >
                            We Solve IT Problems{" "}
                            <span style={{ color: "#6366f1" }}>With Technology</span>
                        </motion.h2>
                    </motion.div>

                    <motion.a
                        href="#"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.7 }}
                        variants={fadeUp}
                        custom={0.22}
                        whileHover={{ x: 4 }}
                        className="group mt-1 inline-flex items-center gap-2 self-start font-semibold md:mt-2"
                        style={{ color: "#6366f1", fontSize: 15 }}
                    >
                        See All Services
                        <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-all group-hover:translate-x-1"
                            style={{ background: "rgba(99,102,241,0.1)" }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </motion.a>
                </div>

                {/* CARD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map(({ Icon, title, desc, accent, bg }, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            variants={fadeScale}
                            custom={0.08 + i * 0.08}
                            whileHover={{ y: -6 }}
                            className="group rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                            style={{
                                background: "rgba(255,255,255,0.85)",
                                border: "1.5px solid #f1f5f9",
                                boxShadow:
                                    "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
                                backdropFilter: "blur(8px)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1.5px ${accent}30`;
                                e.currentTarget.style.borderColor = `${accent}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";
                                e.currentTarget.style.borderColor = "#f1f5f9";
                            }}
                        >
                            {/* ICON */}
                            <div
                                className="w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: bg, width: 52, height: 52 }}
                            >
                                <Icon size={24} style={{ color: accent }} strokeWidth={1.8} />
                            </div>

                            {/* TEXT */}
                            <div className="flex-1">
                                <h3
                                    className="font-bold mb-2 leading-snug"
                                    style={{ color: "#0a0f1e", fontSize: 17 }}
                                >
                                    {title}
                                </h3>
                                <p
                                    className="leading-relaxed"
                                    style={{ color: "#64748b", fontSize: 14.5 }}
                                >
                                    {desc}
                                </p>
                            </div>

                            {/* READ MORE */}
                            <a
                                href="#"
                                className="flex items-center gap-1.5 font-bold tracking-wide uppercase transition-all duration-200"
                                style={{ color: accent, fontSize: 12.5 }}
                            >
                                Read More
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}