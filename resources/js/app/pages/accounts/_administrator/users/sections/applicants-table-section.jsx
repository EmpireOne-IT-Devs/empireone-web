import React, { useState } from "react";
import {
    FaEye,
    FaFilePdf,
    FaFileWord,
    FaPhone,
    FaEnvelope,
    FaPlus,
    FaTrash,
} from "react-icons/fa";
import { TbSearch } from "react-icons/tb";

export default function ApplicantsTableSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [siteFilter, setSiteFilter] = useState("All Sites");
    const [isTableExpanded, setIsTableExpanded] = useState(false);

    // Sample data based on the image
    const applicantsData = [
        {
            applicationNumber: "020261533O0002",
            fullname: "Iligan, Mike",
            dateOfBirth: "March 21, 1998",
            gender: "Male",
            maritalStatus: "Single",
            email: "mikoymik853@gmail.com",
            contact: "09603406071",
            dateSubmitted: "02/02/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "020261005180001",
            fullname: "Camoro, Jamaica",
            dateOfBirth: "December 15, 2001",
            gender: "Female",
            maritalStatus: "Single",
            email: "camorojamaicalibrea@gmail.com",
            contact: "09509204115",
            dateSubmitted: "02/02/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "013026220359002",
            fullname: "Yu, Samantha",
            dateOfBirth: "March 31, 1999",
            gender: "Female",
            maritalStatus: "Single",
            email: "samanthayu331@gmail.com",
            contact: "09936316385",
            dateSubmitted: "01/30/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "013026192143001",
            fullname: "Villanueva, Drixy Lir",
            dateOfBirth: "April 29, 2002",
            gender: "Male",
            maritalStatus: "Single",
            email: "drixvillanueva24@gmail.com",
            contact: "09810063209",
            dateSubmitted: "01/30/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "012962260612004",
            fullname: "Rebalde, Baberly",
            dateOfBirth: "January 21, 2005",
            gender: "Female",
            maritalStatus: "Single",
            email: "baberlyrebalde465@gmail.com",
            contact: "09386027917",
            dateSubmitted: "01/29/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "012961652580003",
            fullname: "Santillan, Romel Brian",
            dateOfBirth: "January 8, 2001",
            gender: "Male",
            maritalStatus: "Single",
            email: "melsantillan553@gmail.com",
            contact: "09269952911",
            dateSubmitted: "01/29/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "012961431172002",
            fullname: "Sanchez, Christi Ann",
            dateOfBirth: "April 29, 1979",
            gender: "Female",
            maritalStatus: "Married",
            email: "chinggaybsanchez@gmail.com",
            contact: "09189261010",
            dateSubmitted: "01/29/2026",
            site: "San Carlos",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
        {
            applicationNumber: "012962084702001",
            fullname: "Lugtu, Maria Lourdes",
            dateOfBirth: "February 7, 1978",
            gender: "Female",
            maritalStatus: "Single",
            email: "lourdz0720@gmail.com",
            contact: "09770684897",
            dateSubmitted: "01/29/2026",
            site: "Carcar",
            status: "Pending",
            hasCV: true,
            hasApplicationDetails: true,
        },
    ];

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "under review":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredData = applicantsData.filter((applicant) => {
        const matchesSearch =
            applicant.fullname
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.applicationNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || applicant.status === statusFilter;
        const matchesSite =
            siteFilter === "All Sites" || applicant.site === siteFilter;

        return matchesSearch && matchesStatus && matchesSite;
    });

    const toggleTable = () => {
        setIsTableExpanded(!isTableExpanded);
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            {/* Collapsible Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex-shrink-0">
                    <button
                        onClick={toggleTable}
                        className="flex items-center space-x-2 text-left hover:bg-gray-100 p-2 rounded-md transition-colors"
                    >
                        <svg
                            className={`h-5 w-5 transform transition-transform ${
                                isTableExpanded ? "rotate-90" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="font-medium text-gray-900">
                            APPLICANT RECORDS ({filteredData.length} applicants)
                        </span>
                    </button>
                </div>
            </div>

            {/* Collapsible Content */}
            {isTableExpanded && (
                <div className="bg-white p-6">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-wrap gap-4 items-center mb-6">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[300px]">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search Applicant"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
                                Search
                            </button>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        {/* Site Filter */}
                        <select
                            value={siteFilter}
                            onChange={(e) => setSiteFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All Sites">All Sites</option>
                            <option value="San Carlos">San Carlos</option>
                            <option value="Carcar">Carcar</option>
                            <option value="Manila">Manila</option>
                            <option value="Cebu">Cebu</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Application #
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Fullname
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Date of Birth
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Gender
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Marital Status
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Email Address
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Contact
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Date Submitted
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        CV File & Application Details
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Site
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((applicant, index) => (
                                    <tr
                                        key={applicant.applicationNumber}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        {/* Application Number */}
                                        <td className="py-4 px-4 text-sm text-gray-900">
                                            {applicant.applicationNumber}
                                        </td>

                                        {/* Full Name */}
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                            {applicant.fullname}
                                        </td>

                                        {/* Date of Birth */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {applicant.dateOfBirth}
                                        </td>

                                        {/* Gender */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {applicant.gender}
                                        </td>

                                        {/* Marital Status */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {applicant.maritalStatus}
                                        </td>

                                        {/* Email */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400 w-3 h-3" />
                                                {applicant.email}
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-gray-400 w-3 h-3" />
                                                {applicant.contact}
                                            </div>
                                        </td>

                                        {/* Date Submitted */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {applicant.dateSubmitted}
                                        </td>

                                        {/* CV File & Application Details */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {applicant.hasCV && (
                                                    <button className="bg-orange-100 p-2 rounded-md hover:bg-orange-200 transition-colors">
                                                        <FaFilePdf className="text-orange-600 w-4 h-4" />
                                                    </button>
                                                )}
                                                {applicant.hasApplicationDetails && (
                                                    <button className="bg-blue-100 p-2 rounded-md hover:bg-blue-200 transition-colors">
                                                        <FaFileWord className="text-blue-600 w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors">
                                                    <FaEye className="text-gray-600 w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>

                                        {/* Site */}
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {applicant.site}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(applicant.status)}`}
                                            >
                                                {applicant.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
