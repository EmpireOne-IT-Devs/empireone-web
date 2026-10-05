import axios from "axios";

export const get_overtime_requests_service = (date) =>
    axios.get("/api/timekeeping/overtime_requests", { params: { date } });

export const create_overtime_request_service = (payload) =>
    axios.post("/api/timekeeping/overtime_requests", payload);

export const endorse_overtime_request_service = (id) =>
    axios.post(`/api/timekeeping/overtime_requests/${id}/endorse`);

export const approve_overtime_request_service = (id) =>
    axios.post(`/api/timekeeping/overtime_requests/${id}/approve`);

export const decline_overtime_request_service = (id, note) =>
    axios.post(`/api/timekeeping/overtime_requests/${id}/decline`, { note });
