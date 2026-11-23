import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    list_purchase_requests_service,
    create_purchase_request_service,
    get_purchase_request_service,
    decide_purchase_request_service,
    download_purchase_quotation_service,
    search_purchase_approvers_service,
} from "@/app/services/purchase-request-service";

function purchaseThunk(name, service, fallback) {
    return createAsyncThunk(`assetPurchaseRequests/${name}`, async (input, { rejectWithValue, signal }) => {
        try {
            return await service(input, signal);
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;
            return rejectWithValue({
                status,
                errors: data?.errors ?? {},
                message: status === 413 ? "The quotation is too large for the server to accept."
                    : status < 500 && typeof data?.message === "string" ? data.message : fallback,
            });
        }
    });
}

export const list_asset_purchase_requests_thunk = purchaseThunk("list", list_purchase_requests_service, "Unable to load purchase requests.");
export const create_asset_purchase_request_thunk = purchaseThunk("create", create_purchase_request_service, "Unable to save the purchase request. Please try again.");
export const get_asset_purchase_request_thunk = purchaseThunk("detail", get_purchase_request_service, "Unable to load this purchase request.");
export const decide_asset_purchase_request_thunk = purchaseThunk("decide", decide_purchase_request_service, "Unable to save the decision. Please try again.");
export const download_asset_purchase_quotation_thunk = purchaseThunk("quotation", download_purchase_quotation_service, "Unable to download the quotation. Please try again.");
export const search_asset_purchase_approvers_thunk = purchaseThunk("approvers", search_purchase_approvers_service, "Unable to load approvers.");
