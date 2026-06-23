import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    close_poll_thunk,
    get_poll_details_thunk,
    reopen_poll_thunk,
} from "@/app/redux/activities-slice";
import { export_poll_vote_records_service } from "@/app/services/activities-service";

export default function PollInfoSection({ pollId }) {
    const dispatch = useDispatch();
    const { selectedPoll, pollStatusUpdating } = useSelector(
        (state) => state.activities,
    );

    const info = selectedPoll?.poll_information;

    const handleExport = async () => {
        const response = await export_poll_vote_records_service(pollId);
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `poll_${pollId}_vote_records.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleToggleStatus = async () => {
        if (!info) return;
        if (info.status === "Closed") {
            await dispatch(reopen_poll_thunk(info.poll_id));
        } else {
            await dispatch(close_poll_thunk(info.poll_id));
        }
        dispatch(get_poll_details_thunk(pollId));
    };

    if (!info) return null;

    return (
        <div className="p-4 bg-gray-100 rounded-md mb-4 flex flex-wrap gap-6 items-center justify-between">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                <p>Poll ID: {info.poll_id}</p>
                <p>Poll Title: {info.poll_title}</p>
                <p>Created Date: {info.created_date}</p>
                <p>Total Votes: {info.total_votes}</p>
                <p>
                    Status:{" "}
                    <span
                        className={
                            info.status === "Closed"
                                ? "text-red-600 font-semibold"
                                : "text-green-600 font-semibold"
                        }
                    >
                        {info.status}
                    </span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleExport}
                    className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-white"
                >
                    Export Vote Records
                </button>
                <button
                    type="button"
                    disabled={pollStatusUpdating}
                    onClick={handleToggleStatus}
                    className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                    {info.status === "Closed" ? "Reopen Poll" : "Close Poll"}
                </button>
            </div>
        </div>
    );
}
