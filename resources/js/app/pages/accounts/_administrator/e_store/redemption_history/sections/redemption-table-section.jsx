import React from "react";
import Badge from "@/app/_components/badge";
import Table from "@/app/_components/table";

const columns = [
    { header: "User", accessor: "user" },
    { header: "Item", accessor: "item" },
    { header: "Points", accessor: "points" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
];

const data = [
    {
        user: (
            <div className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold text-gray-900">
                    Emily Davis
                </span>
                <span className="text-sm text-slate-500">
                    emily.d@company.com
                </span>
            </div>
        ),
        item: "Company Hoodie",
        points: <span className="font-semibold text-blue-700">400</span>,
        date: "2024-12-23 16:20",
        status: (
            <Badge
                outlined
                label="completed"
                variant="success"
                className="rounded-full border-green-100 bg-green-100 px-3 py-1 text-[13px] font-semibold text-green-700"
            />
        ),
    },
];

export default function RedemptionTableSection() {
    return (
        <div className="overflow-hidden">
            <Table columns={columns} data={data} />
        </div>
    );
}
