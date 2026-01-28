import axios from "axios";
export async function create_department_service(data) {
    return await axios.post("/api/departments", data);
}

export async function get_departments_service() {
    return await axios.get("/api/departments");
}
