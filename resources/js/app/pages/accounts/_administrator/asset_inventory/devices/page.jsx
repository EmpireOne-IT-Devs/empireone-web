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
import ExcelImportModal from "../_components/excel-import-modal";
import {
    DEVICE_IMPORT_FIELDS,
    routeDeviceRow,
    transformDeviceRow,
} from "./sections/device-import-config";
import {
    create_asset_device_thunk,
    get_asset_devices_thunk,
    import_asset_devices_thunk,
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

    const handleImport = async (rows) => {
        const result = await dispatch(import_asset_devices_thunk(rows));
        if (import_asset_devices_thunk.fulfilled.match(result)) {
            return result.payload;
        }
        throw result.payload;
    };

    const handleImportDone = (summary) => {
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Import complete",
                message: `${summary.imported} devices imported${summary.skipped?.length ? `, ${summary.skipped.length} duplicates skipped` : ""}.`,
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

                    <ExcelImportModal
                        isOpen={isImportOpen}
                        onClose={() => setIsImportOpen(false)}
                        title="Import Devices from Excel"
                        fields={DEVICE_IMPORT_FIELDS}
                        transformRow={transformDeviceRow}
                        routeRow={routeDeviceRow}
                        onImport={handleImport}
                        onDone={handleImportDone}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}