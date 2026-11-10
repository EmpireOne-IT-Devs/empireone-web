import React, { useState } from "react";
import { Select as AntSelect } from "antd";
import { FiSearch as Search } from "react-icons/fi";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import FilterAttendanceDate from "../../agents/sections/filter-attendance-date";
import BatchEndorseButton from "../../agents/sections/batch-endorse-button";

const TYPE_OPTIONS = [
    { value: "overtime", label: "Overtime" },
    { value: "schedule", label: "Schedule" },
    { value: "leave", label: "Leave" },
];

const STATUS_OPTIONS = [
    { value: "pending", label: "For Final Approval" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
];

export default function ApprovalsFilterSection({
    filters,
    onApply,
    selectedCount,
    onBatchApprove,
    isBusy,
}) {
    const [search, setSearch] = useState(filters.search);
    const [dateFrom, setDateFrom] = useState(filters.dateFrom);
    const [dateTo, setDateTo] = useState(filters.dateTo);

    const apply = (overrides = {}) =>
        onApply({ ...filters, search, dateFrom, dateTo, ...overrides });

    return (
        <div className="mb-4 flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-44">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                    Request Type
                </span>
                <AntSelect
                    size="large"
                    className="w-full"
                    aria-label="Request type"
                    value={filters.type}
                    options={TYPE_OPTIONS}
                    onChange={(type) => apply({ type })}
                />
            </div>

            <div className="w-full sm:w-52">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                    Status
                </span>
                <AntSelect
                    size="large"
                    className="w-full"
                    aria-label="Status"
                    value={filters.status}
                    options={STATUS_OPTIONS}
                    onChange={(status) => apply({ status })}
                />
            </div>

            <div className="w-full sm:w-64">
                <Input
                    label="Search employee"
                    name="final_approval_search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && apply()}
                />
            </div>

            <FilterAttendanceDate
                startDate={dateFrom}
                endDate={dateTo}
                onChange={(from, to) => {
                    setDateFrom(from);
                    setDateTo(to);
                }}
            />

            <Button
                variant="secondary"
                onClick={() => apply()}
                className="gap-2 !py-2.5 text-sm"
            >
                <Search size={16} aria-hidden="true" />
                Search
            </Button>

            <div className="sm:ml-auto">
                <BatchEndorseButton
                    selectedCount={selectedCount}
                    onClick={onBatchApprove}
                    loading={isBusy}
                />
            </div>
        </div>
    );
}
