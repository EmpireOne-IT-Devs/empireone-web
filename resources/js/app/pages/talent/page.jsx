import React, { useEffect } from "react";
import TalentFormSection from "./_sections/talent-form-section";
import store from "@/app/store/store";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_posting_thunk());
    }, []);

    return (
        <div>
            <TalentFormSection />
        </div>
    );
}
