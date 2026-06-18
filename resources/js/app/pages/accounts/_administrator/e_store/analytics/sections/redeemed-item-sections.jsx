import React from 'react';
import { Laptop, Utensils, CreditCard, Crown, Shirt } from 'lucide-react';
import Card from '@/app/_components/card'; // Adjust path based on your file structure

// Performance Optimization: Keeping static list metrics out of render cycle
const REDEEMED_ITEMS = [
    {
        rank: 1,
        title: "Extra WFH Day",
        redemptions: "203 redemptions",
        icon: Laptop,
        iconBg: "bg-purple-50 text-purple-500"
    },
    {
        rank: 2,
        title: "Lunch Voucher - $10",
        redemptions: "128 redemptions",
        icon: Utensils,
        iconBg: "bg-orange-50 text-orange-500"
    },
    {
        rank: 3,
        title: "Amazon Gift Card - $25",
        redemptions: "67 redemptions",
        icon: CreditCard,
        iconBg: "bg-amber-50 text-amber-500"
    },
    {
        rank: 4,
        title: "Golden Crown",
        redemptions: "45 redemptions",
        icon: Crown,
        iconBg: "bg-yellow-50 text-yellow-500"
    },
    {
        rank: 5,
        title: "Company Hoodie",
        redemptions: "34 redemptions",
        icon: Shirt,
        iconBg: "bg-blue-50 text-blue-500"
    }
];

export default function RedeemedItemSections() {
    return (
        <Card 
            variant="default"
            padding="p-6"
            className="h-full w-full bg-white border border-gray-100 rounded-2xl shadow-sm font-sans antialiased"
        >
            {/* Header Title Section */}
            <div className="mb-5">
                <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
                    Top Redeemed Items
                </h2>
            </div>

            {/* List Row Elements wrapper */}
            <div className="flex flex-col gap-3">
                {REDEEMED_ITEMS.map((item) => {
                    const IconComponent = item.icon;
                    
                    return (
                        <div 
                            key={item.rank}
                            className="flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 p-3 rounded-xl transition-all duration-150 border border-gray-50/30"
                        >
                            {/* Symmetrical Rank Number Plate Area */}
                            <div className="w-5 flex items-center justify-center text-sm font-semibold text-gray-400">
                                {item.rank}
                            </div>

                            {/* Styled Custom Visual Background Icon Shield */}
                            <div className={`p-2.5 rounded-xl shrink-0 ${item.iconBg}`}>
                                <IconComponent size={18} className="stroke-[2]" />
                            </div>

                            {/* Text Metadata Stack */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-gray-900 truncate tracking-tight">
                                    {item.title}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {item.redemptions}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}