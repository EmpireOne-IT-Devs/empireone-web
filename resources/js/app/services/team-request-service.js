import axios from "axios";

export async function get_team_requests_service(params) {
    return (await axios.get("/api/timekeeping/team_requests", { params })).data;
}

export async function approve_team_request_service(type, id) {
    return (
        await axios.post(`/api/timekeeping/team_requests/${type}/${id}/approve`)
    ).data;
}

export async function decline_team_request_service(type, id, note) {
    return (
        await axios.post(`/api/timekeeping/team_requests/${type}/${id}/decline`, {
            note,
        })
    ).data;
}
