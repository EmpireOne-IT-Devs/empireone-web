import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const MONITOR_TYPES = ["LED Monitor", "IPS Monitor", "OLED Monitor", "Curved Monitor"];

export const MONITOR_STATUSES = ["Deployed", "Available", "Out of Service", "For Repair"];

export const MONITOR_STATUS_VARIANTS = {
    Deployed: "success",
    Available: "info",
    "Out of Service": "danger",
    "For Repair": "warning",
};

export const AVAILABILITY = ["Available", "Assigned", "Unavailable"];

export const AVAILABILITY_VARIANTS = {
    Available: "success",
    Assigned: "purple",
    Unavailable: "secondary",
};

export const MONITOR_SIZES = ['Small (<22")', 'Standard (22"–27")', 'Large (>27")'];

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

// Parses "24 in" / "24\"" / 24 into a number for size bucketing.
export function parseScreenSize(value) {
    const match = String(value ?? "").match(/[\d.]+/);
    return match ? Number(match[0]) : null;
}

export function sizeBucket(value) {
    const size = parseScreenSize(value);
    if (size === null) return null;
    if (size < 22) return 'Small (<22")';
    if (size > 27) return 'Large (>27")';
    return 'Standard (22"–27")';
}
