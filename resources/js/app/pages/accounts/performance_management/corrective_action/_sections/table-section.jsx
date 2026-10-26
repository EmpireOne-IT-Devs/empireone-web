import React from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
// import MenuSection from "./menu-section";

export default function TableSection({ isloading }) {
    const { reaches } = useSelector((store) => store.human_resources);

    // Get search params from URL
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const search_terms = params.get("search")?.toLowerCase() || "";

    const columns = [
        { header: "CA ID", accessor: "ca_id" },
        { header: "DATE ISSUED", accessor: "date_issued" },
        { header: "EMPLOYEE NAME", accessor: "employee_name" },
        { header: "ACCOUNT", accessor: "account" },
        { header: "SUPERVISOR", accessor: "supervisor" },
        { header: "ACTION MATRIX", accessor: "action_matrix" },
        { header: "STATUS", accessor: "status" },
        { header: "WORKFLOW TARGET ACTIONS", accessor: "workflow_target_actions" },
    ];

    // Extract array from reaches (handles array directly or paginated object)
    const rawData = Array.isArray(reaches?.data)
        ? reaches.data
        : Array.isArray(reaches?.data?.data)
            ? reaches.data.data
            : Array.isArray(reaches)
                ? reaches
                : [];

    // Filter & Format Data
    const formattedReaches = rawData
        .filter((item) => {
            if (!search_terms) return true;

            const personal = item?.personal_information;
            const empName = `${personal?.first_name || item?.first_name || ""} ${personal?.last_name || item?.last_name || ""}`.toLowerCase();
            const supName = `${item?.er_leader?.name || item?.supervisor_first_name || ""} ${item?.supervisor_last_name || ""}`.toLowerCase();
            const caId = String(item?.ca_id || item?.id || "").toLowerCase();
            const account = (item?.account?.name || item?.account || "").toLowerCase();

            return (
                empName.includes(search_terms) ||
                supName.includes(search_terms) ||
                caId.includes(search_terms) ||
                account.includes(search_terms)
            );
        })
        .map((item) => {
            // Employee details fallback
            const personal = item?.personal_information;
            const firstName = personal?.first_name || item?.first_name || "";
            const lastName = personal?.last_name || item?.last_name || "";
            const empFullName = [firstName, lastName].filter(Boolean).join(" ") || "N/A";
            const employeeEmail = item?.eogs_email || item?.employee_email || "";

            // Supervisor details fallback
            const leader = item?.er_leader?.employee || item?.er_leader;
            const leaderInfo = leader?.personal_information;
            const supervisorName = leaderInfo
                ? `${leaderInfo.first_name || ""} ${leaderInfo.last_name || ""}`.trim()
                : item?.er_leader?.name || [item?.supervisor_first_name, item?.supervisor_last_name].filter(Boolean).join(" ") || "N/A";
            const supervisorEmail = leader?.eogs_email || item?.supervisor_email || "";

            // Date Issued fallback (date_issued or date_of_session or created_at)
            const dateIssuedRaw = item?.date_issued || item?.date_of_session || item?.created_at;
            const dateIssued = dateIssuedRaw ? new Date(dateIssuedRaw).toLocaleDateString() : "N/A";

            return {
                id: item?.id,
                ca_id: (
                    <span className="font-semibold text-slate-700">
                        {item?.ca_id || item?.id || "N/A"}
                    </span>
                ),
                date_issued: (
                    <span className="text-sm text-slate-700">
                        {dateIssued}
                    </span>
                ),
                employee_name: (
                    <div>
                        <div className="font-semibold text-slate-800">{empFullName}</div>
                        {employeeEmail && (
                            <div className="text-xs text-slate-500">{employeeEmail}</div>
                        )}
                    </div>
                ),
                account: (
                    <span className="font-medium text-slate-700">
                        {item?.account?.name || item?.account || (item?.account_id ? `Account ID: ${item.account_id}` : "N/A")}
                    </span>
                ),
                supervisor: (
                    <div>
                        <div className="font-medium text-slate-700">{supervisorName}</div>
                        {supervisorEmail && (
                            <div className="text-xs text-slate-500">{supervisorEmail}</div>
                        )}
                    </div>
                ),
                action_matrix: (
                    <span className="text-sm text-slate-700 font-medium">
                        {item?.action_matrix || item?.kpi || "N/A"}
                    </span>
                ),
                status: (
                    <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${item?.status === "ACKNOWLEDGED" || item?.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : item?.status === "PENDING"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                    >
                        {item?.status || "PENDING"}
                    </span>
                ),
                workflow_target_actions: (
                    <div className="flex items-center gap-2">
                        {item?.workflow_target_actions || item?.task_name || (
                            <span className="text-slate-400 text-xs">No Actions</span>
                        )}
                        {/* If you have action buttons or a menu dropdown: */}
                        {/* <MenuSection props_data={item} /> */}
                    </div>
                ),
            };
        });

    return (
        <div className="w-full">
            <Table
                isloading={isloading}
                columns={columns}
                data={formattedReaches}
            />
        </div>
    );
}