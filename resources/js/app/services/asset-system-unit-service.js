import axios from "axios";

const BASE = "/api/asset_inventory/system_units";

export async function get_asset_system_units_service(params = {}, signal) {
    return (await axios.get(BASE, { params, signal })).data;
}

export async function create_asset_system_unit_service(data) {
    return (await axios.post(BASE, data)).data;
}
