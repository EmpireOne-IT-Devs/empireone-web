import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaCrown as Crown,
    FaUtensils as Utensils,
    FaLaptop as Laptop,
} from "react-icons/fa";
import { IoSparkles as Sparkles, IoShirt as Shirt } from "react-icons/io5";
import { FiCreditCard as CreditCard, FiTag as Tag, FiInbox as InboxIcon } from "react-icons/fi";
import { BsTicket as Ticket } from "react-icons/bs";
import Card from "@/app/_components/card";
import { get_admin_e_store_redemption_analytics_thunk } from "@/app/redux/engagement-thunk";

const TYPE_ICONS = {
    "avatar decoration": Crown,
    "profile effect": Sparkles,
    "meal voucher": Utensils,
    "gift card": CreditCard,
    merchandise: Shirt,
    voucher: Ticket,
    "workplace perk": Laptop,
};

function iconFor(rewardType) {
    return TYPE_ICONS[(rewardType ?? "").toLowerCase()] ?? Tag;
}

export default function ItemTypeCardSection() {
    const dispatch = useDispatch();
    const { adminEStoreRedemptionAnalytics, adminEStoreRedemptionAnalyticsLoading } =
        useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_admin_e_store_redemption_analytics_thunk());
    }, [dispatch]);

    const types = adminEStoreRedemptionAnalytics?.items_by_type ?? [];

    return (
        <Card
            variant="default"
            padding="p-6"
            className="h-full w-full bg-white border border-gray-100 rounded-2xl shadow-sm font-sans antialiased"
        >
            <div className="mb-5">
                <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
                    Items by Type
                </h2>
            </div>

            {adminEStoreRedemptionAnalyticsLoading && types.length === 0 ? (
                <div className="flex flex-col gap-2.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 animate-pulse">
                            <div className="flex items-center gap-3.5">
                                <div className="h-4 w-4 rounded bg-gray-200" />
                                <div className="h-3 w-28 rounded bg-gray-200" />
                            </div>
                            <div className="h-4 w-6 rounded bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : types.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                        <InboxIcon size={22} className="text-blue-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No reward items yet</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Add reward items to see them grouped by type.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {types.map((item) => {
                        const IconComponent = iconFor(item.reward_type);
                        const isZero = item.count === 0;

                        return (
                            <div
                                key={item.reward_type}
                                className="flex items-center justify-between bg-gray-50/50 hover:bg-gray-50/80 px-4 py-3 rounded-xl transition-all duration-150 border border-gray-50/20 group"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <IconComponent
                                        size={16}
                                        className="text-gray-500 group-hover:text-gray-700 transition-colors shrink-0 stroke-[2]"
                                    />
                                    <span className="text-sm font-medium text-gray-700 tracking-tight truncate">
                                        {item.reward_type}
                                    </span>
                                </div>

                                <div className="w-6 h-6 flex items-center justify-center">
                                    <span
                                        className={`text-sm font-bold tracking-tight ${
                                            isZero ? "text-blue-900/90" : "text-blue-600"
                                        }`}
                                    >
                                        {item.count}
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
