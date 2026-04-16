import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { peso_format } from "@/app/lib/peso-format";
import { BriefcaseIcon, InfoIcon } from "lucide-react";
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
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <BriefcaseIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Job Offer
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Job Offer Details
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                        <span className="text-blue-500 shrink-0 mt-px">
                            <InfoIcon size={16} />
                        </span>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Current Status:{" "}
                            <span className="font-semibold uppercase">
                                {data.status}
                            </span>
                        </p>
                    </div>

                    {data?.declined_reason && (
                        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100">
                            <span className="text-red-500 shrink-0 mt-px">
                                <InfoIcon size={16} />
                            </span>
                            <p className="text-xs text-red-700 leading-relaxed">
                                Declined Reason:{" "}
                                <span className="font-semibold">
                                    {data.declined_reason}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-blue-600 font-mono">
                                Position Details
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 px-4 py-3 text-sm text-gray-700">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Name
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {data.user.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Email
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {data.user.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Job Title
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {
                                        data.job_application?.job_posting
                                            .job_requisition.title
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Department
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {
                                        data.job_application?.job_posting
                                            .job_requisition.department.name
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-blue-600 font-mono">
                                Offers
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 px-4 py-3 text-sm text-gray-700">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Salary
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {peso_format(data.salary)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                    Role
                                </p>
                                <p className="font-medium text-neutral-800">
                                    {data.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-blue-600 font-mono">
                                Allowances
                            </p>
                        </div>
                        {data.allowances.length === 0 ? (
                            <p className="text-xs text-red-500 px-4 py-3">
                                No Allowance
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.allowances.map((res, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 gap-x-6 gap-y-2.5 px-4 py-3 text-sm text-gray-700"
                                    >
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                                Allowance Type
                                            </p>
                                            <p className="font-medium text-neutral-800">
                                                {res.allowance_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                                                Amount
                                            </p>
                                            <p className="font-medium text-neutral-800">
                                                {peso_format(res.allowance)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
