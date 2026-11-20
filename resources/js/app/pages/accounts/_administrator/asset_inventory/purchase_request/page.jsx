import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePage } from "@inertiajs/react";
import Button from "@/app/_components/button";
import { FiInbox } from "react-icons/fi";
import { create_asset_purchase_request_thunk, list_asset_purchase_requests_thunk } from "@/app/redux/asset-purchase-request-thunk";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreatePurchaseReqSection from "./sections/create-purchase-req-section";
export default function Page() {
    const dispatch = useDispatch();
    const user = usePage().props.auth?.user;
    const { items, meta, loading, error } = useSelector((state) => state.asset_purchase_requests.list);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchQuery.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const request = dispatch(list_asset_purchase_requests_thunk({
            page, search, status: statusFilter, priority: priorityFilter, category: categoryFilter,
        }));
        return () => request.abort();
    }, [dispatch, page, search, statusFilter, priorityFilter, categoryFilter, refresh]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const handleCreateSubmit = async (values) => {
        await dispatch(create_asset_purchase_request_thunk(values)).unwrap();
        setPage(1);
        setRefresh((value) => value + 1);
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                      <HeaderSection onCreateClick={() => setIsCreateOpen(true)} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={withPageReset(setPriorityFilter)}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={withPageReset(setCategoryFilter)}
                        currency={currency}
                        setCurrency={setCurrency}
                        resultCount={meta?.total ?? 0}
                    />

                    {error ? (
                        <div role="alert" className="space-y-3 rounded-xl border border-red-200 p-4 text-sm text-red-700">
                            <p>{error.message}</p>
                            <Button outlined onClick={() => setRefresh((value) => value + 1)}>Retry</Button>
                        </div>
                    ) : !loading && items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-8 text-center">
                            <FiInbox className="h-8 w-8 text-purple-600" aria-hidden="true" />
                            <h2 className="font-semibold">No purchase requests found</h2>
                            <p className="text-sm text-gray-600">Adjust your filters or create a new purchase request.</p>
                            <Button variant="secondary" onClick={() => setIsCreateOpen(true)}>Create request</Button>
                        </div>
                    ) : (
                        <TableSection data={items} loading={loading} currency={currency} meta={meta} onPageChange={setPage} />
                    )}

                    <CreatePurchaseReqSection
                        isOpen={isCreateOpen}
                        requesterName={user?.name?.trim() ? user.name : user?.email}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}