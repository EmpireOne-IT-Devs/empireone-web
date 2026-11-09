import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    ASSET_CATEGORIES,
    ASSET_STATUSES,
    LOCATIONS,
    toOptions,
} from "./other-asset-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    locationFilter,
    setLocationFilter,
    resultCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Other Assets</h2>
                    <p className="text-xs text-gray-500">
                        {resultCount} {resultCount === 1 ? "asset" : "assets"} found
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="sm:col-span-2 lg:w-64">
                        <Input
                            label="Search assets…"
                            name="other_asset_search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Category"
                            name="other_asset_category_filter"
                            options={withAll("All Categories", ASSET_CATEGORIES)}
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Status"
                            name="other_asset_status_filter"
                            options={withAll("All Status", ASSET_STATUSES)}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                    <div className="sm:col-span-2 lg:w-44">
                        <Select
                            label="Location"
                            name="other_asset_location_filter"
                            options={withAll("All Locations", LOCATIONS)}
                            value={locationFilter}
                            onChange={setLocationFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
