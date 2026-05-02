import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
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

export default function FooterSection() {
    const year = new Date().getFullYear();

    const quickLinks = [
        { name: "Home", href: "#home" },
        { name: "About Us", href: "#about-us" },
         { name: "Testimonial", href: "#testimonial" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
    ];

    const services = [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms" },
    ];

    const socialLinks = [
        {
            name: "LinkedIn",
            href: "https://ca.linkedin.com/company/empireonebposolutions",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            ),
        },
        {
            name: "Twitter",
            href: "#",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/empireonebposolutionsinc",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
        },
        {
            name: "Instagram",
            href: "https://www.instagram.com/empireonebposolutions",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
        },
    ];

    return (
        <footer
            className="relative overflow-hidden px-5 pb-8 pt-16 sm:px-6"
            style={{ background: "#050816", colorScheme: "dark" }}
        >
            <div className="mx-auto max-w-7xl">
                {/* Ambient light orbs */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "-20%",
                            left: "-10%",
                            width: "52%",
                            height: "62%",
                            background:
                                "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 65%)",
                            filter: "blur(60px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "5%",
                            right: "-8%",
                            width: "42%",
                            height: "52%",
                            background:
                                "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 65%)",
                            filter: "blur(55px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "0%",
                            left: "28%",
                            width: "52%",
                            height: "48%",
                            background:
                                "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 65%)",
                            filter: "blur(55px)",
                        }}
                    />
                </div>
                {/* TOP GRID */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={fadeUp}
                    custom={0.06}
                    className="relative z-10 mb-14 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4"
                >
                    {/* BRAND */}
                    <div className="md:col-span-1">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-5">
                            <img
                                src="/images/eologo.png"
                                alt="EmpireOne Logo"
                                className="h-12 sm:h-12 w-auto object-contain"
                            />
                        </div>

                        <p
                            className="text-sm leading-relaxed mb-6"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            Delivering outstanding customer support, efficient
                            outsourcing solutions, and meaningful client
                            connections that drive business growth.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    aria-label={s.name}
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                                    style={{
                                        border: "1px solid rgba(124,58,237,0.5)",
                                        color: "rgba(168,85,247,0.7)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color =
                                            "rgb(251,146,60)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(249,115,22,0.7)";
                                        e.currentTarget.style.background =
                                            "rgba(249,115,22,0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color =
                                            "rgba(168,85,247,0.7)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(124,58,237,0.5)";
                                        e.currentTarget.style.background =
                                            "transparent";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4
                            className="font-semibold text-base mb-5"
                            style={{
                                background:
                                    "linear-gradient(90deg, #c084fc, #60a5fa)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li
                                    key={link.name}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #a78bfa, #60a5fa)",
                                        }}
                                    />
                                    <a
                                        href={link.href}
                                        className="text-sm transition-colors"
                                        style={{
                                            color: "rgba(255,255,255,0.52)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color =
                                                "rgb(251,146,60)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.color =
                                                "rgba(255,255,255,0.52)")
                                        }
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* OUR SERVICES */}
                    <div>
                        <h4
                            className="mb-5 text-base font-semibold"
                            style={{
                                background:
                                    "linear-gradient(90deg, #60a5fa, #fb923c)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Our Services
                        </h4>
                        <ul className="space-y-3">
                            {services.map((s) => (
                                <li
                                    key={s.name}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #60a5fa, #fb923c)",
                                        }}
                                    />
                                    <a
                                        href={s.href}
                                        className="text-sm transition-colors"
                                        style={{
                                            color: "rgba(255,255,255,0.52)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color =
                                                "rgb(251,146,60)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.color =
                                                "rgba(255,255,255,0.52)")
                                        }
                                    >
                                        {s.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h4
                            className="mb-3 text-base font-semibold"
                            style={{
                                background:
                                    "linear-gradient(90deg, #a78bfa, #f97316)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Newsletter
                        </h4>
                        <p
                            className="text-sm leading-relaxed mb-5"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            Subscribe to our newsletter to get the latest
                            updates and news.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(124,58,237,0.4)",
                                }}
                            />
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-lg text-sm transition-all duration-200"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #7c3aed, #2563eb, #ea580c)",
                                    boxShadow: "0 0 22px rgba(124,58,237,0.4)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.opacity = "0.85")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.opacity = "1")
                                }
                            >
                                Subscribe Now
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* DIVIDER */}
                <div
                    className="relative z-10"
                    style={{
                        height: "1px",
                        background:
                            "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(59,130,246,0.6), rgba(249,115,22,0.5), transparent)",
                    }}
                />

                {/* BOTTOM */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.8 }}
                    variants={fadeUp}
                    custom={0.12}
                    className="relative z-10 flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center"
                >
                    <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.32)" }}
                    >
                        © {year} EmpireOne. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:gap-6">
                        <a
                            href="/privacy-policy"
                            className="transition-colors"
                            style={{ color: "rgba(255,255,255,0.32)" }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "rgb(251,146,60)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "rgba(255,255,255,0.32)")
                            }
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms"
                            className="transition-colors"
                            style={{ color: "rgba(255,255,255,0.32)" }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "rgb(251,146,60)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "rgba(255,255,255,0.32)")
                            }
                        >
                            Terms of Service
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
