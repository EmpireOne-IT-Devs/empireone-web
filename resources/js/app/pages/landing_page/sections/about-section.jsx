import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── Count-up hook ─────────────────────────────────────── */
function useCountUp(target, active, duration = 1800) {
    const [value, setValue] = useState("0");
    const raf = useRef(null);
    useEffect(() => {
        if (!active) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            const cur = Math.floor(eased * num);
            setValue(cur.toLocaleString() + suffix);
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [active, target, duration]);
    return value;
}

/* ─── Data ───────────────────────────────────────────────── */
const stats = [
    { value: "1000+", label: "Employees", icon: "◈" },
    { value: "250+", label: "Skilled Experts", icon: "◆" },
    { value: "10+", label: "Finished Projects", icon: "◉" },
    { value: "1000+", label: "Media Posts", icon: "◇" },
];

const badgeDetails = [
    {
        label: "ISO Certified",
        img: "/images/ISO-Logo.png",
        title: "ISO 27001:2022",
        desc: "The ISO 27001:2022 badge is an internationally recognized certification that confirms our organization operates a world-class Information Security Management System (ISMS). This standard proves that we don't just use security tools—we have a comprehensive, board-led culture of risk management.",
    },
    {
        label: "GDPR Compliant",
        img: "/images/GDPR-Logo.png",
        title: "GDPR",
        desc: "The GDPR badge signifies our adherence to the most stringent data protection framework in the world. Beyond mere security, GDPR compliance demonstrates our commitment to Data Privacy as a Human Right, ensuring that every individual's personal information is handled with transparency, purpose, and absolute care.",
    },
    {
        label: "SOC 2 Type II",
        img: "/images/SOC2-Logo.png",
        title: "SOC2 TYPE2",
        desc: "The SOC 2 Type 2 badge is the gold standard for service organizations, representing a rigorous, independent audit of our internal controls. Unlike a \"snapshot\" audit, the Type 2 certification proves that our security protocols have been followed consistently and effectively over an extended period.",
    },
    {
        label: "HIPAA Ready",
        img: "/images/HIPAA-Logo.png",
        title: "HIPAA",
        desc: "As a HIPAA-compliant organization, we adhere to the highest federal standards for the protection of Protected Health Information (PHI). This certification signifies that we have implemented rigorous safeguards to ensure the confidentiality, integrity, and availability of sensitive healthcare data.",
    },
    {
        label: "PCI DSS Certified",
        img: "/images/PCI-Logo.png",
        title: "PCI DSS",
        desc: "The PCI DSS badge signifies that our organization meets the rigorous security standards established by the world's leading financial institutions. This compliance ensures that every credit card transaction and financial record processed through our systems is handled with maximum security to prevent fraud and data theft.",
    },
    {
        label: "BBB Accredited",
        img: "/images/BBB-Logo.png",
        title: "BBB ACCREDITED BUSINESSES",
        desc: "The BBB Accredited Business seal is more than a rating; it is a public declaration of our commitment to ethical business practices. Accreditation signifies that we have been independently vetted and have pledged to uphold the BBB Standards for Trust—a comprehensive set of best practices for how businesses should treat their clients and the public.",
    },
];

const pillars = [
    {
        num: "01",
        title: "24/7 Customer Support",
        body: "Round-the-clock service teams fluent in your brand voice, resolving issues before they escalate.",
    },
    {
        num: "02",
        title: "Expert BPO Solutions",
        body: "End-to-end back-office operations engineered for precision, compliance, and cost efficiency.",
    },
    {
        num: "03",
        title: "Scalable Process Management",
        body: "Elastic capacity that grows with you — no overhead, no delays, no limits.",
    },
];

/* ─── Stat chip ──────────────────────────────────────────── */
function StatChip({ value, label, icon, delay }) {
    const [active, setActive] = useState(false);
    const animated = useCountUp(value, active);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setTimeout(() => setActive(true), delay);
                }
            },
            { threshold: 0.5 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
                duration: 0.7,
                delay: delay / 1000 + 0.2,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="stat-chip"
        >
            <span className="stat-icon">{icon}</span>
            <span className="stat-val">{active ? animated : "0"}</span>
            <span className="stat-label">{label}</span>
        </motion.div>
    );
}

/* ─── Pillar card ────────────────────────────────────────── */
function PillarCard({ num, title, body, index }) {
    return (
        <motion.div
            className="pillar-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
                duration: 0.65,
                delay: 0.15 * index,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <span className="pillar-num">{num}</span>
            <div className="pillar-body">
                <strong className="pillar-title">{title}</strong>
                <p className="pillar-text">{body}</p>
            </div>
            <div className="pillar-arrow">→</div>
        </motion.div>
    );
}

