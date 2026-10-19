

import React from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import MenuSection from "./menu-section";

export default function TableSection() {
    const { reaches } = useSelector((store) => store.human_resources);

    // Get search params from URL
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const search_terms = params.get("search")?.toLowerCase() || "";

    const columns = [
        { header: "Employee Name", accessor: "employee_name" },
        { header: "Supervisor", accessor: "supervisor_name" },
        { header: "Account & Date", accessor: "session_details" },
        { header: "KPI / Metrics", accessor: "kpi_metrics" },
        { header: "Action Plan", accessor: "action_plan" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
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
            const empName = `${item?.first_name || ""} ${item?.last_name || ""}`.toLowerCase();
            const supName = `${item?.supervisor_first_name || ""} ${item?.supervisor_last_name || ""}`.toLowerCase();
            const email = (item?.employee_email || "").toLowerCase();
            const kpi = (item?.kpi || "").toLowerCase();

            return (
                empName.includes(search_terms) ||
                supName.includes(search_terms) ||
                email.includes(search_terms) ||
                kpi.includes(search_terms)
            );
        })
        .map((item) => {
            const empFullName = [item?.first_name, item?.last_name].filter(Boolean).join(" ") || "N/A";
            const supFullName = [item?.supervisor_first_name, item?.supervisor_last_name].filter(Boolean).join(" ") || "N/A";

            return {
                id: item?.id,
                employee_name: (
                    <div>
                        <div className="font-semibold text-slate-800">{empFullName}</div>
                        <div className="text-xs text-slate-500">{item?.employee_email || "N/A"}</div>
                        <div className="text-xs text-slate-400">ID: {item?.employee_id || "N/A"}</div>
                    </div>
                ),
                supervisor_name: (
                    <div>
                        <div className="font-medium text-slate-700">{supFullName}</div>
                        <div className="text-xs text-slate-500">{item?.supervisor_email || "N/A"}</div>
                    </div>
                ),
                session_details: (
                    <div>
                        <div className="font-medium text-slate-800">
                            {item?.account?.name || (item?.account_id ? `Account ID: ${item.account_id}` : "N/A")}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.date_of_session ? new Date(item.date_of_session).toLocaleDateString() : "N/A"}
                        </div>
                    </div>
                ),
                kpi_metrics: (
                    <div className="text-xs space-y-0.5">
                        <span className="font-bold text-sky-700">{item?.kpi || "N/A"}</span>
                        <div>
                            Actual: <span className="font-semibold text-slate-700">{item?.actual_metric || "N/A"}</span> | 
                            Target: <span className="font-semibold text-slate-700">{item?.goal_target || "N/A"}</span>
                        </div>
                    </div>
                ),
                action_plan: (
                    <div className="max-w-xs text-xs">
                        <div className="font-semibold text-slate-800">{item?.task_name || "N/A"}</div>
                        <div className="text-slate-500 truncate">{item?.task_description || "N/A"}</div>
                        <div className="text-slate-400">
                            Due: {item?.due_date ? new Date(item.due_date).toLocaleDateString() : "N/A"} ({item?.frequency || "N/A"})
                        </div>
                    </div>
                ),
                status: (
                    <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                            item?.status === "ACKNOWLEDGED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                        }`}
                    >
                        {item?.status || "PENDING"}
                    </span>
                ),
                action: (
                    <MenuSection props_data={item} />
                ),
            };
        });

    return (
        <div className="w-full">
            <Table columns={columns} data={formattedReaches} />
        </div>
    );
}