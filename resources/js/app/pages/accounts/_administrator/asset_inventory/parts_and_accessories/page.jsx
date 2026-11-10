import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import SmartImportModal from "../_components/smart-import-modal";
import { analyze_import_thunk, commit_import_thunk } from "@/app/redux/asset-import-thunk";
import { get_asset_parts_thunk, create_asset_parts_thunk } from "@/app/redux/asset-part-thunk";
import { clearErrors } from "@/app/redux/asset-part-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreatePartSection from "./sections/create-part-section";
import { getStockStatus } from "./sections/part-helpers";

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const { items, meta, loading, saving, errors } = useSelector((state) => state.asset_parts);

    // Debounced server-side fetch on any filter/page change.
    // The parts API only supports search/status/condition — type, brand, location, and stock remain client-side UI state.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                get_asset_parts_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                }),
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, page, searchQuery, typeFilter, brandFilter, locationFilter, stockFilter]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || typeFilter || brandFilter || locationFilter || stockFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("");
        setBrandFilter("");
        setLocationFilter("");
        setStockFilter("");
        setPage(1);
    };

    const brands = useMemo(
        () => [...new Set(items.map((i) => i.brand).filter(Boolean))].sort(),
        [items],
    );

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
            create_asset_parts_thunk({
                asset_tag: `PT-${Date.now().toString(36).toUpperCase()}`,
                name: values.name,
                brand: values.brand || null,
                part_type: values.type,
                quantity: values.quantity,
                low_stock_threshold: values.lowStockThreshold,
                status: "New",
                location: values.location || null,
                price: values.price,
                notes: values.description || null,
            }),
        );
        if (create_asset_parts_thunk.fulfilled.match(result)) {
            setIsCreateOpen(false);
            dispatch(clearErrors());
            dispatch(
                setAlert({
                    open: true,
                    type: "success",
                    title: "Part added",
                    message: `${values.name} was added to the inventory.`,
                }),
            );
            dispatch(get_asset_parts_thunk({ page: 1, per_page: 10 }));
            setPage(1);
        }
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.name,
                message: `${row.brand} ${row.type} — ${getStockStatus(row.quantity, row.lowStockThreshold)} (${row.quantity} in stock).`,
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onCreateClick={() => setIsCreateOpen(true)} onImportClick={() => setIsImportOpen(true)} />

                    {/* Stats reflect the current page until the API exposes a stats block. */}
                    <StatsSection items={items} />

                    <CurrencyStrip currency={currency} setCurrency={setCurrency} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        brandFilter={brandFilter}
                        setBrandFilter={withPageReset(setBrandFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
                        stockFilter={stockFilter}
                        setStockFilter={withPageReset(setStockFilter)}
                        brands={brands}
                        resultCount={meta?.total ?? 0}
                        totalCount={meta?.total ?? 0}
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

                    <CreatePartSection
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