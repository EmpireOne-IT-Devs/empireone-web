import React, { useEffect } from "react";
import AgentOfferLetterPreview from "./jo_documents/agent-document";
import ManagerOfferLetterPreview from "./jo_documents/manager-document";
import SupportOfferLetterPreview from "./jo_documents/support-document";
import store from "@/app/store/store";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
// import JobOfferAgreeSection from "./jo_documents/job-offer-agree-section";
import { useSelector } from "react-redux";
import AcceptJobOfferSection from "./jo_documents/accept-job-offer-section";

export default function Page() {
    const { job_offer } = useSelector((store) => store.applicants);
    useEffect(() => {
        store.dispatch(
            get_job_offer_by_id_thunk(window.location.pathname.split("/")[4]),
        );
    }, []);
    // const validOffers = ["Managerial Offer", "Agent Offer", "Support Offer"];

    // const hasOffer = job_offer?.documents?.some((res) =>
    //     validOffers.includes(res.name),
    // );
    console.log("job_offer", job_offer.status);
    return (
        <>
            {job_offer?.role == "Manager" && (
                <ManagerOfferLetterPreview
                    name="Managerial Offer"
                    type="offer"
                />
            )}
            {job_offer?.role == "Agent" && (
                <AgentOfferLetterPreview name="Agent Offer" type="offer" />
            )}
            {job_offer?.role == "Support" && (
                <SupportOfferLetterPreview name="Support Offer" type="offer" />
            )}
            {job_offer?.status == "Pending" && <AcceptJobOfferSection />}
        </>
    );
}
