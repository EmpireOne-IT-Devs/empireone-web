import axios from "axios";

const BASE = "/api/asset_inventory/purchase_requests";
const requestPath = (uuid) => `${BASE}/${encodeURIComponent(uuid)}`;

export async function list_purchase_requests_service(params, signal) {
    return (await axios.get(BASE, { params, signal })).data;
}

export async function create_purchase_request_service(values) {
    const form = new FormData();
    for (const [key, value] of Object.entries(values)) {
        if (value != null) form.append(key, value);
    }
    return (await axios.post(BASE, form)).data;
}

export async function get_purchase_request_service(uuid, signal) {
    return (await axios.get(requestPath(uuid), { signal })).data;
}

export async function decide_purchase_request_service({ uuid, decision, step, remarks }) {
    const path = decision === "approve" ? "approve" : "reject";
    return (await axios.post(`${requestPath(uuid)}/${path}`, { step, remarks })).data;
}

export async function download_purchase_quotation_service(uuid) {
    return (await axios.get(`${requestPath(uuid)}/quotation`)).data;
}
