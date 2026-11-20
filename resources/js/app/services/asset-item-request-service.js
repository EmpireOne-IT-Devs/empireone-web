import axios from "axios";

const BASE = "/api/asset_inventory/item_requests";
const requestPath = (uuid) => `${BASE}/${encodeURIComponent(uuid)}`;

export async function list_asset_item_requests_service(params, signal) {
    return (await axios.get(BASE, { params, signal })).data;
}

export async function get_asset_item_request_lookups_service(params, signal) {
    return (await axios.get(`${BASE}/lookups`, { params, signal })).data;
}

export async function create_asset_item_request_service(values) {
    return (await axios.post(BASE, values)).data;
}

export async function get_asset_item_request_service(uuid, signal) {
    return (await axios.get(requestPath(uuid), { signal })).data;
}

export async function decide_asset_item_request_service({ uuid, decision, step, remarks }) {
    return (
        await axios.post(`${requestPath(uuid)}/${decision}`, { step, remarks })
    ).data;
}
