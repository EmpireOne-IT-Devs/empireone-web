import React from "react";
import { Briefcase } from "lucide-react";

export default function HeaderSection() {
    return (
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Briefcase size={22} />
                </div>

                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Job Offers
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage and track all job postings efficiently
                    </p>
                </div>
            </div>
        </div>
    );
}
