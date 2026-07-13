import React from "react";

export default function LoginNavsSection() {
    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about-us" },
        { label: "Contact", href: "/#contact" },
        { label: "Apply Now", href: "/talent/application" },
    ];

    return (
        <div className="w-full py-4 mt-2">
             <hr className=" w-full border-white/20" />
            <div className="flex justify-center items-center gap-4 mt-2">
                <nav className="flex items-center gap-2">
                    {navItems.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-300  transition-all duration-200  hover:text-orange-400 hover:shadow-md"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>

           
        </div>
    );
}
