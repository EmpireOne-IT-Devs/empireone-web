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
import CreatePartSection from "./sections/create-part-section";
import { initialParts } from "./sections/part-mock-data";
import { getStockStatus } from "./sections/part-helpers";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(initialParts);

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

    const handleCreateSubmit = (values) => {
        const nextNumber = items.length + 1;

        const item = {
            id: `PT-${String(nextNumber).padStart(3, "0")}`,
            name: values.name,
            brand: values.brand,
            type: values.type,
            quantity: values.quantity,
            lowStockThreshold: values.lowStockThreshold,
            location: values.location,
            price: values.price,
            description: values.description || null,
        };

        setItems((prev) => [item, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Part added",
                message: `${item.name} was added to the inventory.`,
            }),
        );
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

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                !term ||
                [item.name, item.brand, item.type, item.description]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!typeFilter || item.type === typeFilter) &&
                (!brandFilter || item.brand === brandFilter) &&
                (!locationFilter || item.location === locationFilter) &&
                (!stockFilter || getStockStatus(item.quantity, item.lowStockThreshold) === stockFilter)
            );
        });
    }, [items, searchQuery, typeFilter, brandFilter, locationFilter, stockFilter]);

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
                        brandFilter={brandFilter}
                        setBrandFilter={withPageReset(setBrandFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
                        stockFilter={stockFilter}
                        setStockFilter={withPageReset(setStockFilter)}
                        brands={brands}
                        resultCount={filteredData.length}
                        totalCount={items.length}
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

                    <CreatePartSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}