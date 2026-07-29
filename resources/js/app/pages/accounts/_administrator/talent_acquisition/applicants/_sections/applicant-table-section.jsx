import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import moment from "moment";
import { FcApproval, FcButtingIn, FcVideoCall } from "react-icons/fc";

// Component Imports
import Table from "@/app/_components/table";
import Tooltip from "@/app/_components/tooltip";
import Button from "@/app/_components/button";

// Section Imports
import EditStatusSection from "./edit-status-section";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import SendJobOfferSection from "./send-job-offer-section";
import ResendJobOfferSection from "./resend-job-offer-section";
import SendDocumentsSection from "./send-documents-section";
import DeleteApplicantSection from "./delete-applicant-section";

const TABLE_COLUMNS = [
    { header: "Interview Date", accessor: "interview" },
    { header: "Applicant Name", accessor: "name" },
    { header: "Position", accessor: "position" },
    { header: "Recruiter", accessor: "recruiter" },
    { header: "Assessment Status", accessor: "screening_status" },
    { header: "Interview Status", accessor: "interview_status" },
    { header: "Final Status", accessor: "final_status" },
    { header: "Action", accessor: "action" },
];

export default function ApplicantTableSection() {
    const { applicants, search_applicant_status } = useSelector(
        (store) => store.job_postings
    );

    // Filter applicants based on active status filters
    const filteredApplications = useMemo(() => {
        if (!applicants?.data) return [];

        const { screening_status, interview_status, final_status } =
            search_applicant_status || {};

        return applicants.data.filter((res) => {
            const screeningMatch = screening_status
                ? res.screening_status === screening_status
                : true;
            const interviewMatch = interview_status
                ? res.interview_status === interview_status
                : true;
            const finalMatch = final_status
                ? res.final_status === final_status
                : true;

            return screeningMatch && interviewMatch && finalMatch;
        });
    }, [applicants?.data, search_applicant_status]);

    // Format filtered data into table-ready rows
    const tableData = useMemo(() => {
        return filteredApplications.map((res) => {
            // 1. Interview Schedule Logic
            const scheduledDate = res?.schedule?.scheduled_date;
            const isToday = scheduledDate && moment(scheduledDate).isSame(moment(), "day");

            const interviewElement = scheduledDate ? (
                <Button
                    variant="ghost"
                    onClick={() => window.open(res?.schedule?.meeting_link, "_blank")}
                    className="flex items-center gap-3 justify-center p-1.5 h-auto hover:bg-gray-100 rounded-md"
                >
                    <FcVideoCall className="text-3xl shrink-0" />
                    <div className="flex flex-col items-start text-left leading-tight">
                        <span
                            className={`font-semibold text-sm ${isToday ? "text-rose-600 font-bold" : "text-gray-900"
                                }`}
                        >
                            {isToday ? "Today" : moment(scheduledDate).format("MMM DD, YYYY")}
                        </span>
                        <span
                            className={`text-xs font-medium ${isToday ? "text-rose-500/90" : "text-gray-500"
                                }`}
                        >
                            {moment(res.schedule.start_time, "HH:mm:ss").format("h:mm A")} -{" "}
                            {moment(res.schedule.end_time, "HH:mm:ss").format("h:mm A")}
                        </span>
                    </div>
                </Button>
            ) : (
                <span className="text-xs text-gray-400 italic">Not Scheduled</span>
            );

            // 2. Employee Badging & Name Logic
            const currentEmployeeId = res?.applicant?.account_employee?.employee_id;
            const previousStatus = res?.applicant?.personal_information?.previous_employee_status;
            const firstName = res?.applicant?.personal_information?.first_name || "";
            const lastName = res?.applicant?.personal_information?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unknown Applicant";

            const nameElement = (
                <div className="flex items-center gap-2">
                    {currentEmployeeId && (
                        <Tooltip title="Current Employee">
                            <FcApproval className="text-2xl shrink-0" />
                        </Tooltip>
                    )}
                    {previousStatus && (
                        <Tooltip title={`Former employee in the ${previousStatus}`}>
                            <FcButtingIn className="text-2xl shrink-0" />
                        </Tooltip>
                    )}
                    <span className="font-medium text-gray-900">{fullName}</span>
                </div>
            );

            // 3. Action Buttons & Documents Logic
            const isPassedOrPooled = res?.final_status === "Passed" || res?.final_status === "Pooled";
            const canSendOffer = String(res?.user?.role) === "3" && isPassedOrPooled;

            const actionElement = (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Send Job Offer */}
                    {canSendOffer && <SendJobOfferSection data={res} />}

                    {/* Resend Job Offer */}
                    {res?.final_status === "Declined Job Offer" && (
                        <ResendJobOfferSection data={res} />
                    )}

                    {/* Accepted Job Offer Documents */}
                    {res?.final_status === "Accepted Job Offer" && (
                        <>
                            <SendDocumentsSection data={res} />
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                    window.open(
                                        `/accounts/my_documents/${res?.user_id}/contract`,
                                        "_blank"
                                    )
                                }
                            >
                                EMPLOYMENT CONTRACT
                            </Button>
                        </>
                    )}

                    {/* Sent Documents Actions */}
                    {res?.final_status === "Sent Documents" && (
                        <>
                            <Button
                                variant="primary"

                                onClick={() =>
                                    window.open(
                                        `/accounts/my_documents/${res?.user_id}/contract`,
                                        "_blank"
                                    )
                                }
                            >
                                CONTRACT
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    window.open(
                                        `/accounts/my_documents/${res?.user_id}/onboarding`,
                                        "_blank"
                                    )
                                }
                            >
                                ONBOARDING
                            </Button>
                        </>
                    )}

                    {/* Internal Movement / ECF */}
                    {res?.final_status === "Passed" && currentEmployeeId && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                                router.visit(
                                    `/accounts/administrator/human_resources/employee_movements/assessment_process/promotions?employee_id=${currentEmployeeId}`
                                )
                            }
                        >
                            CREATE ECF
                        </Button>
                    )}

                    <ShowApplicantDetailsSection data={res} />
                    <DeleteApplicantSection data={res} />
                </div>
            );

            return {
                interview: interviewElement,
                name: nameElement,
                position: res?.job_posting?.job_requisition?.title || "N/A",
                recruiter: res?.job_posting?.job_requisition?.recruiter?.name || "Unassigned",
                applied_at: res?.created_at ? moment(res.created_at).format("LLL") : "N/A",
                screening_status: (
                    <EditStatusSection data={res} table_status="screening_status" />
                ),
                interview_status: (
                    <EditStatusSection data={res} table_status="interview_status" />
                ),
                final_status: (
                    <EditStatusSection data={res} table_status="final_status" />
                ),
                action: actionElement,
            };
        });
    }, [filteredApplications]);

    return (
        <div className="flex flex-col gap-3">
            <Table columns={TABLE_COLUMNS} data={tableData} />
        </div>
    );
}