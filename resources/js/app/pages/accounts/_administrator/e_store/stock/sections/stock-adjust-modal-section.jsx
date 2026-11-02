import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPackage as Package } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import { setAlert } from "@/app/redux/app-slice";
import {
    adjust_e_store_stock_thunk,
    get_admin_e_store_stock_thunk,
} from "@/app/redux/engagement-thunk";

export default function StockAdjustModalSection({ item, isOpen, onClose, currentParams }) {
    const dispatch = useDispatch();
    const { adminEStoreStockAdjustingId } = useSelector((state) => state.engagement);

    const [action, setAction] = useState("set");
    const [quantity, setQuantity] = useState(0);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const isAdjusting = item && adminEStoreStockAdjustingId === item.id;

    useEffect(() => {
        if (isOpen && item) {
            setAction("set");
            setQuantity(item.is_unlimited_stock ? 0 : Number(item.quantity ?? 0));
            setIsUnlimited(Boolean(item.is_unlimited_stock));
            setFieldErrors({});
        }
    }, [isOpen, item]);

    if (!item) return null;

    const handleSubmit = async () => {
        const result = await dispatch(
            adjust_e_store_stock_thunk({
                id: item.id,
                data: {
                    action,
                    quantity: Number(quantity) || 0,
                    is_unlimited_stock: isUnlimited,
                },
            }),
        );

        if (adjust_e_store_stock_thunk.rejected.match(result)) {
            const payload = result.payload;
            setFieldErrors(payload?.errors ?? {});
            dispatch(
                setAlert({
                    type: "error",
                    message: payload?.message || "Could not update stock.",
                }),
            );
            return;
        }

        dispatch(setAlert({ type: "success", message: "Stock updated successfully." }));
        dispatch(get_admin_e_store_stock_thunk(currentParams));
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={isAdjusting ? () => {} : onClose}
            width="max-w-md"
            title={
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                        <Package className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            Adjust Stock
                        </p>
                        <h2 className="text-base font-semibold text-neutral-900">
                            {item.product_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <div className="p-6 pt-4 space-y-4">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                        type="checkbox"
                        checked={isUnlimited}
                        disabled={isAdjusting}
                        onChange={(e) => setIsUnlimited(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    Unlimited stock
                </label>

                {!isUnlimited && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-neutral-600">Action</label>
                            <div className="mt-1 flex gap-1.5">
                                {["set", "add", "subtract"].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        disabled={isAdjusting}
                                        onClick={() => setAction(option)}
                                        className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                                            action === option
                                                ? "bg-orange-500 text-white"
                                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-600">
                                {action === "set" ? "New quantity" : action === "add" ? "Add amount" : "Subtract amount"}
                            </label>
                            <Input
                                name="quantity"
                                type="number"
                                min={0}
                                value={quantity}
                                disabled={isAdjusting}
                                error={fieldErrors?.quantity?.[0]}
                                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value) || 0))}
                                className="mt-1"
                            />
                            <p className="mt-1 text-[11px] text-neutral-400">
                                Current stock: {item.is_unlimited_stock ? "Unlimited" : Number(item.quantity ?? 0)}
                            </p>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-3">
                    <Button
                        outlined
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        disabled={isAdjusting}
                        className="w-full sm:w-auto px-5"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="engagement"
                        type="button"
                        onClick={handleSubmit}
                        loading={isAdjusting}
                        disabled={isAdjusting}
                        className="w-full sm:w-auto px-6"
                    >
                        Save Stock
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
