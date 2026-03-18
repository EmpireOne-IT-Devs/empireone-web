import Button from "@/app/_components/button";
import { Link } from "@inertiajs/react";

import { Smartphone, Monitor, Download } from "lucide-react";
const ctaButtons = [
    {
        href: "/auth/login/page",
        label: "Login",
        primary: true,
    },
    {
        href: "/auth/register/page",
        label: "Register",
    },
];

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center bg-gray-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                            EmpireOne
                            <span className="block text-blue-500">
                                Unified System
                            </span>
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 max-w-lg">
                            A centralized platform designed to streamline
                            operations, improve efficiency, and deliver a
                            seamless digital experience.
                        </p>

                        <div className="flex gap-2">
                            <Button>
                                <Smartphone className="w-4 h-4 mr-2" />
                                Download APK
                            </Button>
                            <Button>
                                <Monitor className="w-4 h-4 mr-2" />
                                Windows 
                            </Button>
                            <Button>
                                <Download className="w-4 h-4 mr-2" />
                                Mac
                            </Button>
                        </div>
                        {/* CTA */}
                        {/* <div className="flex gap-3">
                            {ctaButtons.map((btn, i) => (
                                <Link
                                    key={i}
                                    href={btn.href}
                                    className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                                        btn.primary
                                            ? "bg-yellow-500 text-black hover:bg-yellow-400"
                                            : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20"
                                    }`}
                                >
                                    {btn.label}
                                </Link>
                            ))}
                        </div> */}
                    </div>

                    {/* RIGHT (Placeholder for future content) */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="w-full h-[350px] rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/20 flex items-center justify-center text-slate-400">
                            {/* You can replace this with image / carousel later */}
                            Preview Area
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
