import Table from "@/app/_components/table";
import React, { useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import {
    close_poll_thunk,
    get_poll_analytics_thunk,
    get_activity_posts_thunk,
    reopen_poll_thunk,
} from "@/app/redux/activities-slice";
import moment from "moment";

const TotalVotesCell = ({ votes, percent }) => {
    return (
        <div className="min-w-[180px]">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>{votes} votes</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default function PollTableSection() {
    const dispatch = useDispatch();
    const { pollAnalytics, pollAnalyticsLoading, pollStatusUpdating } =
        useSelector((state) => state.activities);

    useEffect(() => {
        dispatch(get_poll_analytics_thunk());
    }, [dispatch]);

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    const status = params.get("status") || "all";

    const filtered = pollAnalytics.filter((poll) => {
        const matchesStatus =
            status === "all" ||
            poll.status.toLowerCase() === status.toLowerCase();
        const term = search.trim().toLowerCase();
        const matchesSearch =
            !term ||
            poll.poll_id.toLowerCase().includes(term) ||
            poll.poll_title.toLowerCase().includes(term);
        return matchesStatus && matchesSearch;
    });

    const maxVotes = Math.max(...filtered.map((p) => p.total_votes), 0);

    const data = filtered.map((poll) => {
        const percent =
            maxVotes > 0 ? Math.round((poll.total_votes / maxVotes) * 100) : 0;

        return {
            poll_id: (
                <Link
                    className="text-blue-600 hover:underline font-medium"
                    href={`/accounts/administrator/activities/poll_analytics/${poll.id}`}
                >
                    {poll.poll_id}
                </Link>
            ),
            title: poll.poll_title,
            total_options: poll.total_options,
            total_votes: (
                <TotalVotesCell votes={poll.total_votes} percent={percent} />
            ),
            created_date: moment(poll.created_date).format("MMMM D, YYYY"),
            status: poll.status,
            action: (
                <div className="flex items-center gap-2">
                    <Link
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        href={`/accounts/administrator/activities/poll_analytics/${poll.id}`}
                    >
                        <Eye size={16} />
                    </Link>
                    <button
                        type="button"
                        disabled={pollStatusUpdating}
                        onClick={() =>
                            dispatch(
                                poll.status === "Closed"
                                    ? reopen_poll_thunk(poll.id)
                                    : close_poll_thunk(poll.id),
                            ).then(() => {
                                dispatch(get_poll_analytics_thunk());
                                dispatch(get_activity_posts_thunk());
                            })
                        }
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded disabled:opacity-50"
                        title={poll.status === "Closed" ? "Reopen Poll" : "Close Poll"}
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            ),
        };
    });

    const columns = [
        { header: "Poll ID", accessor: "poll_id" },
        { header: "Title", accessor: "title" },
        { header: "Total Options", accessor: "total_options" },
        { header: "Total Votes", accessor: "total_votes" },
        { header: "Created Date", accessor: "created_date" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    return (
        <div>
            <Table columns={columns} data={pollAnalyticsLoading ? [] : data} />
        </div>
    );
}
