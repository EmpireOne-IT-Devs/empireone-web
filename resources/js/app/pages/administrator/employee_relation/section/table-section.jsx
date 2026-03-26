import Table from "@/app/_components/table";
import React from "react";

export default function TableSection() {
    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Contact", accessor: "contact" },
        { header: "Site", accessor: "site" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <div>
            <Table columns={columns} />
        </div>
    );
}
