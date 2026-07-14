import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddInterviewerSection from "./add-interviewer-section";
import EditInterviewection from "./edit-interview-section";

export default function InterviewerSection({ autoOpen = false }) {
    const { interviewers } = useSelector((store) => store.app);


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
                <AddInterviewerSection autoOpen={autoOpen} />
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
                            <EditInterviewection
                                props_data={item} />

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
