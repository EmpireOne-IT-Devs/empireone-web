import React from "react";
import { Settings } from "lucide-react";

export default function HeaderSection() {
    return (
        <header className="max-w-lg w-full mx-auto bg-white border rounded-2xl p-6 shadow-sm mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100">
                    <Settings className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage your account preferences
                    </p>
                </div>
            </div>
        </header>
    );
}
