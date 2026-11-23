import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import Table from "@/app/_components/table";
import MenuSection from "./menu-section";

export default function TableSection({ isloading }) {
    const { reaches } = useSelector((store) => store.human_resources);
    const { data } = useSelector((store) => store.app);

    const userAccountId = data?.user?.account_employee?.account_id;

    // Get search, supervisor_id & account_id params from URL
    const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
    );
    const search_terms = params.get("search")?.trim().toLowerCase() || "";
    const selectedSupervisorId = params.get("supervisor_id") || "";
    const selectedAccountId = params.get("account_id") || "";

    // Extract array from reaches
    const rawData = Array.isArray(reaches?.data)
        ? reaches.data
        : Array.isArray(reaches?.data?.data)
          ? reaches.data.data
          : Array.isArray(reaches)
            ? reaches
            : [];

    // Filter leaders matching the same account_id
    const supervisors = useMemo(() => {
        const leadersList = Array.isArray(data?.leaders) ? data.leaders : [];
        const seen = new Set();
        const targetAccountId = selectedAccountId || userAccountId;

        return leadersList
            .filter((leader) => {
                if (!targetAccountId) return true;
                const leaderAccountId =
                    leader?.user?.account_employee?.account_id;
                return String(leaderAccountId) === String(targetAccountId);
            })
            .map((leader) => {
                const supervisorUserId = leader?.user_id ?? leader?.user?.id;
                const fullName =
                    leader?.user?.name ||
                    [
                        leader?.user?.personal_information?.first_name,
                        leader?.user?.personal_information?.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim();

                return {
                    id: leader?.id,
                    user_id: supervisorUserId,
                    name: fullName || `Leader #${leader?.id}`,
                };
            })
            .filter((sup) => {
                if (!sup.user_id || seen.has(sup.user_id)) return false;
                seen.add(sup.user_id);
                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.leaders, selectedAccountId, userAccountId]);

    // Extract unique accounts from Redux (data.accounts) or rawData
    const accounts = useMemo(() => {
        const map = new Map();

        if (Array.isArray(data?.accounts)) {
            data.accounts.forEach((acc) => {
                if (acc?.id) {
                    map.set(String(acc.id), acc.name || `Account #${acc.id}`);
                }
            });
        }

        rawData.forEach((item) => {
            if (item?.account_id && !map.has(String(item.account_id))) {
                map.set(
                    String(item.account_id),
                    item?.account?.name || `Account #${item.account_id}`,
                );
            }
        });

        return Array.from(map.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.accounts, rawData]);

    const handleFilterChange = (key, value) => {
        const nextParams = new URLSearchParams(
            typeof window !== "undefined" ? window.location.search : "",
        );

        if (value) {
            nextParams.set(key, value);
        } else {
            nextParams.delete(key);
        }

        // Clear selected supervisor when switching accounts
        if (key === "account_id") {
            nextParams.delete("supervisor_id");
        }

        // Reset pagination when changing filters
        nextParams.delete("page");

        const queryString = nextParams.toString();
        const url = queryString
            ? `/accounts/administrator/performance_management/reach?${queryString}`
            : "/accounts/administrator/performance_management/reach";

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Employee Name", accessor: "employee_name" },
        {
            header: (
                <div className="flex items-center gap-1.5">
                    <span>Supervisor</span>
                    <select
                        aria-label="Filter by Supervisor"
                        value={selectedSupervisorId}
                        onChange={(e) =>
                            handleFilterChange("supervisor_id", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded border px-1.5 py-0.5 text-xs font-normal normal-case focus:border-sky-500 focus:outline-none ${
                            selectedSupervisorId
                                ? "border-sky-500 bg-sky-50 text-sky-700 font-medium"
                                : "border-gray-300 bg-white text-gray-600"
                        }`}
                    >
                        <option value="">All</option>
                        {supervisors.map((sup) => (
                            <option
                                key={sup.user_id}
                                value={String(sup.user_id)}
                            >
                                {sup.name}
                            </option>
                        ))}
                    </select>
                </div>
            ),
            accessor: "supervisor_name",
        },
        {
            header: (
                <div className="flex items-center gap-1.5">
                    <span>Account & Date</span>
                    <select
                        aria-label="Filter by Account"
                        value={selectedAccountId}
                        onChange={(e) =>
                            handleFilterChange("account_id", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded border px-1.5 py-0.5 text-xs font-normal normal-case focus:border-sky-500 focus:outline-none ${
                            selectedAccountId
                                ? "border-sky-500 bg-sky-50 text-sky-700 font-medium"
                                : "border-gray-300 bg-white text-gray-600"
                        }`}
                    >
                        <option value="">All</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name}
                            </option>
                        ))}
                    </select>
                </div>
            ),
            accessor: "session_details",
        },
        { header: "KPI / Metrics", accessor: "kpi_metrics" },
        { header: "Action Plan", accessor: "action_plan" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    // Filter & Format Data
    const formattedReaches = rawData
        .filter((item) => {
            const empName =
                `${item?.first_name || ""} ${item?.last_name || ""}`.toLowerCase();
            const supFullName = [
                item?.supervisor_first_name,
                item?.supervisor_last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .trim()
                .toLowerCase();
            const email = (item?.employee_email || "").toLowerCase();
            const kpi = (item?.kpi || "").toLowerCase();
            const accountName = (item?.account?.name || "").toLowerCase();
            const accountId = String(item?.account_id ?? "").toLowerCase();

            const itemSupervisorUserId =
                item?.supervisor_user_id ?? item?.supervisor_id ?? "";

            const matchesSupervisor =
                !selectedSupervisorId ||
                String(itemSupervisorUserId) === String(selectedSupervisorId);

            const matchesAccount =
                !selectedAccountId ||
                String(item?.account_id ?? "") === String(selectedAccountId);

            const matchesSearch =
                !search_terms ||
                empName.includes(search_terms) ||
                supFullName.includes(search_terms) ||
                email.includes(search_terms) ||
                kpi.includes(search_terms) ||
                accountName.includes(search_terms) ||
                accountId.includes(search_terms);

            return matchesSupervisor && matchesAccount && matchesSearch;
        })
        .map((item) => {
            const empFullName =
                [item?.first_name, item?.last_name].filter(Boolean).join(" ") ||
                "N/A";
            const supFullName =
                [item?.supervisor_first_name, item?.supervisor_last_name]
                    .filter(Boolean)
                    .join(" ") || "N/A";

            return {
                id: item?.id,
                employee_name: (
                    <div>
                        <div className="font-semibold text-slate-800">
                            {empFullName}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.employee_email || "N/A"}
                        </div>
                        <div className="text-xs text-slate-400">
                            ID: {item?.employee_id || "N/A"}
                        </div>
                    </div>
                ),
                supervisor_name: (
                    <div>
                        <div className="font-medium text-slate-700">
                            {supFullName}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.supervisor_email || "N/A"}
                        </div>
                    </div>
                ),
                session_details: (
                    <div>
                        <div className="font-medium text-slate-800">
                            {item?.account?.name ||
                                (item?.account_id
                                    ? `Account ID: ${item.account_id}`
                                    : "N/A")}
                        </div>
                        <div className="text-xs text-slate-500">
                            {item?.date_of_session
                                ? new Date(
                                      item.date_of_session,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </div>
                    </div>
                ),
                kpi_metrics: (
                    <div className="text-xs space-y-0.5">
                        <span className="font-bold text-sky-700">
                            {item?.kpi || "N/A"}
                        </span>
                        <div>
                            Actual:{" "}
                            <span className="font-semibold text-slate-700">
                                {item?.actual_metric || "N/A"}
                            </span>{" "}
                            | Target:{" "}
                            <span className="font-semibold text-slate-700">
                                {item?.goal_target || "N/A"}
                            </span>
                        </div>
                    </div>
                ),
                action_plan: (
                    <div className="max-w-xs text-xs">
                        <div className="font-semibold text-slate-800">
                            {item?.task_name || "N/A"}
                        </div>
                        <div className="text-slate-500 truncate">
                            {item?.task_description || "N/A"}
                        </div>
                        <div className="text-slate-400">
                            Due:{" "}
                            {item?.due_date
                                ? new Date(item.due_date).toLocaleDateString()
                                : "N/A"}{" "}
                            ({item?.frequency || "N/A"})
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
                action: <MenuSection props_data={item} />,
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
