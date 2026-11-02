import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiImage as ImageIcon,
    FiStar as Star,
    FiMinus as Minus,
    FiPlus as Plus,
    FiAlertCircle as AlertCircle,
} from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import { setAlert } from "@/app/redux/app-slice";
import {
    create_e_store_redemption_thunk,
    get_e_store_redemption_balance_thunk,
    get_engagement_e_store_items_thunk,
} from "@/app/redux/engagement-thunk";

function newIdempotencyKey() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export default function RedeemConfirmationSection({ reward, isOpen, onClose, onRedeemed }) {
    const dispatch = useDispatch();
    const { eStoreRedemptionBalance, eStoreRedeeming } = useSelector(
        (state) => state.engagement,
    );

    const [quantity, setQuantity] = useState(1);
    const [idempotencyKey, setIdempotencyKey] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState(null);

    const isUnlimited =
        reward?.is_unlimited_stock === true ||
        reward?.quantity === null ||
        reward?.quantity === undefined;
    const stock = isUnlimited ? null : Number(reward?.quantity ?? 0);
    const unitCost = Number(reward?.point_cost ?? 0);
    const totalCost = unitCost * quantity;
    const availablePoints = eStoreRedemptionBalance?.available_points ?? null;
    const remainingPoints =
        availablePoints === null ? null : availablePoints - totalCost;
    const insufficientPoints =
        availablePoints !== null && totalCost > availablePoints;
    const insufficientStock = stock !== null && quantity > stock;
    const outOfStock = stock !== null && stock === 0;

    useEffect(() => {
        if (isOpen && reward) {
            setQuantity(1);
            setIdempotencyKey(newIdempotencyKey());
            setFieldErrors({});
            setServerError(null);
            dispatch(get_e_store_redemption_balance_thunk());
        }
    }, [isOpen, reward, dispatch]);

    const canSubmit = useMemo(() => {
        return (
            !eStoreRedeeming &&
            idempotencyKey &&
            quantity >= 1 &&
            !insufficientPoints &&
            !insufficientStock &&
            !outOfStock
        );
    }, [eStoreRedeeming, idempotencyKey, quantity, insufficientPoints, insufficientStock, outOfStock]);

    const handleConfirm = async () => {
        if (!canSubmit) return;

        const result = await dispatch(
            create_e_store_redemption_thunk({
                engagement_e_store_id: reward.id,
                quantity,
                idempotency_key: idempotencyKey,
            }),
        );

        if (create_e_store_redemption_thunk.rejected.match(result)) {
            const payload = result.payload;
            setFieldErrors(payload?.errors ?? {});
            setServerError(
                payload?.message && !payload?.errors
                    ? payload.message
                    : null,
            );
            return;
        }

        const redemption = result.payload?.data;
        dispatch(get_e_store_redemption_balance_thunk());
        dispatch(get_engagement_e_store_items_thunk());
        dispatch(
            setAlert({
                type: "success",
                message: `Redemption ${redemption?.reference ?? ""} submitted. Status: Pending.`,
            }),
        );
        onRedeemed?.(redemption);
        onClose();
    };

    if (!reward) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={eStoreRedeeming ? () => {} : onClose}
            width="max-w-md"
            title={
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                        <Star className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Confirm Redemption
                        </p>
                        <h2 className="text-base font-semibold text-neutral-900">
                            {reward.product_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <div className="p-6 pt-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/60">
                        {reward.product_image ? (
                            <img
                                src={reward.product_image}
                                alt={reward.product_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 truncate">
                            {reward.product_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {reward.reward_type}
                        </p>
                        <p className="text-xs font-medium text-amber-700 mt-0.5">
                            {unitCost.toLocaleString()} pts each
                        </p>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-neutral-600">
                        Quantity
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            type="button"
                            ariaLabel="Decrease quantity"
                            disabled={quantity <= 1 || eStoreRedeeming}
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Input
                            name="quantity"
                            type="number"
                            min={1}
                            max={stock ?? 99}
                            value={quantity}
                            disabled={eStoreRedeeming}
                            error={fieldErrors?.quantity?.[0]}
                            onChange={(e) => {
                                const value = Math.max(1, Math.min(99, Number(e.target.value) || 1));
                                setQuantity(value);
                            }}
                            className="text-center"
                        />
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            type="button"
                            ariaLabel="Increase quantity"
                            disabled={eStoreRedeeming || (stock !== null && quantity >= stock)}
                            onClick={() =>
                                setQuantity((q) =>
                                    stock !== null ? Math.min(stock, q + 1) : Math.min(99, q + 1),
                                )
                            }
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-400">
                        {isUnlimited ? "Unlimited stock" : `${stock} in stock`}
                    </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200/60 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-neutral-500">Total cost</span>
                        <span className="font-semibold text-neutral-800">
                            {totalCost.toLocaleString()} pts
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-500">Available points</span>
                        <span className="font-semibold text-neutral-800">
                            {availablePoints === null
                                ? "…"
                                : availablePoints.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 pt-1.5">
                        <span className="text-neutral-500">Remaining after</span>
                        <span
                            className={`font-semibold ${
                                remainingPoints !== null && remainingPoints < 0
                                    ? "text-red-600"
                                    : "text-green-700"
                            }`}
                        >
                            {remainingPoints === null
                                ? "…"
                                : remainingPoints.toLocaleString()}
                        </span>
                    </div>
                </div>

                {(insufficientPoints || insufficientStock || outOfStock || serverError) && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 ring-1 ring-red-200">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            {outOfStock
                                ? "This reward is out of stock."
                                : insufficientStock
                                  ? "Requested quantity exceeds available stock."
                                  : insufficientPoints
                                    ? "You do not have enough points for this redemption."
                                    : serverError}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-3">
                    <Button
                        outlined
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        disabled={eStoreRedeeming}
                        className="w-full sm:w-auto px-5"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="engagement"
                        type="button"
                        onClick={handleConfirm}
                        disabled={!canSubmit}
                        loading={eStoreRedeeming}
                        className="w-full sm:w-auto px-6"
                    >
                        Confirm Redemption
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
