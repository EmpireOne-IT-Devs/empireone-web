import React from "react";

export default function NavFooterSection() {
    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about-us" },
        { label: "Contact", href: "/#contact" },
        { label: "Apply Now", href: "/talent/application" },
    ];

    return (
        <footer className="w-full bg-white/4 backdrop-blur-md py-4 px-4 relative z-10 ">
            {/* Increased gap-x-1 to gap-x-4 for wider spacing between items */}
            <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-4xl mx-auto">
                {navItems.map(({ label, href }, index) => (
                    <React.Fragment key={label}>
                        <a
                            href={href} 
                            className="text-[13px] text-slate-400 hover:text-slate-200 hover:underline transition-colors duration-150 px-1"
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
                <span className="text-slate-600 text-[13px] select-none">
                    ·
                </span>
                <span className="font-montserrat text-[11px] text-slate-400 tracking-[0.2em] ">
                    Built by
                    <span className="text-[#e85c0d] mx-2">
                        EmpireOne Dev Team
                    </span>
                    © {new Date().getFullYear()}
                </span>
            </nav>
        </footer>
    );
}
