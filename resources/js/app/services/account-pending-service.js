import axios from "axios";

export async function submit_account_pending_service(data) {
    return (await axios.post("/api/account-pendings", data)).data;
}

export async function approve_account_pending_service(uuid) {
    return (
        await axios.post(
            `/api/accounts/account-pendings/${uuid}/approve`,
        )
    ).data;
}

export async function decline_account_pending_service(uuid) {
    return (
        await axios.post(
            `/api/accounts/account-pendings/${uuid}/decline`,
        )
    ).data;
}
