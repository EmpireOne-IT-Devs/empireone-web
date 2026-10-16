import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";
import Update201fileStatus from "./update-201file-status";

export default function TableSection() {
    const { files } = useSelector((store) => store.human_resources);
    console.log("leaderadada", files?.data);
    const role = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Document Type", accessor: "type" },
        { header: "Employment Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    const formattedData = files?.data?.map((res) => {
        const userFiles = Array.isArray(res?.files) ? res.files : [];
        const emp = res?.account;


        let approvedCount = userFiles.filter((f) =>
            ["approved", "signed", "completed"].includes(f?.status?.toLowerCase())
        ).length;


        // 2. Count system-generated documents
        let autoDocsCount = 0;
        if (emp?.signature) autoDocsCount++;
        if (emp?.onboarding_agree_on) autoDocsCount++;
        if (emp?.is_has_contract) autoDocsCount++;

        approvedCount += autoDocsCount;

        // 3. Compute total documents
        const totalDocuments = userFiles.length + autoDocsCount;

        // Format employee full name
        const fullName = [
            res?.account?.personal_information?.first_name,
            res?.account?.personal_information?.middle_name,
            res?.account?.personal_information?.last_name,
        ]
            .filter(Boolean)
            .join(" ");

        return {
            ...res,
            employee_id: res?.account?.employee_id || "N/A",
            name: fullName || "N/A",
            status: res?.status ?? "N/A",
            type: (
                <a
                    target="_blank"
                    href={res?.url} // Adjust route structure as needed
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                    {res?.name || "N/A"}
                </a>
            ),
            pending: (
                <span className="font-semibold text-yellow-600">
                    {res.status}
                </span>
            ),
            action: (
                <div className="flex gap-3">
                    <Update201fileStatus props_data={res} />
                </div>
            ),
        };
    }) ?? [];

    return <Table columns={columns} data={formattedData} />;
}