import Card from "@/app/_components/card";
import React from "react";
import { AlertCircle, ExternalLink } from "lucide-react";

const DUMMY_PENDING = [
    {
        id: 1,
        name: "Maria Santos",
        position: "Customer Service Rep",
        period: "3 Months",
        started_at: "2026-02-10",
    },
    {
        id: 2,
        name: "Jose Reyes",
        position: "Team Leader",
        period: "3 Months",
        started_at: "2026-02-15",
    },
    {
        id: 3,
        name: "Anna Cruz",
        position: "QA Analyst",
        period: "5 Months",
        started_at: "2025-12-01",
    },
    {
        id: 4,
        name: "Mark Dela Torre",
        position: "IT Support",
        period: "5 Months",
        started_at: "2025-12-20",
    },
];

export default function PendingEvaluationSection() {
    return (
        <Card padding="p-0" className="!cursor-default overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">
                        Pending Evaluations
                    </p>
                    <p className="text-xs text-gray-400">
                        Members who need performance evaluation created
                    </p>
                </div>
                <span className="ml-auto text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full">
                    {DUMMY_PENDING.length} pending
                </span>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-50">
                {DUMMY_PENDING.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                                {item.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.position}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    item.period === "3 Months"
                                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                                        : "bg-purple-50 text-purple-600 border border-purple-100"
                                }`}
                            >
                                {item.period}
                            </span>
                                
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
