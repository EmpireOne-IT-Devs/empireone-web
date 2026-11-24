import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import SmartImportModal from "../_components/smart-import-modal";
import { analyze_import_thunk, commit_import_thunk } from "@/app/redux/asset-import-thunk";
import {
    create_asset_system_unit_thunk,
    get_asset_system_units_thunk,
} from "@/app/redux/asset-system-unit-thunk";
import { clearErrors } from "@/app/redux/asset-system-unit-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateSystemUnitSection from "./sections/create-system-unit-section";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);
    const { items, meta, stats, loading, error, saving, errors, saveError } = useSelector(
        (state) => state.asset_system_units,
    );
    const lastSearch = useRef("");

    // Typing in the search box waits briefly; filters, paging and reloads fetch straight away.
    useEffect(() => {
        const search = searchQuery.trim();
        let request;
        const timer = setTimeout(
            () => {
                lastSearch.current = search;
                request = dispatch(
                    get_asset_system_units_thunk({
                        page,
                        per_page: PER_PAGE,
                        search: search || undefined,
                        type: typeFilter || undefined,
                        status: statusFilter || undefined,
                        location: locationFilter || undefined,
                    }),
                );
            },
            search === lastSearch.current ? 0 : 300,
        );
        return () => {
            clearTimeout(timer);
            request?.abort();
        };
    }, [dispatch, page, searchQuery, typeFilter, statusFilter, locationFilter, reloadKey]);

    // Any filter change starts back at the first page.
    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || typeFilter || statusFilter || locationFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("");
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
        const total = Object.values(summary ?? {}).reduce(
            (sum, module) => sum + (module.imported ?? 0),
            0,
        );
        setPage(1);
        setReloadKey((value) => value + 1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Import complete",
                message: `${total} assets imported.`,
            }),
        );
    };

    const closeCreate = () => {
        setIsCreateOpen(false);
        dispatch(clearErrors());
    };

    // Returns true when the unit was saved so the form knows it can close.
    const handleCreateSubmit = async (values) => {
        const result = await dispatch(
            create_asset_system_unit_thunk({
                name: values.name,
                type: values.type,
                cpu: values.cpu,
                ram: values.ram,
                storage: values.storage,
                os: values.os,
                status: values.status,
                location: values.location,
                station: values.station || null,
            }),
        );
        if (!create_asset_system_unit_thunk.fulfilled.match(result)) return false;

        const unit = result.payload.data;
        setPage(1);
        setReloadKey((value) => value + 1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "System unit added",
                message: `${unit.name} (${unit.id}) was added to the inventory.`,
            }),
        );
        return true;
    };

    const handleView = (row) => {
        const specifications = [row.cpu, row.ram, row.storage].filter(Boolean).join(" • ");
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.name,
                message: [specifications, row.status].filter(Boolean).join(" — "),
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
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
                        resultCount={meta?.total ?? 0}
                    />

                    {error && !loading ? (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium text-red-900">Couldn’t load system units</p>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                outlined
                                size="sm"
                                onClick={() => setReloadKey((value) => value + 1)}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <TableSection
                            data={items}
                            loading={loading}
                            meta={meta}
                            onPageChange={setPage}
                            hasFilters={hasFilters}
                            onClearFilters={clearFilters}
                            onCreate={() => setIsCreateOpen(true)}
                            onView={handleView}
                        />
                    )}

                    <CreateSystemUnitSection
                        isOpen={isCreateOpen}
                        onClose={closeCreate}
                        onSubmit={handleCreateSubmit}
                        submitting={saving}
                        apiErrors={errors}
                        saveError={saveError}
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