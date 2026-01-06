import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";
import { TbFilter, TbSearch } from "react-icons/tb";
import ListApplicantSection from "./list-applicant-section";
import CalendarSection from "./calendar-section";

export default function SearchSection() {
    const [activeTab, setActiveTab] = useState("list");
    return (
        <div>
            <div className="bg-white shadow-sm p-5 border-2 rounded-2xl flex gap-2 my-3 mt-6">
                <div className="flex-1">
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search by candidate or job title..."
                        name="search"
                    />
                </div>

                <div>
                    <Select
                        iconLeft={<TbFilter className="text-xl" />}
                        label="All Status"
                        options={[
                            { value: "all_status", label: "All Status" },
                            { value: "new", label: "New" },
                            { value: "reviewing", label: "Reviewing" },
                            { value: "shortlisted", label: "Shortlisted" },
                            { value: "interview", label: "Interview" },
                            { value: "rejected", label: "Rejected" },
                            { value: "hired", label: "Hired" },
                        ]}
                    />
                </div>
                <div>
                    <div className="flex gap-0">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`px-6 py-2 rounded-l-lg font-medium transition-colors ${
                                activeTab === "list"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300"
                            }`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setActiveTab("calendar")}
                            className={`px-6 py-2 rounded-r-lg font-medium transition-colors ${
                                activeTab === "calendar"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300"
                            }`}
                        >
                            Calendar
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {activeTab === "list" && <ListApplicantSection />}
                {activeTab === "calendar" && <CalendarSection />}
            </div>
        </div>
    );
}
