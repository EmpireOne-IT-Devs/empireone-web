import moment from "moment";

export { toOptions } from "../../_lib/approval-helpers";

export const FORM_TYPES = ["Public Agreement", "Individual Agreement"];

export const FORM_TYPE_VARIANTS = {
    "Public Agreement": "purple",
    "Individual Agreement": "primary",
};

export const FORM_STATUSES = [
    "Pending Signature",
    "Completed",
    "Expired",
    "Voided",
];

export const FORM_STATUS_VARIANTS = {
    "Pending Signature": "warning",
    Completed: "success",
    Expired: "secondary",
    Voided: "danger",
};

export const DEVICE_CONDITIONS = ["New", "Excellent", "Good", "Fair"];

export const ACCESSORY_OPTIONS = [
    "Charger",
    "Case",
    "Headphones",
    "Mouse",
    "Keyboard",
    "Docking Station",
    "Laptop Bag",
    "Cable Lock",
];

export function formatDateTime(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY, hh:mm A") : "—";
}

export function formatDate(value) {
    if (!value) return "—";
    const date = moment(value);
    return date.isValid() ? date.format("MMM D, YYYY") : "—";
}
