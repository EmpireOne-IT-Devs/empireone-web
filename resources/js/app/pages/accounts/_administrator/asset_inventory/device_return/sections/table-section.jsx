import React from "react";
import { FiEye, FiInbox } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    RETURN_CONDITION_VARIANTS,
    RETURN_REASON_VARIANTS,
    RETURN_STATUS_VARIANTS,
    formatDate,
} from "./device-return-helpers";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No returns match your filters" : "No device returns yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all returns."
                    : "Process the first return to start tracking device handovers."}
            </p>
            {hasFilters && (
                <Button
                    variant="secondary"
                    outlined
                    size="sm"
                    className="mt-5"
                    onClick={onClearFilters}
                >
                    Clear filters
                </Button>
            )}
        </div>
    );
}

export default function TableSection({
    data = [],
    loading = false,
    meta = null,
    onPageChange,
    hasFilters = false,
    onClearFilters,
    onView,
}) {
    const columns = [
        {
            header: "Device",
            accessor: "deviceName",
            render: (row) => (
                <span className="text-sm font-medium text-gray-900">{row.deviceName}</span>
            ),
        },
        {
            header: "Returning Employee",
            accessor: "returningEmployee",
            render: (row) => (
                <span className="text-sm text-gray-700">{row.returningEmployee}</span>
            ),
        },
        {
            header: "Reason",
            accessor: "reason",
            render: (row) => (
                <Badge
                    outlined
                    label={row.reason}
                    variant={RETURN_REASON_VARIANTS[row.reason] ?? "secondary"}
                />
            ),
        },
        {
            header: "Condition",
            accessor: "condition",
            render: (row) => (
                <Badge
                    label={row.condition}
                    variant={RETURN_CONDITION_VARIANTS[row.condition] ?? "secondary"}
                />
            ),
        },
        {
            header: "Return Date",
            accessor: "returnDate",
            render: (row) => (
                <span className="text-sm text-gray-700">{formatDate(row.returnDate)}</span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <Badge
                    outlined
                    showDot
                    label={row.status}
                    variant={RETURN_STATUS_VARIANTS[row.status] ?? "secondary"}
                    className="rounded-full"
                />
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="info"
                    onClick={() => onView?.(row)}
                    ariaLabel={`View return ${row.id}`}
                >
                    <FiEye className="h-3.5 w-3.5" />
                </Button>
            ),
        },
    ];

    const showEmpty = !loading && data.length === 0;

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {showEmpty ? (
                    <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
                ) : (
                    <div className="overflow-x-auto">
                        <Table
                            columns={columns}
                            data={data}
                            isloading={loading}
                            skeletonRows={5}
                        />
                    </div>
                )}
            </div>

            {meta && meta.last_page > 1 && (
                <Pagination data={meta} onPageChange={onPageChange} />
            )}
        </div>
    );
}
