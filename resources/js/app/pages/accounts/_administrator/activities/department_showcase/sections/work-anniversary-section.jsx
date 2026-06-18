import React from "react";
import { Award, Medal } from "lucide-react";
import Card from "@/app/_components/card";

const ANNIVERSARY_DATA = [
    {
        id: 1,
        name: "David Thompson",
        initial: "DT",
        dept: "HR",
        years: 5,
        avatarColor: "bg-blue-800",
    },
    {
        id: 2,
        name: "David Thompson",
        initial: "DT",
        dept: "HR",
        years: 5,
        avatarColor: "bg-blue-800",
    },
    {
        id: 3,
        name: "David Thompson",
        initial: "DT",
        dept: "HR",
        years: 5,
        avatarColor: "bg-blue-800",
    },
];

export default function WorkAnniversarySection() {
    return (
        <div className="w-full flex flex-col font-sans antialiased mt-2">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3.5 px-1">
                <Award size={18} className="text-indigo-900 stroke-[2.5]" />
                <h2 className="text-sm font-bold text-indigo-950 tracking-tight">
                    Work Anniversaries
                </h2>
            </div>

            {/* Anniversary Container Grid / List */}
            <div className="flex flex-col gap-3">
                {ANNIVERSARY_DATA.map((employee) => (
                    <Card key={employee.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="flex items-start gap-4">
                            {/* Left Side: Avatar Cluster with Milestone Ribbon Badge */}
                            <div className="relative shrink-0 mt-0.5">
                                <div
                                    className={`w-12 h-12 rounded-full ${employee.avatarColor} flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-sm`}
                                >
                                    {employee.initial}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center">
                                    <Medal size={10} className="stroke-[2.5]" />
                                </div>
                            </div>

                            {/* Right Side: Employee Corporate Identity Credentials & Milestones */}
                            <div className="flex flex-col text-left min-w-0">
                                <span className="text-sm font-bold text-gray-800 tracking-tight truncate">
                                    {employee.name}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                                    {employee.dept}
                                </span>
                                <div className="text-sm font-medium text-gray-600 mt-2.5 flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-indigo-900 leading-none">
                                        {employee.years}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-500">
                                        years with us!
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}