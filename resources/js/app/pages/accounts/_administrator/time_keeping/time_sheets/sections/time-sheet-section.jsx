import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
    FiCalendar as CalendarIcon,
    FiDownload as Download,
    FiFilter as Filter,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/app/_components/select";
import Alert from "@/app/_components/alert";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import Skeleton from "@/app/_components/skeleton";
import Table from "@/app/_components/table";
import {
    export_time_sheets_thunk,
    get_time_sheets_thunk,
} from "@/app/redux/time-sheet-thunk";

const PER_PAGE = 20;

const STATUS_OPTIONS = [
    "Present",
    "Late",
    "Undertime",
    "Absent",
    "Day Off",
    "On Leave",
    "Clocked In",
    "On Break",
    "Holiday",
];

const NO_RECORD_STATUSES = ["Absent", "Day Off", "On Leave"];

const STATUS_BADGE_VARIANTS = {
    Present: "success",
    Late: "warning",
    Undertime: "info",
    Absent: "danger",
    "Day Off": "purple",
    "On Leave": "secondary",
    "Clocked In": "primary",
    "On Break": "warning",
};

const EMPTY_FILTERS = {
    employee_id: "",
    start_date: "",
    end_date: "",
    status: "",
};

const formatMinutes = (minutes) => (minutes > 0 ? `${minutes} min` : "-");

