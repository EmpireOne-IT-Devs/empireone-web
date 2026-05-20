import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import React from "react";
import { TbBulb, TbFileDownload } from "react-icons/tb";
import { TiWarningOutline } from "react-icons/ti";

export default function RecurringIssueSection() {
    const recurringIssues = [
        {
            title: "Slow Performance on Accounting Software",
            occurrences: 47,
            affectedUsers: 23,
            firstReported: "Nov 15, 2025",
            lastOccurrence: "2 hours ago",
            category: "Software",
            priority: "High",
            priorityVariant: "danger",
            solution:
                "Database optimization and server upgrade required. Consider implementing caching mechanisms.",
        },
        {
            title: "VPN Connection Drops Frequently",
            occurrences: 35,
            affectedUsers: 18,
            firstReported: "Dec 3, 2025",
            lastOccurrence: "1 day ago",
            category: "Network",
            priority: "High",
            priorityVariant: "danger",
            solution:
                "Update VPN client to latest version and review network infrastructure for stability issues.",
        },
        {
             title: "Printer Queue Stuck on Floor 3",
            occurrences: 28,
            affectedUsers: 42,
            firstReported: "Jan 8, 2026",
            lastOccurrence: "3 days ago",
            category: "Hardware",
            priority: "Medium",
            priorityVariant: "secondary",
            solution:
                "Replace aging printer with new model and implement proper driver management system.",
        },
    ];

    return (
        <div className="bg-white shadow-lg p-5 rounded-xl border border-gray-200">
            <div className="flex gap-3 py-3 border-b-2 border-gray-200 items-center justify-between mb-4">
                <div className="flex-1 flex gap-3 items-start justify-start">
                    <TiWarningOutline className="text-orange-600 text-5xl flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                        <div className="text-xl font-bold text-gray-800">
                            Recurring Issues - Needs Permanent Solution
                        </div>
                        <div className="text-sm text-gray-600">
                            Issues that repeatedly affect users and require
                            systemic fixes
                        </div>
                    </div>
                </div>
                <div>
                    <Button variant="primary" className="flex items-center gap-2">
                        <TbFileDownload className="text-xl" /> Export
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {recurringIssues.map((issue, index) => (
                    <Card
                        key={index}
                        variant="warning"
                        outlined
                        className="bg-orange-50 border-2 border-orange-200"
                    >
                        <div className="flex items-center gap-3 py-2 mb-3">
                            <TiWarningOutline className="text-orange-600 text-2xl flex-shrink-0" />
                            <div className="text-lg font-semibold text-gray-800 flex-1">
                                {issue.title}
                            </div>
                            <Badge
                                variant={issue.priorityVariant}
                                label={issue.priority}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-gray-600 font-medium">
                                    Occurrences
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {issue.occurrences} times
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-gray-600 font-medium">
                                    Affected Users
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {issue.affectedUsers} users
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-gray-600 font-medium">
                                    First Reported
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {issue.firstReported}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-gray-600 font-medium">
                                    Last Occurrence
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {issue.lastOccurrence}
                                </div>
                            </div>
                        </div>

                        <Card
                            variant="primary"
                            outlined
                            className="mb-4 bg-blue-50 border-2 border-blue-200"
                        >
                            <div className="flex gap-3">
                                <TbBulb className="text-blue-700 text-4xl flex-shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <div className="font-bold text-gray-800">
                                        Recommended Solution:
                                    </div>
                                    <div className="text-gray-700">
                                        {issue.solution}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex w-full items-center justify-between">
                            <Badge
                                variant="secondary"
                                label={issue.category}
                            />
                            <div className="flex gap-2">
                                <Button variant="primary" outlined>
                                    View All Tickets
                                </Button>
                                <Button variant="success" outlined>
                                    Mark as Resolved
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
