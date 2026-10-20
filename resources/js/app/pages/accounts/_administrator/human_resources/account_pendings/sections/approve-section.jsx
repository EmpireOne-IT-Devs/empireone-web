import React, { useState } from "react";
import Button from "@/app/_components/button";
import Confirmation from "@/app/_components/confirmation";

export default function ApproveSection({
    row,
    onApprove,
    onDecline,
    approvingUuid,
    decliningUuid,
    isReviewing,
    approvalError,
    declineError,
}) {
    const [action, setAction] = useState(null);
    const isDeclining = action === "decline";
    const error = isDeclining ? declineError : approvalError;

    const confirmAction = async () => {
        const completed = isDeclining
            ? await onDecline(row)
            : await onApprove(row);

        if (completed) {
            setAction(null);
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="danger"
                    outlined
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() => setAction("decline")}
                    disabled={isReviewing}
                    ariaLabel={`Decline registration for ${row.full_name}`}
                >
                    Decline
                </Button>
                <Button
                    variant="success"
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() => setAction("approve")}
                    disabled={isReviewing}
                    ariaLabel={`Approve account for ${row.full_name}`}
                >
                    Approve
                </Button>
            </div>
            <Confirmation
                isOpen={Boolean(action)}
                onClose={() => {
                    if (!isReviewing) {
                        setAction(null);
                    }
                }}
                title={isDeclining ? "Decline registration?" : "Approve employee account?"}
            >
                {action && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            {isDeclining ? (
                                <>
                                    This will mark{" "}
                                    <span className="font-semibold">{row.full_name}</span>{" "}
                                    as declined and retain the record in the audit history.
                                </>
                            ) : (
                                <>
                                    This creates an employee account for{" "}
                                    <span className="font-semibold">{row.full_name}</span>.
                                    They can sign in using their registered email or EID
                                    and the configured initial password, then complete
                                    setup 1 and setup 2.
                                </>
                            )}
                        </p>
                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}
                        <div className="flex flex-col justify-end gap-3 sm:flex-row">
                            <Button
                                variant="secondary"
                                outlined
                                className="min-h-[44px]"
                                onClick={() => setAction(null)}
                                disabled={isReviewing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={isDeclining ? "danger" : "success"}
                                className="min-h-[44px]"
                                loading={
                                    isDeclining
                                        ? decliningUuid === row.uuid
                                        : approvingUuid === row.uuid
                                }
                                disabled={isReviewing}
                                onClick={confirmAction}
                            >
                                {isDeclining ? "Confirm decline" : "Confirm approval"}
                            </Button>
                        </div>
                    </div>
                )}
            </Confirmation>
        </>
    );
}