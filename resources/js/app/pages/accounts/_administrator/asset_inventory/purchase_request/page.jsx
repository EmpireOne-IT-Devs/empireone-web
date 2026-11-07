import React, { useMemo, useState } from "react";
import moment from "moment";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreatePurchaseReqSection from "./sections/create-purchase-req-section";
import ViewPurchaseReqSection from "./sections/view-purchase-req-section";

const PER_PAGE = 10;

// Mock data until the purchase-request API exists. Amounts are numeric PHP.
const initialPurchaseRequests = [
    {
        id: "PR-001",
        requestDate: "2025-07-15",
        itemName: "Dell Latitude 5530 Laptop",
        department: "IT Department",
        requesterName: "John Smith",
        category: "Computer Hardware",
        quantity: 5,
        unitPrice: 25000,
        totalAmount: 125000,
        departmentCode: "IT-2025-Q3",
        priority: "High",
        purchaseDate: "2025-08-15",
        status: "Pending Approval",
        supplier: "Dell Technologies",
    },
    {
        id: "PR-002",
        requestDate: "2025-07-14",
        itemName: "Office Chairs (Ergonomic)",
        department: "Human Resources",
        requesterName: "Sarah Wilson",
        category: "Furniture",
        quantity: 10,
        unitPrice: 5450,
        totalAmount: 54500,
        departmentCode: "HR-2025-Q3",
        priority: "Normal",
        purchaseDate: "2025-08-30",
        status: "Approved",
        supplier: "Other",
    },
    {
        id: "PR-003",
        requestDate: "2025-07-13",
        itemName: "Cisco Network Switch",
        department: "IT Department",
        requesterName: "Mike Davis",
        category: "Network Equipment",
        quantity: 2,
        unitPrice: 22500,
        totalAmount: 45000,
        departmentCode: "IT-2025-INFRA",
        priority: "Urgent",
        purchaseDate: "2025-07-25",
        status: "In Progress",
        supplier: "CDW",
    },
    {
        id: "PR-004",
        requestDate: "2025-07-12",
        itemName: "Microsoft Office 365 Licenses",
        department: "Administration",
        requesterName: "Emily Chen",
        category: "Software Licenses",
        quantity: 50,
        unitPrice: 998.5,
        totalAmount: 49925,
        departmentCode: "ADMIN-2025-SW",
        priority: "Normal",
        purchaseDate: "2025-08-01",
        status: "Ordered",
        supplier: "Microsoft",
    },
    {
        id: "PR-005",
        requestDate: "2025-07-11",
        itemName: "Standing Desk Converters",
        department: "Operations",
        requesterName: "Tom Wilson",
        category: "Office Equipment",
        quantity: 8,
        unitPrice: 1002,
        totalAmount: 8016,
        departmentCode: "OPS-2025-Q4",
        priority: "Low",
        purchaseDate: "2025-09-15",
        status: "Rejected",
        supplier: "Amazon Business",
    },
];

const DEPARTMENT_CODES = {
    "IT Department": "IT",
    "Human Resources": "HR",
    Administration: "ADMIN",
    Operations: "OPS",
};

export default function Page() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewing, setViewing] = useState(null);
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
                        onView={setViewing}
                    />

                    <CreatePurchaseReqSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />

                    <ViewPurchaseReqSection
                        request={viewing}
                        currency={currency}
                        onClose={() => setViewing(null)}
                    />
                </div>
                  
                
            </AssetInventory>
        </Layout>
    );
}