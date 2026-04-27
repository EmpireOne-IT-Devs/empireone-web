import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddInterviewerSection from "./add-interviewer-section";
// Import your actual actions here:
// import { addInterviewer, removeInterviewer } from "../../_redux/app-slice";

export default function InterviewerSection() {
    const { interviewers } = useSelector((store) => store.app);
 
    // Helper to format days (e.g., 1 to 5 becomes Mon-Fri)
    const formatSchedule = (item) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return `${days[item.day_of_week_from]} - ${days[item.day_of_week_to]} (${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)})`;
    };
    console.log('interviewers',interviewers)

   
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Interviewer Schedule
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage interviewer availability slots.
                    </p>
                </div>
            </div>

            <div className="flex w-full items-end justify-end">
                <AddInterviewerSection />
            </div>
            <div className="flex flex-col gap-3">
                {interviewers?.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                        No interviewers scheduled.
                    </div>
                ) : (
                    interviewers?.map((item) => (
                        <div
                            key={item.id}
                            className="group flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                                    {item.interviewer?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {item.interviewer?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500 items-start  mt-0.5 flex flex-col gap-2">
                                        <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600">
                                            SCHEDULE
                                        </span>
                                        {formatSchedule(item)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
