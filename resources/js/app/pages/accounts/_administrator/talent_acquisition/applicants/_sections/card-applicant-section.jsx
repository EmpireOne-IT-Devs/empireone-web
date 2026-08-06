import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
    FcApproval,
    FcButtingIn,
    FcVideoCall,
} from 'react-icons/fc';
import {
    Calendar,
    User,
    Briefcase,
    UserCheck,
    CheckCircle2,
    Clock,
    Award,
    Eye,
    Building,
} from 'lucide-react';

// Shared Section Imports from Table
import EditStatusSection from './edit-status-section';
// Component Imports
import Tooltip from '@/app/_components/tooltip';
import ActionListSection from './action-list-section';

export default function CardApplicantSection() {
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

    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {filteredApplications?.length > 0 ? (
                filteredApplications.map((res) => {
                    const applicantId = res.id;

                    // 1. Interview Schedule Logic
                    const scheduledDate = res?.schedule?.scheduled_date;
                    const isToday =
                        scheduledDate &&
                        moment(scheduledDate).isSame(moment(), 'day');

                    // 2. Employee Badging & Name Logic
                    const currentEmployeeId =
                        res?.applicant?.account_employee?.employee_id;
                    const previousStatus =
                        res?.applicant?.personal_information
                            ?.previous_employee_status;
                    const firstName =
                        res?.applicant?.personal_information?.first_name || '';
                    const lastName =
                        res?.applicant?.personal_information?.last_name || '';
                    const fullName =
                        `${firstName} ${lastName}`.trim() ||
                        'Unknown Applicant';

                    // 3. Action Buttons & Logic
                    const isPassedOrPooled =
                        res?.final_status === 'Passed' ||
                        res?.final_status === 'Pooled';
                    const canSendOffer =
                        String(res?.user?.role) === '3' && isPassedOrPooled;

                    return (
                        <div
                            key={applicantId}
                            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.15rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5 text-sm relative overflow-visible h-fit self-start"
                        >
                            {/* Top Details Section */}
                            <div className="flex flex-col gap-3">
                                {/* Header / Category Label */}
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                        Applicant Details
                                    </span>
                                    <span className="font-mono text-xs font-bold text-gray-500">
                                        Applied:{' '}
                                        {res?.created_at
                                            ? moment(res.created_at).format(
                                                'MMM DD, YYYY'
                                            )
                                            : 'N/A'}
                                    </span>
                                </div>

                                {/* Fullname & Icons */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                        <User className="w-4 h-4 text-purple-600" />{' '}
                                        Fullname
                                    </span>
                                    <div className="flex items-center gap-1.5 justify-end truncate">
                                        {currentEmployeeId && (
                                            <Tooltip title="Current Employee">
                                                <FcApproval className="text-xl shrink-0" />
                                            </Tooltip>
                                        )}
                                        {previousStatus && (
                                            <Tooltip
                                                title={`Former employee in the ${previousStatus}`}
                                            >
                                                <FcButtingIn className="text-xl shrink-0" />
                                            </Tooltip>
                                        )}
                                        <span className="font-semibold text-gray-900 text-right truncate">
                                            {fullName}
                                        </span>
                                    </div>
                                </div>

                                {/* Position */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                        <Briefcase className="w-4 h-4 text-purple-600" />{' '}
                                        Position
                                    </span>
                                    <span className="text-gray-900 font-medium text-right truncate">
                                        {res?.job_posting?.job_requisition
                                            ?.title || 'N/A'}
                                    </span>
                                </div>

                                {/* Recruiter */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                        <UserCheck className="w-4 h-4 text-purple-600" />{' '}
                                        Recruiter
                                    </span>
                                    <span className="text-gray-900 font-medium text-right truncate">
                                        {res?.job_posting?.job_requisition
                                            ?.recruiter?.name || 'Unassigned'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                        <Building className="w-4 h-4 text-purple-600" />{' '}
                                        Account
                                    </span>
                                    <span className="text-gray-900 font-medium text-right truncate">
                                        {res?.job_posting?.job_requisition
                                            ?.account?.name || 'Unassigned'}
                                    </span>
                                </div>

                                {/* Interview Schedule */}
                                <div className="flex items-center justify-between gap-2 pt-1 border-t w-full border-gray-50">
                                    <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                        <Calendar className="w-4 h-4 text-purple-600" />{' '}
                                        Interview
                                    </span>
                                    <div>
                                        {scheduledDate ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    window.open(
                                                        res?.schedule
                                                            ?.meeting_link,
                                                        '_blank'
                                                    )
                                                }
                                                className="flex items-center w-full gap-1.5 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                                            >
                                                <FcVideoCall className="text-lg shrink-0" />
                                                <div className="flex gap-3 items-center leading-tight">
                                                    <span
                                                        className={`font-semibold text-xs ${isToday
                                                            ? 'text-rose-600 font-bold'
                                                            : 'text-gray-900'
                                                            }`}
                                                    >
                                                        {isToday
                                                            ? 'Today'
                                                            : moment(
                                                                scheduledDate
                                                            ).format(
                                                                'MMM DD'
                                                            )}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-medium">
                                                        {moment(
                                                            res.schedule
                                                                .start_time,
                                                            'HH:mm:ss'
                                                        ).format('h:mm A')}
                                                    </span>
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                Not Scheduled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Assessment & Pipeline Status
                                </span>

                                <div className="grid grid-cols-1 gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                    {/* Screening Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />{' '}
                                            Screening:
                                        </span>
                                        <EditStatusSection
                                            data={res}
                                            table_status="screening_status"
                                        />
                                    </div>

                                    {/* Interview Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-purple-600" />{' '}
                                            Interview:
                                        </span>
                                        <EditStatusSection
                                            data={res}
                                            table_status="interview_status"
                                        />
                                    </div>

                                    {/* Final Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5 text-purple-600" />{' '}
                                            Final Status:
                                        </span>
                                        <EditStatusSection
                                            data={res}
                                            table_status="final_status"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <ActionListSection props_data={res}/> */}
                        </div>
                    );
                })
            ) : (
                <div className="w-full text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                    No applicants found matching selected filter criteria.
                </div>
            )}
        </div>
    );
}