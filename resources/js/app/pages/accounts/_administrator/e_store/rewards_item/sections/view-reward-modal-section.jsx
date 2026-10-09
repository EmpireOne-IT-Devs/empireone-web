import React from "react";
import {
    Image as ImageIcon,
    Star,
    Sparkles,
    Package,
    ShieldAlert,
} from "lucide-react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";

function formatStock(quantity) {
    if (quantity === null || quantity === undefined || quantity === "") {
        return { label: "Unlimited", isLow: false };
    }
    const qty = Number(quantity);
    return {
        label: `${qty.toLocaleString()} available`,
        isLow: qty > 0 && qty <= 5,
        outOfStock: qty === 0,
    };
}

export default function ViewRewardModalSection({
    reward,
    isOpen,
    onClose,
    onRedeem,
}) {
    if (!reward) return null;

    const stockInfo = formatStock(reward.quantity);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-lg"
            title={
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            E-Store Reward
                        </p>
                        <h2 className="text-base font-semibold text-neutral-900">
                            Reward Details
                        </h2>
                    </div>
                </div>
            }
        >
            <div className="p-6 pt-4 space-y-5">
                {/* Media Preview Header */}
                <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/60 shadow-inner group">
                    {reward.product_image ? (
                        <img
                            src={reward.product_image}
                            alt={reward.product_name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-400">
                            <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-neutral-200/50">
                                <ImageIcon className="h-6 w-6 stroke-[1.5]" />
                            </div>
                            <p className="text-xs font-medium text-neutral-500">
                                No preview image available
                            </p>
                        </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md shadow-sm border ${
                                stockInfo.outOfStock
                                    ? "bg-rose-500/90 text-white border-rose-600/20"
                                    : stockInfo.isLow
                                      ? "bg-amber-500/90 text-white border-amber-600/20"
                                      : "bg-black/60 text-white border-white/20"
                            }`}
                        >
                            <Package className="h-3 w-3" />
                            {stockInfo.label}
                        </span>
                    </div>
                </div>

                {/* Product Info Header */}
                <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-neutral-900 leading-snug">
                            {reward.product_name}
                        </h3>
                        {reward.reward_type && (
                            <span className="shrink-0 rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200/50">
                                {reward.reward_type}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        {reward.customer_description ||
                            "No specific details provided for this reward item."}
                    </p>
                </div>

                {/* Points Banner */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium uppercase tracking-wider text-amber-800/80">
                                Cost to Redeem
                            </p>
                            <p className="text-2xl font-bold tracking-tight text-amber-950">
                                {reward.point_cost?.toLocaleString() || 0}{" "}
                                <span className="text-sm font-medium text-amber-800">
                                    pts
                                </span>
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-4 ring-white">
                            <Star className="h-6 w-6 fill-white stroke-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
                    <Button
                        outlined
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-5"
                    >
                        Cancel
                    </Button>
                    <Button
                        outlined
                        variant="engagement"
                        type="button"
                        onClick={onRedeem}
                        disabled={stockInfo.outOfStock}
                        className="w-full sm:w-auto px-6 shadow-sm disabled:opacity-50"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Redeem Reward
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
