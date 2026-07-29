import axios from "axios";
export async function create_attendance_employee_settings_service(data) {
    return await axios.post("/api/attendance-employee-settings", data);
}

export async function get_attendance_employee_settings_service() {
    return await axios.get("/api/attendance-employee-settings");
}
