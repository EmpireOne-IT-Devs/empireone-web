import React from "react";
import { FiEye, FiInbox } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    SYSTEM_STATUS_VARIANTS,
    SYSTEM_TYPE_VARIANTS,
} from "./system-unit-helpers";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No systems match your filters" : "No system units yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all systems."
                    : "Add the first system unit to start tracking your computers."}
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
            header: "System Info",
            accessor: "name",
            render: (row) => (
                <div className="min-w-[180px]">
                    <span className="font-medium text-gray-900">{row.name}</span>
                    <div className="mt-0.5 font-mono text-[11px] text-gray-500">{row.id}</div>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: "type",
            render: (row) => (
                <Badge
                    outlined
                    label={row.type}
                    variant={SYSTEM_TYPE_VARIANTS[row.type] ?? "secondary"}
                />
            ),
        },
        {
            header: "CPU",
            accessor: "cpu",
            render: (row) => <span className="text-sm text-gray-700">{row.cpu}</span>,
        },
        {
            header: "RAM",
            accessor: "ram",
            render: (row) => <span className="text-sm text-gray-700">{row.ram}</span>,
        },
        {
            header: "Storage",
            accessor: "storage",
            render: (row) => <span className="text-sm text-gray-700">{row.storage}</span>,
        },
        {
            header: "Operating System",
            accessor: "os",
            render: (row) => <span className="text-sm text-gray-700">{row.os}</span>,
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <Badge
                    outlined
                    showDot
                    label={row.status}
                    variant={SYSTEM_STATUS_VARIANTS[row.status] ?? "secondary"}
                    className="rounded-full"
                />
            ),
        },
        {
            header: "Location",
            accessor: "location",
            render: (row) => <span className="text-sm text-gray-700">{row.location}</span>,
        },
        {
            header: "Station",
            accessor: "station",
            render: (row) => <span className="text-sm text-gray-700">{row.station}</span>,
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="info"
                    onClick={() => onView?.(row)}
                    ariaLabel={`View system unit ${row.name}`}
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
