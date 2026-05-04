import React from "react";
import AddDocumentSection from "./add-document-section";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    My Documents
                </h1>
                <p className="text-slate-500 text-sm">
                    Manage, upload, and track the status of your pre-employment
                    documents.
                </p>
            </div>
            <div className="flex-none w-full sm:w-auto">
                <AddDocumentSection />
            </div>
        </div>
    );
}
