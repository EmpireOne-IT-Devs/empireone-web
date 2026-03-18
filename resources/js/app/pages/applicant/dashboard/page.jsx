import React, { useState } from "react";
import Layout from "../layout";
import JobOpeningPage from "../job_opening/page";
import MyApplicationPage from "../my_application/page";
import MessagesPage from "../messages/page";

export default function Page() {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ["Job Opening", "My Applicants", "Message"];
    return (
        <Layout >
            <div className="mb-6">
                <div className="flex gap-2 border-b">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 font-semibold text-sm rounded-t-md focus:outline-none transition-all duration-200 ${
                                activeTab === idx
                                    ? " border-b-2 border-blue-600 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>  
            </div>
            <div className="p-6">
                {activeTab === 0 && <JobOpeningPage />}
                {activeTab === 1 && <MyApplicationPage />}
                {activeTab === 2 && <MessagesPage />}
            </div>
        </Layout>
    );
}
