
import { Plus, Activity, Briefcase, Fingerprint } from "lucide-react";
import { FaArrowTrendUp } from "react-icons/fa6";

export default function QuickAccessSection() {
    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <FaArrowTrendUp className="w-5 h-5 text-blue-600" />

                    <h2 className="text-lg font-semibold text-gray-800">
                        Quick Actions
                    </h2>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-lg transition-colors border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                            Create Ticket
                        </span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-lg transition-colors border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                            View Activities
                        </span>
                    </button>

                    <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-lg transition-colors border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-teal-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                            Job Postings
                        </span>
                    </button>

                    <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-lg  transition-colors border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                            <Fingerprint className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                            Clock In/Out
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}