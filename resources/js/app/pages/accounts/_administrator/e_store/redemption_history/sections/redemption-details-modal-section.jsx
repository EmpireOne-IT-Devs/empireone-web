import React from "react";
import { FiImage as ImageIcon, FiClock as Clock } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Badge from "@/app/_components/badge";

const STATUS_VARIANTS = {
    pending: "warning",
    approved: "info",
    processing: "info",
    completed: "success",
    rejected: "danger",
    cancelled: "secondary",
};

function StatusBadge({ status }) {
    return (
        <Badge
            outlined
            label={status}
            variant={STATUS_VARIANTS[status] ?? "secondary"}
            className="rounded-full px-3 py-1 text-[12px] font-semibold capitalize"
        />
    );
}

function DetailRow({ label, children }) {
    if (children === null || children === undefined || children === "") return null;
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-neutral-500 shrink-0">{label}</span>
            <span className="text-neutral-800 text-right break-words">{children}</span>
        </div>
    );
}

export default function RedemptionDetailsModalSection({ redemption, isOpen, onClose }) {
    if (!redemption) return null;

    const histories = [...(redemption.histories ?? [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-lg"
            title={
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Redemption {redemption.reference}
                    </p>
                    <h2 className="text-base font-semibold text-neutral-900">
                        Redemption Details
                    </h2>
                </div>
            }
        >
            <div className="p-6 pt-4 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/60">
                        {redemption.item?.product_image ? (
                            <img
                                src={redemption.item.product_image}
                                alt={redemption.item?.product_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-800 truncate">
                            {redemption.item?.product_name ?? "Reward item"}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {redemption.item?.reward_type}
                        </p>
                        <div className="mt-1">
                            <StatusBadge status={redemption.status} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200/60 space-y-2">
                    {redemption.employee && (
                        <>
                            <DetailRow label="Employee">{redemption.employee.name}</DetailRow>
                            <DetailRow label="Employee ID">{redemption.employee.eoid}</DetailRow>
                            <DetailRow label="Department">{redemption.employee.department_name}</DetailRow>
                        </>
                    )}
                    <DetailRow label="Quantity">{redemption.quantity}</DetailRow>
                    <DetailRow label="Unit cost">{redemption.unit_point_cost?.toLocaleString()} pts</DetailRow>
                    <DetailRow label="Total points">
                        <span className="font-semibold">{redemption.total_point_cost?.toLocaleString()} pts</span>
                    </DetailRow>
                    <DetailRow label="Requested">{redemption.created_at}</DetailRow>
                    <DetailRow label="Refunded">
                        {redemption.refunded ? "Yes — points returned" : null}
                    </DetailRow>
                    <DetailRow label="Rejection reason">{redemption.rejection_reason}</DetailRow>
                    <DetailRow label="Cancellation reason">{redemption.cancellation_reason}</DetailRow>
                    <DetailRow label="Admin notes">{redemption.admin_notes}</DetailRow>
                    <DetailRow label="Fulfillment notes">{redemption.fulfillment_notes}</DetailRow>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        Status History
                    </h3>
                    {histories.length === 0 ? (
                        <p className="text-xs text-neutral-400">No history recorded.</p>
                    ) : (
                        <ol className="relative space-y-3 border-l border-neutral-200 pl-4">
                            {histories.map((entry) => (
                                <li key={entry.id} className="relative">
                                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-orange-400 ring-4 ring-orange-100" />
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        {entry.from_status ? (
                                            <>
                                                <StatusBadge status={entry.from_status} />
                                                <span className="text-neutral-400">→</span>
                                            </>
                                        ) : null}
                                        <StatusBadge status={entry.to_status} />
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-neutral-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {entry.created_at}
                                        {entry.actor?.name ? ` · ${entry.actor.name}` : ""}
                                    </p>
                                    {entry.notes && (
                                        <p className="mt-0.5 text-[11px] text-neutral-600">
                                            {entry.notes}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </Modal>
    );
}
