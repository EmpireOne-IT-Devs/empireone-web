import axios from "axios";

export async function get_time_sheets_service(params) {
    return (await axios.get("/api/timekeeping/time_sheets", { params })).data;
}

export async function export_time_sheets_service(params) {
    const response = await axios.get("/api/timekeeping/time_sheets/export", {
        params,
        responseType: "blob",
    });

    return {
        blob: response.data,
        contentDisposition: response.headers?.["content-disposition"] ?? "",
    };
}
