import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    RETURN_CONDITIONS,
    RETURN_REASONS,
    RETURN_STATUSES,
    toOptions,
} from "./device-return-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    reasonFilter,
    setReasonFilter,
    conditionFilter,
    setConditionFilter,
    statusFilter,
    setStatusFilter,
    resultCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Device Returns</h2>
                    <p className="text-xs text-gray-500">
                        {resultCount} {resultCount === 1 ? "return" : "returns"} found
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="sm:col-span-2 lg:w-72">
                        <Input
                            label="Search by device, assignee, or reason…"
                            name="device_return_search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Reason"
                            name="return_reason_filter"
                            options={withAll("All Reasons", RETURN_REASONS)}
                            value={reasonFilter}
                            onChange={setReasonFilter}
                        />
                    </div>
                    <div className="lg:w-40">
                        <Select
                            label="Condition"
                            name="return_condition_filter"
                            options={withAll("All Conditions", RETURN_CONDITIONS)}
                            value={conditionFilter}
                            onChange={setConditionFilter}
                        />
                    </div>
                    <div className="sm:col-span-2 lg:w-48">
                        <Select
                            label="Status"
                            name="return_status_filter"
                            options={withAll("All Status", RETURN_STATUSES)}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
