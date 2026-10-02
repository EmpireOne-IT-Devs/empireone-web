import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";
import DrawerSection from "./drawer-section";

export default function TableSection() {
    const { files } = useSelector((store) => store.human_resources);
    console.log("leaderadada", files?.data);
    const role = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Department", accessor: "department" },
        { header: "Employment Status", accessor: "status" },
        { header: "Pending", accessor: "pending" },
        { header: "Approved", accessor: "approved" },
        { header: "Declined", accessor: "declined" },
        { header: "Total Documents", accessor: "total_documents" },
        { header: "Action", accessor: "action" },
    ];

    const formattedData = files?.data?.map((res) => {
        const userFiles = Array.isArray(res?.files) ? res.files : [];
        const emp = res?.account_employee;

        // 1. Calculate status counts from uploaded files
        let pendingCount = userFiles.filter(
            (f) => f?.status?.toLowerCase() === "pending"
        ).length;

        let approvedCount = userFiles.filter((f) =>
            ["approved", "signed", "completed"].includes(f?.status?.toLowerCase())
        ).length;

        let declinedCount = userFiles.filter(
            (f) => f?.status?.toLowerCase() === "declined"
        ).length;

        // 2. Count system-generated documents (Signature, Onboarding, Contract) as Completed/Approved
        let autoDocsCount = 0;
        if (emp?.signature) autoDocsCount++;
        if (emp?.onboarding_agree_on) autoDocsCount++;
        if (emp?.is_has_contract) autoDocsCount++;

        // System-generated documents are auto-approved/completed
        approvedCount += autoDocsCount;

        // 3. Compute total documents
        const totalDocuments = userFiles.length + autoDocsCount;

        // Format employee full name
        const fullName = [
            res?.personal_information?.first_name,
            res?.personal_information?.middle_name,
            res?.personal_information?.last_name,
        ]
            .filter(Boolean)
            .join(" ");

        return {
            ...res,
            employee_id: res?.account_employee?.employee_id || "N/A",
            name: fullName || "N/A",
            department: res?.account_employee?.department?.name || "N/A",
            status: res?.status ?? "N/A",
            pending: (
                <span className="font-semibold text-yellow-600">
                    {pendingCount}
                </span>
            ),
            approved: (
                <span className="font-semibold text-green-600">
                    {approvedCount}
                </span>
            ),
            declined: (
                <span className="font-semibold text-red-600">
                    {declinedCount}
                </span>
            ),
            total_documents: (
                <span className="font-bold text-blue-600">
                    {totalDocuments}
                </span>
            ),
            action: (
                <div className="flex gap-3">
                    <DrawerSection props_data={res} />
                </div>
            ),
        };
    }) ?? [];

    return <Table columns={columns} data={formattedData} />;
}