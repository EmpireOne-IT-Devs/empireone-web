import Button from "@/app/_components/button";
import { Android, Windows, Apple } from "@thesvg/react";
import { motion } from "framer-motion";
import { TrendingUp, Shield } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const fadeInRight = {
    hidden: { opacity: 0, x: 48, scale: 0.96 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative flex min-h-[100svh] items-center overflow-hidden px-0 py-0 lg:min-h-screen"
        >
            <video
                src="/video/landing-page.mp4"
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Purple overlay */}
            <div
                className="absolute inset-0"
                style={{ background: "rgba(109,40,217,0.55)" }}
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-6 sm:px-6 md:px-8 lg:min-h-0 lg:px-10">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-center lg:gap-16">
                    <div className="max-w-2xl space-y-7 sm:space-y-7 md:space-y-8 text-center sm:text-left">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={0.1}
                            className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:mx-0 sm:text-sm"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.25)",
                            }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                            Leading BPO Solutions Company
                        </motion.div>

                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={0.2}
                            className="text-[clamp(1.75rem,8vw,2.25rem)] font-extrabold leading-[1.15] drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
                        >
                            <span
                                className="whitespace-nowrap"
                                style={{
                                    color: "#5170ff",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 900,
                                    display: "block",
                                }}
                            >
                                Empowering Your
                            </span>
                            <span
                                className="block mt-3 sm:mt-4 whitespace-nowrap"
                                style={{
                                    color: "#e35619",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 900,
                                }}
                            >
                                Business Future
                            </span>
                        </motion.h1>

                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={0.32}
                            className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/85 sm:mx-0 sm:text-base md:text-lg"
                        >
                            We provide scalable outsourcing solutions that
                            improve efficiency, reduce costs, and enhance
                            customer experience—powered by skilled teams and
                            modern technology.
                        </motion.p>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={0.42}
                            className="grid grid-cols-3 gap-3 pt-3 sm:flex sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-2"
                        >
                            <motion.div
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="light"
                                    className="w-full whitespace-nowrap text-xs sm:w-auto sm:text-sm"
                                >
                                    Mobile App
                                    <Android className="h-4 w-4 ml-1 sm:h-5 sm:w-5 sm:ml-2" />
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="light"
                                    className="w-full whitespace-nowrap text-xs sm:w-auto sm:text-sm"
                                >
                                    Windows
                                    <Windows className="h-4 w-4 ml-1 sm:h-5 sm:w-5 sm:ml-2" />
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="light"
                                    className="w-full whitespace-nowrap text-xs sm:w-auto sm:text-sm"
                                >
                                    macOS
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 814 1000"
                                        className="h-4 w-4 ml-1 sm:h-5 sm:w-5 sm:ml-2 fill-black"
                                    >
                                        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                    </svg>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Image + Floating Badges ── */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInRight}
                        custom={0.28}
                        className="relative hidden w-full max-w-[550px] flex-shrink-0 self-center md:block"
                        style={{ height: "clamp(320px, 52vw, 500px)" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 1.08 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 1,
                                delay: 0.42,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                top: "40px",
                                left: "16px",
                                right: "0",
                                bottom: "40px",
                                border: "4px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <img
                                src="/images/us.png"
                                alt="Team working"
                                className="w-full h-full object-cover"
                                style={{ filter: "brightness(0.95)" }}
                            />
                        </motion.div>

                        {/* ── FLOATING BADGE: Satisfied Clients (top-right) ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -24, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute right-0 top-0 z-20 hidden animate-bounce items-center gap-3 rounded-2xl px-4 py-3 shadow-xl md:flex"
                            style={{
                                animationDuration: "2s",
                                top: "-8px",
                                right: "-8px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(4px)",
                                minWidth: "200px",
                            }}
                        >
                            <div
                                className="rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "rgba(99,102,241,0.12)",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <TrendingUp
                                    className="w-6 h-6"
                                    style={{ color: "#6366f1" }}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Satisfied Clients
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    100+
                                </p>
                            </div>
                        </motion.div>

                        {/* ── FLOATING BADGE: System Uptime (bottom-left) ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24, x: -20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.82,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute bottom-0 left-0 z-20 hidden animate-bounce items-center gap-3 rounded-2xl px-4 py-3 shadow-xl md:flex"
                            style={{
                                animationDuration: "2s",
                                bottom: "-8px",
                                left: "-8px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(4px)",
                                minWidth: "210px",
                            }}
                        >
                            <div
                                className="rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "rgba(34,197,94,0.12)",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <Shield
                                    className="w-6 h-6"
                                    style={{ color: "#16a34a" }}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    System Uptime
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    99.99%
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
