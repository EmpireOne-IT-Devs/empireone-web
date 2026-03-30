import React, { useState } from "react";
import { Bell, CheckCircle, X, Info } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function VerifySection() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto  p-4">
                {/* Notification Container */}
                <div className="relative flex items-start gap-4 p-5 h-96 bg-white rounded-xl shadow-lg border-l-4 border-blue-600 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                        <div className="p-2 bg-blue-50 rounded-full">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1  min-w-0 flex items-center justify-center flex-col h-full">
                        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            Verification Required
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                New
                            </span>
                        </h3>
                        <p className="mt-1 text-xl text-gray-600 leading-relaxed">
                            Your account verification is almost complete. Please
                            confirm your identity details to access all features
                            of the dashboard.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                            <a
                                target="_blank"
                                href={"/applicant/my_profile/signature"}
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                            >
                                Verify Now
                            </a>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>

                    {/* Close Button (X) */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
