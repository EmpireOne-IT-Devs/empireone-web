import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Cake, Edit2, Send } from "lucide-react";
import { useSelector } from "react-redux";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import BirthdayEditMessageTab from "./birthday-edit-message-tab";
import BirthdayPublishTab from "./birthday-publish-tab";

const DEFAULT_HEADLINE = "🎉 Happy Birthday to Our June Celebrants! 🎂";
const DEFAULT_MESSAGE =
    "Wishing all our team members celebrating birthdays this month a wonderful year filled with happiness, success, good health, and memorable moments. Thank you for your dedication and contributions to the organization.\n\nPlease join us in celebrating our June birthday celebrants and making their special month even more meaningful! 🎈🎁";

export default function CreateBirthdayPost() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("edit");
    const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    // 1. Switched store slice selector from state.activities to state.engagement
    const { birthdayMonth, birthdayCount } = useSelector((state) => state.engagement);

    // Safety fallbacks to prevent errors if the state is empty or loading
    const displayCount = birthdayCount ?? 0;
    const displayMonth = birthdayMonth || new Date().toLocaleString("default", { month: "long" });

    const handleClose = () => {
        setIsOpen(false);
        setActiveTab("edit");
    };

    const TABS = [
        { key: "edit", label: "Edit Message", icon: <Edit2 size={14} /> },
        { key: "publish", label: "Publish", icon: <Send size={14} /> },
    ];

    return (
        <>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
                <FaPaperPlane size={16} className="mr-2" />
                Create Birthday Post
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                width="max-w-3xl"
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shrink-0">
                            <Cake size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Activities / Department Showcase
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Monthly Birthday Post
                            </h2>
                            <p className="text-[11px] text-neutral-500 font-medium mt-1">
                                {displayMonth} Celebrants • {displayCount} employee{displayCount !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="w-full flex flex-col font-sans antialiased pb-2 overflow-x-hidden">
                    {/* Tab bar */}
                    <div className="-mx-6 -mt-3 mb-4 flex border-b border-gray-100 px-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all duration-150 ${
                                    activeTab === tab.key
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "edit" && (
                        <BirthdayEditMessageTab 
                            headline={headline}
                            onHeadlineChange={setHeadline}
                            message={message}
                            onMessageChange={setMessage}
                            onGoPublish={() => setActiveTab("publish")}
                        />
                    )}
                    {activeTab === "publish" && (
                        <BirthdayPublishTab
                            headline={headline}
                            message={message}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
}