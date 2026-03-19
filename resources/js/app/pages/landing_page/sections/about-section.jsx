import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AboutSection() {
    const stats = [
        { value: "6,500+", label: "Satisfied Clients" },
        { value: "600+", label: "Finished Projects" },
        { value: "250+", label: "Skilled Experts" },
        { value: "1,000+", label: "Media Posts" },
    ];

    const features = [
        "Innovative Technology Solutions",
        "Expert Team of Professionals",
        "Guaranteed Business Growth",
    ];

    return (
        <section
            id="about-us"
            className="relative overflow-hidden"
            style={{
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── BACKGROUND LAYER ── */}
            <div className="absolute inset-0 z-0">
                <video
                    src="/video/about.mp4"
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{ background: "rgba(172, 145, 95, 0.82)" }}
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-20 pb-4 grid md:grid-cols-2 gap-8 items-center">
                {/* LEFT – image card */}
                <div className="flex justify-center md:justify-start">
                    <div
                        className="relative rounded-2xl overflow-hidden shadow-2xl w-full"
                        style={{
                            maxWidth: 580,
                            border: "3px solid rgba(255,255,255,0.12)",
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                            alt="Team collaborating"
                            className="w-full object-cover"
                            style={{ height: "46vh", minHeight: 260 }}
                        />
                        {/* gradient bottom fade */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-20"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(15,23,60,0.7), transparent)",
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT – text content */}
                <div className="space-y-5">
                    <span
                        className="text-sm font-bold tracking-widest uppercase"
                        style={{ color: "#fafafa" }}
                    >
                        About Company
                    </span>

                    <h2 className="text-5xl md:text-4xl font-extrabold text-white leading-tight">
                        We Can Help Clients With
                        <span
                            className="block"
                            style={{ color: "#f97316" }}
                        >
                            The Right Solutions
                        </span>
                    </h2>

                    <p className="text-white leading-relaxed max-w-lg text-base">
                        At EmpireOne, we believe in the power of technology to
                        transform businesses. Our mission is to provide
                        scalable, secure, and innovative IT solutions that drive
                        growth and efficiency for our partners globally.
                    </p>

                    {/* feature list */}
                    <ul className="space-y-3 pt-1">
                        {features.map((f) => (
                            <li
                                key={f}
                                className="flex items-center gap-3 text-white font-semibold text-base"
                            >
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        <button
                            className="px-8 py-3.5 rounded-md font-bold text-white text-base transition-all hover:opacity-90 hover:scale-105"
                            style={{ background: "#37215c" }}
                        >
                            Explore More
                        </button>
                        <button
                            className="px-8 py-3.5 rounded-md font-bold text-base transition-all hover:scale-105"
                            style={{
                                background: "white",
                                color: "#4b0082",
                                border: "2px solid white",
                            }}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-14 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-2xl py-6 px-4 text-center"
                        style={{
                            background: "rgba(15,23,60,0.85)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <div className="text-3xl md:text-4xl font-extrabold text-white">
                            {s.value}
                        </div>
                        <div className="text-sm text-white/50 mt-1 tracking-wide">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}