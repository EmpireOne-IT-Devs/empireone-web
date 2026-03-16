import React, { useState } from "react";

export default function JobPostingSection({ onApply, setStep }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const jobDetails = {
        title: "Senior Frontend Developer",
        location: "San Carlos City, Philippines (Remote Friendly)",
        salary: "₱60,000 - ₱90,000 / month",
        type: "Full-time",
        posted: "Posted 2 days ago",
        description:
            "We are looking for a passionate Frontend Developer with strong React skills to help us build the next generation of interactive web applications. You will be responsible for implementing visual elements that users see and interact with within a web application. You will be working with the UI/UX designers and bridging the gap between graphical design and technical implementation, taking an active role on both sides and defining how the application looks as well as how it works.",
        requirements: [
            "3+ years of experience with React.js and modern JavaScript (ES6+)",
            "Proficiency in Tailwind CSS and responsive design",
            "Experience with state management libraries like Redux or React Hook Form",
            "Knowledge of RESTful API integration",
            "Strong communication and problem-solving skills",
            "Experience with Unit Testing (Jest/React Testing Library)",
            "Familiarity with CI/CD pipelines and Git workflow",
            "Knowledge of Next.js and Server-Side Rendering",
        ],
        benefits: [
            "HMO on Day 1",
            "Flexible working hours",
            "Equipment provided",
            "Annual performance bonus",
        ],
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 p-6 flex justify-center items-start">
            <div className="max-w-4xl w-full space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                                {jobDetails.type}
                            </span>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                {jobDetails.title}
                            </h1>
                            <div className=" flex flex-wrap  text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {jobDetails.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {jobDetails.salary}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            type="button"
                            className="w-full md:w-auto px-10 py-2 flex bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            Apply now
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            type="button"
                            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-full text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            {isExpanded ? (
                                <>
                                    Show Less{" "}
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 15l7-7 7 7"
                                        />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Show More{" "}
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[2000px]" : "max-h-[0px]"}`}
                >
                    {/* Main Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className={`relative }`}>
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    Job Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {jobDetails.description}
                                </p>
                            </section>

                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    Requirements
                                </h3>
                                <ul className="space-y-3">
                                    {jobDetails.requirements.map((req, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-gray-600"
                                        >
                                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Gradient overlay when collapsed */}
                            {!isExpanded && (
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* Toggle Button */}
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Perks & Benefits
                            </h3>
                            <ul className="space-y-3">
                                {jobDetails.benefits.map((benefit, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-gray-700 font-medium"
                                    >
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
                            <h3 className="font-bold text-lg mb-2">
                                Ready to apply?
                            </h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Complete our interactive form to send your
                                application directly to the HR team.
                            </p>
                            <p className="text-xs text-blue-200 italic">
                                {jobDetails.posted}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
