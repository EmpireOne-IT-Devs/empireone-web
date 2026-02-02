import React, { useState } from "react";
import DepartmentsSection from "./departments-section";
import UsersSection from "./users-section";
import SitesSection from "./sites-section";
import DepartmentTableSection from "./department-table-section";
import ApplicantsTableSection from "./applicants-table-section";

export default function UserManagementSection() {
    const [activeTab, setActiveTab] = useState("departments");

    return (
        <div>
            <div className="border-gray-200 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    User Management
                </h2>
            </div>

            <div className="border-b border-gray-200">
                <div>
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("departments")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "departments"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Departments & Users
                        </button>
                        <button
                            onClick={() => setActiveTab("sites")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "sites"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Sites
                        </button>
                    </nav>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === "departments" && (
                    <div className="space-y-8">
                        <UsersSection />
                        <ApplicantsTableSection />
                        <DepartmentTableSection />
                    </div>
                )}
                {activeTab === "sites" && <SitesSection />}
            </div>
        </div>
    );
}
