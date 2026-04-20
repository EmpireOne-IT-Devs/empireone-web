import store from "@/app/store/store";
import React from "react";
import { Trash2 } from "lucide-react";
import { delete_job_postings_service } from "@/app/services/job-posting-service";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { TbTrash } from "react-icons/tb";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";

export default function DeleteJobSection({ data }) {
    const dispatch = useDispatch();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this job posting?")) {
            return;
        }

        try {
            await delete_job_postings_service(data.id);
            await store.dispatch(get_job_posting_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Posting Deleted Successfully!",
                    message:
                        "The job posting has been removed from the system.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error("Delete error:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to delete job posting";

            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to Delete Job Posting",
                    message: errorMessage,
                    open: true,
                }),
            );
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 inline-flex items-center"
            title="Delete Job Posting"
        >
            <TbTrash className="w-4 h-4" />
        </button>
    );
}
