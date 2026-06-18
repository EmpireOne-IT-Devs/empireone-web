import React from 'react';
import { Crown, Sparkles, Utensils, CreditCard, Shirt, Ticket, Laptop } from 'lucide-react';
import Card from '@/app/_components/card'; // Adjust path based on your file structure

// Performance Optimization: Moved static dataset outside of the render cycle
const ITEM_TYPES_DATA = [
    { id: 1, name: "Avatar Decoration", count: 1, icon: Crown },
    { id: 2, name: "Profile Effect", count: 0, icon: Sparkles },
    { id: 3, name: "Meal Voucher", count: 1, icon: Utensils },
    { id: 4, name: "Gift Card", count: 1, icon: CreditCard },
    { id: 5, name: "Merchandise", count: 1, icon: Shirt },
    { id: 6, name: "Voucher", count: 0, icon: Ticket },
    { id: 7, name: "Workplace Perk", count: 1, icon: Laptop },
];

export default function ItemTypeCardSection() {
    return (
        <Card 
            variant="default"
            padding="p-6"
            className="h-full w-full bg-white border border-gray-100 rounded-2xl shadow-sm font-sans antialiased"
        >
            {/* Header Section */}
            <div className="mb-5">
                <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
                    Items by Type
                </h2>
            </div>

            {/* List Container */}
            <div className="flex flex-col gap-2.5">
                {ITEM_TYPES_DATA.map((item) => {
                    const IconComponent = item.icon;
                    const isZero = item.count === 0;

                    return (
                        <div 
                            key={item.id}
                            className="flex items-center justify-between bg-gray-50/50 hover:bg-gray-50/80 px-4 py-3 rounded-xl transition-all duration-150 border border-gray-50/20 group"
                        >
                            {/* Left Side: Icon + Label */}
                            <div className="flex items-center gap-3.5 min-w-0">
                                <IconComponent 
                                    size={16} 
                                    className="text-gray-500 group-hover:text-gray-700 transition-colors shrink-0 stroke-[2]" 
                                />
                                <span className="text-sm font-medium text-gray-700 tracking-tight truncate">
                                    {item.name}
                                </span>
                            </div>

                            {/* Right Side: Symmetrical Numeric Count Badge */}
                            <div className="w-6 h-6 flex items-center justify-center">
                                <span className={`text-sm font-bold tracking-tight ${isZero ? 'text-blue-900/90' : 'text-blue-600'}`}>
                                    {item.count}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}