import React, { useMemo, useState } from "react";
import moment from "moment";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreatePurchaseReqSection from "./sections/create-purchase-req-section";
import { APPROVAL_STEPS } from "./sections/purchase-request-helpers";
import {
    DEPARTMENT_CODES,
    initialPurchaseRequests,
} from "./sections/purchase-request-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [currency, setCurrency] = useState("PHP");
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState(initialPurchaseRequests);

    // Any filter change starts back at the first page.
    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const handleCreateSubmit = (values) => {
        const now = moment();
        const nextNumber = requests.length + 1;

        const request = {
            id: `PR-${String(nextNumber).padStart(3, "0")}`,
            requestDate: now.format("YYYY-MM-DD"),
            itemName: values.itemName,
            department: values.department,
            requesterName: values.requesterName,
            category: values.category,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
            totalAmount: values.unitPrice * values.quantity,
            departmentCode: `${DEPARTMENT_CODES[values.department] ?? "DEPT"}-${now.format("YYYY")}-Q${now.quarter()}`,
            priority: values.priority,
            purchaseDate: now.clone().add(1, "month").format("YYYY-MM-DD"),
            status: "Pending Approval",
            supplier: values.supplierName || "General Supplier",
            approvals: APPROVAL_STEPS.map((step) => ({
                ...step,
                status: "pending",
                approverName: null,
                actedAt: null,
                remarks: null,
            })),
        };

        setRequests((prev) => [request, ...prev]);
        setPage(1);
    };

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return requests.filter((item) => {
            const matchesSearch =
                !term ||
                [item.itemName, item.id, item.department, item.requesterName, item.supplier]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!statusFilter || item.status === statusFilter) &&
                (!priorityFilter || item.priority === priorityFilter) &&
                (!categoryFilter || item.category === categoryFilter)
            );
        });
    }, [requests, searchQuery, statusFilter, priorityFilter, categoryFilter]);

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
                        categoryFilter={categoryFilter}
                        setCategoryFilter={withPageReset(setCategoryFilter)}
                        currency={currency}
                        setCurrency={setCurrency}
                        resultCount={filteredData.length}
                    />

                    <TableSection
                        data={pageData}
                        currency={currency}
                        meta={pageMeta}
                        onPageChange={setPage}
                    />

                    <CreatePurchaseReqSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}