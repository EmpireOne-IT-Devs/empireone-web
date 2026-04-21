import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
import { add_documents_service } from "@/app/services/documents-services";
import store from "@/app/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function JobOfferAgreeSection() {
    const { loading, document } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // Safely check window for Next.js
    const user_id =
        typeof window !== "undefined"
            ? window.location.pathname.split("/")[3]
            : null;

    async function submit_contract_agreement() {
        // Prevent submission if there is no document to upload
        if (!document?.url) {
            console.error("No document URL found in state.");
            return;
        }

        setIsLoading(true); // Start button loading state

        try {
            // Fetch the actual PDF file blob from the URL saved in Redux
            const fileResponse = await fetch(document.url);
            const fileBlob = await fileResponse.blob();

            const formData = new FormData();
            formData.append(
                "documents[0][name]",
                document.name || "Job_Offer.pdf",
            );

            formData.append("documents[0][status]", "Approved");
            formData.append(
                "documents[0][file]",
                fileBlob,
                document.name || "Job_Offer.pdf",
            );

            await add_documents_service(formData);
            await store.dispatch(
                get_job_offer_by_id_thunk(
                    window.location.pathname.split("/")[4],
                ),
            );
            dispatch(
                setAlert({
                    type: "success",
                    title: "Documents added Successfully!",
                    message:
                        "The document has been created and is ready for review.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error("Failed to upload documents:", error);
            // You might want to dispatch an error alert here too
        } finally {
            setIsLoading(false); // Stop button loading state
        }
    }

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <Button
                loading={isLoading}
                onClick={submit_contract_agreement}
                disabled={loading || isLoading}
            >
                I Accept Job Offer
            </Button>
        </div>
    );
}
