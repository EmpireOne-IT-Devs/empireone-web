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
import CreatePeripheralSection from "./sections/create-peripheral-section";
import { initialPeripherals } from "./sections/peripheral-mock-data";
import { getStockStatus } from "./sections/peripheral-helpers";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(initialPeripherals);

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

    const handleCreateSubmit = (values) => {
        const nextNumber = items.length + 1;

        const item = {
            id: `PH-${String(nextNumber).padStart(3, "0")}`,
            type: values.type,
            brand: values.brand,
            model: values.model,
            description: values.description || null,
            quantity: values.quantity,
            lowStockThreshold: values.lowStockThreshold,
            location: values.location,
            status: values.status,
            price: values.price,
        };

        setItems((prev) => [item, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Peripheral added",
                message: `${item.brand} ${item.model} was added to stock.`,
            }),
        );
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

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                !term ||
                [item.type, item.brand, item.model, item.description]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!typeFilter || item.type === typeFilter) &&
                (!stockFilter || getStockStatus(item.quantity, item.lowStockThreshold) === stockFilter) &&
                (!locationFilter || item.location === locationFilter)
            );
        });
    }, [items, searchQuery, typeFilter, stockFilter, locationFilter]);

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

                    <CreatePeripheralSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}