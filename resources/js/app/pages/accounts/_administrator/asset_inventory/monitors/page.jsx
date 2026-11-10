import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import SmartImportModal from "../_components/smart-import-modal";
import { analyze_import_thunk, commit_import_thunk } from "@/app/redux/asset-import-thunk";
import { get_asset_monitors_thunk, create_asset_monitors_thunk } from "@/app/redux/asset-monitor-thunk";
import { clearErrors } from "@/app/redux/asset-monitor-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateMonitorSection from "./sections/create-monitor-section";



export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const { items, meta, loading, saving, errors } = useSelector((state) => state.asset_monitors);

    // Debounced server-side fetch on any filter/page change.
    // The monitors API only supports search/status/condition — availability and size remain client-side UI state.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                get_asset_monitors_thunk({
                    page,
                    per_page: 10,
                    search: searchQuery.trim() || undefined,
                    status: statusFilter || undefined,
                }),
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [dispatch, page, searchQuery, statusFilter, availabilityFilter, sizeFilter]);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || statusFilter || availabilityFilter || sizeFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setAvailabilityFilter("");
        setSizeFilter("");
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
            create_asset_monitors_thunk({
                asset_tag: values.serialNumber,
                serial_number: values.serialNumber || null,
                brand: values.brand,
                model: values.model || null,
                screen_size: values.screenSize || null,
                resolution: values.resolution || null,
                monitor_type: values.deviceType,
                status: values.status,
                availability: values.availability,
                location: values.location || null,
                site: values.station || null,
                issued_to: values.issuedTo,
                price: values.price,
            }),
        );
        if (create_asset_monitors_thunk.fulfilled.match(result)) {
            setIsCreateOpen(false);
            dispatch(clearErrors());
            dispatch(
                setAlert({
                    open: true,
                    type: "success",
                    title: "Monitor added",
                    message: `${values.serialNumber} was added to the inventory.`,
                }),
            );
            dispatch(get_asset_monitors_thunk({ page: 1, per_page: 10 }));
            setPage(1);
        }
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.serialNumber,
                message: `${row.brand} ${row.model} — ${row.status} / ${row.availability}.`,
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onCreateClick={() => setIsCreateOpen(true)} onImportClick={() => setIsImportOpen(true)} />

                    {/* Stats reflect the current page until the API exposes a stats block. */}
                    <StatsSection monitors={items} />

                    <CurrencyStrip currency={currency} setCurrency={setCurrency} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        availabilityFilter={availabilityFilter}
                        setAvailabilityFilter={withPageReset(setAvailabilityFilter)}
                        sizeFilter={sizeFilter}
                        setSizeFilter={withPageReset(setSizeFilter)}
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

                    <CreateMonitorSection
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