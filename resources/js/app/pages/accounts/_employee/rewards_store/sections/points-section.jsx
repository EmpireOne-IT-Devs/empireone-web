import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiStar as Star, FiChevronDown as ChevronDown } from "react-icons/fi";
import { get_e_store_redemption_balance_thunk } from "@/app/redux/engagement-thunk";

export default function PointsSection() {
    const dispatch = useDispatch();
    const { eStoreRedemptionBalance, eStoreRedemptionBalanceLoading } = useSelector(
        (state) => state.engagement,
    );

    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        dispatch(get_e_store_redemption_balance_thunk());
    }, [dispatch]);

    useEffect(() => {
        if (!open) return;
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        const onEscape = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, [open]);

    const b = eStoreRedemptionBalance;
    const available = b?.available_points ?? 0;

    return (
        <div ref={containerRef} className="relative inline-flex justify-end">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label="View points breakdown"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1.5 text-sm transition hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                </span>

                {eStoreRedemptionBalanceLoading && !b ? (
                    <span className="h-3.5 w-12 animate-pulse rounded bg-neutral-200" />
                ) : (
                    <span className="font-medium tabular-nums text-neutral-800">
                        {available.toLocaleString()}
                        <span className="ml-0.5 text-[11px] text-neutral-400">pts</span>
                    </span>
                )}

                <ChevronDown
                    size={13}
                    className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-neutral-100 bg-white p-3 shadow-lg shadow-black/5">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Points breakdown
                    </p>
                    <dl className="space-y-1 text-[13px]">
                        <div className="flex justify-between">
                            <dt className="text-neutral-500">Earned</dt>
                            <dd className="tabular-nums text-neutral-800">{(b?.earned_points ?? 0).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-neutral-500">Redeemed</dt>
                            <dd className="tabular-nums text-red-500">−{(b?.redeemed_points ?? 0).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-neutral-500">Refunded</dt>
                            <dd className="tabular-nums text-green-600">+{(b?.refunded_points ?? 0).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between border-t border-neutral-100 pt-2">
                            <dt className="font-medium text-neutral-700">Available</dt>
                            <dd className="font-semibold tabular-nums text-amber-600">{available.toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>
            )}
        </div>
    );
}