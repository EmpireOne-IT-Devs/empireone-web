import axios from "axios";

const BASE = "/api/asset_inventory/liability_forms";
const formPath = (uuid) => `${BASE}/${encodeURIComponent(uuid)}`;

export async function list_liability_forms_service(params, signal) {
    return (await axios.get(BASE, { params, signal })).data;
}

export async function get_liability_form_service(uuid, signal) {
    return (await axios.get(formPath(uuid), { signal })).data;
}

export async function act_on_liability_form_service({ uuid, action, payload }) {
    return (await axios.post(`${formPath(uuid)}/${action}`, payload)).data;
}

export async function search_paper_employees_service(search, signal) {
    return (await axios.get(`${BASE}/paper/employees`, { params: { search }, signal })).data;
}

export async function record_paper_liability_service({ items, scan, ...fields }) {
    const body = new FormData();
    for (const [field, value] of Object.entries(fields)) {
        if (value !== "" && value != null) body.append(field, value);
    }
    items.forEach((item, index) => {
        for (const [field, value] of Object.entries(item)) {
            if (value !== "" && value != null) body.append(`items[${index}][${field}]`, value);
        }
    });
    if (scan?.[0]) body.append("scan", scan[0]);
    return (await axios.post(`${BASE}/paper`, body)).data;
}

export async function get_paper_scan_service(uuid) {
    const path = `/asset-accountability/${encodeURIComponent(uuid)}/paper-scan`;
    const { data, headers } = await axios.get(path, { responseType: "blob", headers: { Accept: "application/json" } });
    const name = headers["content-disposition"]?.match(/filename="?([^";]+)"?/i)?.[1];
    if (!name) throw new Error("Missing paper scan attachment.");
    return { blob: data, name };
}
