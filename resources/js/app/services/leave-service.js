import axios from "axios";

export const get_leave_requests_service = (date) =>
    axios.get("/api/timekeeping/leave_requests", { params: { date } });

export const create_leave_request_service = (payload) =>
    axios.post("/api/timekeeping/leave_requests", payload);
