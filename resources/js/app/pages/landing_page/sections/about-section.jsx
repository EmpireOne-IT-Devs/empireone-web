export default function AboutSection() {
    const info = [
        { label: "System Name", value: "EmpireOne Unified System" },
        { label: "Type", value: "Enterprise Platform" },
        { label: "Availability", value: "24/7 Access" },
        { label: "Support", value: "Online Assistance" },
    ];

    return (
        <section
            id="about-us"
            className="py-20 md:py-28 bg-white dark:bg-slate-950"
        >
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* LEFT */}
                <div className="space-y-6">
                    <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                        About Us
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                        Built for Efficiency
                        <span className="block text-blue-500">
                            Designed for Scale
                        </span>
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                        EmpireOne Unified System is a centralized platform designed
                        to streamline operations, manage data efficiently, and
                        provide a seamless digital experience across multiple
                        services and users.
                    </p>

                    {/* INFO GRID */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                        {info.map((item) => (
                            <div
                                key={item.label}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                            >
                                <div className="text-xs text-blue-500 font-mono uppercase mb-1">
                                    {item.label}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-300">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-blue-500/20 text-center">

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            EmpireOne
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            A unified solution that connects systems, simplifies
                            workflows, and enhances productivity through modern
                            digital tools.
                        </p>

                        <div className="mt-6 text-3xl font-bold text-blue-500">
                            100%
                        </div>
                        <div className="text-xs text-slate-400">
                            Digital Workflow
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}