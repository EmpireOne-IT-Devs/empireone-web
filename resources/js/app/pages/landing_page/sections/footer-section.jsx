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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/empireonebposolutionsinc",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
        },
        {
            name: "Instagram",
            href: "https://www.instagram.com/empireonebposolutions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
        },
    ];

    return (
        <footer
            className="relative overflow-hidden px-5 pb-8 pt-16 sm:px-6 bg-[#050816]"
            style={{ colorScheme: "dark" }}
        >
            <div className="mx-auto max-w-7xl">
           
                <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
                    <div className="absolute top-[-20%] left-[-10%] w-[52%] h-[62%] bg-[radial-gradient(circle,rgba(124,58,237,0.3)_0%,transparent_65%)] blur-[60px]" />
                    <div className="absolute top-[5%] right-[-8%] w-[42%] h-[52%] bg-[radial-gradient(circle,rgba(249,115,22,0.2)_0%,transparent_65%)] blur-[55px]" />
                    <div className="absolute bottom-0 left-[28%] w-[52%] h-[48%] bg-[radial-gradient(circle,rgba(59,130,246,0.22)_0%,transparent_65%)] blur-[55px]" />
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={fadeUp}
                    custom={0.06}
                    className="relative z-10 mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {/* BRAND COL */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <img
                                    src="/images/eologo.png"
                                    alt="EmpireOne Logo"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed mb-6">
                                Delivering outstanding customer support, efficient outsourcing solutions, and meaningful client connections that drive business growth.
                            </p>
                        </div>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    aria-label={s.name}
                                    className="w-9 h-9 rounded-full flex items-center justify-center border border-purple-500/50 text-purple-400/70 transition-all duration-200 hover:text-orange-400 hover:border-orange-500/70 hover:bg-orange-500/10"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS COL */}
                    {/* <div>
                        <h4 className="font-semibold text-base mb-5 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-400 to-blue-400" />
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/50 transition-colors duration-200 hover:text-orange-400"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    {/* SERVICES COL */}
                    {/* <div>
                        <h4 className="font-semibold text-base mb-5 bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text">
                            Our Services
                        </h4>
                        <ul className="space-y-3">
                            {services.map((s) => (
                                <li key={s.name} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-400 to-orange-400" />
                                    <a
                                        href={s.href}
                                        className="text-sm text-white/50 transition-colors duration-200 hover:text-orange-400"
                                    >
                                        {s.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </motion.div>

                {/* DIVIDER */}
                <div className="relative z-10 h-[1px] bg-gradient-to-r from-transparent via-purple-500/70 via-blue-500/60 via-orange-500/50 to-transparent" />

                {/* BOTTOM COMPONENT */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.8 }}
                    variants={fadeUp}
                    custom={0.12}
                    className="relative z-10 flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center"
                >
                    <p className="text-xs text-white/30">
                        © {year} EmpireOne. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:gap-6">
                        <a
                            href="/privacy-policy"
                            className="text-white/30 transition-colors duration-200 hover:text-orange-400"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms"
                            className="text-white/30 transition-colors duration-200 hover:text-orange-400"
                        >
                            Terms of Service
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}