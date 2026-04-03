import { Search } from "lucide-react";
import React from "react";

export default function SearchSection() {
    return (
        <div>
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
                      
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Filter by Status</option>
                        <option>Verified</option>
                        <option>Pending</option>
                        <option>Upload Required</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
