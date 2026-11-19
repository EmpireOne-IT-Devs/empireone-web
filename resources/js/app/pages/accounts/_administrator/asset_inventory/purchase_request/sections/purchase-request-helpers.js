export const DEPARTMENTS = [
    "IT Department",
    "Human Resources",
    "Administration",
    "Operations",
];

export const CATEGORIES = [
    "Computer Hardware",
    "Furniture",
    "Network Equipment",
    "Software Licenses",
    "Office Equipment",
];

export const PRIORITIES = ["Low", "Normal", "High", "Urgent"];
export const MAX_ITEMS = 25;

export function itemCostInCents({ quantity, unitCost }) {
    if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(unitCost) || !/^\d{1,7}$/.test(quantity)) return null;
    const count = BigInt(quantity);
    if (count < 1n || count > 1000000n) return null;

    const [whole, fraction = ""] = unitCost.split(".");
    return count * (BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0")));
}

export function formatItemCents(cents) {
    return formatMoney(`${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`);
}

export const STATUSES = [
    "Pending Approval",
    "Approved",
    "In Progress",
    "Ordered",
    "Rejected",
];

export const CURRENCIES = [
    { label: "PHP — Philippine Peso", value: "PHP" },
    { label: "USD — US Dollar", value: "USD" },
];

// Static conversion used for display only; amounts are stored in PHP.
const USD_PER_PHP = 1 / 58;

export const CATEGORY_VARIANTS = {
    "Computer Hardware": "primary",
    Furniture: "info",
    "Network Equipment": "success",
    "Software Licenses": "purple",
    "Office Equipment": "secondary",
};

export const PRIORITY_VARIANTS = {
    Urgent: "danger",
    High: "warning",
    Normal: "primary",
    Low: "secondary",
};

export const STATUS_VARIANTS = {
    "Pending Approval": "warning",
    Approved: "success",
    "In Progress": "info",
    Ordered: "purple",
    Rejected: "danger",
};

export {
    APPROVAL_STATUS_VARIANTS,
    getCurrentStepIndex,
    getApprovalSummary,
    toOptions,
    formatDate,
} from "../../_lib/approval-helpers";

export function formatMoney(amountPhp, currency = "PHP") {
    const amount = Number(amountPhp) || 0;

    if (currency === "USD") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount * USD_PER_PHP);
    }

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(typeof amountPhp === "string" && /^\d+\.\d{2}$/.test(amountPhp) ? amountPhp : amount);
}
