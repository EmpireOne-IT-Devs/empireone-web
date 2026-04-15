import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: "Home", id: "home" },
    { name: "About Us", id: "about-us" },
    { name: "Services", id: "services" },
    { name: "Testimonials", id: "testimonial" },
    { name: "Careers", id: "careers" },
    { name: "Contact", id: "contact" },
];

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 0">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/images/eologo.png"
                            alt="EmpireOne Logo"
                            className="h-8 sm:h-12 w-auto object-contain"
                        />
                        {/* <p className="text-sm sm:text-md font-bold tracking-tight leading-none">
                            <span
                                style={{
                                    fontFamily: "inherit",
                                    fontWeight: 900,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                <span style={{ color: "#2B2EB4" }}>EMP</span>
                                <span
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        color: "#2B2EB4",
                                    }}
                                >
                                    I
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: 0,
                                            height: 0,
                                            borderRight:
                                                "6px solid transparent",
                                            borderTop: "6px solid #29ABE2",
                                        }}
                                    />
                                </span>
                                <span style={{ color: "#2B2EB4" }}>RE</span>
                                <span style={{ color: "#29ABE2" }}>ONE</span>
                            </span>
                        </p> */}
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollTo(item.id)}
                            className="text-sm font-semibold text-slate-700  hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Right Controls */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* <DarkModeToggle /> */}

                    <Link
                        href="/auth/login"
                        className="text-sm font-semibold text-slate-700  hover:text-blue-600"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/talent/application"
                        className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                    >
                        Apply Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* <DarkModeToggle /> */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-gray-700 "
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 26,
                                stiffness: 300,
                            }}
                            className="fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-lg p-6 overflow-y-auto"
                        >
                            {/* Close button */}
                            <div className="flex justify-end">
                                <motion.button
                                    whileTap={{ scale: 0.9, rotate: 90 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </motion.button>
                            </div>

                            {/* Navigation */}
                            <div className="mt-6 flex flex-col gap-4">
                                {navigation.map((item, i) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1 + i * 0.06,
                                            duration: 0.35,
                                        }}
                                        onClick={() => scrollTo(item.id)}
                                        className="text-left text-lg font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Auth Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                                className="mt-8 flex flex-col gap-3"
                            >
                                <Link
                                    href="/auth/login"
                                    className="text-center py-2 border rounded-md text-slate-700"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href="/talent/application"
                                    className="text-center py-2 bg-blue-600 text-white rounded-md"
                                >
                                    Apply Now
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}
