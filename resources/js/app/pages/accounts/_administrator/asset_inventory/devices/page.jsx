import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
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
} from "@/app/redux/asset-device-thunk";
import { clearErrors } from "@/app/redux/asset-device-slice";

export default function Page() {
    const dispatch = useDispatch();
    const { items, meta, stats, loading, saving, importing, errors } = useSelector(
        (state) => state.asset_devices,
    );

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);

    // Debounced server-side fetch on any filter/page change.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                get_asset_devices_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                    status: statusFilter || undefined,
                    device_type: typeFilter || undefined,
                    availability: availabilityFilter || undefined,
                }),
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, page, searchQuery, statusFilter, typeFilter, availabilityFilter]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || statusFilter || typeFilter || availabilityFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setTypeFilter("");
        setAvailabilityFilter("");
        setPage(1);
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
            dispatch(get_asset_devices_thunk({ page: 1, per_page: 10 }));
            setPage(1);
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
        dispatch(get_asset_devices_thunk({ page: 1, per_page: 10 }));
        setPage(1);
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.assetTag,
                message: `${row.brand} ${row.model ?? ""} — ${row.status} / ${row.availability}.`,
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

                    <StatsSection stats={stats} />

                    <CurrencyStrip currency={currency} setCurrency={setCurrency} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        availabilityFilter={availabilityFilter}
                        setAvailabilityFilter={withPageReset(setAvailabilityFilter)}
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