import React, { useState } from "react";
import { Select as AntSelect } from "antd";
import { Search } from "lucide-react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import FilterAttendanceDate from "./filter-attendance-date";
import BatchEndorseButton from "./batch-endorse-button";

export const REQUEST_TYPE_OPTIONS = [
    { value: "overtime", label: "Overtime" },
    { value: "schedule", label: "Schedule" },
    { value: "leave", label: "Leave" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
];

export default function SearchAgentSection({
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
                    options={REQUEST_TYPE_OPTIONS}
                    onChange={(type) => apply({ type })}
                />
            </div>

            <div className="w-full sm:w-40">
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
                    name="team_request_search"
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
