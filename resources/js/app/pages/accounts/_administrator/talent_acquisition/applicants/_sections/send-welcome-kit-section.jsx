import Modal from "@/app/_components/modal";
import { FiCheckSquare as ClipboardCheckIcon } from "react-icons/fi";
import React, { useState } from "react";
import { send_all_welcome_kit_service } from "@/app/services/human-resources-service";
import Button from "@/app/_components/button";

const buildRecipientName = (data) => {
    const first = data?.personal_information?.first_name?.trim() || "";
    const middle = data?.personal_information?.middle_name?.trim() || "";
    const last = data?.personal_information?.last_name?.trim() || "";
    const fullName = [first, middle, last].filter(Boolean).join(" ");

    return (
        fullName ||
        data?.user?.name?.trim() ||
        data?.applicant?.name?.trim() ||
        "Colleague"
    );
};

const resolveRecipientEmail = (data) =>
    data?.eogs_email?.trim() ||
    data?.user?.email?.trim() ||
    data?.applicant?.email?.trim() ||
    "";

const resolveEmployeeId = (data) =>
    data?.employee_id || data?.user?.employee_id || "";

const resolveAccountName = (data) =>
    data?.job_posting?.job_requisition?.account?.name;

const resolveDesignation = (data) =>
    data?.job_posting?.job_requisition?.title ||
    data?.position ||
    data?.job_posting?.title ||
    data?.job_posting?.position ||
    data?.job_offer?.position ||
    data?.job_offer?.title ||
    "";

const formatHireDate = (rawDate) => {
    if (!rawDate) return "";

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
        return String(rawDate);
    }

    return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
    });
};

const resolveHireDate = (data) => {
    const raw =
        data?.job_posting?.job_requisition?.target_start_date ||
        data?.started_at ||
        data?.hire_date ||
        data?.job_offer?.start_date ||
        data?.job_offer?.hire_date ||
        "";

    return formatHireDate(raw);
};

export default function SendWelcomeKitSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const recipientEmail = resolveRecipientEmail(props_data);
    const recipientName = buildRecipientName(props_data);
    const employeeId = resolveEmployeeId(props_data) || "—";
    const accountName = resolveAccountName(props_data) || "—";
    const designation = resolveDesignation(props_data) || "—";
    const hireDate = resolveHireDate(props_data) || "—";
    console.log("accountName", props_data?.user?.account_employee?.is_kit_sent);
    const handleClose = () => {
        if (loading) return;
        setOpen(false);
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleOpen = () => {
        setErrorMsg("");
        setSuccessMsg("");
        setOpen(true);
    };

    const send_welcome_kit = async (e) => {
        e?.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!recipientEmail) {
            setErrorMsg("No recipient email found on this record.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email: recipientEmail,
                recipient_name: recipientName,
                employee_id: resolveEmployeeId(props_data),
                account_name: resolveAccountName(props_data),
                designation: resolveDesignation(props_data),
                hire_date: resolveHireDate(props_data),
            };

            const res = await send_all_welcome_kit_service(payload);
            setSuccessMsg(
                res?.message ||
                    `Welcome kit dispatched (${res?.sent_count ?? "all"} emails) to ${payload.email}.`,
            );
            setOpen(false);
        } catch (err) {
            setErrorMsg(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to send welcome kit.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                disabled={props_data?.user?.account_employee?.is_kit_sent}
                variant="primary"
                className="w-full"
                onClick={handleOpen}
                outlined
            >
                <div className="text-blue-600">SEND WELCOME KIT</div>
            </Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                width="max-w-xl"
                title={
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <ClipboardCheckIcon size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Onboarding &amp; HR
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Send Welcome Kit
                            </h2>
                        </div>
                    </div>
                }
            >
                <form onSubmit={send_welcome_kit} className="p-4 space-y-4">
                    {errorMsg && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                            {successMsg}
                        </div>
                    )}

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-2.5 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Recipient Details
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 pt-1">
                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Recipient Name
                                </span>
                                <span className="font-medium text-gray-900">
                                    {recipientName}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Recipient Email
                                </span>
                                <span className="font-medium text-gray-900 break-all">
                                    {recipientEmail || "—"}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Employee ID
                                </span>
                                <span className="font-medium text-gray-900">
                                    {employeeId}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Account
                                </span>
                                <span className="font-medium text-gray-900">
                                    {accountName}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Designation
                                </span>
                                <span className="font-medium text-gray-900">
                                    {designation}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] text-gray-500">
                                    Hire Date
                                </span>
                                <span className="font-medium text-gray-900">
                                    {hireDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !recipientEmail}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Confirm & Send"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
