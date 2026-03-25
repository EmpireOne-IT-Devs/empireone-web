import { UploadCloud } from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <div>
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
        </div>
    );
}
