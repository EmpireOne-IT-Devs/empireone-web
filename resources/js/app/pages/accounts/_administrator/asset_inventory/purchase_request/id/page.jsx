import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Layout from "../../../../layout";
import Button from "@/app/_components/button";
import {
    decide_asset_purchase_request_thunk,
    download_asset_purchase_quotation_thunk,
    get_asset_purchase_request_thunk,
} from "@/app/redux/asset-purchase-request-thunk";
import HeaderSection from "./sections/header-section";
import PurchaseReqFlowSection from "./sections/purchase-req-flow-section";

const LIST_PATH = "/accounts/administrator/asset_inventory/purchase_request";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Purchase request not found</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                The request you are looking for does not exist or may have been removed.
            </p>
            <Link
                href={LIST_PATH}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
                Back to purchase requests
            </Link>
        </div>
    );
}

export default function Page() {
    const uuid = usePage().url.split("?")[0].split("/").filter(Boolean).at(-1);
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.asset_purchase_requests.detail);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const fetch = dispatch(get_asset_purchase_request_thunk(uuid));
        return () => fetch.abort();
    }, [dispatch, uuid, retry]);

    const handleDecision = (decision, step, remarks) =>
        dispatch(decide_asset_purchase_request_thunk({ uuid, decision, step, remarks })).unwrap();

    const handleDownload = async () => {
        const { data } = await dispatch(download_asset_purchase_quotation_thunk(uuid)).unwrap();
        window.location.assign(data.url);
    };

    return (
        <Layout>
            <div className="space-y-4">
                {detail.uuid !== uuid || detail.loading ? (
                    <p role="status" className="rounded-xl border bg-white p-5 text-sm text-gray-600">Loading purchase request…</p>
                ) : detail.request ? (
                    <>
                        <HeaderSection request={detail.request} />
                        <PurchaseReqFlowSection
                            key={uuid}
                            request={detail.request}
                            onDecision={handleDecision}
                            onDownload={handleDownload}
                        />
                    </>
                ) : [403, 404].includes(detail.error?.status) ? (
                    <NotFound />
                ) : (
                    <div role="alert" className="space-y-3 rounded-xl border border-red-200 p-4 text-sm text-red-700">
                        <p>{detail.error?.message ?? "Unable to load this purchase request."}</p>
                        <Button outlined onClick={() => setRetry((value) => value + 1)}>Retry</Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}