import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    PRIORITIES,
    REQUEST_TYPES,
    STATUSES,
    toOptions,
} from "./item-request-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    resultCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Item Requests</h2>
                    <p className="text-xs text-gray-500">
                        {resultCount} {resultCount === 1 ? "request" : "requests"} found
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="sm:col-span-2 lg:w-64">
                        <Input
                            label="Search requests"
                            name="item_request_search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Status"
                            name="item_status_filter"
                            options={withAll("All Status", STATUSES)}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Type"
                            name="item_type_filter"
                            options={withAll("All Types", REQUEST_TYPES)}
                            value={typeFilter}
                            onChange={setTypeFilter}
                        />
                    </div>
                    <div className="sm:col-span-2 lg:w-40">
                        <Select
                            label="Priority"
                            name="item_priority_filter"
                            options={withAll("All Priorities", PRIORITIES)}
                            value={priorityFilter}
                            onChange={setPriorityFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}