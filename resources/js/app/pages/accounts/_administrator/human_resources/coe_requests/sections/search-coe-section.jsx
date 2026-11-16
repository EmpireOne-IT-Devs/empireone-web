import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { COE_PURPOSES } from "@/app/lib/coe-purposes";

const PURPOSE_FILTER_OPTIONS = [
    { label: "All Purposes", value: "" },
    ...COE_PURPOSES,
];

export default function SearchCoeSection({
    search,
    setSearch,
    purpose,
    setPurpose,
    resultCount = 0,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">
                        COE Requests
                    </h2>
                    <p className="text-xs text-gray-500">
                        {resultCount}{" "}
                        {resultCount === 1 ? "request" : "requests"} found
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="lg:w-72">
                        <Input
                            label="Search name, employee ID or control no."
                            name="coe_request_search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                        />
                    </div>
                    <div className="lg:w-72">
                        <Select
                            label="Purpose of Request"
                            name="coe_purpose_filter"
                            options={PURPOSE_FILTER_OPTIONS}
                            value={purpose}
                            onChange={setPurpose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
