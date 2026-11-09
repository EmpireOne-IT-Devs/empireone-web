import { excelDateToISO } from "../../_lib/excel-utils";

// Target schema for the Devices import. Synonyms drive header auto-mapping
// against sheets like "End Points" (Unit / Asset Tag / SN / Model / Status / …).
export const DEVICE_IMPORT_FIELDS = [
    { key: "asset_tag", label: "Asset Tag", required: true, synonyms: ["Asset Tag", "AssetTag", "Tag"] },
    { key: "serial_number", label: "Serial Number", required: false, synonyms: ["SN", "Serial", "Serial Number", "Serial No."] },
    { key: "device_type", label: "Device Type", required: true, synonyms: ["Unit", "Device Type", "Type", "Device"] },
    { key: "brand", label: "Brand", required: true, synonyms: ["Model", "Brand", "Brand | Model", "Model | Brand"] },
    { key: "model", label: "Model", required: false, synonyms: ["Model Name", "Device Model"] },
    { key: "status", label: "Status", required: true, synonyms: ["Status"] },
    { key: "condition", label: "Condition", required: false, synonyms: ["Condition"] },
    { key: "nature", label: "Nature", required: false, synonyms: ["Nature"] },
    { key: "purchase_date", label: "Date Purchased", required: false, synonyms: ["Date Purchased", "Purchase Date", "Date"] },
    { key: "account", label: "Account / Remarks", required: false, synonyms: ["Remarks", "Account", "Notes"] },
];

const TYPE_MAP = {
    pc: "Desktop",
    desktop: "Desktop",
    laptop: "Laptop",
    mac: "MAC",
    cellphone: "Mobile",
    mobile: "Mobile",
    tablet: "Tablet",
};

const STATUS_MAP = {
    good: "Working",
    working: "Working",
    new: "New",
    damage: "Defective",
    damaged: "Defective",
    defective: "Defective",
    "for repair": "For Repair",
    repair: "For Repair",
};

const CONDITION_MAP = {
    brandnew: "Brandnew",
    "brand new": "Brandnew",
    "second hand": "Second Hand",
    secondhand: "Second Hand",
};

const NATURE_MAP = {
    dedicated: "Dedicated",
    shared: "Shared",
};

// Rows whose Unit is Monitor or UPS belong to other modules (smart split).
export function routeDeviceRow(mapped) {
    const unit = String(mapped.device_type ?? "").trim().toLowerCase();
    if (unit === "monitor") return { key: "monitors", label: "Monitors" };
    if (unit === "ups") return { key: "other_assets", label: "Other Assets" };
    return null;
}

// Normalizes + validates one mapped row. Returns { row, errors }.
export function transformDeviceRow(mapped) {
    const errors = [];

    const assetTag = String(mapped.asset_tag ?? "").trim();
    if (!assetTag) errors.push("Asset tag is required");

    const rawType = String(mapped.device_type ?? "").trim().toLowerCase();
    const deviceType = TYPE_MAP[rawType] ?? null;
    if (!deviceType) errors.push(`Unknown device type "${mapped.device_type}"`);

    const brand = String(mapped.brand ?? "").trim();
    if (!brand || brand.toUpperCase() === "N/A") errors.push("Brand is required");

    const rawStatus = String(mapped.status ?? "").trim().toLowerCase();
    const status = STATUS_MAP[rawStatus] ?? null;
    if (!status) errors.push(`Unknown status "${mapped.status}"`);

    const condition = CONDITION_MAP[String(mapped.condition ?? "").trim().toLowerCase()] ?? null;
    const nature = NATURE_MAP[String(mapped.nature ?? "").trim().toLowerCase()] ?? null;

    const account = String(mapped.account ?? "").trim();
    const isStock = account.toLowerCase() === "stock";

    const serial = String(mapped.serial_number ?? "").trim();

    return {
        errors,
        row: {
            asset_tag: assetTag,
            serial_number: serial && serial.toUpperCase() !== "N/A" ? serial : null,
            device_type: deviceType,
            brand,
            model: String(mapped.model ?? "").trim() || null,
            status: status ?? "Working",
            availability: isStock ? "Available" : "Assigned",
            condition,
            nature,
            price: null,
            purchase_date: excelDateToISO(mapped.purchase_date),
            account: account || null,
            issued_to: isStock ? null : account || null,
            received_by: null,
            location: null,
            site: null,
            notes: null,
        },
    };
}
