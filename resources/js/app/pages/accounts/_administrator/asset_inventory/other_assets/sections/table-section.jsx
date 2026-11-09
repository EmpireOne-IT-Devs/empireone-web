import React from "react";
import { FiEye, FiInbox, FiArchive } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    ASSET_CATEGORY_VARIANTS,
    ASSET_STATUS_VARIANTS,
    formatDate,
    formatMoney,
} from "./other-asset-helpers";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No assets match your filters" : "No other assets yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all assets."
                    : "Add the first asset to start tracking miscellaneous items."}
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
    currency = "PHP",
    loading = false,
    meta = null,
    onPageChange,
    hasFilters = false,
    onClearFilters,
    onView,
}) {
    const columns = [
        {
            header: "Asset",
            accessor: "name",
            render: (row) => (
                <div className="flex min-w-[180px] items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FiArchive className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-gray-900">{row.name}</span>
                </div>
            ),
        },
        {
            header: "Type & Details",
            accessor: "category",
            render: (row) => (
                <div className="min-w-[180px]">
                    <Badge
                        outlined
                        label={row.category}
                        variant={ASSET_CATEGORY_VARIANTS[row.category] ?? "secondary"}
                    />
                    <div className="mt-1 max-w-[220px] truncate text-[11px] text-gray-500" title={row.details}>
                        {row.details}
                    </div>
                </div>
            ),
        },
        {
            header: "Location & Assignment",
            accessor: "location",
            render: (row) => (
                <div>
                    <span className="text-sm text-gray-900">{row.location}</span>
                    <div className="mt-0.5 text-[11px] text-gray-500">{row.assignedTo}</div>
                </div>
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
                    variant={ASSET_STATUS_VARIANTS[row.status] ?? "secondary"}
                    className="rounded-full"
                />
            ),
        },
        {
            header: "Purchase Info",
            accessor: "purchasePrice",
            render: (row) => (
                <div>
                    <span className="text-sm font-medium text-gray-900">
                        {formatMoney(row.purchasePrice, currency)}
                    </span>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                        {formatDate(row.purchaseDate)}
                    </div>
                </div>
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
                    ariaLabel={`View asset ${row.name}`}
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
