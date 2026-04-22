import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_offer_by_id_thunk } from "@/app/redux/applicant-thunk";
import { add_documents_service } from "@/app/services/documents-services";
import { submit_job_offer_service } from "@/app/services/job-offer-service";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AcceptJobOfferSection() {
    const { loading, document } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [decision, setDecision] = useState("");
    const [reason, setReason] = useState("");
    const { job_offer } = useSelector((store) => store.applicants);
    console.log("job_offer", job_offer);
    async function submit_job_offer(status) {
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
            if (status == "Accepted Job Offer") {
                formData?.append(
                    "documents[0][name]",
                    document.name || "Job_Offer.pdf",
                );

                formData?.append("documents[0][status]", "Approved");
                formData?.append(
                    "documents[0][file]",
                    fileBlob,
                    document.name || "Job_Offer.pdf",
                );
                await add_documents_service(formData);
            }

            await submit_job_offer_service({
                ...job_offer,
                status: status,
                declined_reason: reason,
            });
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
            if (status == "Declined Job Offer") {
                router.visit("/accounts/administrator/job_offers");
            }
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
                disabled={loading || isLoading}
                onClick={() => setOpen(true)}
            >
                I Accept Job Offer
            </Button>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Job Offer Details"
            >
                <div className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100">
                    {/* <div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Position Details
                            </p>
                            <div className="font-bold text-green-600 uppercase text-xs tracking-wider mb-2">
                                Status: {job_offer?.status}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Name:</strong> {job_offer?.user?.name}{" "}
                            </p>
                            <p>
                                <strong>Email:</strong> {job_offer?.user?.email}{" "}
                            </p>
                            <p>
                                <strong>Job Title:</strong>{" "}
                                {
                                    job_offer?.job_application?.job_posting?.job_requisition.title
                                }{" "}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {
                                    job_offer?.job_application?.job_posting?.job_requisition?.department?.name
                                }{" "}
                            </p>
                        </div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2 mt-2">
                            Offers
                        </p>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Salary:</strong>{" "}
                                {peso_format(job_offer?.salary)}{" "}
                            </p>
                            <p>
                                <strong>Role:</strong> {job_offer?.role}{" "}
                            </p>
                        </div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2 mt-2">
                            Allowances
                        </p>
                        {job_offer?.allowances.length == 0 && (
                            <div className="text-red-500">No Allowance</div>
                        )}
                        {job_offer?.allowances.map((res) => {
                            return (
                                <div className="grid grid-cols-2 gap-y-1">
                                    <p>
                                        <strong>Allowance Type:</strong>{" "}
                                        {res.allowance_type}
                                    </p>
                                    <p>
                                        <strong>Allowance:</strong>{" "}
                                        {peso_format(res.allowance)}
                                    </p>
                                </div>
                            );
                        })}
                    </div> */}

                    <div className="space-y-3">
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider">
                            Your Decision
                        </p>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer font-black">
                                <input
                                    type="radio"
                                    name="decision"
                                    value="Accepted"
                                    checked={decision === "Accepted"}
                                    onChange={(e) =>
                                        setDecision(e.target.value)
                                    }
                                />
                                Accept
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer font-black">
                                <input
                                    type="radio"
                                    name="decision"
                                    value="Declined"
                                    checked={decision === "Declined"}
                                    onChange={(e) =>
                                        setDecision(e.target.value)
                                    }
                                />
                                Decline
                            </label>
                        </div>

                        {decision === "Declined" && (
                            <textarea
                                className="w-full border rounded-md p-2 text-sm"
                                rows={3}
                                placeholder="Please provide your reason for declining..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="flex w-full gap-3">
                        {decision === "Declined" && (
                            <Button
                                disabled={loading}
                                loading={isLoading}
                                onClick={() =>
                                    submit_job_offer("Declined Job Offer")
                                }
                                className="flex-1"
                                variant="danger"
                            >
                                DECLINED JOB OFFER
                            </Button>
                        )}

                        {decision === "Accepted" && (
                            <Button
                                disabled={loading}
                                loading={isLoading}
                                onClick={() =>
                                    submit_job_offer("Accepted Job Offer")
                                }
                                className=" flex-1"
                            >
                                ACCEPT JOB OFFER
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
