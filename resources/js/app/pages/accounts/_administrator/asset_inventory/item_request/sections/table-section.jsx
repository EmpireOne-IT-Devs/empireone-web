import React from "react";
import { Link } from "@inertiajs/react";
import { FiEye, FiInbox } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    PRIORITY_VARIANTS,
    REQUEST_TYPE_VARIANTS,
    STATUS_VARIANTS,
    formatDate,
} from "./item-request-helpers";

const DETAIL_BASE = "/accounts/administrator/asset_inventory/item_request";

function EmptyState({ hasFilters, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiInbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasFilters ? "No requests match your filters" : "No item requests yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasFilters
                    ? "Try a different search term or reset the filters to see all requests."
                    : "Create the first request to start tracking device assignments."}
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
}) {
    const columns = [
        {
            header: "Request ID",
            accessor: "id",
            render: (row) => (
                <div>
                    <span className="font-semibold text-gray-900">{row.id}</span>
                    <div className="mt-0.5 text-[11px] text-gray-400">
                        {formatDate(row.requestDate)}
                    </div>
                </div>
            ),
        },
        {
            header: "Device",
            accessor: "deviceName",
            render: (row) => (
                <div className="min-w-[180px]">
                    <span className="font-medium text-gray-900">{row.deviceName}</span>
                    <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                        {row.assetTag}
                    </div>
                </div>
            ),
        },
        {
            header: "Assign To",
            accessor: "assigneeName",
            render: (row) => (
                <div className="min-w-[150px]">
                    <span className="text-sm font-medium text-gray-900">{row.assigneeName}</span>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                        {row.assigneeId} • {row.department}
                    </div>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: "requestType",
            render: (row) => (
                <Badge
                    outlined
                    label={row.requestType}
                    variant={REQUEST_TYPE_VARIANTS[row.requestType] ?? "secondary"}
                />
            ),
        },
        {
            header: "Priority",
            accessor: "priority",
            render: (row) => (
                <Badge
                    label={row.priority}
                    variant={PRIORITY_VARIANTS[row.priority] ?? "secondary"}
                />
            ),
        },
        {
            header: "Period",
            accessor: "fromDate",
            render: (row) => (
                <div className="text-sm text-gray-700">
                    <div>{formatDate(row.fromDate)}</div>
                    {row.untilDate && (
                        <div className="mt-0.5 text-[11px] text-gray-500">
                            until {formatDate(row.untilDate)}
                        </div>
                    )}
                </div>
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
                        variant={STATUS_VARIANTS[row.status] ?? "secondary"}
                        className="rounded-full"
                    />
                    {row.issuedAssetTag && (
                        <div className="mt-1 font-mono text-[11px] text-gray-500">
                            Tag: {row.issuedAssetTag}
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <Link
                    href={`${DETAIL_BASE}/${row.id}`}
                    aria-label={`View item request ${row.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                    <FiEye className="mr-1.5 h-3.5 w-3.5" />
                    View
                </Link>
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