import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { peso_format } from "@/app/lib/peso-format";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_offer_by_user_thunk } from "@/app/redux/applicant-thunk";
import { submit_job_offer_service } from "@/app/services/job-offer-service";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AcceptJobOfferSection({ data }) {
    const params = new URLSearchParams(window.location.search);
    const job_order_id = params.get("job_order_id");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [decision, setDecision] = useState(""); // Accepted | Declined
    const [reason, setReason] = useState("");
    const role = window.location.pathname.split('/')[2]
    const dispatch = useDispatch();
    useEffect(() => {
        if (data.id == job_order_id) {
            setOpen(true);
        }
    }, []);

    function close_modal(params) {
        setOpen(false);
        router.visit(`/accounts/${role}/job_offers`);
    }
    function open_modal(id) {
        router.visit(`/accounts/${role}/job_offers?job_order_id=${id}`);
    }

    async function submit_job_offer(status) {
        try {
            setLoading(true);
            await submit_job_offer_service({
                ...data,
                status: status,
                declined_reason: reason,
            });
            await store.dispatch(get_job_offer_by_user_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: `Job Offer ${status}!`,
                }),
            );
            setOpen(false);
            setLoading(false);
        } catch (error) {}
    }
    return (
        <div>
            <Button onClick={() => open_modal(data.id)} outlined>
                ACCEPT JOB OFFER
            </Button>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => close_modal()}
                title="Job Offer Details"
            >
                <div className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100">
                    {/* Personal & Contact Info */}
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Position Details
                            </p>
                            <div className="font-bold text-green-600 uppercase text-xs tracking-wider mb-2">
                                Status: {data.status}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Name:</strong> {data.user.name}{" "}
                            </p>
                            <p>
                                <strong>Email:</strong> {data.user.email}{" "}
                            </p>
                            <p>
                                <strong>Job Title:</strong>{" "}
                                {
                                    data.job_application.job_posting
                                        .job_requisition.title
                                }{" "}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {
                                    data.job_application.job_posting
                                        .job_requisition.department.name
                                }{" "}
                            </p>
                        </div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2 mt-2">
                            Offers
                        </p>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Salary:</strong>{" "}
                                {peso_format(data.salary)}{" "}
                            </p>
                            <p>
                                <strong>Role:</strong> {data.role}{" "}
                            </p>
                        </div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2 mt-2">
                            Allowances
                        </p>
                        {data.allowances.length == 0 && (
                            <div className="text-red-500">No Allowance</div>
                        )}
                        {data.allowances.map((res) => {
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
                    </div>

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

                        {/* ✅ SHOW IF DECLINED */}
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
                                onClick={() => submit_job_offer("Declined Job Offer")}
                                className="flex-1"
                                variant="danger"
                            >
                                DECLINED JOB OFFER
                            </Button>
                        )}

                        {decision === "Accepted" && (
                            <Button
                                disabled={loading}
                                onClick={() => submit_job_offer("Accepted Job Offer")}
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
