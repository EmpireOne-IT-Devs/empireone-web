import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import { list_asset_item_requests_thunk, create_asset_item_request_thunk } from "@/app/redux/asset-item-request-thunk";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateItemReqSection from "./sections/create-item-req-section";

export default function Page() {
    const dispatch = useDispatch();
    const list = useSelector((state) => state.asset_item_requests.list);
    const saving = useSelector((state) => state.asset_item_requests.saving);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    const params = useMemo(() => ({
        search: searchQuery.trim() || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        type: typeFilter || undefined,
        page,
    }), [searchQuery, statusFilter, priorityFilter, typeFilter, page]);

    useEffect(() => {
        const request = dispatch(list_asset_item_requests_thunk(params));
        return () => request.abort();
    }, [dispatch, params, refreshKey]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(searchQuery.trim() || statusFilter || priorityFilter || typeFilter);
    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setPriorityFilter("");
        setTypeFilter("");
        setPage(1);
    };

    const handleCreateSubmit = async (values) => {
        await dispatch(create_asset_item_request_thunk(values)).unwrap();
        setIsCreateOpen(false);
        setPage(1);
        dispatch(setAlert({
            open: true,
            type: "success",
            title: "Request submitted",
            message: "Your item request has been submitted for review.",
        }));
        setRefreshKey((value) => value + 1);
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
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        resultCount={list.meta?.total ?? list.items.length}
                    />

                    <TableSection
                        data={list.items}
                        loading={list.loading}
                        error={list.error}
                        onRetry={() => setRefreshKey((value) => value + 1)}
                        meta={list.meta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onCreateRequest={() => setIsCreateOpen(true)}
                    />

                    <CreateItemReqSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                        submitting={saving}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}
