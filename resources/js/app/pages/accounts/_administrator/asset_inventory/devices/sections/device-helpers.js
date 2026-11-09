import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const DEVICE_TYPES = ["Laptop", "MAC", "Desktop", "Mobile", "Tablet"];

export const DEVICE_TYPE_VARIANTS = {
    Laptop: "primary",
    MAC: "purple",
    Desktop: "info",
    Mobile: "success",
    Tablet: "warning",
};

export const DEVICE_STATUSES = ["New", "Working", "Defective", "For Repair"];

export const DEVICE_STATUS_VARIANTS = {
    New: "info",
    Working: "success",
    Defective: "danger",
    "For Repair": "warning",
};

export const AVAILABILITY = ["Available", "Assigned", "Unavailable"];

export const AVAILABILITY_VARIANTS = {
    Available: "success",
    Assigned: "purple",
    Unavailable: "secondary",
};

export const CURRENCIES = [
    { label: "PHP — Philippine Peso", value: "PHP" },
    { label: "USD — US Dollar", value: "USD" },
];

// Static conversion used for display only; amounts are stored in PHP.
const USD_PER_PHP = 1 / 58;

export function formatMoney(amountPhp, currency = "PHP") {
    if (amountPhp === null || amountPhp === undefined || amountPhp === "") return "—";
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
