import { motion } from "framer-motion";

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
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Services", href: "/services" },
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
            href: "#",
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
            href: "#",
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
            href: "#",
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
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* TOP GRID */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={fadeUp}
                    custom={0.06}
                    className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14"
                >
                    {/* BRAND */}
                    <div className="md:col-span-1">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-5">
                            <img
                                src="/images/eo-full-logo.png"
                                alt="EmpireOne Logo"
                                className="h-8 sm:h-10 w-auto object-contain"
                            />
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Empowering businesses with innovative IT solutions,
                            robust cybersecurity, and scalable cloud
                            infrastructure for the digital age.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    aria-label={s.name}
                                    className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="text-white font-semibold text-base mb-5">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li
                                    key={link.name}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* OUR SERVICES */}
                    <div>
                        <h4 className="text-white font-semibold text-base mb-5">
                            Our Services
                        </h4>
                        <ul className="space-y-3">
                            {services.map((s) => (
                                <li
                                    key={s.name}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                    <a
                                        href={s.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {s.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h4 className="text-white font-semibold text-base mb-3">
                            Newsletter
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-5">
                            Subscribe to our newsletter to get the latest
                            updates and news.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-all duration-200"
                            >
                                Subscribe Now
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* DIVIDER */}
                <div className="border-t border-slate-700/60" />

                {/* BOTTOM */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.8 }}
                    variants={fadeUp}
                    custom={0.12}
                    className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
                >
                    <p className="text-xs text-slate-500">
                        © {year} EmpireOne. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <a
                            href="/privacy-policy"
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
