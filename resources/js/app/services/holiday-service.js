import axios from "axios";

export async function get_holidays_service(params = {}) {
    return axios.get("/api/timekeeping/holidays", { params });
}

export async function create_holiday_service(data) {
    return axios.post("/api/timekeeping/holidays", data);
}

export async function delete_holiday_service(id) {
    return axios.delete(`/api/timekeeping/holidays/${id}`);
}
