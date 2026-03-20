import Button from "@/app/_components/button";
import { Android, Windows } from "@thesvg/react";
import { TrendingUp, Shield } from "lucide-react";

export default function HeroSection() {
    return (
        <section
            className="flex items-center relative overflow-hidden"
            style={{ height: "100vh" }}
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

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="flex items-center justify-between gap-8">
                    {/* ── LEFT: Text & CTA ── */}
                    <div className="space-y-6 max-w-2xl">
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.25)",
                            }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                            Leading BPO Solutions Company
                        </div>

                        <h1 className="text-7xl font-extrabold drop-shadow-lg leading-tight">
                            <span style={{ color: "#5170ff" }}>
                                Empowering Your
                            </span>
                            <span
                                className="block "
                                style={{ color: "#e35619" }}
                            >
                                Business Future
                            </span>
                        </h1>

                        <p className="text-white/80 max-w-xl text-xl leading-relaxed">
                            We provide cutting-edge technology solutions to help
                            your business scale, secure its data, and streamline
                            operations for the modern digital landscape.
                        </p>

                        <div className="flex gap-4 flex-wrap pt-1">
                            <Button variant="light">
                                Download APK
                                <Android className="h-5 w-5 ml-2" />
                            </Button>
                            <Button variant="light">
                                Windows
                                <Windows className="h-5 w-5 ml-2" />
                            </Button>
                            <Button variant="light">
                                Mac
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2 fill-current"
                                >
                                    <title>Apple</title>
                                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* ── RIGHT: Image + Floating Badges ── */}
                    <div
                        className="relative flex-shrink-0 hidden lg:block"
                        style={{ width: "600px", height: "520px" }}
                    >
                        <div
                            className="absolute rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                top: "44px",
                                left: "30px",
                                right: "0",
                                bottom: "44px",
                                border: "4px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <img
                                src="/images/test-image.jpg"
                                alt="Team working"
                                className="w-full h-full object-cover"
                                style={{ filter: "brightness(0.95)" }}
                            />
                        </div>

                        {/* ── FLOATING BADGE: Satisfied Clients (top-right) ── */}
                        <div
                            className="absolute z-20 animate-pulse flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
                            style={{
                                top: "0px",
                                right: "-16px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(4px)",
                                minWidth: "210px",
                            }}
                        >
                            <div
                                className="rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "rgba(99,102,241,0.12)",
                                    width: 52,
                                    height: 52,
                                }}
                            >
                                <TrendingUp
                                    className="w-7 h-7"
                                    style={{ color: "#6366f1" }}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Satisfied Clients
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    6,500+
                                </p>
                            </div>
                        </div>

                        {/* ── FLOATING BADGE: System Uptime (bottom-left) ── */}
                        <div
                            className="absolute z-20 animate-pulse flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
                            style={{
                                bottom: "0px",
                                left: "-16px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(4px)",
                                minWidth: "210px",
                            }}
                        >
                            <div
                                className="rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "rgba(34,197,94,0.12)",
                                    width: 52,
                                    height: 52,
                                }}
                            >
                                <Shield
                                    className="w-7 h-7"
                                    style={{ color: "#16a34a" }}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    System Uptime
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    99.99%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orange bottom accent bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                    background: "linear-gradient(to right, #e35619, #f97316)",
                }}
            />
        </section>
    );
}