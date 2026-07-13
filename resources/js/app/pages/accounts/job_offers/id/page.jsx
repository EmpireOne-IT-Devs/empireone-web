import React, { useEffect } from "react";
import AgentOfferLetterPreview from "./jo_documents/agent-document";
import ManagerOfferLetterPreview from "./jo_documents/manager-document";
import SupportOfferLetterPreview from "./jo_documents/support-document";
import store from "@/app/store/store";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
import { useSelector } from "react-redux";
import AcceptJobOfferSection from "./_sections/accept-job-offer-section";
import VerifySection from "./_sections/verify-section";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";

export default function Page() {
    const { job_offer } = useSelector((store) => store.applicants);
    const { user } = useSelector((store) => store.app);
    useEffect(() => {
        store.dispatch(
            get_job_offer_by_id_thunk(window.location.pathname.split("/")[4]),
        );
    }, []);
    useEffect(() => {
        if (job_offer?.user_id) {
            store.dispatch(get_user_by_id_thunk(job_offer?.user_id));
        }
    }, [job_offer?.user_id]);
    // const validOffers = ["Managerial Offer", "Agent Offer", "Support Offer"];

    // const hasOffer = job_offer?.documents?.some((res) =>
    //     validOffers.includes(res.name),
    // );
    // console.log("job_offer", user?.account_employee?.signature);

    function verified_section() {
        if (user?.account_employee?.signature === undefined) {
            return <VerifySection />;
        } else if (user?.account_employee?.signature === null) {
            return (
                user?.account_employee?.signature === null && <VerifySection />
            );
        } else if (user?.account_employee?.signature != null) {
            return (
                <>
                    {job_offer?.role == "Manager" && (
                        <ManagerOfferLetterPreview
                            name="Managerial Offer"
                            type="offer"
                            applicant_signature={
                                user?.account_employee?.signature
                            }
                        />
                    )}
                    {job_offer?.role == "Agent" && (
                        <AgentOfferLetterPreview
                            name="Agent Offer"
                            type="offer"
                            applicant_signature={
                                user?.account_employee?.signature
                            }
                        />
                    )}
                    {job_offer?.role == "Support" && (
                        <SupportOfferLetterPreview
                            name="Support Offer"
                            type="offer"
                            applicant_signature={
                                user?.account_employee?.signature
                            }
                        />
                    )}
                    {job_offer?.status == "Pending" && (
                        <AcceptJobOfferSection />
                    )}
                </>
            );
        }
    }
    return verified_section();
}
