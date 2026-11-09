// Mock data until the device-return API exists.
export const initialDeviceReturns = [
    {
        id: "DR-001",
        deviceName: "Jabra Evolve 40",
        returningEmployee: "Madox Serrano",
        reason: "Resignation",
        condition: "Excellent",
        returnDate: "2026-07-27",
        status: "Pending Inspection",
        notes: "Headset with USB cable. No visible damage.",
    },
    {
        id: "DR-002",
        deviceName: "Dell Latitude 5530",
        returningEmployee: "John Smith",
        reason: "Replacement",
        condition: "Good",
        returnDate: "2026-07-20",
        status: "Inspected",
        notes: "Battery at 78% health.",
    },
    {
        id: "DR-003",
        deviceName: "Logitech K120",
        returningEmployee: "Sarah Wilson",
        reason: "Upgrade",
        condition: "Excellent",
        returnDate: "2026-07-15",
        status: "Restocked",
        notes: null,
    },
    {
        id: "DR-004",
        deviceName: "HP ProDesk 400",
        returningEmployee: "Tom Wilson",
        reason: "Termination",
        condition: "Damaged",
        returnDate: "2026-07-10",
        status: "For Disposal",
        notes: "PSU failure — not economical to repair.",
    },
];

export function findDeviceReturn(id) {
    return initialDeviceReturns.find((item) => item.id === id) ?? null;
}
