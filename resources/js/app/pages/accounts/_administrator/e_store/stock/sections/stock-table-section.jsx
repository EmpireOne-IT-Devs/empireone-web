import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiImage as ImageIcon, FiInbox as InboxIcon } from "react-icons/fi";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import Table from "@/app/_components/table";
import { get_admin_e_store_stock_thunk } from "@/app/redux/engagement-thunk";
import StockAdjustModalSection from "./stock-adjust-modal-section";

const LOW_THRESHOLD = 5;

function stockStatus(item) {
    if (item.is_unlimited_stock) return { label: "Unlimited", variant: "info" };
    const qty = Number(item.quantity ?? 0);
    if (qty <= 0) return { label: "Out of Stock", variant: "danger" };
    if (qty <= LOW_THRESHOLD) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
}

export default function StockTableSection({ page, onPageChange, onParamsChange }) {
    const dispatch = useDispatch();
    const { adminEStoreStock, adminEStoreStockLoading } = useSelector(
        (state) => state.engagement,
    );

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [adjustTarget, setAdjustTarget] = useState(null);

    const params = useMemo(() => {
        const p = { page, per_page: 15 };
        if (search.trim()) p.search = search.trim();
        if (status) p.status = status;
        return p;
    }, [page, search, status]);

    useEffect(() => {
        dispatch(get_admin_e_store_stock_thunk(params));
        onParamsChange?.(params);
    }, [dispatch, params, onParamsChange]);

    const columns = useMemo(() => [
        {
            header: "Reward",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/60">
                        {row.product_image ? (
                            <img src={row.product_image} alt={row.product_name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{row.product_name}</div>
                        <div className="text-xs text-gray-400 font-normal truncate">
                            {row.customer_description || row.reward_type}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Category",
            render: (row) => <span className="font-semibold text-gray-800">{row.reward_type}</span>,
        },
        {
            header: "Points",
            render: (row) => <span className="font-medium text-orange-600">{Number(row.point_cost).toLocaleString()}</span>,
        },
        {
            header: "Stock",
            render: (row) => {
                const s = stockStatus(row);
                return (
                    <span className={`font-semibold ${s.variant === "warning" ? "text-amber-600" : s.variant === "danger" ? "text-red-600" : "text-gray-800"}`}>
                        {row.is_unlimited_stock ? "∞" : Number(row.quantity ?? 0)}
                    </span>
                );
            },
        },
        {
            header: "Status",
            render: (row) => {
                const s = stockStatus(row);
                return <Badge outlined label={s.label} variant={s.variant} className="rounded-full px-3 py-1 text-[12px] font-semibold" />;
            },
        },
        {
            header: "",
            render: (row) => (
                <div className="flex justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        outlined
                        type="button"
                        onClick={() => setAdjustTarget(row)}
                    >
                        Adjust Stock
                    </Button>
                </div>
            ),
        },
    ], []);

    if (!adminEStoreStockLoading && adminEStoreStock.length === 0 && !search && !status) {
        return (
            <Card padding="p-10" className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <InboxIcon size={22} className="text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No reward items yet</p>
                <p className="text-xs text-gray-500 mt-1">Add a reward item to start tracking stock.</p>
            </Card>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search reward or category…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); onPageChange(1); }}
                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-700 placeholder-gray-400"
                    />
                </div>
                <div className="w-full md:w-44">
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); onPageChange(1); }}
                        className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-700"
                    >
                        <option value="">All Statuses</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="unlimited">Unlimited</option>
                    </select>
                </div>
            </div>

            <div className="p-1">
                <Table columns={columns} data={adminEStoreStock} isloading={adminEStoreStockLoading} skeletonRows={5} />
            </div>

            <StockAdjustModalSection
                item={adjustTarget}
                isOpen={adjustTarget !== null}
                onClose={() => setAdjustTarget(null)}
                currentParams={params}
            />
        </div>
    );
}
