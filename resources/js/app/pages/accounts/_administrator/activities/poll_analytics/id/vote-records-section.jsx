import React from "react";
import Table from "@/app/_components/table";
import { useSelector } from "react-redux";

const columns = [
    { header: "Employee Name", accessor: "employee_name" },
    { header: "User ID", accessor: "user_id" },
    { header: "Selected Option", accessor: "selected_option" },
    { header: "Poll ID", accessor: "poll_id" },
    { header: "Voted At", accessor: "voted_at" },
];

export default function VoteRecordsSection() {
    const { pollVoteRecords, pollVoteRecordsLoading } = useSelector(
        (state) => state.activities,
    );

    return <Table columns={columns} data={pollVoteRecordsLoading ? [] : pollVoteRecords} />;
}
