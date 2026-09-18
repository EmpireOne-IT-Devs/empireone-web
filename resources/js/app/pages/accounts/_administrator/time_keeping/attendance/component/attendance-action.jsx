import React, { useState } from "react";
import { FaRegHandPointer } from "react-icons/fa";
import Modal from "@/app/_components/modal";
import CorrectionSection from "../sections/correction-section";
import OvertimeSection from "../sections/overtime-section";
import LeaveSection from "../sections/leave-section";

export default function AttendanceAction() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("correction");

    const tabs = [
        {
            key: "correction",
            label: "Correction",
        },
        {
            key: "overtime",
            label: "Overtime",
        },
        {
            key: "leave",
            label: "Leave",
        },
    ];

    const renderActiveSection = () => {
        switch (activeTab) {
            case "correction":
                return <CorrectionSection />;

            case "overtime":
                return <OvertimeSection />;

            case "leave":
                return <LeaveSection />;

            default:
                return <CorrectionSection />;
        }
    };

    return (
        <div>
            <button
                title="Attendance Action"
                className="p-1.5 rounded-md hover:bg-green-500 text-white bg-green-400"
                onClick={() => setIsModalOpen(true)}
            >
                <FaRegHandPointer />
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onClose={() => setIsModalOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Attendance Action
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-[1400px]"
            >
                {/* Tabs */}
                <div className="border-b border-neutral-200 mb-5">
                    <div className="flex items-center gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    relative py-3 text-sm font-medium transition-colors w-full
                                    ${
                                        activeTab === tab.key
                                            ? "text-green-600"
                                            : "text-neutral-500 hover:text-neutral-800"
                                    }
                                `}
                            >
                                {tab.label}

                                {activeTab === tab.key && (
                                    <span className="absolute left-0 right-0 bottom-[-1px] h-0.5 bg-green-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Section */}
                <div>{renderActiveSection()}</div>
            </Modal>
        </div>
    );
}
