import React, { useMemo } from "react";
import Table from "@/app/_components/table";
import { useSelector } from "react-redux";

const ResultCell = ({ voteCount, percentage }) => {
    return (
        <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>{voteCount} votes</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const columns = [
    { header: "Poll Option", accessor: "poll_option" },
    { header: "Results", accessor: "votes" },
];

export default function PollResultsSection() {
    const { selectedPoll } = useSelector((state) => state.activities);

    const data = useMemo(() => {
        return (selectedPoll?.poll_results ?? []).map((result) => ({
            poll_option: result.option_label,
            votes: (
                <ResultCell
                    voteCount={result.vote_count}
                    percentage={result.percentage}
                />
            ),
        }));
    }, [selectedPoll]);

    return <Table columns={columns} data={data} />;
}
