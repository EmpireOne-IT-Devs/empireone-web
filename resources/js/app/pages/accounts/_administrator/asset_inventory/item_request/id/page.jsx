import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Layout from "../../../../layout";
import AssetInventory from "../../layout";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import {
    decide_asset_item_request_thunk,
    get_asset_item_request_thunk,
} from "@/app/redux/asset-item-request-thunk";
import HeaderSection from "./sections/header-section";
import ItemReqFlowSection from "./sections/item-req-flow-section";

const LIST_PATH = "/accounts/administrator/asset_inventory/item_request";

function NotFound({ message }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Item request not found</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {message || "The request may have been removed or you may not have access to it."}
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

export default function Page() {
    const uuid = usePage().url.split("?")[0].split("/").filter(Boolean).slice(-1)[0];
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.asset_item_requests.detail);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (!uuid) return undefined;
        const request = dispatch(get_asset_item_request_thunk(uuid));
        return () => request.abort();
    }, [dispatch, uuid, retry]);

    const handleDecision = async (decision, step, remarks) => {
        let result;
        try {
            result = await dispatch(
                decide_asset_item_request_thunk({ uuid, decision, step, remarks }),
            ).unwrap();
        } catch (error) {
            if (error?.status === 409) {
                dispatch(setAlert({ open: true, type: "info", title: "Request updated", message: error.message }));
                setRetry((value) => value + 1);
                return;
            }
            throw error;
        }
        const request = result.data;
        dispatch(setAlert({
            open: true,
            type: decision === "approve" ? "success" : "danger",
            title: decision === "approve" ? "Approval recorded" : "Request rejected",
            message: decision === "approve"
                ? `${request.id}: ${request.status}.`
                : `${request.id} was rejected.`,
        }));
    };

    const isCurrentRequest = detail.uuid === uuid;
    const request = isCurrentRequest ? detail.request : null;

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    {!isCurrentRequest || detail.loading ? (
                        <p role="status" className="rounded-xl border bg-white p-5 text-sm text-gray-600">Loading item request…</p>
                    ) : request ? (
                        <>
                            <HeaderSection request={request} />
                            <ItemReqFlowSection key={uuid} request={request} onDecision={handleDecision} />
                        </>
                    ) : [403, 404].includes(detail.error?.status) ? (
                        <NotFound message={detail.error?.message} />
                    ) : (
                        <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
                            <p>{detail.error?.message ?? "Unable to load this item request."}</p>
                            <Button outlined onClick={() => setRetry((value) => value + 1)}>Retry</Button>
                        </div>
                    )}
                </div>
            </AssetInventory>
        </Layout>
    );
}
