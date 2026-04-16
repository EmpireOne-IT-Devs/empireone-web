import React, { useEffect } from "react";
import store from "@/app/store/store";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import TalentApplicationForm from "./_sections/talent-application-form";
export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_posting_thunk());
    }, []);

    return (
        <>
            <TalentApplicationForm />
        </>
    );
}
