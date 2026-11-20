import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";

const STATUSES = [
    { label: "All statuses", value: "" },
    { label: "Pending Acknowledgment", value: "Pending Acknowledgment" },
    { label: "Acknowledged", value: "Acknowledged" },
    { label: "Voided", value: "Voided" },
];
const SOURCES = [
    { label: "All sources", value: "" },
    { label: "Digital", value: "digital" },
    { label: "Paper Record", value: "paper" },
];

export default function SearchSection({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    resultCount = 0,
    loading = false,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Agreements</h2>
                    <p className="text-xs text-gray-500">
                        {loading ? "Updating results…" : `${resultCount} ${resultCount === 1 ? "form" : "forms"} found`}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
                    <div className="sm:col-span-2 lg:w-80">
                        <Input
                            label="Search employee, asset tag, request…"
                            name="liability_form_search"
                            maxLength={150}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            iconLeft={<FiSearch size={16} />}
                            aria-label="Search liability forms"
                        />
                    </div>
                    <div className="lg:w-48">
                        <Select
                            label="Status"
                            name="liability_status_filter"
                            options={STATUSES}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                    <div className="lg:w-40">
                        <Select label="Source" name="liability_source_filter" options={SOURCES}
                            value={sourceFilter} onChange={setSourceFilter} />
                    </div>
                </div>
            </div>
        </div>
    );
}
