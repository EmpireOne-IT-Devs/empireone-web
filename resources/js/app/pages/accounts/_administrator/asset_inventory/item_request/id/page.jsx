import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Layout from "../../../../layout";
import AssetInventory from "../../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import ItemReqFlowSection from "./sections/item-req-flow-section";
import { findItemRequest } from "../sections/item-request-mock-data";
import { getApprovalSummary } from "../sections/item-request-helpers";

const LIST_PATH = "/accounts/administrator/asset_inventory/item_request";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Item request not found</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                The request you are looking for does not exist or may have been removed.
            </p>
            <Link
                href={LIST_PATH}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
                Back to item requests
            </Link>
        </div>
    );
}

// Derives the headline status from the approval chain (mock only).
function deriveStatus(approvals, fallback) {
    const summary = getApprovalSummary(approvals);
    if (summary.isRejected) return "Rejected";
    if (summary.isComplete) return "Approved";
    return fallback ?? "Pending Approval";
}

export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();
    const [request, setRequest] = useState(() => findItemRequest(id));

    const updateStep = (index, status, remarks) => {
        setRequest((prev) => {
            if (!prev) return prev;

            const approvals = prev.approvals.map((step, i) =>
                i === index
                    ? {
                          ...step,
                          status,
                          approverName: step.approverName ?? "You",
                          actedAt: new Date().toISOString().slice(0, 10),
                          remarks:
                              remarks ||
                              (status === "approved" ? "Reviewed and approved." : null),
                      }
                    : step,
            );

            return { ...prev, approvals, status: deriveStatus(approvals, prev.status) };
        });
    };

    const handleApprove = (index, remarks) => {
        const stepLabel = request?.approvals?.[index]?.label ?? "approver";
        updateStep(index, "approved", remarks);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Request approved",
                message: `${request.id} was approved by ${stepLabel}.`,
            }),
        );
    };

    const handleReject = (index, remarks) => {
        const stepLabel = request?.approvals?.[index]?.label ?? "approver";
        updateStep(index, "rejected", remarks);
        dispatch(
            setAlert({
                open: true,
                type: "danger",
                title: "Request rejected",
                message: `${request.id} was rejected by ${stepLabel}.`,
            }),
        );
    };

    const handleIssue = (assetTag) => {
        setRequest((prev) =>
            prev ? { ...prev, status: "Issued", issuedAssetTag: assetTag } : prev,
        );
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Item issued",
                message: `${request.id} issued with asset tag ${assetTag}.`,
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    {request ? (
                        <>
                            <HeaderSection request={request} />
                            <ItemReqFlowSection
                                request={request}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onIssue={handleIssue}
                            />
                        </>
                    ) : (
                        <NotFound />
                    )}
                </div>
            </AssetInventory>
        </Layout>
    );
}
