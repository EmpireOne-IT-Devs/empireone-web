import { AlertCircle, Megaphone, ChevronRight, Shield } from "lucide-react";
import React from "react";

export default function UrgentAnnouncementSection() {
    return (
        <div className="flex-1 flex flex-col bg-red-50 rounded-lg shadow border-l-4 border-l-red-600 p-6 mt-6  ">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-semibold text-gray-900">Urgent Announcements</h2>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-red-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                            Company-wide Town Hall Meeting
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            2 hours from now
                        </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                            Holiday Office Closure Schedule
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            Tomorrow
                        </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-yellow-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                            New Health Insurance Benefits
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            3 days
                        </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
            </div>

            <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Announcements →
                </button>
            </div>
        </div>
    );
}