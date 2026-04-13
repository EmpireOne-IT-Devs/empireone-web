import Modal from "@/app/_components/modal";
import React, { useState } from "react";
import { FcShare } from "react-icons/fc";
import {
    FaLinkedin,
    FaFacebook,
    FaTwitter,
    FaEnvelope,
    FaLink,
    FaCheck,
    FaFacebookMessenger,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ShareJobSection({ data }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { data: account } = useSelector((store) => store.app);
    const jobUrl = `${window.location.host}/talent/application?job_posting_id=${data.id}&referral_id=${btoa(account?.user?.id?.toString() || "")}`;
    console.log("window.location");
    const jobTitle = data?.job_requisition?.title;
    // Handles the "Copy Link" button logic
    const handleCopyLink = () => {
        navigator.clipboard.writeText(jobUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Pre-formatted social sharing URLs
    const shareLinks = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}&url=${encodeURIComponent(jobUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${jobTitle}`)}&body=${encodeURIComponent(`I thought you might be interested in this job posting:\n\n${jobUrl}`)}`,
        messenger: `fb-messenger://share/?link=${encodeURIComponent(jobUrl)}`,
    };
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share Job"
            >
                <FcShare className="text-2xl" />
            </button>

            <Modal
                width="max-w-md" // Swapped to md for a tighter, cleaner share UI
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Share Job Posting"
            >
                <div className="flex flex-col gap-6 py-4">
                    {/* Social Share Icon Buttons */}
                    <div className="flex justify-center gap-4">
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 hover:scale-105 transition-all"
                            aria-label="Share on LinkedIn"
                        >
                            <FaLinkedin className="text-2xl" />
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 hover:scale-105 transition-all"
                            aria-label="Share on Twitter"
                        >
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-105 transition-all"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebook className="text-2xl" />
                        </a>
                        <a
                            href={shareLinks.email}
                            className="p-4 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-200 hover:scale-105 transition-all"
                            aria-label="Share via Email"
                        >
                            <FaEnvelope className="text-2xl" />
                        </a>
                        <a
                            href={shareLinks.messenger}
                            className="p-4 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 hover:scale-105 transition-all"
                            aria-label="Share on Messenger"
                        >
                            <FaFacebookMessenger className="text-2xl" />
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 px-4 text-sm text-gray-500 font-medium">
                            or copy link
                        </span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Copy Link Input Bar */}
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                        <FaLink className="text-gray-400 ml-2" />
                        <input
                            type="text"
                            readOnly
                            value={jobUrl}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 px-2 outline-none truncate"
                        />
                        <button
                            onClick={handleCopyLink}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                copied
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <FaCheck /> Copied
                                </>
                            ) : (
                                "Copy"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
