import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk, get_job_application_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { update_job_application_status_service } from "@/app/services/job-application-service";
import store from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Badge from "@/app/_components/badge";

export default function EditStatusSection({ data, table_status }) {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(data[table_status] || "New");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setStatus(data[table_status]);
    }, [data[table_status]]);

    const screening_status = [
        "New",
        "Conducted",
        "Screened Passed",
        "Screened Failed",
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
        "Pooled",
        "Sent Job Offer",
        "Accepted Job Offer",
        "Declined Job Offer",
        "Passed with Condition",
        "Hired",
        "Rejected",
        "No Show",
    ];
    const getStatusVariant = (status) => {
        switch (status) {
            case "New":
                return "primary";
            case "Conducted":
            case "Scheduled":
            case "Not Scheduled":
            case "Pooled":
                return "warning";
            case "Screened Passed":
            case "Passed":
            case "Accepted Job Offer":
            case "Hired":
                return "success";
            case "Screened Failed":
            case "Failed":
            case "Rejected":
                return "danger";
            case "No Response":
            case "No Show":
            case "Withdrawn":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    async function submit_changes(e) {
        try {
            setLoading(true);
            setStatus(e);

            await update_job_application_status_service({
                ...data,
                [table_status]: e,
            });
            await store.dispatch(get_applicants_thunk());

            setLoading(false);
            setIsEditing(false);

            dispatch(
                setAlert({
                    type: "success",
                    title: "Applicants Updated Successfully!",
                    message:
                        "The applicants has been updated and is ready for review.",
                }),
            );
        } catch (error) {
            setLoading(false);
        }
    }
    const isTransferred = data.final_status === "Transferred";
    return (
        <div className="min-h-[50px] flex items-center">
            {isEditing ? (
                <div className="relative min-w-[180px] flex">
                    <select
                        autoFocus
                        value={status}
                        onChange={(e) => submit_changes(e.target.value)}
                        onBlur={handleBlur}
                        className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border-2 border-blue-500 rounded-md focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value=""></option>
                        {table_status == "screening_status" &&
                            screening_status.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}

                        {table_status == "interview_status" &&
                            interview_status.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}

                        {table_status == "final_status" &&
                            final_status.map((option) => (
                                <option key={option} value={option}>
                                    {option == 'Pooled' ? 'Pool' : option}
                                </option>
                            ))}
                    </select>

                    {loading && (
                        <div className="absolute right-2 top-2 text-xs text-blue-500">
                            Loading...
                        </div>
                    )}
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
                        label={status ?? ""}
                        variant={getStatusVariant(status)}
                        solid
                    />
                </div>
            )}
        </div>
    );
}
