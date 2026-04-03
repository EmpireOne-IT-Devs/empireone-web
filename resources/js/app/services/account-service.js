import axios from "axios";

export async function save_signature_service(data) {
    return await axios.post(`/api/accounts/save_signature`, data);
}

export async function send_documents_service(data) {
    return await axios.post(`/api/accounts/send_documents`, data);
}


export async function edit_information_service(data) {
    return await axios.post(`/api/accounts/edit_information`, data);
}

