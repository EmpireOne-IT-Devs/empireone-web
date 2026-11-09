export async function ask_ai_service(data) {
    return await axios.post("/api/get_ai_cocd",data);
}