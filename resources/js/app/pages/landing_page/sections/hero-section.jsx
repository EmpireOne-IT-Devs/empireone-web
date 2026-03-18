import Button from "@/app/_components/button";
import {
    Smartphone,
    Monitor,
    Download,
    TrendingUp,
    Shield,
} from "lucide-react";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center relative overflow-hidden">
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
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="flex items-center justify-between gap-8">
                    {/* ── LEFT: Text & CTA ── */}
                    <div className="space-y-6 max-w-xl">
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.25)",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                            Leading BPO Solutions Company
                        </div>

                        <h1 className="text-6xl font-bold text-white drop-shadow-lg leading-tight">
                            Empowering Your
                            <span
                                className="block mt-1"
                                style={{ color: "#e35619" }}
                            >
                                Business Future
                            </span>
                        </h1>

                        <p className="text-white/75 max-w-lg text-lg leading-relaxed">
                            We provide cutting-edge technology solutions to help
                            your business scale, secure its data, and streamline
                            operations for the modern digital landscape.
                        </p>

                        <div className="flex gap-3 flex-wrap">
                            <Button variant="light">
                                <Smartphone className="w-4 h-4 mr-2" />
                                Download APK
                            </Button>
                            <Button variant="light">
                                <Monitor className="w-4 h-4 mr-2" />
                                Windows
                            </Button>
                            <Button variant="light">
                                <Download className="w-4 h-4 mr-2" />
                                Mac
                            </Button>
                        </div>
                    </div>

                    <div
                        className="relative flex-shrink-0 hidden lg:block"
                        style={{ width: "640px", height: "560px" }}
                    >
                        <div
                            className="absolute rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                top: "40px",
                                left: "30px",
                                right: "0",
                                bottom: "50px",
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
                            className="absolute z-20 animate-bounce flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
                            style={{
                                top: "0px",
                                right: "-16px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(12px)",
                                minWidth: "190px",
                            }}
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(99,102,241,0.12)" }}
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
                                <p className="text-2xl font-bold text-gray-900">
                                    6,500+
                                </p>
                            </div>
                        </div>

                        {/* ── FLOATING BADGE: System Uptime (bottom-left) ── */}
                        <div
                            className="absolute z-20 animate-bounce flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
                            style={{
                                bottom: "0px",
                                left: "-16px",
                                background: "rgba(255,255,255,0.97)",
                                backdropFilter: "blur(12px)",
                                minWidth: "190px",
                            }}
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(34,197,94,0.12)" }}
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
                                <p className="text-2xl font-bold text-gray-900">
                                    99.99%
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ── end right panel ── */}
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
