import React from "react";
import { FiInfo, FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    CATEGORIES,
    CURRENCIES,
    PRIORITIES,
    STATUSES,
    toOptions,
} from "./purchase-request-helpers";

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
    categoryFilter,
    setCategoryFilter,
    currency,
    setCurrency,
    resultCount = 0,
}) {
    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Purchase Requests
                        </h2>
                        <p className="text-xs text-gray-500">
                            {resultCount} {resultCount === 1 ? "request" : "requests"} found
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                        <div className="sm:col-span-2 lg:w-64">
                            <Input
                                label="Search requests"
                                name="purchase_request_search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                iconLeft={<FiSearch size={16} />}
                            />
                        </div>
                        <div className="lg:w-44">
                            <Select
                                label="Status"
                                name="status_filter"
                                options={withAll("All Status", STATUSES)}
                                value={statusFilter}
                                onChange={setStatusFilter}
                            />
                        </div>
                        <div className="lg:w-40">
                            <Select
                                label="Priority"
                                name="priority_filter"
                                options={withAll("All Priorities", PRIORITIES)}
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                            />
                        </div>
                        <div className="sm:col-span-2 lg:w-48">
                            <Select
                                label="Category"
                                name="category_filter"
                                options={withAll("All Categories", CATEGORIES)}
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency strip */}
            <div className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                        <FiInfo className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-teal-900">
                        Amounts are stored in Philippine Pesos (₱) and shown in
                        the selected currency.
                    </span>
                </div>

                <div className="w-full sm:w-56">
                    <Select
                        label="Display currency"
                        name="display_currency"
                        options={CURRENCIES}
                        value={currency}
                        onChange={setCurrency}
                    />
                </div>
            </div>
        </div>
    );
}