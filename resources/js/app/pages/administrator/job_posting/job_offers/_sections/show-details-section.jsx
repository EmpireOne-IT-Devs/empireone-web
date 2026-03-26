import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { peso_format } from "@/app/lib/peso-format";
import React, { useState } from "react";

export default function ShowDetailsSection({ data }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)} outlined>
                VIEW DETAILS
            </Button>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
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

                        {data?.declined_reason && (
                            <>
                                <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2 mt-2">
                                    Declined Reason:
                                </p>
                                <div className="text-red-600">
                                    {data?.declined_reason}
                                </div>
                            </>
                        )}

                        {data.allowances.length == 0 && (
                            <div className="text-red-500">No Allowance</div>
                        )}
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
                </div>
            </Modal>
        </div>
    );
}
