import axios from "axios";

export async function get_employees_service(data) {
    return (
        await axios.get(
            `/api/accounts/employees${window.location.search}`,
            data,
        )
    ).data;
}

export async function get_probationary_service() {
    return (await axios.get(`/api/accounts/get_probationary`)).data;
}
