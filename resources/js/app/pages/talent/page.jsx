import React, { useEffect } from "react";
import store from "@/app/store/store";
import { get_job_posting_by_location_thunk } from "@/app/redux/job-posting-thunk";
import TalentApplicationForm from "./_sections/talent-application-form";
import { useSelector } from "react-redux";
import { get_departments_thunk } from "@/app/redux/department-thunk";
import Layout from "./layout";
import LoadingPage from "@/app/_components/loading-page";
export default function Page() {
    const { job_postings } = useSelector((store) => store.job_postings);
    const { job_posting_id } = useSelector((store) => store.app);
    // Store may still hold the landing page's paginated object until the location fetch resolves.
    const isLoaded = Array.isArray(job_postings);

    const interview_id = isLoaded
        ? job_postings.find((res) => res.id == job_posting_id)
              ?.job_requisition?.recruiter_id
        : undefined;

    useEffect(() => {
        store.dispatch(get_job_posting_by_location_thunk(window.location.pathname.split('/')[3]));
        store.dispatch(get_departments_thunk());
    }, []);
    
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
    if (!isLoaded) {
        return (
            <LoadingPage
                title="Loading positions"
                message="Preparing your application..."
            />
        );
    }

    return (
        <Layout>
            <TalentApplicationForm />
        </Layout>
    );
}
