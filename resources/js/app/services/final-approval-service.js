import axios from "axios";

export async function get_final_approvals_service(params) {
    return (await axios.get("/api/timekeeping/final_approvals", { params }))
        .data;
}

export async function approve_final_approval_service(type, id) {
    return (
        await axios.post(
            `/api/timekeeping/final_approvals/${type}/${id}/approve`,
        )
    ).data;
}

export async function decline_final_approval_service(type, id, note) {
    return (
        await axios.post(
            `/api/timekeeping/final_approvals/${type}/${id}/decline`,
            { note },
        )
    ).data;
}
