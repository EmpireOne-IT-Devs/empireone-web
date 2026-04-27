export async function get_job_applicant_schedule_service() {
    return (await axios.get(`/api/job/job_applicant_schedules`)).data;
}
