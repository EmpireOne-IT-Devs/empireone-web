import React from "react";
import { MessageCircle } from "lucide-react";

export default function HeaderSection() {
    return (
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                    <MessageCircle className="w-6 h-6" />
                </div>

                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        EmpireOne Chat
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage and track all job postings efficiently
                    </p>
                </div>
            </div>
        </div>
    );
}
