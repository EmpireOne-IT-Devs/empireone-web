import React from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableSection({ isloading }) {
    const { pips } = useSelector((store) => store.human_resources);

    // Get search params from URL
    const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
    );
    const search_terms = params.get("search")?.toLowerCase() || "";

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Employee Name", accessor: "employee_name" },
        { header: "Leadership", accessor: "leadership" },
        { header: "PIP Cycle", accessor: "pip_details" },
        { header: "History KPI", accessor: "history_kpi" },
        { header: "Action Plan", accessor: "action_plan" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    // Extract array from pips (handles array directly or paginated object)
    const rawData = Array.isArray(pips?.data)
        ? pips.data
        : Array.isArray(pips?.data?.data)
          ? pips.data.data
          : Array.isArray(pips)
            ? pips
            : [];

    // Filter & Format Data
    const formattedPips = rawData
        .filter((item) => {
            if (!search_terms) return true;
            const empName =
                `${item?.first_name || ""} ${item?.last_name || ""}`.toLowerCase();
            const supName = (item?.supervisor_name || "").toLowerCase();
            const email = (item?.employee_email || "").toLowerCase();
            const kpi = (item?.history_kpi || "").toLowerCase();

            return (
                empName.includes(search_terms) ||
                supName.includes(search_terms) ||
                email.includes(search_terms) ||
                kpi.includes(search_terms)
            );
        })
        .map((item) => {
            const empFullName =
                [item?.first_name, item?.last_name].filter(Boolean).join(" ") ||
                "N/A";

            return {
                id: item?.id,
                employee_name: (
                    <div>
                        <div className="font-semibold text-slate-800">
                            {empFullName}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.position || item?.employee_email || "N/A"}
                        </div>
                        <div className="text-xs text-slate-400">
                            ID: {item?.employee_id || "N/A"}
                        </div>
                    </div>
                ),
                leadership: (
                    <div>
                        <div className="font-medium text-slate-700">
                            Sup: {item?.supervisor_name || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500">
                            Mgr: {item?.manager_name || "N/A"}
                        </div>
                    </div>
                ),
                pip_details: (
                    <div>
                        <div className="font-medium text-slate-800">
                            {item?.pip_cycle || "N/A"}
                            {item?.account?.name
                                ? ` - ${item.account.name}`
                                : ""}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.pip_start_date
                                ? new Date(
                                      item.pip_start_date,
                                  ).toLocaleDateString()
                                : "N/A"}{" "}
                            to{" "}
                            {item?.pip_end_date
                                ? new Date(
                                      item.pip_end_date,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </div>
                    </div>
                ),
                history_kpi: (
                    <div className="text-xs space-y-0.5">
                        <span className="font-bold text-sky-700">
                            {item?.history_kpi || "N/A"}
                        </span>
                        <div>
                            Actual:{" "}
                            <span className="font-semibold text-slate-700">
                                {item?.history_actual || "N/A"}
                            </span>{" "}
                            | Target:{" "}
                            <span className="font-semibold text-slate-700">
                                {item?.history_target || "N/A"}
                            </span>
                        </div>
                    </div>
                ),
                action_plan: (
                    <div className="max-w-xs text-xs">
                        <div className="font-semibold text-slate-800">
                            {item?.action_kpi_goal || "N/A"}
                        </div>
                        <div
                            className="text-slate-500 truncate"
                            title={item?.action_target_action}
                        >
                            {item?.action_target_action || "N/A"}
                        </div>
                        <div className="text-slate-400">
                            Action Date:{" "}
                            {item?.action_date
                                ? new Date(
                                      item.action_date,
                                  ).toLocaleDateString()
                                : "N/A"}
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
            };
        });

    return (
        <div className="w-full">
            <Table
                isloading={isloading}
                columns={columns}
                data={formattedPips}
            />
        </div>
    );
}
