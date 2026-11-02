import React from "react";
import { useSelector } from "react-redux";
import Card from "@/app/_components/card";

export default function CardSection() {
    const { adminEStoreStockStats, adminEStoreStockStatsLoading } = useSelector(
        (state) => state.engagement,
    );

    const stats = [
        { id: 1, label: "TOTAL REWARDS", value: adminEStoreStockStats?.total_rewards ?? 0 },
        { id: 2, label: "NEEDS ATTENTION", value: adminEStoreStockStats?.needs_attention ?? 0 },
        { id: 3, label: "TOTAL UNITS", value: adminEStoreStockStats?.total_units ?? 0 },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            {stats.map((stat) => (
                <Card
                    key={stat.id}
                    className="w-full md:w-1/3 flex-col gap-2 p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {stat.label}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {adminEStoreStockStatsLoading ? "…" : Number(stat.value).toLocaleString()}
                    </div>
                </Card>
            ))}
        </div>
    );
}
