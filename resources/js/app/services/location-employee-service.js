import axios from "axios";

export async function get_location_employee_counts_service() {
    const response = await axios.get("/api/locations/employee-counts");
    return response.data?.data ?? [];
}

export async function export_location_employees_service(locationId) {
    const response = await axios.get(
        `/api/locations/${locationId}/employees/export`,
        { responseType: "blob" },
    );

    return {
        blob: response.data,
        contentDisposition: response.headers?.["content-disposition"] ?? "",
    };
}
