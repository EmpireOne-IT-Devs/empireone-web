import React, { useMemo, useState } from "react";
import moment from "moment";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateItemReqSection from "./sections/create-item-req-section";
import { APPROVAL_STEPS, findDevice, findEmployee } from "./sections/item-request-helpers";
import { emptyApprovals } from "../_lib/approval-helpers";
import { initialItemRequests } from "./sections/item-request-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState(initialItemRequests);

    // Any filter change starts back at the first page.
    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(
        searchQuery.trim() || statusFilter || priorityFilter || typeFilter,
    );

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setPriorityFilter("");
        setTypeFilter("");
        setPage(1);
    };

    const handleCreateSubmit = (values) => {
        const nextNumber = requests.length + 1;
        const device = findDevice(values.assetTag);
        const employee = findEmployee(values.assigneeId);

        const request = {
            id: `IR-${String(nextNumber).padStart(3, "0")}`,
            requestDate: moment().format("YYYY-MM-DD"),
            deviceName: device?.name ?? values.assetTag,
            assetTag: values.assetTag,
            assigneeName: employee?.name ?? values.assigneeId,
            assigneeId: values.assigneeId,
            requestType: values.requestType,
            fromDate: values.fromDate || null,
            untilDate: values.untilDate || null,
            justification: values.justification,
            purpose: values.purpose || null,
            requesterName: employee?.name ?? "You",
            requesterEmail: employee?.email ?? null,
            department: employee?.department ?? "—",
            priority: values.priority,
            status: "Pending Approval",
            issuedAssetTag: null,
            approvals: emptyApprovals(APPROVAL_STEPS),
        };

        setRequests((prev) => [request, ...prev]);
        setPage(1);
    };

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return requests.filter((item) => {
            const matchesSearch =
                !term ||
                [item.deviceName, item.id, item.assetTag, item.assigneeName, item.assigneeId, item.department]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!statusFilter || item.status === statusFilter) &&
                (!priorityFilter || item.priority === priorityFilter) &&
                (!typeFilter || item.requestType === typeFilter)
            );
        });
    }, [requests, searchQuery, statusFilter, priorityFilter, typeFilter]);

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
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={withPageReset(setPriorityFilter)}
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        resultCount={filteredData.length}
                    />

                    <TableSection
                        data={pageData}
                        meta={pageMeta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                    />

                    <CreateItemReqSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}