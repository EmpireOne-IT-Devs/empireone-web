import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const navigation = [
    { name: "Home", id: "home" },
    { name: "About Us", id: "about-us" },
    { name: "Services", id: "services" },
    { name: "Contact", id: "contact" },
    { name: "Testimonials", id: "testimonial" },
];

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 0">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/images/eo-full-logo.png"
                            alt="EmpireOne Logo"
                            className="h-8 sm:h-10 w-auto object-contain"
                        />
                        {/* <p className="text-sm sm:text-md font-bold tracking-tight leading-none">
                            <span
                                style={{
                                    fontFamily: "inherit",
                                    fontWeight: 900,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                <span style={{ color: "#2B2EB4" }}>EMP</span>
                                <span
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        color: "#2B2EB4",
                                    }}
                                >
                                    I
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: 0,
                                            height: 0,
                                            borderRight:
                                                "6px solid transparent",
                                            borderTop: "6px solid #29ABE2",
                                        }}
                                    />
                                </span>
                                <span style={{ color: "#2B2EB4" }}>RE</span>
                                <span style={{ color: "#29ABE2" }}>ONE</span>
                            </span>
                        </p> */}
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollTo(item.id)}
                            className="text-sm font-semibold text-slate-700  hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Right Controls */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* <DarkModeToggle /> */}

                    <Link
                        href="/auth/login"
                        className="text-sm font-semibold text-slate-700  hover:text-blue-600"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/talent/application"
                        className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                    >
                        Apply Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* <DarkModeToggle /> */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-gray-700 "
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
                    <div className="fixed right-0 top-0 h-full w-72 bg-white  shadow-lg p-6">
                        {/* Close button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-700 "
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="mt-6 flex flex-col gap-4">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollTo(item.id)}
                                    className="text-left text-lg font-semibold text-slate-700  hover:text-blue-600"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="mt-8 flex flex-col gap-3">
                            <Link
                                href="/auth/login"
                                className="text-center py-2 border rounded-md text-slate-700 "
                            >
                                Log in
                            </Link>

                            <Link
                                href="/talent/application"
                                className="text-center py-2 bg-blue-600 text-white rounded-md"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
