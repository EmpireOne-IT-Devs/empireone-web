import React from "react";

export default function ApplicationFooterSection() {
    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about-us" },
        { label: "Contact", href: "/#contact" },
        { label: "Login", href: "/auth/login" },
    ];

    return (
        <footer
            className="w-full py-4 px-4 relative z-20 border-t border-white/10"
            style={{
                background: `
            radial-gradient(circle at 10% 40%, rgba(168, 85, 247, 0.3), transparent 30%),
            radial-gradient(circle at 90% 60%, rgba(249, 115, 22, 0.25), transparent 30%),
            rgba(10, 5, 25, 0.45)
        `,
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(1px)",
            }}
        >
            {/* Increased gap-x-1 to gap-x-4 for wider spacing between items */}
            <nav className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-4xl mx-auto">
                {navItems.map(({ label, href }, index) => (
                    <React.Fragment key={label}>
                        <a
                            href={href}
                            className="text-[13px] text-slate-300 hover:text-slate-200 hover:underline transition-colors duration-150 px-1"
                        >
                            {label}
                        </a>
                        {index < navItems.length - 1 && (
                            <span className="text-slate-600 text-[13px] select-none">
                                ·
                            </span>
                        )}
                    </React.Fragment>
                ))}
                <span className="text-slate-500 text-[13px] select-none">
                    |
                </span>
                <span className="font-montserrat text-[11px] text-slate-300 tracking-[0.2em] ">
                    Built by
                    <span className="text-orange-400 mx-1">
                        EmpireOne Dev Team
                    </span>
                    © {new Date().getFullYear()}
                </span>
            </nav>
        </footer>
    );
}
