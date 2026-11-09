import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const SYSTEM_TYPES = ["Desktop", "Workstation", "Server"];

export const SYSTEM_TYPE_VARIANTS = {
    Desktop: "primary",
    Workstation: "purple",
    Server: "info",
};

export const SYSTEM_STATUSES = ["Available", "Assigned", "Maintenance", "Retired"];

export const SYSTEM_STATUS_VARIANTS = {
    Available: "success",
    Assigned: "purple",
    Maintenance: "warning",
    Retired: "secondary",
};

export const LOCATIONS = ["Main office", "Branch — Cebu", "Branch — Davao", "Remote"];

export const CURRENCIES = [
    { label: "PHP — Philippine Peso", value: "PHP" },
    { label: "USD — US Dollar", value: "USD" },
];

export function formatDate(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY") : "—";
}
