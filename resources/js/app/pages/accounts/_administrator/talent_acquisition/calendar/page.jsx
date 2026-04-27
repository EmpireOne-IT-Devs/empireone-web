import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import CalendarSection from "./_sections/calendar-section";
import InterviewerSection from "./_sections/interviewer-section";
import store from "@/app/store/store";
import { get_job_applicant_schedule_thunk } from "@/app/redux/talent-acquisition-thunk";
import { get_job_interviewer_schedule_thunk } from "@/app/redux/app-thunk";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_applicant_schedule_thunk());
        store.dispatch(get_job_interviewer_schedule_thunk());
        store.dispatch(get_job_requisitions_thunk());
    }, []);
    return (
        <Layout>
            <JobPostingLayout>
                <div className="flex flex-col lg:flex-row gap-6 w-full mt-5">
                    <CalendarSection />
                    <div className="flex flex-col gap-5 overflow-auto h-[80vh] py-3">
                        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-auto self-start ">
                            <InterviewerSection />
                        </div>
                    </div>
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
