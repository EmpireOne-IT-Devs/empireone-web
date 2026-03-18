export default function ServicesSection() {
    const services = [
        {
            icon: "🧑‍💼",
            title: "User Management",
            desc: "Manage employees, roles, and permissions with a secure and centralized system.",
        },
        {
            icon: "📊",
            title: "Analytics & Reports",
            desc: "Generate real-time insights and reports to support data-driven decisions.",
        },
        {
            icon: "🗂️",
            title: "Data Management",
            desc: "Organize, store, and access your data efficiently with a structured system.",
        },
        {
            icon: "📅",
            title: "Scheduling System",
            desc: "Plan appointments, tasks, and events with an intuitive scheduling interface.",
        },
        {
            icon: "🔔",
            title: "Notifications",
            desc: "Stay updated with real-time alerts, reminders, and important system updates.",
        },
        {
            icon: "🔐",
            title: "Secure Access",
            desc: "Protect your system with role-based authentication and advanced security features.",
        },
    ];

    return (
        <section
            id="services"
            className="py-20 md:py-28 bg-gray-50 dark:bg-slate-950"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                        Services
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2">
                        What We Offer
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mt-4">
                        EmpireOne provides powerful tools to streamline operations,
                        manage data, and improve overall productivity.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((s, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all"
                        >
                            {/* ICON */}
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-xl mb-4">
                                {s.icon}
                            </div>

                            {/* TITLE */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {s.title}
                            </h3>

                            {/* DESC */}
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}