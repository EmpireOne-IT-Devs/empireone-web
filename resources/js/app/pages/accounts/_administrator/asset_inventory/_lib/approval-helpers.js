import moment from "moment";

// Shared approval-chain utilities for asset inventory request modules
// (Purchase Request, Item Request). Each step shape:
// { key, label, description, status: "pending"|"approved"|"rejected", approverName, actedAt, remarks }

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"];

export const APPROVAL_STATUS_VARIANTS = {
    approved: "success",
    rejected: "danger",
    pending: "warning",
};

// Index of the first non-approved step; -1 when the whole chain is approved.
export function getCurrentStepIndex(approvals = []) {
    return approvals.findIndex((step) => step.status !== "approved");
}

export function getApprovalSummary(approvals = []) {
    const approvedCount = approvals.filter((s) => s.status === "approved").length;
    const rejected = approvals.find((s) => s.status === "rejected");

    return {
        approvedCount,
        total: approvals.length,
        isRejected: Boolean(rejected),
        isComplete: !rejected && approvedCount === approvals.length,
        rejectedBy: rejected?.label ?? null,
    };
}

// Builds a chain from `steps`, marking the first `approvedCount` approved and
// optionally rejecting the step right after them. Used by mock data only.
export function buildApprovals(steps, approvedCount, options = {}) {
    const { rejected = false, baseDate = "2025-07-15", approvers = [] } = options;

    return steps.map((step, index) => {
        const approver = approvers[index] ?? {};
        const actedAt = moment(baseDate)
            .add(index + 1, "days")
            .format("YYYY-MM-DD");

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

export function emptyApprovals(steps) {
    return steps.map((step) => ({
        ...step,
        status: "pending",
        approverName: null,
        actedAt: null,
        remarks: null,
    }));
}

export const toOptions = (values) =>
    values.map((value) => ({ label: value, value }));

export function formatDate(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY") : "—";
}
