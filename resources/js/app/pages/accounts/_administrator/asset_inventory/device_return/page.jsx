import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import ProcessReturnSection from "./sections/process-return-section";
import { initialDeviceReturns } from "./sections/device-return-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [reasonFilter, setReasonFilter] = useState("");
    const [conditionFilter, setConditionFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [returns, setReturns] = useState(initialDeviceReturns);

    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || reasonFilter || conditionFilter || statusFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setReasonFilter("");
        setConditionFilter("");
        setStatusFilter("");
        setPage(1);
    };

    const handleCreateSubmit = (values) => {
        const nextNumber = returns.length + 1;

        const item = {
            id: `DR-${String(nextNumber).padStart(3, "0")}`,
            deviceName: values.deviceName,
            returningEmployee: values.returningEmployee,
            reason: values.reason,
            condition: values.condition,
            returnDate: values.returnDate,
            status: "Pending Inspection",
            notes: values.notes || null,
        };

        setReturns((prev) => [item, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Return processed",
                message: `${item.deviceName} from ${item.returningEmployee} is pending inspection.`,
            }),
        );
    };

    const handleView = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: row.deviceName,
                message: `${row.returningEmployee} — ${row.reason} / ${row.status}.`,
            }),
        );
    };

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return returns.filter((item) => {
            const matchesSearch =
                !term ||
                [item.deviceName, item.returningEmployee, item.reason, item.id]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!reasonFilter || item.reason === reasonFilter) &&
                (!conditionFilter || item.condition === conditionFilter) &&
                (!statusFilter || item.status === statusFilter)
            );
        });
    }, [returns, searchQuery, reasonFilter, conditionFilter, statusFilter]);

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
                        reasonFilter={reasonFilter}
                        setReasonFilter={withPageReset(setReasonFilter)}
                        conditionFilter={conditionFilter}
                        setConditionFilter={withPageReset(setConditionFilter)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
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

                    <ProcessReturnSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}