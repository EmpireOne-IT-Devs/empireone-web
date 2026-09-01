import axios from "axios";
export async function create_attendance_employee_settings_service(data) {
    return await axios.post("/api/timekeeping/attendance_employee_settings", data);
}

export async function get_attendance_employee_settings_service(employeeId) {
    return await axios.get("/api/timekeeping/attendance_employee_settings", {
        params: { employee_id: employeeId },
    });
}
