import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.68,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const logos = [
    { id: 1, name: "BBB", src: "/images/BBB-logo.png" },
    { id: 2, name: "SOC2", src: "/images/SOC2-Logo.png" },
    { id: 3, name: "PCI", src: "/images/PCI-Logo.png" },
    { id: 4, name: "ISO", src: "/images/ISO-Logo.png" },
    { id: 5, name: "HIPAA", src: "/images/HIPAA-Logo.png" },
    { id: 6, name: "GDPR", src: "/images/GDPR-Logo.png" },
];

const track = [...logos, ...logos, ...logos];
const SPEED = 38;

export default function CarouselSection() {
    const [paused, setPaused] = useState(false);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .cs-root {
          width: 100%;
          padding: 100px 0 90px;
          background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle dot grid */
        .cs-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(59,130,246,0.12) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 100%);
          pointer-events: none;
        }

        /* Top center radial glow */
        .cs-glow {
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Bottom wave decoration */
        .cs-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(59,130,246,0.06), transparent);
          pointer-events: none;
        }

        /* ── Header ── */
        .cs-header {
          position: relative;
          text-align: center;
          margin-bottom: 20px;
          z-index: 2;
        }

        .cs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 100px;
          border: 1px solid rgba(59,130,246,0.25);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(59,130,246,0.08);
        }

        .cs-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59,130,246,0.7);
          animation: cs-pulse 2s ease-in-out infinite;
        }

        @keyframes cs-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .cs-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }

        .cs-title span {
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .cs-rule {
          width: 64px;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #60a5fa, #93c5fd);
          border-radius: 99px;
          margin: 20px auto 32px;
          box-shadow: 0 2px 8px rgba(37,99,235,0.25);
        }

        .cs-subtitle {
          color: #475569;
          font-size: 1.0625rem;
          max-width: 480px;
          margin: 0 auto 64px;
          line-height: 1.7;
          font-weight: 400;
        }

        /* ── Carousel track ── */
        .cs-track-wrap {
          position: relative;
          height: 160px;
          display: flex;
          align-items: center;
          z-index: 2;
        }

        .cs-track-wrap::before,
        .cs-track-wrap::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 200px;
          z-index: 4;
          pointer-events: none;
        }
        .cs-track-wrap::before {
          left: 0;
          background: linear-gradient(to right, #f0f7ff 0%, #e6f2ff 20%, transparent 100%);
        }
        .cs-track-wrap::after {
          right: 0;
          background: linear-gradient(to left, #f0f7ff 0%, #e6f2ff 20%, transparent 100%);
        }

        .cs-track {
          display: flex;
          align-items: center;
          width: max-content;
          gap: 20px;
          padding: 12px 20px;
          animation: cs-marquee ${SPEED}s linear infinite;
          will-change: transform;
        }

        .cs-track.paused { animation-play-state: paused; }

        @keyframes cs-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        /* ── Badge card ── */
        .cs-badge {
          flex-shrink: 0;
          position: relative;
          width: 176px;
          height: 136px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 20px;
          cursor: pointer;
          background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
          border: 1px solid rgba(59,130,246,0.12);
          box-shadow:
            0 2px 8px rgba(59,130,246,0.06),
            0 1px 2px rgba(0,0,0,0.03);
          transition:
            transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
          overflow: hidden;
        }

        /* Shimmer sweep */
        .cs-badge::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255,255,255,0.8) 50%,
            transparent 65%
          );
          transform: skewX(-15deg);
          pointer-events: none;
        }
        .cs-badge:hover::after {
          left: 150%;
          transition: left 0.6s ease;
        }

        .cs-badge:hover {
          transform: translateY(-12px) scale(1.08);
          border-color: rgba(59,130,246,0.5);
          box-shadow:
            0 0 0 4px rgba(59,130,246,0.12),
            0 24px 48px rgba(59,130,246,0.18),
            0 8px 16px rgba(0,0,0,0.08);
        }

        /* Top-edge color accent on hover */
        .cs-badge-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa);
          border-radius: 20px 20px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cs-badge:hover .cs-badge-accent { transform: scaleX(1); }

        /* Inner top glow */
        .cs-badge-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(ellipse at 50% -15%, rgba(59,130,246,0.12) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .cs-badge:hover .cs-badge-glow { opacity: 1; }

        .cs-badge img {
          height: 64px;
          width: auto;
          object-fit: contain;
          filter: opacity(0.7) saturate(0.6);
          transition: filter 0.35s ease, transform 0.35s ease;
          position: relative;
          z-index: 1;
        }
        .cs-badge:hover img {
          filter: opacity(1) saturate(1.2);
          transform: scale(1.08);
        }

        .cs-badge-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          transition: color 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .cs-badge:hover .cs-badge-label { color: #1d4ed8; }

        /* ── Stats row ── */
        .cs-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          margin-top: 72px;
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
          background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 24px;
          box-shadow: 0 4px 24px rgba(59,130,246,0.1);
          overflow: hidden;
        }

        .cs-stat {
          flex: 1;
          text-align: center;
          padding: 28px 20px;
          position: relative;
        }

        .cs-stat + .cs-stat::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(59,130,246,0.15);
        }

        .cs-stat-number {
          font-family: 'Montserrat', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cs-stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .cs-root { padding: 80px 0 64px; }
          .cs-title { font-size: clamp(1.75rem, 6vw, 2.5rem); }
          .cs-badge { width: 144px; height: 112px; }
          .cs-badge img { height: 52px; }
          .cs-track-wrap { height: 124px; }
          .cs-track-wrap::before,
          .cs-track-wrap::after { width: 100px; }
          .cs-stats { margin: 48px 16px 0; flex-direction: column; gap: 0; }
          .cs-stat { border-bottom: 1px solid rgba(59,130,246,0.15); }
          .cs-stat:last-child { border-bottom: none; }
          .cs-stat + .cs-stat::before { display: none; }
          .cs-stat-number { font-size: 1.5rem; }
        }
      `}</style>

            <section className="cs-root">
                <div className="cs-glow" />
                <div className="cs-wave" />

                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.4 }}
                    variants={fadeUp}
                    custom={0.05}
                    className="cs-header"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.7 }}
                        variants={fadeUp}
                        custom={0.1}
                        className="cs-eyebrow"
                    >
                        <span className="cs-eyebrow-dot" />
                        Compliance &amp; Trust
                    </motion.div>
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.6 }}
                        variants={fadeUp}
                        custom={0.16}
                        className="cs-title"
                    >
                        Built on a foundation of <span>certified trust</span>
                    </motion.h2>
                    <div className="cs-rule" />
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.6 }}
                        variants={fadeUp}
                        custom={0.22}
                        className="cs-subtitle"
                    >
                        Every credential earned, every standard exceeded — so
                        your data stays protected.
                    </motion.p>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.25 }}
                    variants={fadeUp}
                    custom={0.28}
                    className="cs-track-wrap"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className={`cs-track ${paused ? "paused" : ""}`}>
                        {track.map((logo, i) => (
                            <div key={`${logo.id}-${i}`} className="cs-badge">
                                <div className="cs-badge-accent" />
                                <div className="cs-badge-glow" />
                                <img src={logo.src} alt={logo.name} />
                                <span className="cs-badge-label">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </>
    );
}
