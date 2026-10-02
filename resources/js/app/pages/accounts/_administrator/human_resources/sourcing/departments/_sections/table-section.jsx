import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import EditDepartmentSection from "./edit-department-section";

export default function TableSection({ loading }) {
    const { data } = useSelector((store) => store.app);

    // Columns configured specifically for Departments
    const columns = [
        { header: "Department ID", accessor: "id" },
        { header: "Department Name", accessor: "name" },
        { header: "Created At", accessor: "created_at" },
        { header: "Action", accessor: "action" },
    ];

    // Map through the department objects directly
    const formattedData = useMemo(() => {
        if (!Array.isArray(data?.departments)) return [];

        return data.departments.map((department) => ({
            ...department,
            id: department?.id ?? "N/A",
            name: department?.name || "N/A",
            created_at: department?.created_at
                ? new Date(department.created_at).toLocaleDateString()
                : "N/A",
            action: <EditDepartmentSection props_data={department} />
        }));
    }, [data?.departments]);

    return <Table columns={columns} data={formattedData} isloading={loading} />;
}