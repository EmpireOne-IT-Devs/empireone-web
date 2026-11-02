import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Confirmation from "@/app/_components/confirmation";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import {
    approve_e_store_redemption_thunk,
    process_e_store_redemption_thunk,
    complete_e_store_redemption_thunk,
    reject_e_store_redemption_thunk,
    admin_cancel_e_store_redemption_thunk,
    get_admin_e_store_redemption_stats_thunk,
} from "@/app/redux/engagement-thunk";

const ACTIONS = {
    approve: {
        label: "Approve",
        variant: "success",
        statuses: ["pending"],
        thunk: approve_e_store_redemption_thunk,
        confirmTitle: "Approve this redemption?",
        confirmBody: "The request will move to Approved and await processing.",
        success: "Redemption approved.",
    },
    process: {
        label: "Process",
        variant: "primary",
        statuses: ["approved"],
        thunk: process_e_store_redemption_thunk,
        confirmTitle: "Mark as processing?",
        confirmBody: "The reward is being prepared for collection or delivery.",
        success: "Redemption marked as processing.",
    },
    complete: {
        label: "Complete",
        variant: "success",
        statuses: ["processing"],
        thunk: complete_e_store_redemption_thunk,
        confirmTitle: "Complete this redemption?",
        confirmBody: "Confirm only after the reward has actually been released or delivered. This cannot be undone.",
        success: "Redemption completed.",
    },
    reject: {
        label: "Reject",
        variant: "danger",
        statuses: ["pending"],
        thunk: reject_e_store_redemption_thunk,
        confirmTitle: "Reject this redemption?",
        confirmBody: "Points will be refunded and reserved stock restored. A reason is required.",
        success: "Redemption rejected and points refunded.",
        requiresReason: true,
    },
    cancel: {
        label: "Cancel",
        variant: "danger",
        statuses: ["pending", "approved"],
        thunk: admin_cancel_e_store_redemption_thunk,
        confirmTitle: "Cancel this redemption?",
        confirmBody: "Points will be refunded and reserved stock restored.",
        success: "Redemption cancelled and points refunded.",
    },
};

export default function RedemptionActionSection({ redemption, onUpdated }) {
    const dispatch = useDispatch();
    const { adminEStoreRedemptionActionRef } = useSelector((state) => state.engagement);

    const [activeAction, setActiveAction] = useState(null);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState(null);

    if (!redemption) return null;

    const availableActions = Object.entries(ACTIONS).filter(([, config]) =>
        config.statuses.includes(redemption.status),
    );

    if (availableActions.length === 0) return null;

    const isActing = adminEStoreRedemptionActionRef === redemption.reference;

    const closeConfirmation = () => {
        setActiveAction(null);
        setReason("");
        setReasonError(null);
    };

    const handleConfirm = async () => {
        const config = ACTIONS[activeAction];
        if (!config) return;

        if (config.requiresReason && !reason.trim()) {
            setReasonError("A rejection reason is required.");
            return;
        }

        const data = config.requiresReason
            ? { rejection_reason: reason.trim() }
            : reason.trim()
              ? { reason: reason.trim() }
              : {};

        const result = await dispatch(
            config.thunk({ reference: redemption.reference, data }),
        );

        if (config.thunk.rejected.match(result)) {
            const payload = result.payload;
            setReasonError(payload?.errors?.rejection_reason?.[0] ?? null);
            dispatch(
                setAlert({
                    type: "error",
                    message: payload?.message || "The action could not be completed.",
                }),
            );
            return;
        }

        dispatch(setAlert({ type: "success", message: config.success }));
        dispatch(get_admin_e_store_redemption_stats_thunk());
        closeConfirmation();
        onUpdated?.(result.payload?.data);
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {availableActions.map(([key, config]) => (
                <Button
                    key={key}
                    variant={config.variant}
                    size="xs"
                    outlined
                    type="button"
                    disabled={isActing}
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveAction(key);
                    }}
                >
                    {config.label}
                </Button>
            ))}

            <Confirmation
                isOpen={activeAction !== null}
                onClose={isActing ? () => {} : closeConfirmation}
                title={activeAction ? ACTIONS[activeAction].confirmTitle : ""}
            >
                <div className="space-y-3 pb-2">
                    <p className="text-sm text-neutral-600">
                        {activeAction ? ACTIONS[activeAction].confirmBody : ""}
                    </p>
                    {(activeAction === "reject" || activeAction === "cancel") && (
                        <TextArea
                            name="reason"
                            label={activeAction === "reject" ? "Rejection reason" : "Reason (optional)"}
                            rows={3}
                            value={reason}
                            disabled={isActing}
                            error={reasonError}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setReasonError(null);
                            }}
                        />
                    )}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            type="button"
                            onClick={closeConfirmation}
                            disabled={isActing}
                        >
                            Back
                        </Button>
                        <Button
                            variant={activeAction ? ACTIONS[activeAction].variant : "primary"}
                            size="sm"
                            type="button"
                            onClick={handleConfirm}
                            loading={isActing}
                            disabled={isActing}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Confirmation>
        </div>
    );
}
