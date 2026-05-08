import { Link } from "@inertiajs/react";
import { Bell } from "lucide-react";
import React from "react";

export default function NoSignatureNotification() {
    const role = window.location.pathname.split("/")[2];

    return (
        <div className="fixed inset-0 w-screen h-screen bg-white flex items-center justify-center z-50">
            <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
                {/* Icon */}
                <div className="p-5 bg-blue-100 rounded-full mb-6">
                    <Bell className="w-14 h-14 text-blue-600" />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3">
                    Signature Required
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                        New
                    </span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
                    Your signature is almost complete. Please confirm your
                    identity details to access all features of the dashboard.
                </p>

                {/* Button */}
                <div className="mt-8">
                    <Link
                        href={`/accounts/${role}/my_profile/signature`}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                    >
                        ADD SIGNATURE
                    </Link>
                </div>
            </div>
        </div>
    );
}