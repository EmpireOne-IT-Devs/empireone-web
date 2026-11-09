import React from "react";
import { FiEye, FiInbox } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    AVAILABILITY_VARIANTS,
    MONITOR_STATUS_VARIANTS,
    formatMoney,
} from "./monitor-helpers";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No monitors match your filters" : "No monitors yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all monitors."
                    : "Add the first monitor to start tracking your inventory."}
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
            header: "Serial Number",
            accessor: "serialNumber",
            render: (row) => (
                <span className="font-mono text-sm font-semibold text-gray-900">
                    {row.serialNumber}
                </span>
            ),
        },
        {
            header: "Brand",
            accessor: "brand",
            render: (row) => <span className="text-sm text-gray-700">{row.brand}</span>,
        },
        {
            header: "Model",
            accessor: "model",
            render: (row) => (
                <div className="min-w-[140px]">
                    <span className="text-sm font-medium text-gray-900">{row.model}</span>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                        {row.screenSize} · {row.resolution}
                    </div>
                </div>
            ),
        },
        {
            header: "Device Type",
            accessor: "deviceType",
            render: (row) => <span className="text-sm text-gray-700">{row.deviceType}</span>,
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <Badge
                    label={row.status}
                    variant={MONITOR_STATUS_VARIANTS[row.status] ?? "secondary"}
                />
            ),
        },
        {
            header: "Availability",
            accessor: "availability",
            render: (row) => (
                <Badge
                    outlined
                    showDot
                    label={row.availability}
                    variant={AVAILABILITY_VARIANTS[row.availability] ?? "secondary"}
                    className="rounded-full"
                />
            ),
        },
        {
            header: "Price",
            accessor: "price",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    {formatMoney(row.price, currency)}
                </span>
            ),
        },
        {
            header: "Issued To",
            accessor: "issuedTo",
            render: (row) => (
                <span className="text-sm text-gray-700">{row.issuedTo ?? "Not issued"}</span>
            ),
        },
        {
            header: "Received By",
            accessor: "receivedBy",
            render: (row) => <span className="text-sm text-gray-700">{row.receivedBy}</span>,
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="info"
                    onClick={() => onView?.(row)}
                    ariaLabel={`View monitor ${row.serialNumber}`}
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
