import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaLaptop as Laptop,
    FaUtensils as Utensils,
    FaCrown as Crown,
} from "react-icons/fa";
import { FiCreditCard as CreditCard, FiImage as ImageIcon, FiInbox as InboxIcon } from "react-icons/fi";
import { IoShirt as Shirt, IoSparkles as Sparkles } from "react-icons/io5";
import { BsTicket as Ticket } from "react-icons/bs";
import Card from "@/app/_components/card";
import { get_admin_e_store_redemption_analytics_thunk } from "@/app/redux/engagement-thunk";

const TYPE_ICONS = {
    "meal voucher": Utensils,
    "gift card": CreditCard,
    merchandise: Shirt,
    voucher: Ticket,
    "workplace perk": Laptop,
    "avatar decoration": Crown,
    "profile effect": Sparkles,
};

const TYPE_COLORS = [
    "bg-purple-50 text-purple-500",
    "bg-orange-50 text-orange-500",
    "bg-amber-50 text-amber-500",
    "bg-yellow-50 text-yellow-500",
    "bg-blue-50 text-blue-500",
];

function iconFor(rewardType) {
    return TYPE_ICONS[(rewardType ?? "").toLowerCase()] ?? CreditCard;
}

export default function RedeemedItemSections() {
    const dispatch = useDispatch();
    const { adminEStoreRedemptionAnalytics, adminEStoreRedemptionAnalyticsLoading } =
        useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_admin_e_store_redemption_analytics_thunk());
    }, [dispatch]);

    const items = adminEStoreRedemptionAnalytics?.top_redeemed ?? [];

    return (
        <Card
            variant="default"
            padding="p-6"
            className="h-full w-full bg-white border border-gray-100 rounded-2xl shadow-sm font-sans antialiased"
        >
            <div className="mb-5">
                <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
                    Top Redeemed Items
                </h2>
            </div>

            {adminEStoreRedemptionAnalyticsLoading && items.length === 0 ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                            <div className="h-4 w-5 rounded bg-gray-200" />
                            <div className="h-10 w-10 rounded-xl bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-1/2 rounded bg-gray-200" />
                                <div className="h-2.5 w-1/4 rounded bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                        <InboxIcon size={22} className="text-orange-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No redemptions yet</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Approved, processing, and completed redemptions will rank here.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {items.map((item, index) => {
                        const IconComponent = iconFor(item.reward_type);
                        const iconBg = TYPE_COLORS[index % TYPE_COLORS.length];

                        return (
                            <div
                                key={item.item_id ?? index}
                                className="flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 p-3 rounded-xl transition-all duration-150 border border-gray-50/30"
                            >
                                <div className="w-5 flex items-center justify-center text-sm font-semibold text-gray-400">
                                    {index + 1}
                                </div>

                                {item.product_image ? (
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="h-10 w-10 shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                                        <IconComponent size={18} className="stroke-[2]" />
                                    </div>
                                )}

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-gray-900 truncate tracking-tight">
                                        {item.product_name}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {item.redemptions.toLocaleString()}{" "}
                                        {item.redemptions === 1 ? "redemption" : "redemptions"}
                                        {item.units > item.redemptions
                                            ? ` · ${item.units.toLocaleString()} units`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
