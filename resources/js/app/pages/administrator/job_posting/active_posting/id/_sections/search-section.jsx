import { Search } from "lucide-react";
import React from "react";

export default function SearchSection() {
    return (
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search applicants..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex gap-2">
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none">
                    <option>All Status</option>
                    <option>Interview</option>
                    <option>Hired</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Export CSV
                </button>
            </div>
        </div>
    );
}
