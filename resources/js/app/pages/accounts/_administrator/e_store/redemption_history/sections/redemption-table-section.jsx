import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiInbox as InboxIcon } from "react-icons/fi";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import Pagination from "@/app/_components/pagination";
import Table from "@/app/_components/table";
import Confirmation from "@/app/_components/confirmation";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_e_store_redemptions_thunk,
    cancel_e_store_redemption_thunk,
    get_admin_e_store_redemptions_thunk,
} from "@/app/redux/engagement-thunk";
import RedemptionDetailsModalSection from "./redemption-details-modal-section";
import RedemptionFilterSection from "./redemption-filter-section";
import RedemptionActionSection from "./redemption-action-section";

const STATUS_VARIANTS = {
    pending: "warning",
    approved: "info",
    processing: "info",
    completed: "success",
    rejected: "danger",
    cancelled: "secondary",
};

function StatusBadge({ status }) {
    return (
        <Badge
            outlined
            label={status}
            variant={STATUS_VARIANTS[status] ?? "secondary"}
            className="rounded-full px-3 py-1 text-[12px] font-semibold capitalize"
        />
    );
}

export default function RedemptionTableSection() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.app.data?.user);
    const isAdmin = Number(user?.role) === 1;

    const {
        eStoreRedemptions,
        eStoreRedemptionsMeta,
        eStoreRedemptionsLoading,
        eStoreRedemptionCancellingRef,
        adminEStoreRedemptions,
        adminEStoreRedemptionsMeta,
        adminEStoreRedemptionsLoading,
    } = useSelector((state) => state.engagement);

    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [cancelTarget, setCancelTarget] = useState(null);

    const redemptions = isAdmin ? adminEStoreRedemptions : eStoreRedemptions;
    const meta = isAdmin ? adminEStoreRedemptionsMeta : eStoreRedemptionsMeta;
    const loading = isAdmin ? adminEStoreRedemptionsLoading : eStoreRedemptionsLoading;

    useEffect(() => {
        const params = { page, per_page: 15 };
        if (status) params.status = status;
        if (isAdmin && search.trim()) params.search = search.trim();

        dispatch(
            isAdmin
                ? get_admin_e_store_redemptions_thunk(params)
                : get_e_store_redemptions_thunk(params),
        );
    }, [dispatch, isAdmin, status, search, page]);

    const openDetails = (redemption) => {
        setSelected(redemption);
        setDetailsOpen(true);
    };

    const handleEmployeeCancel = async () => {
        if (!cancelTarget) return;
        const result = await dispatch(
            cancel_e_store_redemption_thunk({ reference: cancelTarget.reference }),
        );
        if (cancel_e_store_redemption_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "error",
                    message: result.payload?.message || "The redemption could not be cancelled.",
                }),
            );
            return;
        }
        dispatch(setAlert({ type: "success", message: "Redemption cancelled and points refunded." }));
        setCancelTarget(null);
    };

    const columns = useMemo(() => {
        const base = [
            {
                header: "Reference",
                render: (row) => (
                    <span className="font-mono text-xs font-semibold text-neutral-700">
                        {row.reference}
                    </span>
                ),
            },
        ];

        if (isAdmin) {
            base.push({
                header: "Employee",
                render: (row) => (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                            {row.employee?.name ?? "—"}
                        </span>
                        <span className="text-xs text-slate-500">
                            {row.employee?.eoid ?? row.employee?.email ?? ""}
                        </span>
                    </div>
                ),
            });
        }

        base.push(
            {
                header: "Item",
                render: (row) => (
                    <div className="flex items-center gap-2">
                        {row.item?.product_image && (
                            <img
                                src={row.item.product_image}
                                alt={row.item?.product_name}
                                className="h-8 w-8 rounded-md object-cover"
                            />
                        )}
                        <span className="text-sm text-gray-800">
                            {row.item?.product_name ?? "—"}
                            {row.quantity > 1 ? ` ×${row.quantity}` : ""}
                        </span>
                    </div>
                ),
            },
            {
                header: "Points",
                render: (row) => (
                    <span className="font-semibold text-blue-700">
                        {row.total_point_cost?.toLocaleString()}
                    </span>
                ),
            },
            { header: "Date", render: (row) => row.created_at },
            { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
                header: "",
                render: (row) => (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="light"
                            size="xs"
                            outlined
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDetails(row);
                            }}
                        >
                            Details
                        </Button>
                        {isAdmin ? (
                            <RedemptionActionSection
                                redemption={row}
                                onUpdated={() => setDetailsOpen(false)}
                            />
                        ) : (
                            row.status === "pending" && (
                                <Button
                                    variant="danger"
                                    size="xs"
                                    outlined
                                    type="button"
                                    disabled={eStoreRedemptionCancellingRef === row.reference}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCancelTarget(row);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )
                        )}
                    </div>
                ),
            },
        );

        return base;
    }, [isAdmin, eStoreRedemptionCancellingRef]);

    if (!loading && redemptions.length === 0 && !status && !search) {
        return (
            <Card padding="p-10" className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                    <InboxIcon size={22} className="text-orange-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                    No redemptions yet
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {isAdmin
                        ? "Redemption requests from employees will appear here."
                        : "Redeem a reward from the Rewards Items tab and it will show up here."}
                </p>
            </Card>
        );
    }

    return (
        <div className="overflow-hidden">
            <RedemptionFilterSection
                status={status}
                onStatusChange={(value) => {
                    setStatus(value);
                    setPage(1);
                }}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                showSearch={isAdmin}
            />

            <Table columns={columns} data={redemptions} isloading={loading} skeletonRows={5} />

            {meta && meta.last_page > 1 && (
                <div className="mt-4">
                    <Pagination data={meta} onPageChange={setPage} />
                </div>
            )}

            <RedemptionDetailsModalSection
                redemption={selected}
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
            />

            <Confirmation
                isOpen={cancelTarget !== null}
                onClose={() => setCancelTarget(null)}
                title="Cancel this redemption?"
            >
                <div className="space-y-3 pb-2">
                    <p className="text-sm text-neutral-600">
                        Your points will be refunded and the reserved stock restored.
                    </p>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            type="button"
                            onClick={() => setCancelTarget(null)}
                        >
                            Back
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            type="button"
                            loading={eStoreRedemptionCancellingRef === cancelTarget?.reference}
                            onClick={handleEmployeeCancel}
                        >
                            Confirm Cancel
                        </Button>
                    </div>
                </div>
            </Confirmation>
        </div>
    );
}
