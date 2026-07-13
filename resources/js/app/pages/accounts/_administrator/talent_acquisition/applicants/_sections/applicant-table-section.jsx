import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import {
    TbMail,
    TbPhone,
    TbBriefcase,
    TbCalendarEvent,
    TbEye,
} from "react-icons/tb";
import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import EditStatusSection from "./edit-status-section";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import SendJobOfferSection from "./send-job-offer-section";
import ResendJobOfferSection from "./resend-job-offer-section";
import SendDocumentsSection from "./send-documents-section";
import { FcApproval, FcButtingIn, FcVideoCall } from "react-icons/fc";
import Tooltip from "@/app/_components/tooltip";
import Button from "@/app/_components/button";
import { router } from "@inertiajs/react";

export default function ApplicantTableSection() {
    const { applicants, search_applicant_status } = useSelector(
        (store) => store.job_postings,
    );
    console.log("applicants", applicants.data);

    const columns = [
        {
            header: "Interview Date",
            accessor: "interview",
        },
        {
            header: "Applicant Name",
            accessor: "name",
        },
        {
            header: "Position",
            accessor: "position",
        },
        {
            header: "Recruiter",
            accessor: "recruiter",
        },

        {
            header: "Screening Status",
            accessor: "screening_status",
        },
        {
            header: "Interview Status",
            accessor: "interview_status",
        },
        {
            header: "Final Status",
            accessor: "final_status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    const filteredApplications = applicants?.data?.filter((res) => {
        const { screening_status, interview_status, final_status } =
            search_applicant_status;

        const screeningMatch = screening_status
            ? res.screening_status == screening_status
            : true;
        const interviewMatch = interview_status
            ? res.interview_status == interview_status
            : true;
        const finalMatch = final_status
            ? res.final_status == final_status
            : true;

        return screeningMatch && interviewMatch && finalMatch;
    });

    console.log("filteredApplications", filteredApplications);
    // 
    const tableData = filteredApplications?.map((res) => {
        // 1. Safe parsing and dynamic "Today" check for Interview details
        const hasSchedule = res?.schedule?.scheduled_date;

        // Check if the scheduled interview date matches today's date
        const isScheduledForToday = hasSchedule && moment(res.schedule.scheduled_date).isSame(moment(), 'day');

        const interviewElement = hasSchedule ? (
            <a
                href={res?.schedule?.meeting_link}
                target="_blank"
                className="flex items-center gap-3 justify-center">
                <FcVideoCall className="text-3xl shrink-0" />
                <div className="flex flex-col items-start text-left leading-tight">
                    <span className={`font-semibold text-sm ${isScheduledForToday ? 'text-rose-600 font-bold' : 'text-gray-900'}`}>
                        {isScheduledForToday ? 'Today' : moment(res.schedule.scheduled_date).format('MMM DD, YYYY')}
                    </span>
                    <span className={`text-xs font-medium ${isScheduledForToday ? 'text-rose-500/90' : 'text-gray-500'}`}>
                        {moment(res.schedule.start_time, 'HH:mm:ss').format('h:mm A')} - {moment(res.schedule.end_time, 'HH:mm:ss').format('h:mm A')}
                    </span>
                </div>
            </a>
        ) : (
            <span className="text-xs text-gray-400 italic">Not Scheduled</span>
        );

        // 2. Clear Badging for Current/Former Employee Badges
        const isCurrentEmployee = res?.applicant?.account_employee?.employee_id;
        const previousStatus = res?.applicant?.personal_information?.previous_employee_status;
        const firstName = res?.applicant?.personal_information?.first_name || '';
        const lastName = res?.applicant?.personal_information?.last_name || '';

        const nameElement = (
            <div className="flex items-center gap-2">
                {isCurrentEmployee && (
                    <Tooltip title="Current Employee">
                        <FcApproval className="text-2xl shrink-0" />
                    </Tooltip>
                )}
                {previousStatus && (
                    <Tooltip title={`Former employee in the ${previousStatus}`}>
                        <FcButtingIn className="text-2xl shrink-0" />
                    </Tooltip>
                )}
                <span className="font-medium text-gray-900">{`${firstName} ${lastName}`.trim() || 'Unknown Applicant'}</span>
            </div>
        );

        return {
            interview: interviewElement,
            name: nameElement,
            position: res?.job_posting?.job_requisition?.title || 'N/A',
            recruiter: res?.job_posting?.job_requisition?.recruiter?.name || 'Unassigned',
            applied_at: res?.created_at ? moment(res.created_at).format("LLL") : 'N/A',

            screening_status: (
                <EditStatusSection data={res} table_status="screening_status" />
            ),
            interview_status: (
                <EditStatusSection data={res} table_status="interview_status" />
            ),
            final_status: (
                <EditStatusSection data={res} table_status="final_status" />
            ),

            action: (
                <div className="flex items-center gap-3">
                    {/* Send Job Offer Condition */}
                    {res?.user?.role == "3" && (res?.final_status == "Passed" || res?.final_status == "Pooled") && (
                        <SendJobOfferSection data={res} />
                    )}

                    {/* Resend Job Offer Condition */}
                    {res?.final_status == "Declined Job Offer" && (
                        <ResendJobOfferSection data={res} />
                    )}

                    {/* Document Request Condition */}
                    {res?.final_status == "Accepted Job Offer" && (
                        <SendDocumentsSection data={res} />
                    )}

                    {/* Promotions / Internal Movement ECF Condition */}
                    {res?.final_status == "Passed" && isCurrentEmployee && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => router.visit(`/accounts/administrator/human_resources/employee_movements/assessment_process/promotions?employee_id=${isCurrentEmployee}`)}
                        >
                            CREATE ECF
                        </Button>
                    )}

                    <ShowApplicantDetailsSection data={res} />
                </div>
            ),
        };
    });
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
        </div>
    );
}
