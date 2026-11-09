import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    LOCATIONS,
    PERIPHERAL_TYPES,
    STOCK_STATUSES,
    toOptions,
} from "./peripheral-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    stockFilter,
    setStockFilter,
    locationFilter,
    setLocationFilter,
    resultCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Peripherals</h2>
                    <p className="text-xs text-gray-500">
                        {resultCount} {resultCount === 1 ? "item" : "items"} found
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="sm:col-span-2 lg:w-72">
                        <Input
                            label="Search peripherals by type, brand, model, description…"
                            name="peripheral_search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                        />
                    </div>
                    <div className="lg:w-40">
                        <Select
                            label="Type"
                            name="peripheral_type_filter"
                            options={withAll("All Types", PERIPHERAL_TYPES)}
                            value={typeFilter}
                            onChange={setTypeFilter}
                        />
                    </div>
                    <div className="lg:w-44">
                        <Select
                            label="Stock Status"
                            name="peripheral_stock_filter"
                            options={withAll("All Stock", STOCK_STATUSES)}
                            value={stockFilter}
                            onChange={setStockFilter}
                        />
                    </div>
                    <div className="sm:col-span-2 lg:w-44">
                        <Select
                            label="Location"
                            name="peripheral_location_filter"
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
