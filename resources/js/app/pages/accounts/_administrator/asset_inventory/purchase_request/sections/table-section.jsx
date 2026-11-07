import React from "react";
import { FiEye } from "react-icons/fi";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import {
    CATEGORY_VARIANTS,
    PRIORITY_VARIANTS,
    STATUS_VARIANTS,
    formatDate,
    formatMoney,
} from "./purchase-request-helpers";

export default function TableSection({
    data = [],
    currency = "PHP",
    loading = false,
    meta = null,
    onPageChange,
    onView,
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
            header: "Item",
            accessor: "itemName",
            render: (row) => (
                <div className="min-w-[180px]">
                    <span className="font-medium text-gray-900">{row.itemName}</span>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                        {row.department} • {row.requesterName}
                    </div>
                </div>
            ),
        },
        {
            header: "Category",
            accessor: "category",
            render: (row) => (
                <Badge
                    outlined
                    label={row.category}
                    variant={CATEGORY_VARIANTS[row.category] ?? "secondary"}
                />
            ),
        },
        {
            header: "Qty",
            accessor: "quantity",
            render: (row) => (
                <div>
                    <span className="font-medium text-gray-900">{row.quantity}</span>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                        {formatMoney(row.unitPrice, currency)} each
                    </div>
                </div>
            ),
        },
        {
            header: "Total",
            accessor: "totalAmount",
            render: (row) => (
                <div>
                    <span className="font-semibold text-gray-900">
                        {formatMoney(row.totalAmount, currency)}
                    </span>
                    <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                        {row.departmentCode}
                    </div>
                </div>
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
            header: "Purchase Date",
            accessor: "purchaseDate",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    {formatDate(row.purchaseDate)}
                </span>
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
                    <div className="mt-1 text-[11px] text-gray-500">
                        Supplier: {row.supplier}
                    </div>
                </div>
            ),
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <Button
                    size="sm"
                    variant="success"
                    onClick={() => onView?.(row)}
                    ariaLabel={`View purchase request ${row.id}`}
                >
                    <FiEye className="mr-1.5 h-3.5 w-3.5" />
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        data={data}
                        isloading={loading}
                        skeletonRows={5}
                    />
                </div>
            </div>

            {meta && meta.last_page > 1 && (
                <Pagination data={meta} onPageChange={onPageChange} />
            )}
        </div>
    );
}