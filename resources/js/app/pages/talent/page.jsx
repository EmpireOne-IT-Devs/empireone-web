import React, { useEffect } from "react";
import store from "@/app/store/store";
import { get_job_posting_by_location_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import TalentApplicationForm from "./_sections/talent-application-form";
import { useSelector } from "react-redux";
import { get_departments_thunk } from "@/app/redux/department-thunk";
import Layout from "./layout";
export default function Page() {
    const { job_postings } = useSelector((store) => store.job_postings);
    const { job_posting_id } = useSelector((store) => store.app);

    const interview_id = job_postings.find((res) => res.id == job_posting_id)
        ?.job_requisition?.recruiter_id;

    useEffect(() => {
        store.dispatch(get_job_posting_by_location_thunk(window.location.pathname.split('/')[3]));
        store.dispatch(get_departments_thunk());
    }, []);
    
    console.log('job_postings',job_postings)
    // useEffect(() => {
    //     if (interview_id) {
    //         store.dispatch(
    //             get_job_interviewer_schedule_by_interviewer_id_thunk(
    //                 interview_id,
    //             ),
    //         );
    //     }
    // }, [job_posting_id, interview_id]);

    // localStorage.clear();
    return (
        <Layout>
            <TalentApplicationForm />
            
        </Layout>
    );
}
