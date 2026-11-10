import axios from "axios";

const BASE = "/api/asset_inventory/parts";

export async function get_asset_parts_service(params = {}) {
    return (await axios.get(BASE, { params })).data;
}

export async function create_asset_parts_service(data) {
    return (await axios.post(BASE, data)).data;
}

export async function update_asset_parts_service(uuid, data) {
    return (await axios.put(BASE + "/" + uuid, data)).data;
}

export async function delete_asset_parts_service(uuid) {
    return (await axios.delete(BASE + "/" + uuid)).data;
}