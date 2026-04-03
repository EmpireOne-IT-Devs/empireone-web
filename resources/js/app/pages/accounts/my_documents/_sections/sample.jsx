import React, { useState } from "react";
import {
    Search,
    UploadCloud,
    Eye,
    Download,
    Trash2,
    FileText,
    Image as ImageIcon,
    Upload,
    File,
} from "lucide-react";

const TableSection = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data based on the generated design and checklist
    const documents = [
        {
            id: 1,
            type: "pdf",
            name: "Birth Certificate.pdf",
            size: "1.2 MB",
            date: "Mar 15, 2024",
            status: "Verified",
        },
        {
            id: 2,
            type: "docx",
            name: "SSS Form E1.docx",
            size: "450 KB",
            date: "Mar 20, 2024",
            status: "Pending",
        },
        {
            id: 3,
            type: "jpg",
            name: "NBI Clearance.jpg",
            size: "1.5 MB",
            date: "Mar 10, 2024",
            status: "Upload Required",
        },
        {
            id: 4,
            type: "png",
            name: "2x2 Photo.png",
            size: "80 KB",
            date: "Mar 05, 2024",
            status: "Verified",
        },
    ];

    // Helper to render the correct document icon and color
    const getFileIcon = (type) => {
        switch (type) {
            case "pdf":
                return (
                    <div className="p-2 bg-red-100 text-red-600 rounded">
                        <FileText size={20} />
                    </div>
                );
            case "docx":
                return (
                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                        <File size={20} />
                    </div>
                );
            case "jpg":
            case "png":
                return (
                    <div className="p-2 bg-purple-100 text-purple-600 rounded">
                        <ImageIcon size={20} />
                    </div>
                );
            default:
                return (
                    <div className="p-2 bg-gray-100 text-gray-600 rounded">
                        <FileText size={20} />
                    </div>
                );
        }
    };

    // Helper to render the status badges
    const getStatusBadge = (status) => {
        switch (status) {
            case "Verified":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Verified
                    </span>
                );
            case "Pending":
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Pending Verification
                    </span>
                );
            case "Upload Required":
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Upload Required
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className=" mx-auto w-full text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        My Documents
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Manage, upload, and track the status of your
                        pre-employment documents.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    <UploadCloud size={20} />
                    Upload New Document
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Filter by Status</option>
                        <option>Verified</option>
                        <option>Pending</option>
                        <option>Upload Required</option>
                    </select>
                    <select className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Sort by: All</option>
                        <option>Newest First</option>
                        <option>Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg font-medium text-slate-700 shadow-sm">
                    Total: <span className="text-slate-900">12</span>
                </div>
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-medium text-green-700 shadow-sm">
                    Verified: 8
                </div>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg font-medium text-yellow-700 shadow-sm">
                    Pending: 2
                </div>
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-medium text-red-700 shadow-sm">
                    Upload Required: 2
                </div>
            </div>

            {/* Document Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">
                                    [Type]
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Document Name
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    File Size
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Date Uploaded
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {documents.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        {getFileIcon(doc.type)}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {doc.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {doc.size}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {doc.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(doc.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-3 items-center text-slate-400">
                                            {doc.status ===
                                            "Upload Required" ? (
                                                <>
                                                    <button className="flex items-center gap-1 px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium">
                                                        <Upload size={16} />{" "}
                                                        Upload
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="hover:text-blue-600 transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                    <button
                                                        className="hover:text-blue-600 transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={20} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableSection;
