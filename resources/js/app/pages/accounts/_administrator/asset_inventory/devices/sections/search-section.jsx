import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    AVAILABILITY,
    DEVICE_STATUSES,
    DEVICE_TYPES,
    INVENTORY_CATEGORIES,
    toOptions,
} from "./device-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];
const CATEGORIES = [
    { label: "All categories", value: "" },
    ...Object.entries(INVENTORY_CATEGORIES).map(([value, label]) => ({ value, label })),
];
const STATUSES = [...DEVICE_STATUSES, "Active", "Inactive", "Available", "Assigned", "Deployed", "In Maintenance", "Out of Service", "Retired"];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    availabilityFilter,
    setAvailabilityFilter,
    resultCount,
    loading,
    fieldErrors,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Inventory search</h2>
                    <p role="status" className="text-xs text-gray-500">
                        {loading ? "Searching inventory…" : resultCount == null ? "" : `${resultCount} ${resultCount === 1 ? "record" : "records"} found`}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
                    <div className="sm:col-span-2 lg:w-72">
                        <Input
                            label="Search by tag, serial, name, or model"
                            name="device_search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                            maxLength={150}
                            error={fieldErrors?.search?.[0]}
                        />
                    </div>
                    <div className="lg:w-48">
                        <Select label="Category" name="inventory_category_filter" options={CATEGORIES}
                            value={category} onChange={setCategory} error={fieldErrors?.category?.[0]} />
                    </div>
                    <div className="lg:w-40">
                        <Select
                            label="Status"
                            name="device_status_filter"
                            options={withAll("All statuses", STATUSES)}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            error={fieldErrors?.status?.[0]}
                        />
                    </div>
                    {category === "devices" && <div className="lg:w-40">
                        <Select
                            label="Type"
                            name="device_type_filter"
                            options={withAll("All Types", DEVICE_TYPES)}
                            value={typeFilter}
                            onChange={setTypeFilter}
                            error={fieldErrors?.device_type?.[0]}
                        />
                    </div>}
                    {(category === "devices" || category === "monitors") && <div className="lg:w-44">
                        <Select
                            label="Availability"
                            name="device_availability_filter"
                            options={withAll("All Availability", AVAILABILITY)}
                            value={availabilityFilter}
                            onChange={setAvailabilityFilter}
                            error={fieldErrors?.availability?.[0]}
                        />
                    </div>}
                </div>
            </div>
        </div>
    );
}
