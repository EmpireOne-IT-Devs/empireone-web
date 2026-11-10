import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import SmartImportModal from "../_components/smart-import-modal";
import { analyze_import_thunk, commit_import_thunk } from "@/app/redux/asset-import-thunk";
import { get_asset_other_assets_thunk, create_asset_other_assets_thunk } from "@/app/redux/asset-other-asset-thunk";
import { clearErrors } from "@/app/redux/asset-other-asset-slice";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateOtherAssetSection from "./sections/create-other-asset-section";

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const { items, meta, loading, saving, errors } = useSelector((state) => state.asset_other_assets);

    // Debounced server-side fetch on any filter/page change.
    // The other-assets API only supports search/status/condition — category and location remain client-side UI state.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                get_asset_other_assets_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                    status: statusFilter || undefined,
                }),
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, page, searchQuery, categoryFilter, statusFilter, locationFilter]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || categoryFilter || statusFilter || locationFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setStatusFilter("");
        setLocationFilter("");
        setPage(1);
    };

    const handleAnalyze = async (rows) => {
        const result = await dispatch(analyze_import_thunk(rows));
        if (analyze_import_thunk.fulfilled.match(result)) return result.payload;
        throw result.payload;
    };

    const handleImport = async (modules) => {
        const result = await dispatch(commit_import_thunk(modules));
        if (commit_import_thunk.fulfilled.match(result)) return result.payload;
        throw result.payload;
    };

    const handleImportDone = (summary) => {
        const total = Object.values(summary ?? {}).reduce((sum, m) => sum + (m.imported ?? 0), 0);
        dispatch(setAlert({ open: true, type: "success", title: "Import complete", message: ` ${total} assets imported. ` }));
    };
    const handleCreateSubmit = async (values) => {
        const result = await dispatch(
            create_asset_other_assets_thunk({
                asset_tag: `OA-${Date.now().toString(36).toUpperCase()}`,
                name: values.name,
                category: values.category,
                details: values.details || null,
                status: values.status,
                price: values.purchasePrice,
                purchase_date: values.purchaseDate,
                assigned_to: values.assignedTo,
                location: values.location || null,
            }),
        );
        if (create_asset_other_assets_thunk.fulfilled.match(result)) {
            setIsCreateOpen(false);
            dispatch(clearErrors());
            dispatch(
                setAlert({
                    open: true,
                    type: "success",
                    title: "Asset added",
                    message: `${values.name} was added to the inventory.`,
                }),
            );
            dispatch(get_asset_other_assets_thunk({ page: 1, per_page: 10 }));
            setPage(1);
        }
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.name,
                message: `${row.category} — ${row.status} at ${row.location}.`,
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onCreateClick={() => setIsCreateOpen(true)} onImportClick={() => setIsImportOpen(true)} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={withPageReset(setCategoryFilter)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
                        resultCount={meta?.total ?? 0}
                    />

                    <TableSection
                        data={items}
                        currency={currency}
                        loading={loading}
                        meta={meta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onView={handleView}
                    />

                    <CreateOtherAssetSection
                        isOpen={isCreateOpen}
                        onClose={() => {
                            setIsCreateOpen(false);
                            dispatch(clearErrors());
                        }}
                        onSubmit={handleCreateSubmit}
                        submitting={saving}
                        apiErrors={errors}
                    />
                    <SmartImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onAnalyze={handleAnalyze} onImport={handleImport} onDone={handleImportDone} />
                </div>
            </AssetInventory>
        </Layout>
    );
}