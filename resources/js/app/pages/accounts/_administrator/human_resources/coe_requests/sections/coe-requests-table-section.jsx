import React from "react";
import moment from "moment";
import { Link } from "@inertiajs/react";
import { FiAlertCircle, FiFileText } from "react-icons/fi";
import Table from "@/app/_components/table";
import Pagination from "@/app/_components/pagination";
import Button from "@/app/_components/button";

const columns = [
    { header: "Control No.", accessor: "control_no" },
    { header: "Employee ID", accessor: "employee_id" },
    { header: "Fullname", accessor: "name" },
    { header: "Purpose of Request", accessor: "purpose" },
    {
        header: "Date & Time Requested",
        accessor: "requested_at",
        render: (row) =>
            row.requested_at
                ? moment(row.requested_at).format("MMM D, YYYY h:mm A")
                : "—",
    },
];

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiFileText className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                No COE requests yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                Requests appear here once employees generate a Certificate of
                Employment.
            </p>
            {/* <Link href="/accounts/my_documents" className="mt-5">
                <Button variant="secondary" outlined size="sm">
                    Go to My Documents
                </Button>
            </Link> */}
        </div>
    );
}

export default function CoeRequestsTableSection({
    loading,
    data = [],
    meta,
    error,
    onPageChange,
}) {
    const is_empty = !loading && !error && data.length === 0;

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base font-semibold text-gray-900">
                    COE Requests
                </h2>
                <p className="text-sm text-gray-500">
                    {meta?.total ?? 0}{" "}
                    {meta?.total === 1 ? "request" : "requests"} logged
                </p>
            </div>

            {error ? (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <FiAlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            ) : null}

            {is_empty ? (
                <EmptyState />
            ) : (
                <>
                    <Table
                        isloading={loading}
                        skeletonRows={10}
                        columns={columns}
                        data={data}
                    />
                    {meta && meta.last_page > 1 ? (
                        <Pagination data={meta} onPageChange={onPageChange} />
                    ) : null}
                </>
            )}
        </div>
    );
}
