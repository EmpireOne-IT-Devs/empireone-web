import axios from "axios";

export async function agree_contract_service(data) {
    return await axios.post(`/api/accounts/contract`, data);
}


export async function agree_onboarding_service(data) {
    return await axios.post(`/api/accounts/agree_onboarding`, data);
}
