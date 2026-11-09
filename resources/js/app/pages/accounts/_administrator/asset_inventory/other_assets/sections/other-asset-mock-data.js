// Mock data until the other-assets API exists. Amounts are numeric PHP (null = no price).
export const initialOtherAssets = [
    {
        id: "OA-001",
        name: "Samsung 55-inch Smart TV",
        category: "Audio Visual",
        details: "4K UHD display for the boardroom",
        location: "Main office",
        assignedTo: "Boardroom A",
        status: "Assigned",
        purchasePrice: 31500,
        purchaseDate: "2025-03-12",
    },
    {
        id: "OA-002",
        name: "Ergonomic Office Chair",
        category: "Furniture",
        details: "Adjustable lumbar support and mesh back",
        location: "Main office",
        assignedTo: "Available",
        status: "Available",
        purchasePrice: 8200,
        purchaseDate: "2025-04-08",
    },
    {
        id: "OA-003",
        name: "Foldable Training Table",
        category: "Furniture",
        details: "Six-seat modular training table",
        location: "North hub",
        assignedTo: "Training room",
        status: "Assigned",
        purchasePrice: 12800,
        purchaseDate: "2025-01-22",
    },
    {
        id: "OA-004",
        name: "Portable Projector",
        category: "Audio Visual",
        details: "1080p LED projector with HDMI input",
        location: "Remote",
        assignedTo: "Available",
        status: "In Maintenance",
        purchasePrice: 18900,
        purchaseDate: "2024-11-05",
    },
    {
        id: "OA-005",
        name: "Standing Fan",
        category: "Appliance",
        details: "16-inch oscillating fan",
        location: "Main office",
        assignedTo: "Available",
        status: "Available",
        purchasePrice: 1500,
        purchaseDate: "2025-05-30",
    },
];

export function findOtherAsset(id) {
    return initialOtherAssets.find((asset) => asset.id === id) ?? null;
}
