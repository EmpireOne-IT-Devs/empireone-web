import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CubeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import {
    FiShoppingBag as ShoppingBag,
    FiDollarSign as DollarSign,
} from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import Card from "@/app/_components/card";
import { get_admin_e_store_redemption_stats_thunk } from "@/app/redux/engagement-thunk";

export default function StatisticCardSection() {
    const dispatch = useDispatch();
    const { eStoreItems, adminEStoreRedemptionStats, adminEStoreRedemptionStatsLoading } =
        useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_admin_e_store_redemption_stats_thunk());
    }, [dispatch]);

    const totalItems = eStoreItems.length;
    const activeItems = eStoreItems.filter((item) => item.is_active !== false).length;
    const totalRedemptions = adminEStoreRedemptionStats?.total_redemptions ?? 0;
    const pointsRedeemed = adminEStoreRedemptionStats?.points_redeemed ?? 0;

    const stats = [
        {
            id: 1,
            value: totalItems.toLocaleString(),
            label: "Total Items",
            iconBg: "bg-blue-600",
            icon: <CubeIcon className="inline-block text-4xl text-white w-8 h-8" />,
        },
        {
            id: 2,
            value: activeItems.toLocaleString(),
            label: "Active Items",
            iconBg: "bg-green-600",
            icon: <CheckCircleIcon className="inline-block text-4xl text-white w-8 h-8" />,
        },
        {
            id: 3,
            value: totalRedemptions.toLocaleString(),
            label: "Total Redemptions",
            iconBg: "bg-purple-700",
            icon: <ShoppingBag className="inline-block text-4xl text-white w-8 h-8" />,
        },
        {
            id: 4,
            value: pointsRedeemed.toLocaleString(),
            label: "Points Redeemed",
            iconBg: "bg-orange-600",
            icon: <DollarSign className="inline-block text-4xl text-white w-8 h-8" />,
        },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-3 w-full">
            {stats.map((stat) => (
                <Card
                    key={stat.id}
                    className="w-full md:w-1/4 flex-col gap-3 cursor-default transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex-row flex items-start justify-between">
                        <div
                            className={`${stat.iconBg} p-3 rounded-xl w-16 flex items-center justify-center`}
                        >
                            {stat.icon}
                        </div>
                        <FaArrowTrendUp className="text-green-600 text-lg" />
                    </div>
                    <div className="flex-col flex items-start justify-between">
                        <div className="text-xl font-bold text-gray-900">
                            {adminEStoreRedemptionStatsLoading && stat.id >= 3 ? "…" : stat.value}
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
