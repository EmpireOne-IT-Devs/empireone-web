import React, { useEffect } from "react";
import AgentOfferLetterPreview from "./jo_documents/agent-document";
import ManagerOfferLetterPreview from "./jo_documents/manager-document";
import SupportOfferLetterPreview from "./jo_documents/support-document";
import store from "@/app/store/store";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
import JobOfferAgreeSection from "./jo_documents/job-offer-agree-section";
import { useSelector } from "react-redux";

export default function Page() {
    const { job_offer } = useSelector((store) => store.applicants);
    useEffect(() => {
        store.dispatch(
            get_job_offer_by_id_thunk(window.location.pathname.split("/")[4]),
        );
    }, []);
    console.log("job_offer", job_offer);
    return (
        <>
            {job_offer?.role == "Manager" && <ManagerOfferLetterPreview />}
            {job_offer?.role == "Agent" && <AgentOfferLetterPreview />}
            {job_offer?.role == "Support" && <SupportOfferLetterPreview />}
            <JobOfferAgreeSection />
        </>
    );
}
