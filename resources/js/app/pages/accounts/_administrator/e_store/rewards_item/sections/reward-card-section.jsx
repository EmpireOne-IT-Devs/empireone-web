import React, { useEffect } from "react";
import { Image as ImageIcon, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import { get_engagement_e_store_items_thunk } from "@/app/redux/engagement-thunk";

function formatStock(quantity) {
    if (quantity === null || quantity === undefined || quantity === "") {
        return "Unlimited";
    }
    return quantity;
}

export default function RewardCardSection() {
    const dispatch = useDispatch();
    const { eStoreItems, eStoreItemsLoading } = useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_engagement_e_store_items_thunk());
    }, [dispatch]);

    if (eStoreItemsLoading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} padding="p-4" className="animate-pulse">
                            <div className="h-40 w-full rounded-xl bg-gray-200 mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 rounded bg-gray-200 w-3/4" />
                                <div className="h-3 rounded bg-gray-200 w-1/2" />
                            </div>
                            <div className="mt-4 h-8 rounded bg-gray-200" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!eStoreItems.length) {
        return (
            <div className="p-6">
                <Card padding="p-10" className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <ImageIcon size={22} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No reward items yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Add your first reward item and it will appear here.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {eStoreItems.map((item) => (
                    <Card key={item.id} padding="p-4" className="flex flex-col">

                        {/* Product image */}
                        <div className="w-full h-40 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-700 flex items-center justify-center overflow-hidden mb-4 flex-shrink-0">
                            {item.product_image ? (
                                <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-white/80">
                                    <ImageIcon size={28} />
                                    <p className="text-[10px] mt-1.5 font-medium">No Image</p>
                                </div>
                            )}
                        </div>

                        {/* Name + description */}
                        <div className="flex-1 mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                                {item.product_name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                                {item.customer_description || item.reward_type}
                            </p>
                        </div>

                        {/* Stock badge */}
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-[11px] text-gray-400">Stock:</span>
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                {formatStock(item.quantity)}
                            </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-gray-700 text-sm">{item.point_cost}</span>
                                <span className="text-xs text-gray-400">pts</span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                            >
                                Redeem
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}