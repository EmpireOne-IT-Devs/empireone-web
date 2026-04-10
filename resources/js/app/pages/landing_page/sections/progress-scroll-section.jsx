import { useEffect, useState, useRef } from "react";

const SECTIONS = [
    { id: "hero", label: "Home", color: "#7C3AED" },
    { id: "about-us", label: "About", color: "#3B82F6" },
    { id: "services", label: "Services", color: "#F97316" },
    { id: "contact", label: "Contact", color: "#7C3AED" },
];

export default function ProgressScrollSection() {
    const [scrollPct, setScrollPct] = useState(0);
    const [activeId, setActiveId] = useState("hero");
    const [visible, setVisible] = useState(false);
    const [dotHover, setDotHover] = useState(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const rafRef = useRef(null);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const updateViewport = (event) => {
            setIsDesktop(event.matches);
        };

        updateViewport(media);
        media.addEventListener("change", updateViewport);

        return () => media.removeEventListener("change", updateViewport);
    }, []);

    /* ── scroll handler ── */
    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docH =
                    document.documentElement.scrollHeight - window.innerHeight;
                const pct =
                    docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0;
                setScrollPct(pct);
                setVisible(scrollTop > 80);

                // determine active section
                let current = SECTIONS[0].id;
                for (const sec of SECTIONS) {
                    const el = document.getElementById(sec.id);
                    if (el) {
                        const top = el.getBoundingClientRect().top;
                        if (top <= window.innerHeight * 0.45) current = sec.id;
                    }
                }
                setActiveId(current);
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const activeSection =
        SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

    return (
        <>
            {/* ══════════════════════════════════════════
                TOP PROGRESS BAR
            ══════════════════════════════════════════ */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    zIndex: 9999,
                    background: "rgba(0,0,0,0.08)",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${scrollPct}%`,
                        background:
                            "linear-gradient(90deg, #7C3AED, #3B82F6 50%, #F97316)",
                        borderRadius: "0 2px 2px 0",
                        transition: "width 0.08s linear",
                        boxShadow:
                            "0 0 10px rgba(124,58,237,0.55), 0 0 20px rgba(249,115,22,0.25)",
                        position: "relative",
                    }}
                >
                    {/* glowing tip */}
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#F97316",
                            boxShadow: "0 0 8px #F97316, 0 0 16px #FB923C",
                            opacity: scrollPct > 1 ? 1 : 0,
                            transition: "opacity 0.2s",
                        }}
                    />
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SIDE DOT NAVIGATOR
            ══════════════════════════════════════════ */}
            {isDesktop && (
                <nav
                    aria-label="Page sections"
                    style={{
                        position: "fixed",
                        right: 24,
                        top: "50%",
                        transform: `translateY(-50%) translateX(${visible ? 0 : 48}px)`,
                        zIndex: 9000,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        alignItems: "flex-end",
                        transition:
                            "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
                        opacity: visible ? 1 : 0,
                        pointerEvents: visible ? "auto" : "none",
                    }}
                >
                    {SECTIONS.map((sec) => {
                        const isActive = activeId === sec.id;
                        const isHovered = dotHover === sec.id;

                        return (
                            <button
                                key={sec.id}
                                onClick={() => scrollTo(sec.id)}
                                onMouseEnter={() => setDotHover(sec.id)}
                                onMouseLeave={() => setDotHover(null)}
                                aria-label={`Go to ${sec.label}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "2px 0",
                                    flexDirection: "row",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: isActive
                                            ? "#fff"
                                            : "rgba(255,255,255,0.55)",
                                        whiteSpace: "nowrap",
                                        opacity: isHovered || isActive ? 1 : 0,
                                        transform:
                                            isHovered || isActive
                                                ? "translateX(0)"
                                                : "translateX(6px)",
                                        transition: "all 0.22s ease",
                                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {sec.label}
                                </span>

                                <div
                                    style={{
                                        flexShrink: 0,
                                        width: isActive ? 8 : isHovered ? 7 : 6,
                                        height: isActive ? 24 : isHovered ? 9 : 6,
                                        borderRadius: isActive ? 4 : "50%",
                                        background: isActive
                                            ? `linear-gradient(180deg, ${sec.color}, #3B82F6)`
                                            : isHovered
                                              ? "rgba(255,255,255,0.6)"
                                              : "rgba(255,255,255,0.3)",
                                        boxShadow: isActive
                                            ? `0 0 10px ${sec.color}80`
                                            : "none",
                                        transition:
                                            "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                        border: isActive
                                            ? "none"
                                            : "1px solid rgba(255,255,255,0.2)",
                                    }}
                                />
                            </button>
                        );
                    })}
                </nav>
            )}

            {/* ══════════════════════════════════════════
                BOTTOM STATUS BAR
            ══════════════════════════════════════════ */}
        </>
    );
}
