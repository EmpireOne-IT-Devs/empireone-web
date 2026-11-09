import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const RETURN_REASONS = [
    "Resignation",
    "Termination",
    "Replacement",
    "Upgrade",
    "End of Loan",
];

export const RETURN_REASON_VARIANTS = {
    Resignation: "warning",
    Termination: "danger",
    Replacement: "info",
    Upgrade: "purple",
    "End of Loan": "secondary",
};

export const RETURN_CONDITIONS = ["Excellent", "Good", "Fair", "Damaged"];

export const RETURN_CONDITION_VARIANTS = {
    Excellent: "success",
    Good: "primary",
    Fair: "warning",
    Damaged: "danger",
};

export const RETURN_STATUSES = [
    "Pending Inspection",
    "Inspected",
    "Restocked",
    "For Disposal",
];

export const RETURN_STATUS_VARIANTS = {
    "Pending Inspection": "warning",
    Inspected: "info",
    Restocked: "success",
    "For Disposal": "danger",
};

export function formatDate(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY") : "—";
}
