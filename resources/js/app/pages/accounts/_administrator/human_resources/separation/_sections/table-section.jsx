import React from "react";
import { useSelector } from "react-redux";
import { Link } from "@inertiajs/react";
import Table from "@/app/_components/table";
import DocumentsListSection from "./documents-list-section";
import moment from "moment";
import AttritionActionSection from "./attrition-action-section";

export default function TableSection() {
    const { attritions } = useSelector((store) => store.human_resources);
    const accountId =
        typeof window !== "undefined"
            ? window.location.pathname.split("/")[2]
            : "";

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "fullname" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Hired Date", accessor: "hired_date" },
        { header: "Separation Date", accessor: "separation_date" },
        { header: "Status", accessor: "status" },
        { header: "Reason", accessor: "reason" },
        { header: "Eligible for Rehire", accessor: "is_rehire" },
        { header: "Attrition Status", accessor: "attrition_status" },
        { header: "Documents", accessor: "documents" },
    ];

    const formattedData =
        attritions?.map((res) => {
            const exit_documents = [
                {
                    document_type: "Exit Clearance",
                    href: `/accounts/off_boarding_documents/${res.id}/exit-clearance`,
                    ...res.exit_clearance,
                },
                {
                    document_type: "Exit Survey",
                    href: `/accounts/off_boarding_documents/${res.id}/exit-survey`,
                    ...res.exit_interview,
                },
            ];

            const fullName = `${res?.personal_information?.first_name || ""} ${res?.personal_information?.last_name || ""}`.trim();

            return {
                ...res,
                employee_id: (
                    <Link
                        href={`/accounts/${accountId}/my_team/${res?.user_id}/personal_information`}
                        className="underline text-blue-600 hover:text-blue-800 font-medium"
                    >
                        #{res?.employee_id}
                    </Link>
                ),
                fullname: fullName || "N/A",
                position: res?.position || "N/A",
                department: res?.department || "N/A",
                hired_date: res?.started_at ? moment(res.started_at).format("LL") : "-",
                separation_date: res?.separation_date ? moment(res.separation_date).format("LL") : "-",
                status: (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        {res?.status || "N/A"}
                    </span>
                ),
                reason: res?.reason_for_separation || "N/A",
                is_rehire: res?.is_rehire ? (typeof res.is_rehire === "boolean" ? (res.is_rehire ? "Yes" : "No") : res.is_rehire) : "No",
                attrition_status: res?.attrition_status || "N/A",
                documents: (
                    // <DocumentsListSection props_data={{ documents: exit_documents }} />
                    <AttritionActionSection  props_data={{ documents: exit_documents }} />
                ),
            };
        }) ?? [];

    return (
        <div >
            <Table columns={columns} data={formattedData} />
        </div>
    );
}