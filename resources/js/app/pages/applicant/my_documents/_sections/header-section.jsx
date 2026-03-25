import { UploadCloud } from "lucide-react";
import React from "react";
import AddDocumentSection from "./add-document-section";

export default function HeaderSection() {
    return (
        <div className="flex w-full  justify-between items-start md:items-center">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    My Documents
                </h1>
                <p className="text-slate-500 text-sm">
                    Manage, upload, and track the status of your pre-employment
                    documents.
                </p>
            </div>
            <div className="flex-none">
                <AddDocumentSection />
            </div>
        </div>
    );
}
