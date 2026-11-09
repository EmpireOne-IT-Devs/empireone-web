import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const ASSET_CATEGORIES = [
    "Audio Visual",
    "Furniture",
    "Appliance",
    "Tool",
    "Miscellaneous",
];

export const ASSET_CATEGORY_VARIANTS = {
    "Audio Visual": "primary",
    Furniture: "purple",
    Appliance: "info",
    Tool: "warning",
    Miscellaneous: "secondary",
};

export const ASSET_STATUSES = ["Available", "Assigned", "In Maintenance", "Retired"];

export const ASSET_STATUS_VARIANTS = {
    Available: "success",
    Assigned: "purple",
    "In Maintenance": "warning",
    Retired: "secondary",
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
