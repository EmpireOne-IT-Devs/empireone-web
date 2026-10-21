import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import TextArea from "@/app/_components/textarea";

const TYPE_LABELS = {
    overtime: "Overtime",
    schedule: "Schedule Correction",
    leave: "Leave",
};

export default function ReviewRequestModal({
    target,
    onClose,
    onConfirm,
    isSubmitting,
    errors,
    serverError,
}) {
    const [note, setNote] = useState("");
    const item = target?.item;
    const isDecline = target?.mode === "decline";

    useEffect(() => {
        setNote("");
    }, [target]);

    return (
        <Modal
            isOpen={!!target}
            onClose={onClose}
            title={isDecline ? "Decline Request" : "Approve Request"}
        >
            {item && (
                <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                        <p className="font-medium text-gray-900">
                            {item.employee?.name ?? "Unknown employee"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {TYPE_LABELS[item.type]} &middot;{" "}
                            {dayjs(item.date).format("MM/DD/YYYY")}
                        </p>
                        <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
                            {item.details.map((detail) => (
                                <li key={detail.label}>
                                    <span className="text-gray-500">
                                        {detail.label}:
                                    </span>{" "}
                                    {detail.value}
                                </li>
                            ))}
                        </ul>
                        {item.reason && (
                            <p className="mt-2 text-xs text-gray-600">
                                <span className="text-gray-500">Reason:</span>{" "}
                                {item.reason}
                            </p>
                        )}
                    </div>

                    {isDecline ? (
                        <TextArea
                            label="Reason for declining"
                            name="decline_note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            error={errors?.note?.[0]}
                        />
                    ) : (
                        <p className="text-sm text-gray-600">
                            Approve this {TYPE_LABELS[item.type].toLowerCase()}{" "}
                            request for {item.employee?.name}?
                        </p>
                    )}

                    {serverError && !errors?.note && (
                        <p className="text-sm text-red-600" role="alert">
                            {serverError}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="light"
                            outlined
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={isDecline ? "danger" : "success"}
                            loading={isSubmitting}
                            onClick={() => onConfirm(note)}
                        >
                            {isDecline ? "Decline" : "Approve"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
