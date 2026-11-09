import React from "react";
import { FiEye, FiInbox } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    PERIPHERAL_STATUS_VARIANTS,
    STOCK_STATUS_VARIANTS,
    getStockStatus,
} from "./peripheral-helpers";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No peripherals match your filters" : "No peripherals yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all peripherals."
                    : "Add the first peripheral to start tracking stock."}
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
            header: "Type",
            accessor: "type",
            render: (row) => (
                <span className="text-sm font-medium text-gray-900">{row.type}</span>
            ),
        },
        {
            header: "Brand/Model",
            accessor: "brand",
            render: (row) => (
                <div className="min-w-[180px]">
                    <span className="text-sm font-medium text-gray-900">
                        {row.brand} {row.model}
                    </span>
                    <div className="mt-0.5 max-w-[220px] truncate text-[11px] text-gray-500" title={row.description}>
                        {row.description}
                    </div>
                </div>
            ),
        },
        {
            header: "Stock Levels",
            accessor: "quantity",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{row.quantity}</span>
                    <span className="text-gray-400"> / min {row.lowStockThreshold}</span>
                </span>
            ),
        },
        {
            header: "Stock Status",
            accessor: "stockStatus",
            render: (row) => {
                const status = getStockStatus(row.quantity, row.lowStockThreshold);
                return (
                    <Badge
                        outlined
                        showDot
                        label={status}
                        variant={STOCK_STATUS_VARIANTS[status] ?? "secondary"}
                        className="rounded-full"
                    />
                );
            },
        },
        {
            header: "Location",
            accessor: "location",
            render: (row) => <span className="text-sm text-gray-700">{row.location}</span>,
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <Badge
                    label={row.status}
                    variant={PERIPHERAL_STATUS_VARIANTS[row.status] ?? "secondary"}
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
                    ariaLabel={`View ${row.brand} ${row.model}`}
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
