import Table from "@/app/_components/table";
import React from "react";

export default function TableSection() {
    const columns = [
        { header: "Personnel", accessor: "personnel" },
        { header: "Department", accessor: "department" },
        { header: "Status", accessor: "status" },
        { header: "Total", accessor: "total" },
        { header: "Resolved", accessor: "resolved" },
        { header: "Pending", accessor: "pending" },
        { header: "In Progress", accessor: "in_progress" },
        { header: "Average Time", accessor: "average_time" }, // fixed spelling
        { header: "Satisfaction", accessor: "satisfaction" }, // fixed spelling
        { header: "This Week", accessor: "this_week" },
        { header: "Actions", accessor: "actions" },
    ];

    const data = [
        {
            personnel: "Juan Dela Cruz",
            department: "IT",
            status: "Active",
            total: 25,
            resolved: 18,
            pending: 5,
            in_progress: 2,
            average_time: "2h 30m",
            satisfaction: "⭐️⭐️⭐️⭐️",
            this_week: 6,
            actions: "View",
        },
        {
            personnel: "Maria Santos",
            department: "HR",
            status: "Active",
            total: 14,
            resolved: 10,
            pending: 3,
            in_progress: 1,
            average_time: "1h 45m",
            satisfaction: "⭐️⭐️⭐️⭐️⭐️",
            this_week: 4,
            actions: "View",
        },
    ];
    return (
        <>
            <Table columns={columns} data={data} />
        </>
    );
}
