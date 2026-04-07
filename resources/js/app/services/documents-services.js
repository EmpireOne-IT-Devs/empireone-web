import axios from "axios";

export async function add_documents_service(data) {
    return await axios.post("/api/accounts/add_documents", data);
}

export async function re_upload_documents_service(data) {
    return await axios.post("/api/accounts/re_upload_documents", data);
}

export async function get_documents_by_user_service(data) {
    return await axios.get("/api/accounts/get_documents_by_user", data);
}

export async function get_201_files_by_user_service(user_id) {
    return await axios.get(`/api/accounts/get_201_files_by_user/${user_id}`);
}

