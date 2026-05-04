import Button from "@/app/_components/button";
import {
    AlertCircle,
    Mail,
    User,
    Camera,
    PencilLine,
    Link as LinkIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const role = window.location.pathname.split("/")[2];
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

    const handleAvatarClick = () => {
        if (!uploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const uploadProfilePicture = async (file) => {
        setUploading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            console.log("Uploaded file:", file);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadProfilePicture(file);
        }
        // Reset so the same file can be re-selected
        e.target.value = "";
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mx-auto w-full">
            {/* Banner */}
            <div className="h-24 md:h-28 bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700" />

            <div className="px-4 md:px-6 pb-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                    <div className="flex flex-col items-center md:items-start">
                        {/* Avatar — file input moved OUTSIDE the clickable div */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />

                        <div
                            className="w-[90px] h-[90px] rounded-full bg-gray-200 border-4 border-white flex items-center justify-center -mt-11 relative z-10 overflow-hidden group cursor-pointer shadow-sm"
                            onClick={handleAvatarClick}
                            title="Change profile picture"
                        >
                            {/* Avatar image or fallback */}
                            {data?.user?.profile_picture ? (
                                <img
                                    src={data.user.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}

                            {/* Hover overlay — pointer-events enabled now */}
                            {!uploading && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                    <Camera className="w-5 h-5 text-white mb-1" />
                                    <span className="text-[10px] text-white font-semibold text-center leading-tight px-1">
                                        Update photo
                                    </span>
                                </div>
                            )}

                            {/* Loading spinner overlay */}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                                    <svg
                                        className="animate-spin h-6 w-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                </div>
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <button
                            onClick={handleCopyLink}
                            className="w-full sm:w-auto px-4 py-2 flex gap-2 border border-blue-500 bg-blue-600 rounded-md items-center justify-center text-white text-sm font-medium transition-colors hover:bg-blue-700"
                        >
                            <LinkIcon className="w-4 h-4" />
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <a
                            href={`/accounts/${role}/my_profile/signature`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-4 py-2 flex gap-2 border border-purple-500 bg-purple-600 rounded-md items-center justify-center text-white text-sm font-medium transition-colors hover:bg-purple-700"
                        >
                            <PencilLine className="w-4 h-4" />
                            E-Signature
                        </a>
                    </div>
                </div>

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
