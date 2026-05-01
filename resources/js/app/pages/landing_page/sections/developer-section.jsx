import React, { useEffect, useRef, useState, useCallback, memo } from "react";

/* ── Constants ──────────────────────────────── */
const CARD_W = 280;
const GAP    = 24;

/* ── Team data ──────────────────────────────── */
const teamMembers = [
    {
        name:     "Quickly De Guzman",
        role:     "Full-Stack Developer",
        initials: "QD",
        img:      "/images/2.png",
        accent:   "purple",
        bio:      "Building scalable, high-performance systems with seamless user experiences. With a strong focus on clean architecture and modern technologies, I turn complex ideas into reliable and intuitive digital solutions.",
        skills:   ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
        socials:  { github: "https://github.com/", linkedin: "https://linkedin.com/", facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    },
    {
        name:     "Wacky Hojilla",
        role:     "Web Developer",
        initials: "WH",
        img:      "/images/4.png",
        accent:   "orange",
        bio:      "I build modern web experiences that are fast, functional, and designed to stand out — focused on performance, clean code, and seamless user interactions.",
        skills:   ["Vue.js", "CSS/SCSS", "JavaScript", "Webpack", "Figma"],
        socials:  { github: "https://github.com/", linkedin: "https://linkedin.com/", facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    },
    {
        name:     "Marlou Pepito",
        role:     "Senior Full-Stack Developer",
        initials: "MP",
        img:      "/images/1.png",
        accent:   "blue",
        bio:      "Specializing in crafting robust, scalable applications from end to end. I combine technical expertise with thoughtful design to deliver systems that are fast, reliable, and built for real-world impact.",
        skills:   ["React", "Laravel", "MySQL", "Redis", "AWS"],
        socials:  { github: "https://github.com/", linkedin: "https://linkedin.com/", facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    },
    {
        name:     "Christ Vein Cabalida",
        role:     "UX/UI Designer",
        initials: "CC",
        img:      "/images/3.png",
        accent:   "purple",
        bio:      "Turning ideas into seamless, visually compelling experiences — where simplicity, function, and style all work together to create intuitive and engaging user journeys.",
        skills:   ["Figma", "Prototyping", "Design Systems", "Framer", "Illustrator"],
        socials:  { github: "https://github.com/", linkedin: "https://linkedin.com/", facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    },
    {
        name:     "Snickers Jay Magbanua",
        role:     "Mobile Developer",
        initials: "SM",
        img:      "/images/5.png",
        accent:   "orange",
        bio:      "Building mobile experiences that combine performance, clean design, and usability — crafted for users on the go with a focus on speed, scalability, and intuitive user flows.",
        skills:   ["React Native", "Flutter", "iOS", "Android", "Firebase"],
        socials:  { github: "https://github.com/", linkedin: "https://linkedin.com/", facebook: "https://facebook.com/", instagram: "https://instagram.com/" },
    },
];

/* ── Accent palette ─────────────────────────── */
const PALETTE = {
    purple: {
        neon:       "#a855f7",
        glow:       "0 0 28px rgba(168,85,247,0.6), 0 0 70px rgba(168,85,247,0.2)",
        ring:       "rgba(168,85,247,0.65)",
        gradient:   "linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)",
        conic:      "conic-gradient(#a855f7, transparent 60%, #a855f7)",
        badge:      { background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.35)" },
        skillBg:    "rgba(168,85,247,0.1)",
        skillBorder:"rgba(168,85,247,0.28)",
        skillColor: "#c084fc",
    },
    orange: {
        neon:       "#f97316",
        glow:       "0 0 28px rgba(249,115,22,0.6), 0 0 70px rgba(249,115,22,0.2)",
        ring:       "rgba(249,115,22,0.65)",
        gradient:   "linear-gradient(135deg,#ea580c 0%,#f97316 100%)",
        conic:      "conic-gradient(#f97316, transparent 60%, #f97316)",
        badge:      { background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.35)" },
        skillBg:    "rgba(249,115,22,0.1)",
        skillBorder:"rgba(249,115,22,0.28)",
        skillColor: "#fb923c",
    },
    blue: {
        neon:       "#3b82f6",
        glow:       "0 0 28px rgba(59,130,246,0.6), 0 0 70px rgba(59,130,246,0.2)",
        ring:       "rgba(59,130,246,0.65)",
        gradient:   "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)",
        conic:      "conic-gradient(#3b82f6, transparent 60%, #3b82f6)",
        badge:      { background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.35)" },
        skillBg:    "rgba(59,130,246,0.1)",
        skillBorder:"rgba(59,130,246,0.28)",
        skillColor: "#60a5fa",
    },
};

/* ── SVG social icons ───────────────────────── */
const Icons = {
    github: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    ),
    linkedin: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    facebook: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    instagram: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
};

/* ── Global styles (injected once) ─────────── */
function useStyles() {
    useEffect(() => {
        const id = "ds-styles-v4";
        if (document.getElementById(id)) return;
        const el = document.createElement("style");
        el.id = id;
        el.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
            .ds-wrap * { box-sizing: border-box; font-family: 'Space Grotesk', sans-serif; }

            @keyframes ds-spin  { to { transform: rotate(360deg); } }
            @keyframes ds-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            @keyframes ds-dot   { 0%,100% { opacity:1; box-shadow:0 0 6px #22c55e; } 50% { opacity:.35; box-shadow:0 0 2px #22c55e; } }
            @keyframes ds-back-in { from { opacity:0; transform:rotateY(180deg) translateY(10px); } to { opacity:1; transform:rotateY(180deg) translateY(0); } }

            /* 3-D flip */
            .ds-card { perspective: 1000px; }
            .ds-flip {
                position: relative; width: 100%; height: 100%;
                transform-style: preserve-3d;
                transition: transform 0.58s cubic-bezier(0.4,0,0.2,1);
            }
            .ds-card:hover .ds-flip { transform: rotateY(180deg); }
            .ds-face {
                position: absolute; inset: 0;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                border-radius: 22px; overflow: hidden;
            }
            .ds-back { transform: rotateY(180deg); }
            .ds-back-content { animation: ds-back-in 0.35s ease 0.25s both; }

            /* Social icon */
            .ds-soc {
                width: 32px; height: 32px; border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.12);
                color: rgba(255,255,255,0.5);
                text-decoration: none;
                transition: background .2s, color .2s, transform .2s;
            }
            .ds-soc:hover {
                background: rgba(255,255,255,0.18) !important;
                color: #fff !important;
                transform: translateY(-3px) scale(1.12);
            }
            /* Arrow nav */
            .ds-arrow { transition: background .2s, border-color .2s, transform .15s; }
            .ds-arrow:hover {
                background: rgba(168,85,247,0.22) !important;
                border-color: rgba(168,85,247,0.55) !important;
                color: #fff !important;
            }
            .ds-arrow:active { transform: scale(0.92); }
            /* Dot */
            .ds-dot { transition: width .3s ease, background .3s ease; border: none; cursor: pointer; padding: 0; }
        `;
        document.head.appendChild(el);
    }, []);
}

/* ── Single flip card ───────────────────────── */
const TeamCard = memo(function TeamCard({ member, floatDelay }) {
    const [imgErr, setImgErr] = useState(false);
    const p = PALETTE[member.accent] ?? PALETTE.purple;

    return (
        <div
            className="ds-card"
            style={{
                width: CARD_W,
                height: 410,
                flexShrink: 0,
                cursor: "pointer",
                animation: `ds-float ${3.5 + floatDelay}s ease-in-out infinite`,
                animationDelay: `${floatDelay}s`,
            }}
        >
            <div className="ds-flip">

                {/* ══ FRONT ══ */}
                <div
                    className="ds-face"
                    style={{
                        background: "linear-gradient(155deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.02) 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem 1.5rem",
                    }}
                >
                    {/* Top neon bar */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: p.gradient, borderRadius: "22px 22px 0 0",
                    }} />

                    {/* Spinning ring + avatar */}
                    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                        <div style={{
                            position: "absolute", inset: -4, borderRadius: "50%",
                            background: p.conic,
                            animation: "ds-spin 3.5s linear infinite",
                        }} />
                        <div style={{
                            width: 100, height: 100, borderRadius: "50%",
                            background: p.gradient,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 30, fontWeight: 800, color: "#fff",
                            position: "relative", zIndex: 1, overflow: "hidden",
                            boxShadow: p.glow,
                        }}>
                            {imgErr ? member.initials : (
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    onError={() => setImgErr(true)}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8, lineHeight: 1.3 }}>
                        {member.name}
                    </p>

                    {/* Role badge */}
                    <span style={{
                        fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        padding: "4px 14px", borderRadius: 100,
                        marginBottom: "1.8rem",
                        ...p.badge,
                    }}>
                        {member.role}
                    </span>

                    {/* Neon divider */}
                    <div style={{ width: 40, height: 2, borderRadius: 2, background: p.gradient, marginBottom: "1.25rem" }} />

                    {/* Online dot */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                            animation: "ds-dot 2s ease infinite", flexShrink: 0,
                        }} />
                        Available for projects
                    </div>

                    {/* Hint */}
                    <p style={{
                        position: "absolute", bottom: 14,
                        fontSize: 9.5, color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>
                        Hover to view profile ↑
                    </p>
                </div>

                {/* ══ BACK ══ */}
                <div
                    className="ds-face ds-back"
                    style={{
                        background: "linear-gradient(155deg,rgba(8,4,18,0.97) 0%,rgba(4,6,16,0.99) 100%)",
                        backdropFilter: "blur(24px)",
                        border: `1px solid ${p.ring}`,
                        boxShadow: p.glow,
                        display: "flex",
                        flexDirection: "column",
                        padding: "1.6rem 1.4rem 1.4rem",
                    }}
                >
                    {/* Top bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.gradient, borderRadius: "22px 22px 0 0" }} />

                    <div className="ds-back-content" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        {/* Name + role */}
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{member.name}</p>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: p.neon, marginBottom: "0.85rem" }}>
                            {member.role}
                        </p>

                        {/* Bio */}
                        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, flex: 1, marginBottom: "0.85rem" }}>
                            {member.bio}
                        </p>

                        {/* Skills */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.9rem" }}>
                            {member.skills.map((s) => (
                                <span key={s} style={{
                                    fontSize: 9.5, fontWeight: 600,
                                    padding: "3px 9px", borderRadius: 6,
                                    background: p.skillBg,
                                    color: p.skillColor,
                                    border: `1px solid ${p.skillBorder}`,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Socials */}
                        <div style={{ display: "flex", gap: 8, paddingTop: "0.7rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            {Object.entries(member.socials).map(([key, href]) =>
                                Icons[key] ? (
                                    <a
                                        key={key}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={key}
                                        className="ds-soc"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {Icons[key]}
                                    </a>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

/* ── Main carousel ──────────────────────────── */
export default function DeveloperCarousel() {
    useStyles();

    const TOTAL    = teamMembers.length;
    const trackRef = useRef(null);
    const wrapRef  = useRef(null);
    const curRef   = useRef(0);
    const dragX    = useRef(null);

    const [current, setCurrent] = useState(0);
    const [paused,  setPaused]  = useState(false);

    const goTo = useCallback((i) => {
        const next = ((i % TOTAL) + TOTAL) % TOTAL;
        curRef.current = next;
        setCurrent(next);
    }, [TOTAL]);

    const applyTransform = useCallback(() => {
        const track = trackRef.current;
        const wrap  = wrapRef.current;
        if (!track || !wrap) return;
        const offset = -(curRef.current * (CARD_W + GAP)) + (wrap.offsetWidth - CARD_W) / 2;
        track.style.transform = `translate3d(${offset}px,0,0)`;
        Array.from(track.children).forEach((c, i) => {
            const d = Math.abs(i - curRef.current);
            c.style.opacity   = d === 0 ? "1" : d === 1 ? "0.5" : "0.22";
            c.style.filter    = d === 0 ? "none" : "brightness(0.45)";
            c.style.transform = d === 0 ? "scale(1.06)" : "scale(1)";
        });
    }, []);

    useEffect(() => { applyTransform(); }, [current, applyTransform]);

    useEffect(() => {
        window.addEventListener("resize", applyTransform);
        return () => window.removeEventListener("resize", applyTransform);
    }, [applyTransform]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => goTo(curRef.current + 1), 3200);
        return () => clearInterval(id);
    }, [paused, goTo, current]);

    const onDown = useCallback((e) => {
        dragX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
    }, []);
    const onUp = useCallback((e) => {
        if (dragX.current === null) return;
        const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragX.current;
        const diff = dragX.current - x;
        if (Math.abs(diff) > 50) goTo(curRef.current + (diff > 0 ? 1 : -1));
        dragX.current = null;
    }, [goTo]);

    const progress = Math.round(((current + 1) / TOTAL) * 100);

    return (
        <section
            className="ds-wrap"
            style={{
                background: "#07090f",
                padding: "72px 0 56px",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Ambient neon blobs */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background:
                    "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(139,92,246,0.22) 0%, transparent 65%)," +
                    "radial-gradient(ellipse 45% 40% at 5%  90%, rgba(249,115,22,0.14) 0%, transparent 60%)," +
                    "radial-gradient(ellipse 40% 40% at 95% 80%, rgba(59,130,246,0.16) 0%, transparent 60%)",
            }} />

            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: "3.5rem", position: "relative", zIndex: 2, padding: "0 1rem" }}>
                <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "#a855f7", marginBottom: 12,
                }}>
                    Developer Team
                </p>
                <h2 style={{
                    fontSize: "clamp(26px,4vw,44px)", fontWeight: 800,
                    color: "#fff", lineHeight: 1.2, marginBottom: 14,
                }}>
                    Meet the people behind the system
                </h2>
                <p style={{
                    fontSize: 13, color: "rgba(255,255,255,0.45)",
                    maxWidth: 460, margin: "0 auto", lineHeight: 1.8,
                }}>
                    A diverse team of specialists who bring deep expertise across the full development lifecycle.
                </p>
            </div>

            {/* Carousel track */}
            <div
                ref={wrapRef}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onMouseDown={onDown}
                onMouseUp={onUp}
                onTouchStart={onDown}
                onTouchEnd={onUp}
                style={{ overflow: "hidden", cursor: "grab", padding: "16px 0 28px", position: "relative", zIndex: 2 }}
            >
                <div
                    ref={trackRef}
                    style={{
                        display: "flex",
                        gap: GAP,
                        transition: "transform 0.52s cubic-bezier(0.4,0,0.2,1)",
                        willChange: "transform",
                    }}
                >
                    {teamMembers.map((m, i) => (
                        <div
                            key={m.name}
                            onClick={() => goTo(i)}
                            style={{ transition: "opacity .4s ease, filter .4s ease, transform .4s ease", flexShrink: 0 }}
                        >
                            <TeamCard member={m} floatDelay={i * 0.4} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                height: 2, background: "rgba(255,255,255,0.07)",
                borderRadius: 2, margin: "0 2.5rem", overflow: "hidden", position: "relative", zIndex: 2,
            }}>
                <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg,#7c3aed,#a855f7,#f97316)",
                    borderRadius: 2, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                }} />
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.25rem", position: "relative", zIndex: 2 }}>
                {teamMembers.map((m, i) => (
                    <button
                        key={i}
                        className="ds-dot"
                        onClick={() => goTo(i)}
                        aria-label={`Card ${i + 1}`}
                        style={{
                            width: i === current ? 26 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: i === current
                                ? (PALETTE[m.accent]?.neon ?? "#a855f7")
                                : "rgba(255,255,255,0.18)",
                        }}
                    />
                ))}
            </div>

            {/* Arrow navigation */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "1rem", position: "relative", zIndex: 2 }}>
                {[-1, 1].map((delta) => (
                    <button
                        key={delta}
                        className="ds-arrow"
                        aria-label={delta < 0 ? "Previous" : "Next"}
                        onClick={() => goTo(current + delta)}
                        style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.55)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, fontWeight: 600,
                        }}
                    >
                        {delta < 0 ? "←" : "→"}
                    </button>
                ))}
            </div>
        </section>
    );
}
