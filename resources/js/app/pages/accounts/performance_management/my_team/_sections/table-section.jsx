import Table from "@/app/_components/table";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import MenuSection from "./menu-section";
import HoverWeekSection from "./hover-week-section";

const calculateCompletion = (res) => {
    if (!res) return 0;

    const fields = [
        res?.employee_id,
        res?.department_id,
        res?.position,
        res?.eogs_email,
        res?.personal_information?.first_name,
        res?.personal_information?.last_name,
        res?.personal_information?.contact,
        res?.site_id,
        res?.department_manager_id,
    ];

    const filledFields = fields.filter(
        (field) => field !== null && field !== undefined && field !== "",
    );

    return Math.round((filledFields.length / fields.length) * 100);
};

export default function TableSection({ isloading }) {
    const { teams } = useSelector((store) => store.departments);
    const { data } = useSelector((store) => store.app);

    const userAccountId = data?.user?.account_employee?.account_id;

    // Get search & supervisor_id params from URL
    const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
    );
    const search_teams = params.get("search")?.trim().toLowerCase() || "";
    const selectedSupervisorId = params.get("supervisor_id") || "";

    // Filter leaders matching the same account_id
    const supervisors = useMemo(() => {
        const leadersList = Array.isArray(data?.leaders) ? data.leaders : [];
        const seen = new Set();

        return leadersList
            .filter((leader) => {
                if (!userAccountId) return true;
                const leaderAccountId =
                    leader?.user?.account_employee?.account_id;
                return String(leaderAccountId) === String(userAccountId);
            })
            .map((leader) => {
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
                    user_id: leader?.user_id ?? leader?.user?.id,
                    name: fullName || `Leader #${leader?.id}`,
                };
            })
            .filter((sup) => {
                if (!sup.id || seen.has(sup.id)) return false;
                seen.add(sup.id);
                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.leaders, userAccountId]);

    const handleSupervisorChange = (e) => {
        const supervisorId = e.target.value;
        const nextParams = new URLSearchParams(
            typeof window !== "undefined" ? window.location.search : "",
        );

        if (supervisorId) {
            nextParams.set("supervisor_id", supervisorId);
        } else {
            nextParams.delete("supervisor_id");
        }

        nextParams.delete("page");

        const queryString = nextParams.toString();
        const basePath =
            typeof window !== "undefined" ? window.location.pathname : "";
        const url = queryString ? `${basePath}?${queryString}` : basePath;

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        {
            header: `Employee ID ${teams?.data?.length ?? teams?.length ?? ""}`,
            accessor: "employee_id",
        },
        { header: "Name", accessor: "full_name" },
        {
            header: (
                <div className="flex items-center gap-1.5">
                    <span>Immediate Supervisor</span>
                    <select
                        aria-label="Filter by Immediate Supervisor"
                        value={selectedSupervisorId}
                        onChange={handleSupervisorChange}
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded border px-1.5 py-0.5 text-xs font-normal normal-case focus:border-sky-500 focus:outline-none ${
                            selectedSupervisorId
                                ? "border-sky-500 bg-sky-50 text-sky-700 font-medium"
                                : "border-gray-300 bg-white text-gray-600"
                        }`}
                    >
                        <option value="">All</option>
                        {supervisors.map((sup) => (
                            <option key={sup.id} value={String(sup.id)}>
                                {sup.name}
                            </option>
                        ))}
                    </select>
                </div>
            ),
            accessor: "immediate_supervisor",
        },
        { header: "Next Level Manager", accessor: "next_level_manager" },
        { header: "Week 1", accessor: "week_1" },
        { header: "Week 2", accessor: "week_2" },
        { header: "Week 3", accessor: "week_3" },
        { header: "Week 4", accessor: "week_4" },
        { header: "Action", accessor: "action" },
    ];

    const rawTeams = Array.isArray(teams?.data)
        ? teams.data
        : Array.isArray(teams)
          ? teams
          : [];

    // Filter & Format Data
    const formattedTeams = rawTeams
        .filter((item) => {
            const firstName =
                item?.personal_information?.first_name?.toLowerCase() || "";
            const lastName =
                item?.personal_information?.last_name?.toLowerCase() || "";
            const empFullName = `${firstName} ${lastName}`.trim();
            const empId = String(item?.employee_id || "").toLowerCase();

            const supFirst =
                item?.er_leader?.employee?.personal_information?.first_name?.toLowerCase() ||
                "";
            const supLast =
                item?.er_leader?.employee?.personal_information?.last_name?.toLowerCase() ||
                "";
            const supFullName = `${supFirst} ${supLast}`.trim();

            // Match either e_r_leader_id (er_leader.id) or er_leader.user_id
            const itemLeaderId =
                item?.e_r_leader_id ?? item?.er_leader?.id ?? "";
            const matchesSupervisor =
                !selectedSupervisorId ||
                String(itemLeaderId) === String(selectedSupervisorId);

            const matchesSearch =
                !search_teams ||
                firstName.includes(search_teams) ||
                lastName.includes(search_teams) ||
                empFullName.includes(search_teams) ||
                empId.includes(search_teams) ||
                supFullName.includes(search_teams);

            return matchesSupervisor && matchesSearch;
        })
        .map((item) => {
            const firstName = item?.personal_information?.first_name || "";
            const lastName = item?.personal_information?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "N/A";

            const supFullName =
                [
                    item?.er_leader?.employee?.personal_information?.first_name,
                    item?.er_leader?.employee?.personal_information?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "N/A";

            const managerFullName =
                [
                    item?.department_manager?.personal_information?.first_name,
                    item?.department_manager?.personal_information?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "N/A";

            const completionPercent = calculateCompletion(item);

            return {
                id: item?.id,
                employee_id: (
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item?.status === "Regular"
                                ? "bg-green-100 text-green-800"
                                : item?.status === "Probationary"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {item?.employee_id || "N/A"}
                    </span>
                ),
                full_name: (
                    <>
                        {fullName}
                        <div className="flex items-center gap-2 w-32 md:ml-0 ml-auto">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1 shadow-inner">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        completionPercent === 100
                                            ? "bg-emerald-500"
                                            : "bg-purple-500"
                                    }`}
                                    style={{
                                        width: `${completionPercent}%`,
                                    }}
                                ></div>
                            </div>
                            <span
                                className={`text-[11px] font-bold w-7 text-right ${
                                    completionPercent === 100
                                        ? "text-emerald-600"
                                        : "text-purple-600"
                                }`}
                            >
                                {completionPercent}%
                            </span>
                        </div>
                    </>
                ),
                immediate_supervisor: supFullName,
                next_level_manager: managerFullName,
                week_1: <HoverWeekSection props_data={item} week="week_1" />,
                week_2: <HoverWeekSection props_data={item} week="week_2" />,
                week_3: <HoverWeekSection props_data={item} week="week_3" />,
                week_4: <HoverWeekSection props_data={item} week="week_4" />,
                action: <MenuSection props_data={item} />,
            };
        });

    return (
        <div className="w-full">
            <div className="py-3 px-3">
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Regular
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Probationary
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        Unknown
                    </div>
                </div>
            </div>
            <Table
                isloading={isloading}
                columns={columns}
                data={formattedTeams}
            />
        </div>
    );
}
