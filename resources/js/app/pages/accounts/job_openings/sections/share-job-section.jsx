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
    FaBriefcase,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Gmail } from "@thesvg/react";
import { MailIcon } from "lucide-react";

export default function ShareJobSection({ data }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { data: account } = useSelector((store) => store.app);

    // Safety check for window object in SSR
    const host = typeof window !== "undefined" ? window.location.host : "";
    const jobUrl = `${host}/talent/application?job_posting_id=${data.id}&referral_id=${btoa(account?.user?.id?.toString() || "")}`;
    const jobTitle = data?.job_requisition?.title;

    const getTrackedUrl = (url, sourceName) => {
        try {
            const urlObj = new URL(
                url.startsWith("http") ? url : `https://${url}`,
            );
            urlObj.searchParams.set("source", sourceName);
            return urlObj.toString();
        } catch (e) {
            return url.includes("?")
                ? `${url}&source=${sourceName}`
                : `${url}?source=${sourceName}`;
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(getTrackedUrl(jobUrl, "EmpireOne App"))
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
    };

    const shareLinks = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getTrackedUrl(jobUrl, "linkedin"))}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}&url=${encodeURIComponent(getTrackedUrl(jobUrl, "twitter"))}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getTrackedUrl(jobUrl, "facebook"))}`,
        email: `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${jobTitle}`)}&body=${encodeURIComponent(`I thought you might be interested in this job posting:\n\n${getTrackedUrl(jobUrl, "email")}`)}`,
        messenger: `fb-messenger://share/?link=${encodeURIComponent(getTrackedUrl(jobUrl, "messenger"))}`,
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Share Job"
            >
                <FcShare className="text-2xl md:text-3xl" />
            </button>

            <Modal
                width="max-w-[95vw] md:max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3 ">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <FaBriefcase />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-blue-700 font-mono">
                                Share this role
                            </p>
                            <h2 className="text-[15px] font-bold text-gray-900 leading-tight ">
                                {jobTitle}
                                <br />
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="border-t border-gray-200 "></div>

                <div className="flex flex-col gap-6 py-2 md:py-4 ">
                    {/* Social Share Icon Grid - Responsive wrap */}
                    <div className="grid grid-cols-3 sm:flex sm:justify-center gap-3 md:gap-4 px-2">
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 text-blue-700 rounded-2xl md:rounded-full hover:bg-blue-100 transition-all active:scale-95"
                            aria-label="Share on LinkedIn"
                        >
                            <FaLinkedin className="text-xl md:text-2xl" />
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-sky-50 text-sky-500 rounded-2xl md:rounded-full hover:bg-sky-100 transition-all active:scale-95"
                            aria-label="Share on Twitter"
                        >
                            <FaTwitter className="text-xl md:text-2xl" />
                        </a>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl md:rounded-full hover:bg-blue-100 transition-all active:scale-95"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebook className="text-xl md:text-2xl" />
                        </a>
                        <a
                            href={shareLinks.email}
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl md:rounded-full hover:bg-blue-200 transition-all active:scale-95"
                            aria-label="Share via Email"
                        >
                            <Gmail className="h-6 w-6 " />
                        </a>
                        {/* Messenger often needs more space, so it handles the 5th spot or wraps */}
                        <a
                            href={shareLinks.messenger}
                            className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 text-blue-500 rounded-2xl md:rounded-full hover:bg-blue-100 transition-all active:scale-95 col-span-1"
                            aria-label="Share on Messenger"
                        >
                            <FaFacebookMessenger className="text-xl md:text-2xl" />
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center px-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 px-4 text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">
                            or copy link
                        </span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Copy Link Input Bar - Responsive Layout */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-50 p-1.5 md:p-2 rounded-xl border border-gray-200 focus-within:border-blue-400 transition-all mx-2">
                        <div className="flex items-center flex-1 min-w-0 px-2 py-2 sm:py-0">
                            <FaLink className="text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                readOnly
                                value={jobUrl}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 px-2 outline-none truncate"
                            />
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className={`px-6 py-2.5 sm:py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                copied
                                    ? "bg-green-600 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <FaCheck /> Copied
                                </>
                            ) : (
                                "Copy Link"
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 border-t border-gray-200 pt-2 mx-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-snug">
                            Referral link — you'll get credit when someone
                            applies through this link
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
}