export default function TimeSheetSection() {
    // `filters` is the editable draft; `applied` is what was last sent to the API.
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [applied, setApplied] = useState(EMPTY_FILTERS);
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();

    const { employees, employeesLoading } = useSelector(
        (store) => store.human_resources,
    );
    const {
        items: rows,
        meta,
        summary: summaryData,
        isLoading,
        error,
        isExporting,
        exportError,
    } = useSelector((store) => store.time_sheets);

    const selectedEmployeeId = applied.employee_id;

    useEffect(() => {
        const params = { page, per_page: PER_PAGE };
        Object.entries(applied).forEach(([key, value]) => {
            if (value) params[key] = value;
        });

        dispatch(get_time_sheets_thunk(params));
    }, [applied, page, dispatch]);

    const updateFilter = (key, value) =>
        setFilters((current) => ({ ...current, [key]: value }));

    const applyFilters = (next = filters) => {
        setApplied(next);
        setPage(1);
    };

    const clearFilters = () => {
        setFilters(EMPTY_FILTERS);
        applyFilters(EMPTY_FILTERS);
    };

    const hasActiveFilters = Object.values(applied).some(Boolean);

    // Exports the applied filters, not unapplied draft edits.
    const handleExport = async () => {
        const params = {};
        Object.entries(applied).forEach(([key, value]) => {
            if (value) params[key] = value;
        });

        const result = await dispatch(export_time_sheets_thunk(params));
        if (!export_time_sheets_thunk.fulfilled.match(result)) return;

        const url = window.URL.createObjectURL(result.payload.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.payload.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
    };

    // Make sure employees is always an array
    const employeeList = Array.isArray(employees)
        ? employees
        : (employees?.data ?? []);

    // Sort employees by Last Name, then First Name
    const sortedEmployeeOptions = useMemo(() => {
        const options = employeeList
            .slice()
            .sort((a, b) => {
                const lastNameA = a.personal_information?.last_name || "";
                const lastNameB = b.personal_information?.last_name || "";

                const lastNameComparison = lastNameA.localeCompare(lastNameB);

                if (lastNameComparison !== 0) {
                    return lastNameComparison;
                }

                const firstNameA = a.personal_information?.first_name || "";
                const firstNameB = b.personal_information?.first_name || "";

                return firstNameA.localeCompare(firstNameB);
            })
            .map((employee) => ({
                value: employee.employee_id,
                label: `${employee.personal_information?.last_name ?? ""}, ${
                    employee.personal_information?.first_name ?? ""
                } - ${employee.employee_id}`,
            }));

        return [
            {
                value: "",
                label: "All Employees",
            },
            ...options,
        ];
    }, [employeeList]);

    // Find currently selected employee
    const selectedEmployee = employeeList.find(
        (employee) =>
            String(employee.employee_id) === String(selectedEmployeeId),
    );

    const summary = [
        { title: "Working Days", value: summaryData.working_days },
        { title: "Present", value: summaryData.present },
        { title: "Late", value: summaryData.late },
        { title: "Overtime", value: `${summaryData.overtime_hours} hrs` },
    ];

    const columns = [
        {
            header: "Employee",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        {row.employee_name || "-"}
                    </span>
                    <span className="text-xs text-gray-500">
                        {row.employee_id}
                    </span>
                </div>
            ),
        },
        {
            header: "Date",
            render: (row) => moment(row.date).format("LL"),
        },
        { header: "Time In", render: (row) => row.clock_in || "-" },
        { header: "Break Out", render: (row) => row.break_start || "-" },
        { header: "Break In", render: (row) => row.break_end || "-" },
        { header: "Time Out", render: (row) => row.clock_out || "-" },
        {
            header: "Hours",
            render: (row) =>
                row.worked_hours === null ? "-" : row.worked_hours.toFixed(2),
        },
        { header: "Late", render: (row) => formatMinutes(row.late_minutes) },
        {
            header: "Overtime",
            render: (row) => formatMinutes(row.overtime_minutes),
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    label={row.status}
                    variant={STATUS_BADGE_VARIANTS[row.status] ?? "secondary"}
                    outlined
                />
            ),
        },
    ];

    const isEmpty = !isLoading && !error && rows.length === 0;
    const statusNeedsEmployee =
        !selectedEmployeeId && NO_RECORD_STATUSES.includes(applied.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Time Sheets</h1>

                <p className="text-gray-500">
                    View and manage employee attendance records.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Employee */}
                    <div className="flex-1 min-w-[260px]">
                        <Select
                            label="Select Employee"
                            name="employee_id"
                            options={sortedEmployeeOptions}
                            value={filters.employee_id}
                            onChange={(value) => {
                                const next = { ...filters, employee_id: value };
                                setFilters(next);
                                applyFilters(next);
                            }}
                            disabled={employeesLoading}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            aria-label="Start date"
                            value={filters.start_date}
                            max={filters.end_date || undefined}
                            onChange={(e) =>
                                updateFilter("start_date", e.target.value)
                            }
                            className="h-11 px-3 border rounded-lg"
                        />

                        <span className="text-gray-500">to</span>

                        <input
                            type="date"
                            aria-label="End date"
                            value={filters.end_date}
                            min={filters.start_date || undefined}
                            onChange={(e) =>
                                updateFilter("end_date", e.target.value)
                            }
                            className="h-11 px-3 border rounded-lg"
                        />
                    </div>

                    {/* Status */}
                    <select
                        aria-label="Status"
                        value={filters.status}
                        onChange={(e) => updateFilter("status", e.target.value)}
                        className="h-11 min-w-[170px] px-3 border rounded-lg"
                    >
                        <option value="">All Status</option>
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {/* Filter */}
                    <Button
                        variant="secondary"
                        onClick={() => applyFilters()}
                        disabled={isLoading}
                        className="h-11 px-6 gap-2"
                    >
                        <Filter size={18} />
                        Filter
                    </Button>

                    {/* Export */}
                    <Button
                        variant="outlined"
                        outlined
                        onClick={handleExport}
                        loading={isExporting}
                        disabled={isLoading || rows.length === 0}
                        className="h-11 px-8 gap-2"
                    >
                        <Download size={18} />
                        Export
                    </Button>
                </div>
            </div>

            {/* Selected Employee */}
            {selectedEmployee && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Selected Employee</p>

                    <p className="font-semibold text-purple-700">
                        {selectedEmployee.personal_information?.last_name},{" "}
                        {selectedEmployee.personal_information?.first_name}
                    </p>

                    <p className="text-sm text-gray-500">
                        Employee ID: {selectedEmployee.employee_id}
                    </p>
                </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white border rounded-xl p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{item.title}</p>

                        {isLoading ? (
                            <Skeleton
                                variant="text"
                                lines={1}
                                className="mt-3 w-20"
                            />
                        ) : (
                            <h2 className="text-3xl font-bold mt-2">
                                {item.value}
                            </h2>
                        )}
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden p-2 sm:p-4 space-y-4">
                {error && (
                    <Alert
                        open
                        type="error"
                        title="Unable to load time sheets"
                        message={error}
                        duration={4000}
                    />
                )}

                {exportError && (
                    <Alert
                        open
                        type="error"
                        title="Unable to export time sheets"
                        message={exportError}
                        duration={4000}
                    />
                )}

                {isEmpty ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-center">
                        <CalendarIcon size={32} className="text-gray-400" />
                        <h3 className="text-base font-medium text-gray-900">
                            No attendance records found
                        </h3>
                        <p className="max-w-md text-sm text-gray-500">
                            {statusNeedsEmployee
                                ? `${applied.status} is only available when a specific employee is selected.`
                                : "Try a different employee, date range, or status."}
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="secondary"
                                outlined
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={rows}
                        isloading={isLoading}
                        skeletonRows={8}
                    />
                )}

                {meta?.last_page > 1 && (
                    <Pagination data={meta} onPageChange={setPage} />
                )}
            </div>
        </div>
    );
}
