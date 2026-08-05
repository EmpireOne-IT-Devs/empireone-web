export async function ask_ai_service(data) {
    return await axios.post("/api/ask_ai",data);
}