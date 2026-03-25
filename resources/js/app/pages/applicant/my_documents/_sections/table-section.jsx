import Table from "@/app/_components/table";
import React from "react";

export default function TableSection() {
    const columns = [
        {
            header: "Document Name",
            accessor: "name",
        },
        {
            header: "Date Uploaded",
            accessor: "created_at",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];
    return (
        <div>
            <Table columns={columns} data={[]} />
        </div>
    );
}
