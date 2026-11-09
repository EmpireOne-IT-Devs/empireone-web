import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateOtherAssetSection from "./sections/create-other-asset-section";
import { initialOtherAssets } from "./sections/other-asset-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [assets, setAssets] = useState(initialOtherAssets);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || categoryFilter || statusFilter || locationFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setStatusFilter("");
        setLocationFilter("");
        setPage(1);
    };

    const handleCreateSubmit = (values) => {
        const nextNumber = assets.length + 1;

        const asset = {
            id: `OA-${String(nextNumber).padStart(3, "0")}`,
            name: values.name,
            category: values.category,
            details: values.details || null,
            location: values.location,
            assignedTo: values.assignedTo,
            status: values.status,
            purchasePrice: values.purchasePrice,
            purchaseDate: values.purchaseDate,
        };

        setAssets((prev) => [asset, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Asset added",
                message: `${asset.name} was added to the inventory.`,
            }),
        );
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.name,
                message: `${row.category} — ${row.status} at ${row.location}.`,
            }),
        );
    };

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return assets.filter((asset) => {
            const matchesSearch =
                !term ||
                [asset.name, asset.category, asset.details, asset.assignedTo]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!categoryFilter || asset.category === categoryFilter) &&
                (!statusFilter || asset.status === statusFilter) &&
                (!locationFilter || asset.location === locationFilter)
            );
        });
    }, [assets, searchQuery, categoryFilter, statusFilter, locationFilter]);

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

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={withPageReset(setCategoryFilter)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        locationFilter={locationFilter}
                        setLocationFilter={withPageReset(setLocationFilter)}
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

                    <CreateOtherAssetSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}