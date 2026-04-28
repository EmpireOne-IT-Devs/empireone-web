import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: "Home", id: "home" },
    { name: "Careers", id: "careers" },
    { name: "About", id: "about-us" },
    { name: "Testimonials", id: "testimonial" },
    { name: "Contact", id: "contact" },
];

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredPath, setHoveredPath] = useState(null);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bg = window.getComputedStyle(
                            entry.target,
                        ).backgroundColor;
                        // Improved dark detection
                        const isDarkBg =
                            bg.includes("rgb(0") ||
                            bg.includes("10, 10") ||
                            entry.target.id === "home";
                        setIsDark(isDarkBg);
                    }
                });
            },
            { threshold: 0.4 },
        );

        document
            .querySelectorAll("section[id]")
            .forEach((sec) => observer.observe(sec));
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className="fixed top-0 inset-x-0 z-50 transition-all duration-500 mt-2">
            <nav
                className={`mx-auto transition-all duration-500 px-6 py-3 
                ${
                    scrolled
                        ? "mt-4 max-w-5xl rounded-full border shadow-2xl backdrop-blur-md"
                        : "max-w-7xl border-b border-transparent"
                }
                ${
                    isDark
                        ? "bg-black/20 border-white/10 text-white"
                        : "bg-white/40 border-black/5 text-slate-900"
                }`}
            >
                <div className="flex items-center justify-between">
                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <a href="/" className="group flex items-center gap-2">
                            <img
                                src="/images/eologo.png"
                                alt="Logo"
                                className="h-8 transition-transform group-hover:scale-105"
                            />
                        </a>
                    </div>

                    {/* DESKTOP NAV */}
                    <div className="hidden lg:flex items-center gap-x-2">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollTo(item.id)}
                                onMouseEnter={() => setHoveredPath(item.id)}
                                onMouseLeave={() => setHoveredPath(null)}
                                className="relative px-4 py-2 text-sm font-medium transition-opacity hover:opacity-100 opacity-80"
                            >
                                {item.name}
                                {hoveredPath === item.id && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className={`absolute inset-0 -z-10 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`}
                                        transition={{
                                            type: "spring",
                                            bounce: 0.25,
                                            duration: 0.5,
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/login"
                            className="hidden sm:block px-4 py-2 text-sm font-semibold hover:opacity-70 transition"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/talent/application"
                            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Apply Now
                        </Link>

                        {/* MOBILE TOGGLE */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-1 rounded-md"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-white p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center">
                            <img
                                src="/images/eologo.png"
                                alt="Logo"
                                className="h-8"
                            />
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <XMarkIcon className="h-8 w-8 text-slate-900" />
                            </button>
                        </div>
                        <div className="mt-12 flex flex-col gap-6 text-center">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollTo(item.id)}
                                    className="text-3xl font-bold text-slate-900 tracking-tight"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                            <Link
                                href="/auth/login"
                                className="w-full py-4 text-center font-bold border rounded-2xl"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/talent/application"
                                className="w-full py-4 text-center font-bold bg-purple-600 text-white rounded-2xl"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
