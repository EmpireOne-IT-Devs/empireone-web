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
import CreateSystemUnitSection from "./sections/create-system-unit-section";
import { initialSystemUnits } from "./sections/system-unit-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [units, setUnits] = useState(initialSystemUnits);

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

    const handleCreateSubmit = (values) => {
        const nextNumber = units.length + 1;

        const unit = {
            id: `SU-${String(nextNumber).padStart(3, "0")}`,
            name: values.name,
            type: values.type,
            cpu: values.cpu,
            ram: values.ram,
            storage: values.storage,
            os: values.os,
            status: values.status,
            location: values.location,
            station: values.station || "—",
            customBuilt: values.name.toLowerCase().includes("custom"),
        };

        setUnits((prev) => [unit, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "System unit added",
                message: `${unit.name} was added to the inventory.`,
            }),
        );
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.name,
                message: `${row.cpu} • ${row.ram} • ${row.storage} — ${row.status}.`,
            }),
        );
    };

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return units.filter((unit) => {
            const matchesSearch =
                !term ||
                [unit.name, unit.id, unit.cpu, unit.os, unit.station]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!typeFilter || unit.type === typeFilter) &&
                (!statusFilter || unit.status === statusFilter) &&
                (!locationFilter || unit.location === locationFilter)
            );
        });
    }, [units, searchQuery, typeFilter, statusFilter, locationFilter]);

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

                    <StatsSection units={units} />

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
                        resultCount={filteredData.length}
                    />

                    <TableSection
                        data={pageData}
                        meta={pageMeta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onView={handleView}
                    />

                    <CreateSystemUnitSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}