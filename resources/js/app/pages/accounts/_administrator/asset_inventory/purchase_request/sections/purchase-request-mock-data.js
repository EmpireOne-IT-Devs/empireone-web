import { APPROVAL_STEPS } from "./purchase-request-helpers";

export const DEPARTMENT_CODES = {
    "IT Department": "IT",
    "Human Resources": "HR",
    Administration: "ADMIN",
    Operations: "OPS",
};

// Builds the 4-step chain, marking the first `approvedCount` steps approved
// and optionally rejecting the step right after them.
function buildApprovals(approvedCount, options = {}) {
    const { rejected = false, baseDate = "2025-07-15", approvers = [] } = options;

    return APPROVAL_STEPS.map((step, index) => {
        const approver = approvers[index] ?? {};
        const dayOffset = index + 1;
        const date = new Date(baseDate);
        date.setDate(date.getDate() + dayOffset);
        const actedAt = date.toISOString().slice(0, 10);

        if (index < approvedCount) {
            return {
                ...step,
                status: "approved",
                approverName: approver.name ?? "—",
                actedAt,
                remarks: approver.remarks ?? "Reviewed and approved.",
            };
        }

        if (rejected && index === approvedCount) {
            return {
                ...step,
                status: "rejected",
                approverName: approver.name ?? "—",
                actedAt,
                remarks: approver.remarks ?? "Request does not meet the current criteria.",
            };
        }

        return {
            ...step,
            status: "pending",
            approverName: approver.name ?? null,
            actedAt: null,
            remarks: null,
        };
    });
}

// Mock data until the purchase-request API exists. Amounts are numeric PHP.
export const initialPurchaseRequests = [
    {
        id: "PR-001",
        requestDate: "2025-07-15",
        itemName: "Dell Latitude 5530 Laptop",
        description:
            "Replacement laptops for the IT support team. Current units are past their 5-year lifecycle and no longer receive firmware updates.",
        department: "IT Department",
        requesterName: "John Smith",
        requesterEmail: "john.smith@empireonecx.com",
        category: "Computer Hardware",
        quantity: 5,
        unitPrice: 25000,
        totalAmount: 125000,
        departmentCode: "IT-2025-Q3",
        priority: "High",
        purchaseDate: "2025-08-15",
        status: "Pending Approval",
        supplier: "Dell Technologies",
        approvals: buildApprovals(1, {
            baseDate: "2025-07-15",
            approvers: [
                { name: "Carlo Reyes", remarks: "Lifecycle replacement is overdue. Approved." },
                { name: "Ana Lim" },
                { name: "Marco Dela Cruz" },
                { name: "Patricia Santos" },
            ],
        }),
    },
    {
        id: "PR-002",
        requestDate: "2025-07-14",
        itemName: "Office Chairs (Ergonomic)",
        description:
            "Ergonomic chairs for the new HR onboarding area to accommodate the expanded recruitment team.",
        department: "Human Resources",
        requesterName: "Sarah Wilson",
        requesterEmail: "sarah.wilson@empireonecx.com",
        category: "Furniture",
        quantity: 10,
        unitPrice: 5450,
        totalAmount: 54500,
        departmentCode: "HR-2025-Q3",
        priority: "Normal",
        purchaseDate: "2025-08-30",
        status: "Approved",
        supplier: "Other",
        approvals: buildApprovals(4, {
            baseDate: "2025-07-14",
            approvers: [
                { name: "Grace Tan", remarks: "Headcount expansion confirmed." },
                { name: "Ana Lim", remarks: "Within Q3 facilities budget." },
                { name: "Marco Dela Cruz", remarks: "Supplier quote validated." },
                { name: "Patricia Santos", remarks: "Approved for release." },
            ],
        }),
    },
    {
        id: "PR-003",
        requestDate: "2025-07-13",
        itemName: "Cisco Network Switch",
        description:
            "Core switch replacement for the 3rd floor IDF. Existing unit is intermittently dropping uplinks.",
        department: "IT Department",
        requesterName: "Mike Davis",
        requesterEmail: "mike.davis@empireonecx.com",
        category: "Network Equipment",
        quantity: 2,
        unitPrice: 22500,
        totalAmount: 45000,
        departmentCode: "IT-2025-INFRA",
        priority: "Urgent",
        purchaseDate: "2025-07-25",
        status: "In Progress",
        supplier: "CDW",
        approvals: buildApprovals(2, {
            baseDate: "2025-07-13",
            approvers: [
                { name: "Carlo Reyes", remarks: "Critical infrastructure. Expedite." },
                { name: "Ana Lim", remarks: "Emergency fund allocated." },
                { name: "Marco Dela Cruz" },
                { name: "Patricia Santos" },
            ],
        }),
    },
    {
        id: "PR-004",
        requestDate: "2025-07-12",
        itemName: "Microsoft Office 365 Licenses",
        description:
            "Annual renewal of 50 E3 seats for the administration and finance teams.",
        department: "Administration",
        requesterName: "Emily Chen",
        requesterEmail: "emily.chen@empireonecx.com",
        category: "Software Licenses",
        quantity: 50,
        unitPrice: 998.5,
        totalAmount: 49925,
        departmentCode: "ADMIN-2025-SW",
        priority: "Normal",
        purchaseDate: "2025-08-01",
        status: "Ordered",
        supplier: "Microsoft",
        approvals: buildApprovals(4, {
            baseDate: "2025-07-12",
            approvers: [
                { name: "Patricia Santos", remarks: "Renewal is mandatory." },
                { name: "Ana Lim", remarks: "Matches last year's allocation." },
                { name: "Marco Dela Cruz", remarks: "EA pricing applied." },
                { name: "Patricia Santos", remarks: "Approved. Proceed to PO." },
            ],
        }),
    },
    {
        id: "PR-005",
        requestDate: "2025-07-11",
        itemName: "Standing Desk Converters",
        description:
            "Sit-stand converters for the operations floor as part of the wellness initiative.",
        department: "Operations",
        requesterName: "Tom Wilson",
        requesterEmail: "tom.wilson@empireonecx.com",
        category: "Office Equipment",
        quantity: 8,
        unitPrice: 1002,
        totalAmount: 8016,
        departmentCode: "OPS-2025-Q4",
        priority: "Low",
        purchaseDate: "2025-09-15",
        status: "Rejected",
        supplier: "Amazon Business",
        approvals: buildApprovals(1, {
            rejected: true,
            baseDate: "2025-07-11",
            approvers: [
                { name: "Rafael Gomez", remarks: "Supports the wellness program." },
                {
                    name: "Ana Lim",
                    remarks: "Deferred to Q1 2026 — not in the current budget cycle.",
                },
                { name: "Marco Dela Cruz" },
                { name: "Patricia Santos" },
            ],
        }),
    },
];

export function findPurchaseRequest(id) {
    return initialPurchaseRequests.find((request) => request.id === id) ?? null;
}
