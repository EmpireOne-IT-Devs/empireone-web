export async function get_job_applicant_schedule_service() {
    return (await axios.get(`/api/job/job_applicant_schedules`)).data;
}

export async function change_job_applicant_schedule_service(data) {
    return (await axios.post(`/api/job/change_job_applicant_schedule`, data))
        .data;
}
