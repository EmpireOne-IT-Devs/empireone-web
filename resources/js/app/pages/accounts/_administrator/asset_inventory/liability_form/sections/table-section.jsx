import React from "react";
import { Link } from "@inertiajs/react";
import { FiEye, FiDownload, FiInbox, FiUser, FiMonitor } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    FORM_STATUS_VARIANTS,
    FORM_TYPE_VARIANTS,
    formatDateTime,
} from "./liability-form-helpers";

const DETAIL_BASE = "/accounts/administrator/asset_inventory/liability_form";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No forms match your filters" : "No liability forms yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all forms."
                    : "Create the first agreement to start tracking device liability."}
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
    onDownload,
}) {
    const columns = [
        {
            header: "Employee",
            accessor: "employeeName",
            render: (row) => (
                <div className="flex min-w-[180px] items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <FiUser className="h-4 w-4" />
                    </span>
                    <div>
                        <span className="font-medium text-gray-900">{row.employeeName}</span>
                        <div className="mt-0.5 text-[11px] text-gray-500">
                            ID: {row.employeeId}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Device",
            accessor: "deviceName",
            render: (row) => (
                <div className="flex min-w-[170px] items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <FiMonitor className="h-4 w-4" />
                    </span>
                    <div>
                        <span className="font-medium text-gray-900">{row.deviceName}</span>
                        <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                            {row.assetTag}
                        </div>
                    </div>
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
                    variant={FORM_TYPE_VARIANTS[row.type] ?? "secondary"}
                />
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <div>
                    <Badge
                        outlined
                        showDot
                        label={row.status}
                        variant={FORM_STATUS_VARIANTS[row.status] ?? "secondary"}
                        className="rounded-full"
                    />
                    <div className="mt-1 text-[11px] text-gray-500">
                        {row.department} • {row.employeeRole}
                    </div>
                </div>
            ),
        },
        {
            header: "Signed Date",
            accessor: "signedDate",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    {formatDateTime(row.signedDate)}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`${DETAIL_BASE}/${row.id}`}
                        aria-label={`View liability form ${row.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                        <FiEye className="mr-1.5 h-3.5 w-3.5" />
                        View
                    </Link>
                    <Button
                        size="sm"
                        variant="light"
                        outlined
                        onClick={() => onDownload?.(row)}
                        ariaLabel={`Download liability form ${row.id}`}
                    >
                        <FiDownload className="mr-1.5 h-3.5 w-3.5" />
                        Download
                    </Button>
                </div>
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
