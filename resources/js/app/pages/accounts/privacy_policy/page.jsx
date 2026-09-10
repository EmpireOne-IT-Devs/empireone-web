import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Page() {
    const [activeSection, setActiveSection] = useState("overview");

    const navItems = [
        { id: "1", title: "1. Information We Collect" },
        { id: "2", title: "2. How We Use Your Information" },
        { id: "3", title: "3. Access and Confidentiality" },
        { id: "4", title: "4. Information Sharing" },
        { id: "5", title: "5. Data Security" },
        { id: "6", title: "6. Data Retention" },
        { id: "7", title: "7. Cookies and System Technologies" },
        { id: "8", title: "8. Employee Responsibilities" },
        { id: "9", title: "9. Privacy and Data Requests" },
        { id: "10", title: "10. Policy Updates" },
        { id: "11", title: "11. Employee Acknowledgment" },
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Sync the active nav item with whichever section is currently in view.
    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.id))
            .filter(Boolean);

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );

                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                }
            },
            { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0710] text-gray-200 font-sans selection:bg-purple-500 selection:text-white pb-20">
            <div className="relative overflow-hidden bg-gradient-to-b from-[#180e29] to-[#0a0710] border-b border-purple-900/30 pt-8 pb-16 px-6 sm:px-12">
                <div className="max-w-8xl mx-auto mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-md font-medium text-gray-600 hover:text-white transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back to Home
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto text-center space-y-5">
                    <img
                        src="/images/E1CXlogo.png"
                        alt="EmpireOne Logo"
                        className="mx-auto h-12 w-auto"
                    />

                    <h1 className="font-extrabold tracking-wider  text-white">
                        <span className="text-4xl sm:text-5xl ">
                            PRIVACY{" "}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent ">
                                POLICY
                            </span>
                        </span>

                        <br />

                        <span className="text-gray-300 text-2xl sm:text-3xl">
                            EMPIREONE UNIFIED SYSTEM 
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
                        EmpireOne is committed to protecting the privacy,
                        confidentiality, and security of personal information
                        processed through the EmpireOne Unified System.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 bg-[#120c1f] px-3 py-1.5 rounded-lg border border-purple-900/40">
                            <span className="text-purple-400 font-medium">
                                Effective Date:
                            </span>{" "}
                            September 8, 2026
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#120c1f] px-3 py-1.5 rounded-lg border border-purple-900/40">
                            <span className="text-purple-400 font-medium">
                                Last Updated:
                            </span>{" "}
                            September 8, 2026
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-[#110b1a] border border-purple-900/30 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                Table of Contents
                            </h3>
                            <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 block truncate ${
                                            activeSection === item.id
                                                ? "bg-gradient-to-r from-purple-900/60 to-pink-900/40 text-white border-l-2 border-pink-500"
                                                : "text-gray-400 hover:text-white hover:bg-purple-950/40"
                                        }`}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Privacy Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Overview / Introduction Box */}
                        <div className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                This Policy explains how information is
                                collected, used, accessed, stored, and
                                protected.
                            </p>
                            <div className="mt-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 text-purple-200 text-xs sm:text-sm">
                                EmpireOne collects and processes information
                                only for legitimate and reasonably necessary
                                business or employment purposes.
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section
                            id="1"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    01
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Information We Collect
                                </h2>
                            </div>

                            <p className="text-sm text-gray-300 leading-relaxed">
                                The system may collect information necessary for
                                employment and business operations, including:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="bg-[#170e24] border border-purple-900/20 rounded-xl p-5">
                                    <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
                                        <li>
                                            Name, employee ID, contact and
                                            employment information
                                        </li>
                                        <li>
                                            Department, position, schedule,
                                            attendance, leave, payroll, and
                                            training records
                                        </li>
                                        <li>
                                            Login details, IP address,
                                            device/browser information, system
                                            activity, and audit logs
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section
                            id="2"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    02
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    How We Use Your Information
                                </h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Information may be used to:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-300">
                                {[
                                    "Administer employment, HR, payroll, attendance, leave, and training",
                                    "Manage system access, workflows, and company communications",
                                    "Maintain security, investigate incidents, and prevent unauthorized access",
                                    "Comply with applicable legal, regulatory, and company requirements",
                                    "Improve system functionality and performance",
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 bg-[#170e24] p-3 rounded-xl border border-purple-900/20"
                                    >
                                        <span className="text-pink-500 font-bold">
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed pt-2">
                                EmpireOne collects and processes information
                                only for legitimate and reasonably necessary
                                business or employment purposes.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section
                            id="3"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    03
                                </div>
                                <h2 className="text-lg font-bold text-white">
                                    Access and Confidentiality
                                </h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Access is limited based on an employee's role
                                and authorization. Employees must not access,
                                disclose, copy, or use information without
                                authorization or share their system credentials.
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Unauthorized access or misuse may result in
                                appropriate company action.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section
                            id="4"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    04
                                </div>
                                <h2 className="text-lg font-bold text-white">
                                    Information Sharing
                                </h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                EmpireOne does not sell personal information.
                                Information may be shared only when necessary
                                for legitimate business purposes, including with
                                authorized employees, HR, IT, service providers,
                                or government/regulatory authorities when
                                legally required or permitted.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section
                            id="5"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    05
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Data Security
                                </h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                EmpireOne implements reasonable administrative,
                                technical, and organizational safeguards to
                                protect information from unauthorized access,
                                disclosure, alteration, loss, or misuse.
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Employees are responsible for protecting their
                                credentials and reporting suspected security or
                                privacy incidents immediately.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section
                            id="6"
                            className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    06
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Data Retention
                                </h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Personal information is retained only as long as
                                necessary for legitimate business purposes and
                                applicable legal, regulatory, contractual, and
                                company requirements. Information no longer
                                required may be securely deleted, anonymized, or
                                disposed of.
                            </p>
                        </section>

                        {/* Sections 7, 8, 9, 10 Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                id="7"
                                className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2"
                            >
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="text-pink-500">07.</span>{" "}
                                    Cookies and System Technologies
                                </h3>
                                <p className="text-xs text-gray-400">
                                    The system may use cookies, sessions, local
                                    storage, and similar technologies for
                                    authentication, security, system
                                    functionality, and performance monitoring.
                                </p>
                            </div>

                            <div
                                id="8"
                                className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2"
                            >
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="text-pink-500">08.</span>{" "}
                                    Employee Responsibilities
                                </h3>
                                <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
                                    <li>Keep credentials confidential</li>
                                    <li>
                                        Access only information necessary for
                                        their role
                                    </li>
                                    <li>
                                        Protect confidential company information
                                    </li>
                                    <li>
                                        Follow information-security and privacy
                                        policies
                                    </li>
                                    <li>
                                        Report suspected unauthorized access or
                                        security incidents
                                    </li>
                                </ul>
                            </div>

                            <div
                                id="9"
                                className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2"
                            >
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="text-pink-500">09.</span>{" "}
                                    Privacy Requests
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Employees may contact HR, IT, or the
                                    designated Privacy/Data Protection personnel
                                    regarding questions, concerns, or requests
                                    involving their personal information,
                                    subject to applicable laws and company
                                    policies.
                                </p>
                            </div>

                            <div
                                id="10"
                                className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2"
                            >
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="text-pink-500">10.</span>{" "}
                                    Policy Updates
                                </h3>
                                <p className="text-xs text-gray-400">
                                    EmpireOne may update this Policy to reflect
                                    changes in business practices, system
                                    functionality, security requirements, or
                                    applicable laws. Significant changes may be
                                    communicated through appropriate company
                                    channels.
                                </p>
                            </div>
                        </div>

                        {/* Contact / Acknowledgment Section */}
                        <section
                            id="11"
                            className="bg-gradient-to-r from-[#1b102e] to-[#120b1f] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                                    11
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    EMPLOYEE ACKNOWLEDGMENT
                                </h2>
                            </div>

                            <p className="text-sm text-gray-300 leading-relaxed">
                                By accessing the EmpireOne Unified System,
                                employees acknowledge that they have read and
                                understood this Privacy Policy and agree to
                                comply with applicable privacy, confidentiality,
                                security, and company requirements.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
