import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { motion, useReducedMotion } from "framer-motion";

const LOGIN_CAROUSEL_IMAGES = [
    "/images/login-carousel/us.png",
    "/images/login-carousel/empireone-background.jpg",
    "/images/login-carousel/eo-carcar.jpg",
];

const FOOTER_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about-us" },
    { label: "Contact", href: "/#contact" },
    { label: "Apply Now", href: "/talent/application" },
    { label: "Privacy Policy", href: "/privacy-policy" },
];

export default function AuthLayout({ children }) {
    const reduceMotion = useReducedMotion();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (reduceMotion) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setActiveImageIndex(
                (currentIndex) =>
                    (currentIndex + 1) % LOGIN_CAROUSEL_IMAGES.length,
            );
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [reduceMotion]);

    return (
        <div className="min-h-screen bg-[#f7f5ff] font-sans">
            <main className="grid min-h-screen bg-[#f7f5ff] lg:grid-cols-[1.08fr_0.92fr]">
                <section className="relative order-2 flex min-h-[320px] items-center overflow-hidden px-7 py-12 sm:px-12 lg:order-1 lg:min-h-screen lg:px-16 xl:px-24">
                    {LOGIN_CAROUSEL_IMAGES.map((src, index) => (
                        <motion.img
                            key={src}
                            src={src}
                            alt=""
                            aria-hidden="true"
                            initial={false}
                            animate={{
                                opacity: activeImageIndex === index ? 1 : 0,
                            }}
                            transition={{
                                duration: reduceMotion ? 0 : 1.2,
                                ease: "easeInOut",
                            }}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                        />
                    ))}

                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-violet-700/80 to-blue-900/85" />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full border border-white/10"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full border border-white/10"
                    />

                    <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0">
                        <img
                            src="/images/E1CXlogo.png"
                            alt="EmpireOneCX"
                            className="mb-8 h-auto w-52 object-contain sm:w-60 lg:w-64"
                        />
                        <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                            Work better, together.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-white/85 sm:text-base">
                            Delivering outstanding customer support, efficient
                            outsourcing solutions, and meaningful client
                            connections that drive business growth.
                        </p>
                        <div className="mt-8 flex items-center gap-3 text-xs text-white/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                            <span>One platform. Everything connected.</span>
                        </div>
                    </div>
                </section>

                <section className="relative order-1 flex min-h-screen flex-col overflow-hidden px-6 sm:px-10 lg:order-2 lg:px-12 xl:px-20">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                    >
                        <span className="absolute left-[8%] top-[8%] h-16 w-16 rounded-full border border-violet-200/80" />
                        <span className="absolute right-[10%] top-[4%] h-10 w-10 rounded-full border border-violet-200/80" />
                        <span className="absolute right-[5%] top-[37%] h-7 w-7 rounded-full border border-violet-200/80" />
                        <span className="absolute bottom-[8%] left-[5%] h-24 w-24 rounded-full border border-violet-200/80" />
                        <span className="absolute bottom-[10%] right-[8%] h-16 w-16 rounded-full border border-violet-200/80" />
                    </div>

                    <div className="relative z-10 flex flex-1 items-center justify-center py-10">
                        {children}
                    </div>

                    <footer className="relative z-10 mt-auto border-t border-violet-100/70 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
                            <nav
                                aria-label="Footer navigation"
                                className="flex flex-wrap items-center justify-center gap-x-5"
                            >
                                {FOOTER_LINKS.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className="transition-colors hover:text-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                            <span className="hidden text-gray-300 sm:inline">
                                |
                            </span>
                            <p className="whitespace-nowrap text-gray-400">
                                © 2026 EmpireOneCX. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}
