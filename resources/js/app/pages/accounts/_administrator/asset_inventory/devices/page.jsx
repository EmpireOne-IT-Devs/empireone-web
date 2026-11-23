import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateDeviceSection from "./sections/create-device-section";
import SmartImportModal from "../_components/smart-import-modal";
import {
    analyze_import_thunk,
    commit_import_thunk,
} from "@/app/redux/asset-import-thunk";
import {
    create_asset_device_thunk,
    get_asset_devices_thunk,
    search_asset_inventory_thunk,
} from "@/app/redux/asset-device-thunk";
import { clearErrors } from "@/app/redux/asset-device-slice";
import { INVENTORY_CATEGORIES } from "./sections/device-helpers";

export default function Page() {
    const dispatch = useDispatch();
    const { inventory: { items, meta, loading, error }, stats, saving, errors } = useSelector(
        (state) => state.asset_devices,
    );

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        let request;
        const timer = setTimeout(() => {
            request = dispatch(
                search_asset_inventory_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                    category: category || undefined,
                    status: statusFilter || undefined,
                    device_type: typeFilter || undefined,
                    availability: availabilityFilter || undefined,
                }),
            );
        }, 300);
        return () => {
            clearTimeout(timer);
            request?.abort();
        };
    }, [dispatch, page, searchQuery, category, statusFilter, typeFilter, availabilityFilter, refresh]);

    useEffect(() => {
        if (category === "devices") dispatch(get_asset_devices_thunk({ per_page: 1 }));
    }, [dispatch, category, refresh]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || category || statusFilter || typeFilter || availabilityFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setCategory("");
        setStatusFilter("");
        setTypeFilter("");
        setAvailabilityFilter("");
        setPage(1);
    };

    const changeCategory = (value) => {
        setCategory(value);
        setTypeFilter("");
        setAvailabilityFilter("");
        setPage(1);
    };

    const refreshInventory = () => {
        setPage(1);
        setRefresh((value) => value + 1);
    };

    const handleCreateSubmit = async (values) => {
        const result = await dispatch(create_asset_device_thunk(values));
        if (create_asset_device_thunk.fulfilled.match(result)) {
            setIsCreateOpen(false);
            dispatch(clearErrors());
            dispatch(
                setAlert({
                    open: true,
                    type: "success",
                    title: "Device added",
                    message: `${values.asset_tag} was added to the inventory.`,
                }),
            );
            refreshInventory();
        }
    };

    const handleAnalyze = async (rows) => {
        const result = await dispatch(analyze_import_thunk(rows));
        if (analyze_import_thunk.fulfilled.match(result)) {
            return result.payload;
        }
        throw result.payload;
    };

    const handleImport = async (modules) => {
        const result = await dispatch(commit_import_thunk(modules));
        if (commit_import_thunk.fulfilled.match(result)) {
            return result.payload;
        }
        throw result.payload;
    };

    const handleImportDone = (summary) => {
        const total = Object.values(summary ?? {}).reduce(
            (sum, m) => sum + (m.imported ?? 0),
            0,
        );
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Import complete",
                message: `${total} assets imported across all modules.`,
            }),
        );
        refreshInventory();
    };

    const handleView = (row) => {
        const name = row.name ?? ([row.brand, row.model].filter(Boolean).join(" ") || row.deviceType);
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.assetTag,
                message: [INVENTORY_CATEGORIES[row.category], name, row.status, row.availability,
                    row.quantity !== null ? `Quantity: ${row.quantity}` : null].filter(Boolean).join(" · "),
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection
                        onCreateClick={() => setIsCreateOpen(true)}
                        onImportClick={() => setIsImportOpen(true)}
                    />

                    {category === "devices" && <StatsSection stats={stats} />}

                    <CurrencyStrip currency={currency} setCurrency={setCurrency} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        category={category}
                        setCategory={changeCategory}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        availabilityFilter={availabilityFilter}
                        setAvailabilityFilter={withPageReset(setAvailabilityFilter)}
                        resultCount={meta?.total}
                        loading={loading}
                        fieldErrors={error?.errors}
                    />

                    {error && !loading ? (
                        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            <p>{error.message}</p>
                            <Button type="button" variant="secondary" outlined size="sm" onClick={refreshInventory}>Retry</Button>
                        </div>
                    ) : <TableSection
                        data={items}
                        currency={currency}
                        loading={loading}
                        meta={meta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onView={handleView}
                    />}

                    <CreateDeviceSection
                        isOpen={isCreateOpen}
                        onClose={() => {
                            setIsCreateOpen(false);
                            dispatch(clearErrors());
                        }}
                        onSubmit={handleCreateSubmit}
                        submitting={saving}
                        apiErrors={errors}
                    />

                    <SmartImportModal
                        isOpen={isImportOpen}
                        onClose={() => setIsImportOpen(false)}
                        onAnalyze={handleAnalyze}
                        onImport={handleImport}
                        onDone={handleImportDone}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}