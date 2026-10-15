import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk } from "@/app/redux/job-posting-thunk";
import { update_job_application_status_service } from "@/app/services/job-application-service";
import { add_notes_application_service } from "@/app/services/employee-relation-service";
import store from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Badge from "@/app/_components/badge";
import Modal from "@/app/_components/modal";
import { FcRules } from "react-icons/fc";
import { FiPlus } from "react-icons/fi";

export default function EditStatusSection({ data, table_status }) {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(data[table_status] || "");
    const [pendingStatus, setPendingStatus] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setStatus(data[table_status]);
    }, [data[table_status]]);
    const screening_status = [
        "New",
        "Conducted",
        "Screen Passed",
        "Screen Failed",
        "Not Interested",
        "No Response",
    ];

    const interview_status = [
        "Scheduled",
        "Not Scheduled",
        "Passed",
        "Failed",
        "No Show",
    ];

    const final_status = [
        "Passed",
        "Failed",
        "Withdrawn",
        "Pool",
        "Sent Job Offer",
        "Accepted Job Offer",
        "Declined Job Offer",
        "Passed with Condition",
        "Hired",
        "Rejected",
        "No Show",
    ];

    const getStatusVariant = (statusValue) => {
        switch (statusValue) {
            case "New":
                return "primary";

            case "Conducted":
            case "Scheduled":
            case "Not Scheduled":
            case "Pool":
            case "Pooled":
            case "Passed with Condition":
                return "warning";

            case "Screen Passed":
            case "Screened Passed":
            case "Passed":
            case "Accepted Job Offer":
            case "Hired":
                return "success";

            case "Screen Failed":
            case "Screened Failed":
            case "Failed":
            case "Declined Job Offer":
            case "Rejected":
                return "danger";

            case "Not Interested":
            case "No Response":
            case "No Show":
            case "Withdrawn":
                return "secondary";

            default:
                return "secondary";
        }
    };

    const handleSelectChange = (newStatus) => {
        if (!newStatus || newStatus === status) {
            setIsEditing(false);
            return;
        }
        setPendingStatus(newStatus);
        setShowNoteModal(true);
    };

    const handleConfirmStatusChange = async (e) => {
        e.preventDefault();
        if (!pendingStatus) return;

        try {
            setLoading(true);

            // 1. Save evaluation note if entered
            if (noteText.trim()) {
                const stageLabel = `${table_status.replace("_", " ").toUpperCase()} update to '${pendingStatus}'`;

                await add_notes_application_service({
                    id: data?.id,
                    stage: stageLabel,
                    text: noteText.trim(),
                });
            }

            // 2. Update status in database
            await update_job_application_status_service({
                ...data,
                start_date: data?.job_posting?.job_requisition?.target_start_date,
                [table_status]: pendingStatus,
            });

            // 3. Re-fetch applicants to refresh Redux store
            await store.dispatch(get_applicants_thunk());

            setStatus(pendingStatus);
            setNoteText("");
            setPendingStatus(null);
            setShowNoteModal(false);
            setIsEditing(false);

            dispatch(
                setAlert({
                    type: "success",
                    title: "Status Updated Successfully!",
                    message: `Status updated to ${pendingStatus} with interview notes recorded.`,
                    open: true,
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to Update Status",
                    message: error?.response?.data?.message || "Something went wrong",
                    open: true,
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const isTransferred = data.final_status === "Transferred";

    return (
        <div className="min-h-[50px] flex items-center">
            {isEditing ? (
                <div className="relative min-w-[180px] flex">
                    <select
                        autoFocus
                        value={status}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        onBlur={() => {
                            if (!showNoteModal) setIsEditing(false);
                        }}
                        className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border-2 border-blue-500 rounded-md focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Select Status</option>
                        {table_status === "screening_status" &&
                            screening_status.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}

                        {table_status === "interview_status" &&
                            interview_status.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}

                        {table_status === "final_status" &&
                            final_status.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                    </select>
                </div>
            ) : (
                <div
                    onDoubleClick={() => {
                        if (!isTransferred) {
                            setIsEditing(true);
                        }
                    }}
                    className="cursor-pointer"
                    title="Double click to edit"
                >
                    <Badge
                        label={status || "N/A"}
                        variant={getStatusVariant(status)}
                        solid
                    />
                </div>
            )}

            {/* Note Entry Modal triggered when any status option is selected */}
            <Modal
                width="max-w-md"
                isOpen={showNoteModal}
                onClose={() => {
                    setShowNoteModal(false);
                    setIsEditing(false);
                    setPendingStatus(null);
                    setNoteText("");
                }}
                title={
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 shrink-0">
                            <FcRules size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                                Confirm Status Change
                            </p>
                            <h2 className="text-sm font-bold text-gray-800 leading-snug">
                                Change to "{pendingStatus}"
                            </h2>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleConfirmStatusChange} className="space-y-4 pt-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">
                            Interview / Evaluation Note (Optional)
                        </label>
                        <textarea
                            rows="4"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add reason or interview observations for this status update..."
                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowNoteModal(false);
                                setIsEditing(false);
                                setPendingStatus(null);
                                setNoteText("");
                            }}
                            className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FiPlus className="w-4 h-4" />
                            {loading ? "Saving..." : "Confirm & Save Status"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}