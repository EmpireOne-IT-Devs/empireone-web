import React, { useState } from "react";
import Layout from "../layout";
import JobOpeningPage from "../job_opening/page";
import MyApplicationPage from "../my_application/page";
import MessagesPage from "../messages/page";
import MyProfilePage from "../my_profile/page";
import SettingPage from "../settings/page";

export default function Page() {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        "Job Opening",
        "My Application",
        "Message",
        "My Profile",
        "Setting",
    ];

    return (
        <Layout>
            <div className=" mb-6 border-b border-gray-200">
                <div className="flex gap-0">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(idx)}
                            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                activeTab === idx
                                    ? "border-emerald-500 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                    {activeTab === 0 && <JobOpeningPage />}
                    {activeTab === 1 && <MyApplicationPage />}
                </div>
            </div>
            <div className="max-h-5xl max-w-8xl mx-auto">
                {activeTab === 2 && <MessagesPage />}
            </div>

            {activeTab === 3 && <MyProfilePage />}

            <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                    {activeTab === 4 && <SettingPage />}
                </div>
            </div>
        </Layout>
    );
}
