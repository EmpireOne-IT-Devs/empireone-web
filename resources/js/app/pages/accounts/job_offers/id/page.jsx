import React, { useEffect } from "react";
import AgentOfferLetterPreview from "./jo_documents/agent-document";
import ManagerOfferLetterPreview from "./jo_documents/manager-document";
import SupportOfferLetterPreview from "./jo_documents/support-document";
import store from "@/app/store/store";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
import JobOfferAgreeSection from "./jo_documents/job-offer-agree-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(
            get_job_offer_by_id_thunk(window.location.pathname.split("/")[4]),
        );
    }, []);
    return (
        <>
            <ManagerOfferLetterPreview />
            <JobOfferAgreeSection />
        </>
    );
}
