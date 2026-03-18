export default function FooterSection() {
    const year = new Date().getFullYear();

    const quickLinks = [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Contact", href: "#contact" },
    ];

    const legalLinks = [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms" },
    ];

    return (
        <footer className="bg-gray-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* TOP */}
                <div className="grid gap-10 md:grid-cols-3 mb-10">
                    {/* BRAND */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                            EmpireOne
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            A unified system designed to streamline operations,
                            manage data, and improve productivity across your
                            organization.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <div className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">
                            Quick Links
                        </div>

                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* LEGAL */}
                    <div>
                        <div className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">
                            Legal
                        </div>

                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-slate-400 text-center md:text-left">
                        © {year} EmpireOne. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>v2.0.0</span>
                        <span>
                            Built by{" "}
                            <span className="text-blue-500">
                                EmpireOne Devs
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
