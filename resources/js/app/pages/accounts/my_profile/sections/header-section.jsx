import Button from "@/app/_components/button";
import {
    AlertCircle,
    Edit2,
    Mail,
    User,
    X,
    Camera,
    PencilLine,
    Link as LinkIcon, // Renamed to avoid conflicts if you import Link from next/link or react-router
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);
    const [copied, setCopied] = useState(false);

    // 1. Make the completion percentage dynamic, default to 0
    const profileCompletion = data?.profile_percent
        ? Number(data.profile_percent)
        : 0;

    const handleCopyLink = () => {
        const encodedId = btoa(data?.user?.id?.toString() || "");
        const link = `${window.location.origin}/talent/application?referral_id=${encodedId}&source=facebook`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mx-auto w-full">
            {/* Banner - Fixed height for mobile/desktop */}
            <div className="h-24 md:h-28 bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700" />

            <div className="px-4 md:px-6 pb-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                    <div className="flex flex-col items-center md:items-start">
                        <div
                            className={`w-[90px] h-[90px] rounded-full bg-gray-200 border-4 border-white flex items-center justify-center -mt-11 relative z-10 overflow-hidden group cursor-pointer shadow-sm`}
                        >
                            {/* 2. Dynamic Avatar Image */}
                            {data?.user?.profile_picture ? (
                                <img
                                    src={data.user.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>

                        {/* Applicant Info */}
                        <div className="mt-2 text-center md:text-left">
                            <p className="text-base font-bold text-gray-900">
                                {data?.user?.name || "Loading..."}
                            </p>
                            {data?.user?.account_employee?.employee_id && (
                                <p className="text-sm font-semibold text-gray-600">
                                    ID:{" "}
                                    {data?.user?.account_employee?.employee_id}
                                </p>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5 text-gray-500 text-xs">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate max-w-[200px] md:max-w-none">
                                    {data?.user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Stacked on mobile, row on desktop */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <button
                            onClick={handleCopyLink}
                            className="w-full sm:w-auto px-4 py-2 flex gap-2 border border-blue-500 bg-blue-600 rounded-md items-center justify-center text-white text-sm font-medium transition-colors hover:bg-blue-700"
                        >
                            <LinkIcon className="w-4 h-4" />
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <a
                            href="/accounts/my_profile/signature"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-4 py-2 flex gap-2 border border-purple-500 bg-purple-600 rounded-md items-center justify-center text-white text-sm font-medium transition-colors hover:bg-purple-700"
                        >
                            <PencilLine className="w-4 h-4" />
                            E-Signature
                        </a>
                    </div>
                </div>

                {/* 3. Conditional Profile Completion Card (Hides if 100%) */}
                {profileCompletion < 100 && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-bold text-gray-800">
                                Complete Your Profile
                            </span>
                        </div>

                        <p className="text-xs leading-relaxed text-gray-600 mb-4">
                            Fill in your First Name, Last Name, Email, Contact
                            Number, and upload your Resume to complete your
                            profile.
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${profileCompletion}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-8">
                                {profileCompletion}%
                            </span>
                        </div>

                        <div className="mt-3 py-2 px-3 bg-white/50 rounded border border-yellow-100 text-[10px] md:text-xs text-gray-500 flex items-start gap-2">
                            <span>💡</span>
                            <em className="not-italic">
                                <strong>Tip:</strong> Completing your profile to
                                100% increases your chances of getting hired!
                            </em>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