/* ─── Badge item with tooltip ───────────────────────────── */
function BadgeItem({ label, img, title, desc }) {
    const [hovered, setHovered] = useState(false);
    return (
        <span
            className="strip-badge"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={img} alt={label} style={{ height: 50, width: "auto" }} />
            <span>{label}</span>
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        className="badge-tooltip"
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        <div className="badge-tooltip-title">{title}</div>
                        <p className="badge-tooltip-desc">{desc}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}

/* ─── Main component ─────────────────────────────────────── */
export default function AboutSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

    return (
        <section id="about-us" ref={sectionRef} className="about-root">
            {/* ── STYLES ─────────────────────────────────────────── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

                :root {
                    --ink:   #0b0b10;
                    --gold:  #c9a84c;
                    --gold2: #e8c97a;
                    --lilac: #8b7bb5;
                }

                .about-root {
                    position: relative;
                    overflow: hidden;
                    background: var(--ink);
                    font-family: 'Outfit', sans-serif;
                }

                /* video bg */
                .about-video-wrap { position: absolute; inset: 0; z-index: 0; }
                .about-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
                .about-video-wrap::after {
                    content: '';
                    position: absolute; inset: 0;
                    background:
                        linear-gradient(to bottom, rgba(11,11,16,0.88) 0%, rgba(11,11,16,0.55) 50%, rgba(11,11,16,0.92) 100%),
                        linear-gradient(100deg, rgba(11,11,16,0.9) 0%, transparent 60%);
                }

                /* grain */
                .about-grain {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    opacity: 0.035;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 200px 200px;
                }

                /* layout */
                .about-inner {
                    position: relative; z-index: 2;
                    max-width: 1360px; margin: 0 auto;
                    padding: 100px 48px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 72px;
                    align-items: start;
                }

                /* eyebrow */
                .eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 22px;
                }
                .eyebrow-line {
                    display: block; width: 32px; height: 1px;
                    background: linear-gradient(90deg, var(--gold), transparent);
                }

                /* headline */
                .about-h2 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(38px, 5vw, 72px);
                    font-weight: 700; line-height: 1.03;
                    color: #fff; margin: 0 0 6px;
                }
                .about-h2 em {
                    font-style: italic;
                    background: linear-gradient(120deg, var(--gold2), var(--lilac));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .about-sub {
                    font-size: 15px; font-weight: 300; line-height: 1.75;
                    color: rgba(255,255,255,0.52); max-width: 440px; margin-bottom: 40px;
                }

                /* pillars */
                .pillars { display: flex; flex-direction: column; gap: 2px; margin-bottom: 44px; }
                .pillar-card {
                    display: flex; align-items: flex-start; gap: 20px;
                    padding: 18px 20px; border-radius: 14px;
                    border: 1px solid transparent; cursor: default;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                }
                .pillar-card:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(201,168,76,0.2);
                    transform: translateX(6px);
                }
                .pillar-num {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 11px; font-weight: 600; letter-spacing: 0.15em;
                    color: var(--gold); margin-top: 3px; flex-shrink: 0; min-width: 26px;
                }
                .pillar-body { flex: 1; min-width: 0; }
                .pillar-title {
                    display: block; font-size: 14px; font-weight: 600;
                    color: rgba(255,255,255,0.9); margin-bottom: 4px; letter-spacing: 0.01em;
                }
                .pillar-text {
                    font-size: 13px; font-weight: 300;
                    color: rgba(255,255,255,0.42); line-height: 1.65; margin: 0;
                }
                .pillar-arrow {
                    font-size: 16px; color: rgba(255,255,255,0.12);
                    margin-top: 2px; flex-shrink: 0;
                    transition: color 0.2s, transform 0.2s;
                }
                .pillar-card:hover .pillar-arrow { color: var(--gold); transform: translateX(4px); }

                /* CTA */
                .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .btn-primary {
                    padding: 13px 30px;
                    background: linear-gradient(135deg, var(--gold) 0%, #a8722a 100%);
                    border: none; border-radius: 10px;
                    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
                    color: #1a1000; cursor: pointer; letter-spacing: 0.03em;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 8px 28px rgba(201,168,76,0.28);
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,0.38); }
                .btn-ghost {
                    padding: 13px 30px; background: transparent;
                    border: 1px solid rgba(255,255,255,0.18); border-radius: 10px;
                    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
                    color: rgba(255,255,255,0.7); cursor: pointer; text-decoration: none;
                    display: inline-flex; align-items: center;
                    transition: border-color 0.2s, color 0.2s, transform 0.2s;
                }
                .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

                /* right col */
                .right-col { display: flex; flex-direction: column; gap: 28px; }

                /* image frame */
                .img-frame-outer { position: relative; }
                .img-frame {
                    position: relative; border-radius: 20px; overflow: hidden;
                    aspect-ratio: 4/3;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04);
                }
                .img-frame img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
                .img-frame::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(11,11,16,0.6) 0%, transparent 55%);
                    border-radius: inherit; pointer-events: none;
                }
                .img-corner {
                    position: absolute; width: 52px; height: 52px;
                    border-color: var(--gold); border-style: solid; border-width: 0; opacity: 0.6;
                }
                .img-corner.tl { top: -10px; left: -10px; border-top-width: 1px; border-left-width: 1px; border-top-left-radius: 6px; }
                .img-corner.br { bottom: -10px; right: -10px; border-bottom-width: 1px; border-right-width: 1px; border-bottom-right-radius: 6px; }

                /* badge */
                .img-badge {
                    position: absolute; bottom: 16px; left: 16px; z-index: 3;
                    background: rgba(11,11,16,0.82); backdrop-filter: blur(18px);
                    border: 1px solid rgba(201,168,76,0.25); border-radius: 14px;
                    padding: 12px 16px; display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    max-width: calc(100% - 32px);
                }
                .badge-dot {
                    width: 8px; height: 8px; border-radius: 50%; background: #4ade80;
                    flex-shrink: 0; box-shadow: 0 0 10px #4ade80;
                    animation: pulse-green 2.2s ease-out infinite;
                }
                @keyframes pulse-green {
                    0%,100% { box-shadow: 0 0 6px #4ade80; }
                    50% { box-shadow: 0 0 14px #4ade80, 0 0 24px rgba(74,222,128,0.3); }
                }
                .badge-text-top { font-size: 11px; font-weight: 300; color: rgba(255,255,255,0.45); margin-bottom: 1px; }
                .badge-text-bot { font-size: 14px; font-weight: 600; color: #fff; font-family: 'Outfit', sans-serif; }

                /* divider */
                .gold-rule {
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent);
                }

                /* stats grid */
                .stats-grid {
                    display: grid; grid-template-columns: repeat(2, 1fr);
                    gap: 1px; background: rgba(255,255,255,0.07);
                    border-radius: 18px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                }
                .stat-chip {
                    display: flex; flex-direction: column; align-items: flex-start;
                    gap: 4px; padding: 22px 20px 18px;
                    background: rgba(11,11,16,0.85);
                    transition: background 0.25s; cursor: default;
                }
                .stat-chip:hover { background: rgba(201,168,76,0.06); }
                .stat-icon { font-size: 12px; color: var(--gold); margin-bottom: 6px; }
                .stat-val {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(26px, 3.5vw, 42px);
                    font-weight: 700; color: #fff; line-height: 1; letter-spacing: -0.02em;
                }
                .stat-label {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
                    text-transform: uppercase; color: rgba(255,255,255,0.38); margin-top: 2px;
                }

                /* bottom strip */
                .about-strip {
                    position: relative; z-index: 2;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding: 24px 48px;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px;
                    max-width: 1360px; margin: 0 auto;
                }
                .strip-text {
                    font-size: 12px; font-weight: 400;
                    color: rgba(255,255,255,0.28); letter-spacing: 0.06em;
                }
                .strip-badges { display: flex; gap: 10px; flex-wrap: wrap; }
                .strip-badge {
                    padding: 6px 14px; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px; font-size: 11px; font-weight: 500;
                    color: rgba(255,255,255,0.38); letter-spacing: 0.06em;
                    transition: border-color 0.2s, color 0.2s; cursor: default;
                    display: flex; align-items: center; gap: 6px;
                    position: relative;
                }
                .strip-badge:hover { border-color: var(--gold); color: var(--gold); }

                /* badge tooltip */
                .badge-tooltip {
                    position: absolute;
                    bottom: calc(100% + 14px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: 270px;
                    background: rgba(11,11,16,0.97);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(201,168,76,0.35);
                    border-radius: 14px;
                    padding: 16px 18px;
                    pointer-events: none;
                    z-index: 200;
                    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08) inset;
                }

                .badge-tooltip-title {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    color: var(--gold);
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    font-family: 'Outfit', sans-serif;
                }
                .badge-tooltip-desc {
                    font-size: 12px;
                    font-weight: 300;
                    color: rgba(255,255,255,0.62);
                    line-height: 1.65;
                    margin: 0;
                    font-family: 'Outfit', sans-serif;
                }

                /* ── RESPONSIVE ─────────────────────────────────── */
                @media (max-width: 1024px) {
                    .about-inner { gap: 0 48px; padding: 80px 32px 60px; }
                }

                @media (max-width: 768px) {
                    .about-inner {
                        grid-template-columns: 1fr;
                        gap: 48px;
                        padding: 72px 20px 52px;
                    }
                    .about-h2 { font-size: clamp(32px, 9vw, 56px); }
                    .about-sub { font-size: 14px; max-width: 100%; margin-bottom: 28px; }
                    .pillars { margin-bottom: 32px; }
                    .pillar-card { padding: 14px 16px; gap: 14px; }
                    .cta-row { flex-direction: column; }
                    .btn-primary, .btn-ghost { width: 100%; text-align: center; justify-content: center; padding: 14px 24px; }
                    .right-col { gap: 20px; }
                    .stat-chip { padding: 18px 16px 14px; }
                    .about-strip {
                        flex-direction: column; align-items: flex-start;
                        padding: 20px 20px; gap: 14px;
                    }
                    .strip-badges { gap: 8px; }
                    .strip-badge { font-size: 10px; padding: 5px 10px; }
                    .strip-badge img { height: 40px !important; }
                }

                @media (max-width: 480px) {
                    .about-inner { padding: 64px 16px 44px; gap: 36px; }
                    .eyebrow { font-size: 9px; }
                    .about-h2 { font-size: clamp(28px, 10vw, 44px); }
                    .img-badge { padding: 10px 12px; gap: 8px; }
                    .badge-text-bot { font-size: 12px; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .stat-chip { padding: 14px 12px 12px; }
                    .stat-val { font-size: clamp(22px, 6vw, 32px); }
                    .stat-label { font-size: 9px; }
                    .strip-badge img { height: 30px !important; }
                }
            `}</style>

            {/* ── Video background ───────────────────────────────── */}
            <div className="about-video-wrap">
                <video src="/video/about.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="about-grain" />

            {/* ── Main grid ──────────────────────────────────────── */}
            <div className="about-inner">
                {/* LEFT ─ text */}
                <div>
                    <motion.div
                        className="eyebrow"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="eyebrow-line" />
                        About EmpireOne BPO Solutions Inc.
                    </motion.div>

                    <motion.h2
                        className="about-h2"
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            duration: 0.75,
                            delay: 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        Your Trusted
                        <br />
                        Partner in
                        <br />
                        <em>Business Excellence</em>
                    </motion.h2>

                    <motion.p
                        className="about-sub"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        At EmpireOne, we deliver world-class BPO solutions that
                        help businesses optimize operations, reduce costs, and
                        scale efficiently — from customer support to back-office
                        operations, across the globe.
                    </motion.p>

                    {/* Pillars */}
                    <div className="pillars">
                        {pillars.map((p, i) => (
                            <PillarCard key={p.num} {...p} index={i} />
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        className="cta-row"
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <motion.button
                            className="btn-primary"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Explore More
                        </motion.button>
                        <motion.a
                            href="#contact"
                            className="btn-ghost"
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Contact Us →
                        </motion.a>
                    </motion.div>
                </div>

                {/* RIGHT ─ image + stats */}
                <div className="right-col">
                    {/* Image */}
                    <motion.div
                        className="img-frame-outer"
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.85,
                            delay: 0.18,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="img-corner tl" />
                        <div className="img-corner br" />

                        <div className="img-frame">
                            <motion.img
                                src="/images/image-200.png"
                                alt="Team collaborating"
                                style={{ y: imgY }}
                            />
                            {/* overlay badge */}
                            <div className="img-badge">
                                <span className="badge-dot" />
                                <div>
                                    <div className="badge-text-top">
                                        Currently hiring
                                    </div>
                                    <div className="badge-text-bot">
                                        Join our global team
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Gold divider */}
                    <motion.div
                        className="gold-rule"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ transformOrigin: "left" }}
                    />

                    {/* Stats */}
                    <motion.div
                        className="stats-grid"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {stats.map((s, i) => (
                            <StatChip key={s.label} {...s} delay={i * 120} />
                        ))}
                    </motion.div>
                </div>
            </div>
            <motion.div
                className="about-strip"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <span className="strip-text">
                    EmpireOne BPO · Trusted Worldwide
                </span>
                <div className="strip-badges">
                    {badgeDetails.map((b) => (
                        <BadgeItem key={b.label} {...b} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
