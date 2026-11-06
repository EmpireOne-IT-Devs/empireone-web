import React from "react";
import Modal from "@/app/_components/modal";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import {
    CATEGORY_VARIANTS,
    PRIORITY_VARIANTS,
    STATUS_VARIANTS,
    formatDate,
    formatMoney,
} from "./purchase-request-helpers";

function DetailRow({ label, children }) {
    return (
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </dt>
            <dd className="text-sm font-medium text-gray-900 sm:text-right">
                {children ?? "—"}
            </dd>
        </div>
    );
}

export default function ViewPurchaseReqSection({ request, currency = "PHP", onClose }) {
    return (
        <Modal
            isOpen={Boolean(request)}
            onClose={onClose}
            width="max-w-2xl"
            title={
                <div>
                    <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                        Purchase Request {request?.id}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Requested {formatDate(request?.requestDate)}
                    </p>
                </div>
            }
        >
            {request && (
                <div className="mt-4 p-2">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <Badge
                            outlined
                            showDot
                            label={request.status}
                            variant={STATUS_VARIANTS[request.status] ?? "secondary"}
                            className="rounded-full"
                        />
                        <Badge
                            label={request.priority}
                            variant={PRIORITY_VARIANTS[request.priority] ?? "secondary"}
                        />
                        <Badge
                            outlined
                            label={request.category}
                            variant={CATEGORY_VARIANTS[request.category] ?? "secondary"}
                        />
                    </div>

                    <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200 px-4">
                        <DetailRow label="Item">{request.itemName}</DetailRow>
                        <DetailRow label="Department">{request.department}</DetailRow>
                        <DetailRow label="Requester">{request.requesterName}</DetailRow>
                        <DetailRow label="Department code">
                            <span className="font-mono">{request.departmentCode}</span>
                        </DetailRow>
                        <DetailRow label="Quantity">{request.quantity}</DetailRow>
                        <DetailRow label="Unit price">
                            {formatMoney(request.unitPrice, currency)}
                        </DetailRow>
                        <DetailRow label="Total amount">
                            <span className="font-semibold">
                                {formatMoney(request.totalAmount, currency)}
                            </span>
                        </DetailRow>
                        <DetailRow label="Supplier">{request.supplier}</DetailRow>
                        <DetailRow label="Target purchase date">
                            {formatDate(request.purchaseDate)}
                        </DetailRow>
                    </dl>

                    <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                        <Button variant="secondary" outlined onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
