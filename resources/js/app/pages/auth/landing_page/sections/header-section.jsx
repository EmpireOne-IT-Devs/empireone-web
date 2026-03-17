import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const navigation = [
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Contact", id: "contact" },
];

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/images/empireone.png"
                            alt="EmpireOne Logo"
                            className="h-8 sm:h-10 w-auto object-contain"
                        />
                        <p className="text-sm sm:text-md font-bold text-slate-900 dark:text-white tracking-tight">
                            EmpireOne Unified System
                        </p>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollTo(item.id)}
                            className="text-sm font-semibold text-slate-700 dark:text-white hover:text-blue-600 transition-colors"
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
                        className="text-sm font-semibold text-slate-700 dark:text-white hover:text-blue-600"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/auth/register"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                        Sign up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* <DarkModeToggle /> */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-gray-700 dark:text-gray-300"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
                    <div className="fixed right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg p-6">
                        {/* Close button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-700 dark:text-gray-300"
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
                                    className="text-left text-lg font-semibold text-slate-700 dark:text-white hover:text-blue-600"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="mt-8 flex flex-col gap-3">
                            <Link
                                href="/auth/login"
                                className="text-center py-2 border rounded-md text-slate-700 dark:text-white"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/auth/register"
                                className="text-center py-2 bg-blue-600 text-white rounded-md"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
