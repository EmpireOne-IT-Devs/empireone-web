import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const PERIPHERAL_TYPES = [
    "Keyboard",
    "Mouse",
    "Headset",
    "Webcam",
    "Speaker",
    "Docking Station",
];

export const PERIPHERAL_STATUSES = ["Active", "Inactive", "Retired"];

export const PERIPHERAL_STATUS_VARIANTS = {
    Active: "primary",
    Inactive: "secondary",
    Retired: "danger",
};

export const STOCK_STATUSES = ["In Stock", "Low Stock", "Out of Stock"];

export const STOCK_STATUS_VARIANTS = {
    "In Stock": "success",
    "Low Stock": "warning",
    "Out of Stock": "danger",
};

export const LOCATIONS = ["Main office", "North hub", "Branch — Cebu", "Remote"];

export const CURRENCIES = [
    { label: "PHP — Philippine Peso", value: "PHP" },
    { label: "USD — US Dollar", value: "USD" },
];

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

// Derives stock status from quantity vs. threshold.
export function getStockStatus(quantity, threshold) {
    const qty = Number(quantity) || 0;
    const min = Number(threshold) || 0;
    if (qty === 0) return "Out of Stock";
    if (qty < min) return "Low Stock";
    return "In Stock";
}
