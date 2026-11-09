import axios from "axios";

const BASE = "/api/asset_inventory/devices";

export async function get_asset_devices_service(params = {}) {
    return (await axios.get(BASE, { params })).data;
}

export async function create_asset_device_service(data) {
    return (await axios.post(BASE, data)).data;
}

export async function update_asset_device_service(uuid, data) {
    return (await axios.put(`${BASE}/${uuid}`, data)).data;
}

export async function delete_asset_device_service(uuid) {
    return (await axios.delete(`${BASE}/${uuid}`)).data;
}

export async function import_asset_devices_service(rows) {
    return (await axios.post(`${BASE}/import`, { rows })).data;
}
