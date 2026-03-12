import { setAlert } from "@/app/redux/app-slice";
import { get_job_application_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { update_job_application_status_service } from "@/app/services/job-application-service";
import store from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function EditStatusSection({ data, table_status }) {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(data.screening_status || "New");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setStatus(data.screening_status);
    }, [data.screening_status]);
    
    const screening_options = [
        "New",
        "Conducted",
        "Screened Passed",
        "Screened Failed",
        "No Response",
    ];

    const handleBlur = () => {
        setIsEditing(false);
        console.log("Updated status to:", status);
    };

    async function submit_changes(e) {
        try {
            setLoading(true);
            await update_job_application_status_service({
                ...data,
                [table_status]: e,
            });
            await store.dispatch(get_job_application_by_id_thunk());
            setIsEditing(false);
            setLoading(false);
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

    return (
        <div className="min-h-[50px] flex items-center">
            {isEditing ? (
                <div className="relative min-w-[180px] flex">
                    <select
                        autoFocus
                        value={status}
                        onChange={(e) => submit_changes(e.target.value)}
                        onBlur={handleBlur}
                        className="block w-full px-3 py-2 text-sm text-gray-700 bg-transparent border-2 border-blue-500 rounded-md focus:outline-none appearance-none cursor-pointer"
                    >
                        {screening_options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {loading && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                            Loading...
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onDoubleClick={() => setIsEditing(true)}
                    className="text-sm text-gray-800 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all"
                    title="Double click to edit"
                >
                    {status}
                </div>
            )}
        </div>
    );
}
