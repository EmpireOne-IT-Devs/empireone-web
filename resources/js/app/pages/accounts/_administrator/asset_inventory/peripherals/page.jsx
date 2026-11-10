import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import SmartImportModal from "../_components/smart-import-modal";
import { analyze_import_thunk, commit_import_thunk } from "@/app/redux/asset-import-thunk";
import { get_asset_peripherals_thunk, create_asset_peripherals_thunk } from "@/app/redux/asset-peripheral-thunk";
import { clearErrors } from "@/app/redux/asset-peripheral-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreatePeripheralSection from "./sections/create-peripheral-section";
import { getStockStatus } from "./sections/peripheral-helpers";

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const { items, meta, loading, saving, errors } = useSelector((state) => state.asset_peripherals);

    // Debounced server-side fetch on any filter/page change.
    // The peripherals API only supports search/status/condition — type, stock, and location remain client-side UI state.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                get_asset_peripherals_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                }),
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, page, searchQuery, typeFilter, stockFilter, locationFilter]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || typeFilter || stockFilter || locationFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("");
        setStockFilter("");
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
            create_asset_peripherals_thunk({
                asset_tag: `PH-${Date.now().toString(36).toUpperCase()}`,
                peripheral_type: values.type,
                brand: values.brand || null,
                model: values.model || null,
                description: values.description || null,
                quantity: values.quantity,
                low_stock_threshold: values.lowStockThreshold,
                status: values.status,
                location: values.location || null,
                price: values.price,
            }),
        );
        if (create_asset_peripherals_thunk.fulfilled.match(result)) {
            setIsCreateOpen(false);
            dispatch(clearErrors());
            dispatch(
                setAlert({
                    open: true,
                    type: "success",
                    title: "Peripheral added",
                    message: `${values.brand} ${values.model} was added to stock.`,
                }),
            );
            dispatch(get_asset_peripherals_thunk({ page: 1, per_page: 10 }));
            setPage(1);
        }
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: `${row.brand} ${row.model}`,
                message: `${row.type} — ${getStockStatus(row.quantity, row.lowStockThreshold)} (${row.quantity} in stock).`,
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
                        stockFilter={stockFilter}
                        setStockFilter={withPageReset(setStockFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
                        resultCount={meta?.total ?? 0}
                    />

                    <TableSection
                        data={items}
                        loading={loading}
                        meta={meta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onView={handleView}
                    />

                    <CreatePeripheralSection
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