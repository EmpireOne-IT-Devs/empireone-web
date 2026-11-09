// Mock data until the parts API exists. Amounts are numeric PHP (null = no price).
export const initialParts = [
    {
        id: "PT-001",
        name: "Fury DDR4 16 GB",
        brand: "Kingston",
        type: "Memory",
        quantity: 14,
        lowStockThreshold: 5,
        location: "Main office",
        price: 2250,
        description: "DDR4-3200 DIMM module.",
    },
    {
        id: "PT-002",
        name: "870 EVO 500 GB",
        brand: "Samsung",
        type: "Storage",
        quantity: 3,
        lowStockThreshold: 5,
        location: "Main office",
        price: 2980,
        description: "SATA SSD.",
    },
    {
        id: "PT-003",
        name: "CV550",
        brand: "Corsair",
        type: "Power Supply",
        quantity: 6,
        lowStockThreshold: 2,
        location: "North hub",
        price: 3250,
        description: "550W 80+ Bronze PSU.",
    },
    {
        id: "PT-004",
        name: "HDMI 2.0 Cable",
        brand: "UGREEN",
        type: "Cable",
        quantity: 0,
        lowStockThreshold: 8,
        location: "Main office",
        price: 380,
        description: "2m braided HDMI cable.",
    },
    {
        id: "PT-005",
        name: "USB-C to USB-A Adapter",
        brand: "Anker",
        type: "Adapter",
        quantity: 20,
        lowStockThreshold: 5,
        location: "Main office",
        price: 450,
        description: "OTG adapter.",
    },
];

export function findPart(id) {
    return initialParts.find((part) => part.id === id) ?? null;
}
