import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import { CalendarIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { get_ta_top_performing_jobs_service } from "@/app/services/job-posting-service";
import { FiBriefcase } from "react-icons/fi";

export default function TopPerformingJobSection() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        get_ta_top_performing_jobs_service()
            .then(setJobs)
            .catch(console.error);
    }, []);

    const maxApplicants = jobs[0]?.applicants ?? 1;

    return (
        <Card className="flex-1 flex flex-col gap-3 p-6">
            <div className="pb-3 mb-1 flex items-center justify-between border-b border-gray-100">
                <div className="text-xl font-bold">Top Performing Jobs</div>
                <span className="text-xs text-gray-400 font-medium">By applicants</span>
            </div>

            <div className="overflow-y-auto max-h-72 pr-1">
                {jobs.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-10">No data available.</div>
                )}

                <div className="flex flex-col gap-3">
                    {jobs.map((job, index) => {
                        const barWidth = Math.round((job.applicants / maxApplicants) * 100);
                        return (
                            <div key={index} className="flex flex-col gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/40 transition-colors">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <FiBriefcase className="w-3.5 h-3.5 text-blue-600" />   
                                        </div>
                                        <span className="font-semibold text-sm text-gray-900 truncate">{job.title}</span>
                                    </div>
                                    <Badge
                                        className="rounded-md flex-shrink-0"
                                        label={job.status}
                                        variant={job.variant}
                                        showDot={false}
                                    />
                                </div>

                                {/* Progress bar */}
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <LuUsers className="w-3.5 h-3.5" />
                                        <span className="text-xs">{job.applicants} applicants</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        <span className="text-xs">{job.interviews} interviews</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
