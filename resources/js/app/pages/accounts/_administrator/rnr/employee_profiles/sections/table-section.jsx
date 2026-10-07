import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/app/_components/table";
import Skeleton from "@/app/_components/skeleton";
import { Star } from "lucide-react";
import SearchSection from "./search-section";
import { export_reward_challenge_employee_profiles_service } from "@/app/services/engagement-service";
import { setAlert } from "@/app/redux/app-slice";

function EmployeeCell({ name, department, position, isTopEngager }) {
    const initials =
        name
            ?.trim()
            .split(/\s+/)
            .map((part) => part[0]?.toUpperCase())
            .slice(0, 2)
            .join("") || "?";

    return (
        <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {initials}
                </div>
                {isTopEngager && (
                    <Star className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                )}
            </div>
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">
                    {name}
                </div>
                <div className="truncate text-xs text-gray-400">
                    {department}
                    {position && position !== "N/A" ? ` · ${position}` : ""}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: "bg-green-50 text-green-600",
        Inactive: "bg-gray-100 text-gray-500",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || styles.Inactive}`}
        >
            {status}
        </span>
    );
}

function FilterTabs({ options, active, onChange }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        active === option
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

function formatLastActive(lastActive) {
    if (!lastActive) return "No activity yet";

    const date = new Date(lastActive);
    const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function TableSection() {
    const dispatch = useDispatch();
    const {
        rewardChallengeEmployeeProfiles,
        rewardChallengeEmployeeProfilesLoading,
    } = useSelector((state) => state.engagement);

    const [department, setDepartment] = useState("All");
    const [search, setSearch] = useState("");
    const [exporting, setExporting] = useState(false);

    const employees = rewardChallengeEmployeeProfiles?.employees ?? [];
    const departments = rewardChallengeEmployeeProfiles?.departments ?? [];
    const topEngagerName = rewardChallengeEmployeeProfiles?.summary?.top_engager?.name;

    const departmentOptions = useMemo(() => ["All", ...departments], [departments]);

    const columns = [
        { header: "EMPLOYEE", accessor: "employee" },
        { header: "POINTS", accessor: "points" },
        { header: "LAST ACTIVE", accessor: "lastActive" },
        { header: "STATUS", accessor: "status" },
    ];

    const filteredEmployees = employees.filter((employee) => {
        const matchesDepartment = department === "All" || employee.department === department;
        const matchesSearch =
            !search ||
            `${employee.name} ${employee.employee_id}`.toLowerCase().includes(search.toLowerCase());

        return matchesDepartment && matchesSearch;
    });

    const data = filteredEmployees.map((employee) => ({
        id: employee.user_id,
        employee: (
            <EmployeeCell
                name={employee.name}
                department={employee.department}
                position={employee.position}
                isTopEngager={employee.points > 0 && employee.name === topEngagerName}
            />
        ),
        points: (
            <span className="text-sm font-bold text-gray-900">
                {employee.points.toLocaleString()}
            </span>
        ),
        lastActive: (
            <span className="text-sm text-gray-500">
                {formatLastActive(employee.last_active)}
            </span>
        ),
        status: <StatusBadge status={employee.status} />,
    }));

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await export_reward_challenge_employee_profiles_service({
                department: department === "All" ? undefined : department,
                search: search || undefined,
            });
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "employee_profiles.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Export failed",
                    message:
                        error.response?.data?.message ??
                        "Something went wrong while generating the export.",
                    open: true,
                }),
            );
        } finally {
            setExporting(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-4">
            <div className="space-y-2">
                <SearchSection
                    search={search}
                    onSearchChange={setSearch}
                    exporting={exporting}
                    onExport={handleExport}
                />
                <FilterTabs
                    options={departmentOptions}
                    active={department}
                    onChange={setDepartment}
                />
            </div>

            {rewardChallengeEmployeeProfilesLoading ? (
                <Skeleton variant="table" lines={5} />
            ) : (
                <>
                    <Table columns={columns} data={data} />
                    {filteredEmployees.length === 0 && (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">
                            No employees found.
                        </p>
                    )}
                </>
            )}
        </section>
    );
}
