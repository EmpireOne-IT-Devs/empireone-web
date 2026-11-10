import axios from "axios";

const BASE = "/api/asset_inventory/import";

export async function analyze_import_service(rows) {
    return (await axios.post(`${BASE}/analyze`, { rows })).data;
}

export async function commit_import_service(modules) {
    return (await axios.post(`${BASE}/commit`, { modules })).data;
}
