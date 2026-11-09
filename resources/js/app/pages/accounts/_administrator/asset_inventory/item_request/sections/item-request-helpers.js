export {
    APPROVAL_STATUSES,
    APPROVAL_STATUS_VARIANTS,
    getCurrentStepIndex,
    getApprovalSummary,
    toOptions,
    formatDate,
} from "../../_lib/approval-helpers";

export const DEPARTMENTS = [
    "IT Department",
    "Human Resources",
    "Administration",
    "Operations",
    "Finance",
];

// Mirrors the Assets tabs in the asset inventory layout.
export const ASSET_CATEGORIES = [
    "Devices",
    "System Unit",
    "Monitors",
    "Peripherals",
    "Parts & Accessories",
    "Other Assets",
];

export const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export const STATUSES = ["Pending Approval", "Approved", "Issued", "Rejected"];

export const REQUEST_TYPES = [
    "New Assignment",
    "Replacement",
    "Temporary Loan",
    "Return & Reassign",
];

export const REQUEST_TYPE_VARIANTS = {
    "New Assignment": "primary",
    Replacement: "warning",
    "Temporary Loan": "info",
    "Return & Reassign": "purple",
};

// Mock directory until the employees/devices APIs exist.
export const MOCK_EMPLOYEES = [
    { id: "EMP-1001", name: "John Smith", department: "IT Department", email: "john.smith@empireonecx.com" },
    { id: "EMP-1002", name: "Sarah Wilson", department: "Human Resources", email: "sarah.wilson@empireonecx.com" },
    { id: "EMP-1003", name: "Mike Davis", department: "IT Department", email: "mike.davis@empireonecx.com" },
    { id: "EMP-1004", name: "Emily Chen", department: "Administration", email: "emily.chen@empireonecx.com" },
    { id: "EMP-1005", name: "Tom Wilson", department: "Operations", email: "tom.wilson@empireonecx.com" },
    { id: "EMP-1006", name: "Ana Lim", department: "Finance", email: "ana.lim@empireonecx.com" },
    { id: "EMP-1007", name: "Carlo Reyes", department: "IT Department", email: "carlo.reyes@empireonecx.com" },
    { id: "EMP-1008", name: "Grace Tan", department: "Human Resources", email: "grace.tan@empireonecx.com" },
];

export const MOCK_DEVICES = [
    { tag: "LT-0142", name: "Dell Latitude 5530", category: "Devices", available: true },
    { tag: "LT-0155", name: "Dell Latitude 5530", category: "Devices", available: true },
    { tag: "LT-0160", name: "Lenovo ThinkPad T14", category: "Devices", available: true },
    { tag: "MN-0031", name: "Dell 24\" LED Monitor", category: "Monitors", available: true },
    { tag: "MN-0032", name: "Dell 24\" LED Monitor", category: "Monitors", available: true },
    { tag: "KB-0087", name: "Mechanical Keyboard", category: "Peripherals", available: false },
    { tag: "MS-0110", name: "Wireless Mouse", category: "Peripherals", available: true },
    { tag: "MS-0111", name: "Wireless Mouse", category: "Peripherals", available: true },
    { tag: "SU-0021", name: "Desktop System Unit — i5 / 16GB", category: "System Unit", available: true },
    { tag: "DK-0007", name: "USB-C Docking Station", category: "Parts & Accessories", available: true },
    { tag: "HS-0045", name: "Jabra Evolve 40 Headset", category: "Peripherals", available: true },
];

export const employeeOptions = () =>
    MOCK_EMPLOYEES.map((e) => ({
        label: `${e.name} (${e.id})`,
        value: e.id,
    }));

export const deviceOptions = (availableOnly = true) =>
    MOCK_DEVICES.filter((d) => !availableOnly || d.available).map((d) => ({
        label: `${d.name} — ${d.tag}`,
        value: d.tag,
    }));

export const findEmployee = (id) => MOCK_EMPLOYEES.find((e) => e.id === id) ?? null;
export const findDevice = (tag) => MOCK_DEVICES.find((d) => d.tag === tag) ?? null;

export const CATEGORY_VARIANTS = {
    Devices: "primary",
    "System Unit": "purple",
    Monitors: "info",
    Peripherals: "success",
    "Parts & Accessories": "warning",
    "Other Assets": "secondary",
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
    Issued: "purple",
    Rejected: "danger",
};

// 3-level chain — items are issued from existing stock, so no Finance/Procurement step.
export const APPROVAL_STEPS = [
    {
        key: "department_head",
        label: "Department Head",
        description: "Confirms the request is needed for the role",
    },
    {
        key: "asset_custodian",
        label: "Asset Custodian",
        description: "Checks stock availability and reserves the unit",
    },
    {
        key: "general_manager",
        label: "Admin / General Manager",
        description: "Final sign-off to release the item",
    },
];
