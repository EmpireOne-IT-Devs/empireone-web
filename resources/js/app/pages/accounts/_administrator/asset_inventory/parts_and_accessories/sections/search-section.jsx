import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    LOCATIONS,
    PART_TYPES,
    STOCK_STATUSES,
    toOptions,
} from "./part-helpers";

const withAll = (label, values) => [
    { label, value: "" },
    ...toOptions(values),
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    brandFilter,
    setBrandFilter,
    locationFilter,
    setLocationFilter,
    stockFilter,
    setStockFilter,
    brands = [],
    resultCount = 0,
    totalCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FiFilter className="h-4 w-4 text-purple-600" />
                Filter Options
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Input
                    label="Search"
                    name="part_search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconLeft={<FiSearch size={16} />}
                />
                <Select
                    label="Type"
                    name="part_type_filter"
                    options={withAll("All Types", PART_TYPES)}
                    value={typeFilter}
                    onChange={setTypeFilter}
                />
                <Select
                    label="Brand"
                    name="part_brand_filter"
                    options={withAll("All Brands", brands)}
                    value={brandFilter}
                    onChange={setBrandFilter}
                />
                <Select
                    label="Location"
                    name="part_location_filter"
                    options={withAll("All Locations", LOCATIONS)}
                    value={locationFilter}
                    onChange={setLocationFilter}
                />
                <Select
                    label="Stock Status"
                    name="part_stock_filter"
                    options={withAll("All Stock", STOCK_STATUSES)}
                    value={stockFilter}
                    onChange={setStockFilter}
                />
            </div>

            <p className="mt-3 text-xs text-gray-500">
                Showing {resultCount} of {totalCount} parts
            </p>
        </div>
    );
}
