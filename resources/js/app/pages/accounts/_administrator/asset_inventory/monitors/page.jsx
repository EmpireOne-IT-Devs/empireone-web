import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import CurrencyStrip from "./sections/currency-strip";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateMonitorSection from "./sections/create-monitor-section";
import { initialMonitors } from "./sections/monitor-mock-data";
import { sizeBucket } from "./sections/monitor-helpers";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [monitors, setMonitors] = useState(initialMonitors);

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

    const handleCreateSubmit = (values) => {
        const monitor = {
            id: values.serialNumber,
            serialNumber: values.serialNumber,
            brand: values.brand,
            model: values.model,
            screenSize: values.screenSize,
            resolution: values.resolution || "—",
            deviceType: values.deviceType,
            status: values.status,
            availability: values.availability,
            price: values.price,
            issuedTo: values.issuedTo,
            receivedBy: "You",
            location: values.location || "—",
            station: values.station || "—",
        };

        setMonitors((prev) => [monitor, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Monitor added",
                message: `${monitor.serialNumber} was added to the inventory.`,
            }),
        );
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

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return monitors.filter((monitor) => {
            const matchesSearch =
                !term ||
                [monitor.serialNumber, monitor.brand, monitor.model, monitor.screenSize, monitor.issuedTo]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!statusFilter || monitor.status === statusFilter) &&
                (!availabilityFilter || monitor.availability === availabilityFilter) &&
                (!sizeFilter || sizeBucket(monitor.screenSize) === sizeFilter)
            );
        });
    }, [monitors, searchQuery, statusFilter, availabilityFilter, sizeFilter]);

    const pageMeta = useMemo(
        () => ({
            current_page: page,
            last_page: Math.max(1, Math.ceil(filteredData.length / PER_PAGE)),
            per_page: PER_PAGE,
            total: filteredData.length,
        }),
        [filteredData.length, page],
    );

    const pageData = useMemo(() => {
        const start = (page - 1) * PER_PAGE;
        return filteredData.slice(start, start + PER_PAGE);
    }, [filteredData, page]);

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onCreateClick={() => setIsCreateOpen(true)} />

                    <StatsSection monitors={monitors} />

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
                        resultCount={filteredData.length}
                    />

                    <TableSection
                        data={pageData}
                        currency={currency}
                        meta={pageMeta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onView={handleView}
                    />

                    <CreateMonitorSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}