import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook ──────────────────────────────
function useInView(threshold = 0.18) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
}

// ── Animated wrapper ────────────────────────────────────────
function Reveal({ children, delay = 0, from = "bottom", className = "" }) {
    const [ref, inView] = useInView();
    const base = "transition-all duration-700 ease-out";
    const hidden =
        from === "right"
            ? "opacity-0 translate-x-8"
            : "opacity-0 translate-y-6";
    const visible =
        from === "right"
            ? "opacity-100 translate-x-0"
            : "opacity-100 translate-y-0";
    return (
        <div
            ref={ref}
            className={`${base} ${inView ? visible : hidden} ${className}`}
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

// ── SVG Icons ───────────────────────────────────────────────
const IconPin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const IconPhone = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.69 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconMail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);
const IconClock = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CONTACT_DATA = {
    addresses: [
        {
            country: "Canada",
            tag: "Headquarter",
            address: "250 Consumers Rd suite 810, Toronto, ON M2J 4V6",
        },
        {
            country: "Philippines",
            tag: "Site 1",
            address: "EmpireOne Bldg Gen. Luna St Poblacion II Carcar City, Cebu 6014",
        },
        {
            country: "Philippines",
            tag: "Site 2",
            address: "EmpireOne Bldg., S. Carmona St., Barangay 6, San Carlos City, Negros Occidental, 6127",
        },
        {
            country: "Philippines",
            tag: "Site 3",
            address: "Unit 806 FLB Corporate Center Bohol Avenue Cebu Business Park Cebu City, Cebu 6000",
        },
        {
            country: "Colombia",
            tag: "Site 1",
            address: "Calle 15 No. 4 - 81 Piso 10, Edificio del Cafe, Santa Marta, Magdalena.",
        },
    ],
    phone: "800-233-0843",
    emails: ["hiring@empireonegroup.com", "career@empireonegroup.com"],
    officeHours: ["Open 24 Hours a Day, 7 Days a Week"],
};

export default function ContactSection() {
    const contactItems = [
        {
            icon: <IconPhone />,
            label: "Phone Number",
            color: "from-purple-500 via-pink-500 to-orange-500",
            content: (
                <a
                    href={`tel:${CONTACT_DATA.phone}`}
                    className="text-sm sm:text-base font-medium text-white/70 hover:text-orange-400 transition-colors"
                >
                    {CONTACT_DATA.phone}
                </a>
            ),
        },
        {
            icon: <IconMail />,
            label: "Email Address",
            color: "from-purple-500 via-pink-500 to-orange-500",
            content: (
                <div className="space-y-1">
                    {CONTACT_DATA.emails.map((email, i) => (
                        <a
                            key={i}
                            href={`mailto:${email}`}
                            className="block text-sm sm:text-base font-medium text-white/70 hover:text-purple-400 transition-colors break-all"
                        >
                            {email}
                        </a>
                    ))}
                </div>
            ),
        },
        {
            icon: <IconClock />,
            label: "Office Hours",
            color: "from-purple-500 via-pink-500 to-orange-500",
            content: CONTACT_DATA.officeHours.map((h, i) => (
                <p key={i} className="text-sm sm:text-base font-medium text-white/70">
                    {h}
                </p>
            )),
        },
    ];

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative overflow-hidden py-24 lg:py-32 bg-[#06060c] text-white"
        >
            {/* Background ambient glowing nodes */}
            <div className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full -top-40 -left-32 pointer-events-none" />
            <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[130px] rounded-full top-1/3 -right-24 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <Reveal delay={0}>
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-purple-500/10 border border-purple-500/30 text-purple-400">
                            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                            Get In Touch
                        </div>
                        <h2 id="contact-heading" className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                                Global Contact Hub
                            </span>
                        </h2>
                        <p className="text-white/50 text-base max-w-md mx-auto">
                            Reach out to any of our dedicated operating centers or global offices anytime.
                        </p>
                    </div>
                </Reveal>

                {/* Split Operational Architecture Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT TWO COLUMNS: Location Matrix Card */}
                    <div className="lg:col-span-2">
                        <Reveal delay={100} from="bottom">
                            <div className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
                                <div className="flex items-center gap-3.5 mb-8 border-b border-white/10 pb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                        <IconPin />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-xl text-white/90">Our Global Offices</h3>
                                        <p className="text-xs text-white/40">Cross-continental operations & facilities</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {CONTACT_DATA.addresses.map((loc, i) => (
                                        <div
                                            key={i}
                                            className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-base font-bold text-white/90 group-hover:text-purple-400 transition-colors">
                                                    {loc.country}
                                                </h4>
                                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 uppercase tracking-wider group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-orange-500 group-hover:text-white transition-all">
                                                    {loc.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                                                {loc.address}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* RIGHT ONE COLUMN: Standard Contact Handles */}
                    <div className="flex flex-col gap-4">
                        {contactItems.map(({ icon, label, color, content }, i) => (
                            <Reveal
                                key={label}
                                delay={150 + i * 80}
                                from="right"
                            >
                                <div className="group flex items-start gap-4 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/[0.08] p-5 sm:p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 shadow-xl">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-105 transition-transform`}
                                    >
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white/40 text-xs uppercase tracking-widest mb-1">
                                            {label}
                                        </p>
                                        <div className="break-words">
                                            {content}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}