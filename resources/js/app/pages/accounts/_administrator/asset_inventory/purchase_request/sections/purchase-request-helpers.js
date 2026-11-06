import moment from "moment";

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

export const toOptions = (values) =>
    values.map((value) => ({ label: value, value }));

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
    }).format(amount);
}

export function formatDate(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY") : "—";
}
