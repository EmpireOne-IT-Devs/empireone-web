import axios from "axios";

export async function get_attendance_for_date_service(date) {
    return axios.get(`/api/timekeeping/attendance/today`, {
        params: { date },
    });
}

export async function get_attendance_logs_service(params = {}) {
    return axios.get(`/api/timekeeping/attendance/logs`, { params });
}

export const clock_in_service = (date) =>
    axios.post("/api/timekeeping/attendance/clock_in", { date });

export const break_start_service = (date) =>
    axios.post("/api/timekeeping/attendance/break_start", { date });

export const break_end_service = (date) =>
    axios.post("/api/timekeeping/attendance/break_end", { date });

export const clock_out_service = (date) =>
    axios.post("/api/timekeeping/attendance/clock_out", { date });
