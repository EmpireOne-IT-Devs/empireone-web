import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
    FcCalendar,
    FcBusinessman,
    FcBriefcase,
    FcCheckmark,
    FcClock,
    FcApproval,
    FcDepartment,
    FcLike,
    FcButtingIn,
    FcVideoCall,
    FcGenealogy,
} from 'react-icons/fc';

import DetailsCard from '@/app/_components/details-card';
import EditStatusSection from './edit-status-section';
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

        if (!screening_status && !interview_status && !final_status) {
            return applicants.data;
        }

        return applicants.data.filter((res) => {
            if (screening_status && res.screening_status !== screening_status) return false;
            if (interview_status && res.interview_status !== interview_status) return false;
            if (final_status && res.final_status !== final_status) return false;

            return true;
        });
    }, [applicants?.data, search_applicant_status]);

    return (
        <div className="flex bg-gray-100 gap-6 flex-wrap w-full justify-start items-start">
            {filteredApplications?.length > 0 ? (
                filteredApplications.map((res) => {
                    const applicantId = res.id;

                    // Interview Schedule Logic
                    const scheduledDate = res?.schedule?.scheduled_date;
                    const isToday =
                        scheduledDate &&
                        moment(scheduledDate).isSame(moment(), 'day');

                    // Employee Badging & Name Logic
                    const personalInfo = res?.applicant?.personal_information;
                    const currentEmployeeId = res?.applicant?.account_employee?.employee_id;
                    const previousStatus = personalInfo?.previous_employee_status;

                    const firstName = personalInfo?.first_name || '';
                    const lastName = personalInfo?.last_name || '';
                    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Applicant';

                    const jobRequisition = res?.job_posting?.job_requisition;

    console.log('props_data',res)
                    return (
                        <DetailsCard
                            key={applicantId}
                            data={res}
                            title="Applicant Details"
                            badgeRight={
                                <span className="font-mono text-xs font-bold text-gray-500">
                                    Applied:{' '}
                                    {res?.created_at
                                        ? moment(res.created_at).format('MMM DD, YYYY')
                                        : 'N/A'}
                                </span>
                            }
                            hideViewButton={true}
                            list={[
                                {
                                    id: 'fullname',
                                    label: 'Fullname',
                                    icon: FcBusinessman,
                                    value: (
                                        <div className="flex items-center gap-1.5 justify-end truncate">
                                            {currentEmployeeId && (
                                                <Tooltip title="Current Employee">
                                                    <FcApproval className="text-xl shrink-0" />
                                                </Tooltip>
                                            )}
                                            {previousStatus && (
                                                <Tooltip title={`Former employee in the ${previousStatus}`}>
                                                    <FcButtingIn className="text-xl shrink-0" />
                                                </Tooltip>
                                            )}
                                            <span className="font-semibold text-gray-900 text-right truncate">
                                                {fullName}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    id: 'position',
                                    label: 'Position',
                                    icon: FcBriefcase,
                                    value: jobRequisition?.title || 'N/A',
                                },
                                {
                                    id: 'recruiter',
                                    label: 'Recruiter',
                                    icon: FcGenealogy,
                                    value: jobRequisition?.recruiter?.name || 'Unassigned',
                                },
                                {
                                    id: 'account',
                                    label: 'Account',
                                    icon: FcDepartment,
                                    value: jobRequisition?.account?.name || 'Unassigned',
                                },
                                {
                                    id: 'marital_status',
                                    label: 'Marital Status',
                                    icon: FcLike,
                                    value: personalInfo?.marital_status || 'Unassigned',
                                },
                                {
                                    id: 'interview',
                                    label: 'Interview',
                                    icon: FcCalendar,
                                    value: scheduledDate ? (
                                        <button
                                            type="button"
                                            onClick={() => window.open(res.schedule?.meeting_link, '_blank')}
                                            className="flex items-center w-full gap-1.5 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                                        >
                                            <FcVideoCall className="text-lg shrink-0" />
                                            <div className="flex gap-3 items-center leading-tight">
                                                <span
                                                    className={`font-semibold text-xs ${isToday ? 'text-rose-600 font-bold' : 'text-gray-900'
                                                        }`}
                                                >
                                                    {isToday ? 'Today' : moment(scheduledDate).format('MMM DD')}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    {res.schedule?.start_time
                                                        ? moment(res.schedule.start_time, 'HH:mm:ss').format('h:mm A')
                                                        : ''}
                                                </span>
                                            </div>
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">
                                            Not Scheduled
                                        </span>
                                    ),
                                },
                            ]}
                            dropdown={
                                <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 w-full">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            Assessment & Pipeline Status
                                        </span>

                                        <div className="grid grid-cols-1 gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                    <FcCheckmark className="text-sm shrink-0" /> Screening:
                                                </span>
                                                <EditStatusSection data={res} table_status="screening_status" />
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                    <FcClock className="text-sm shrink-0" /> Interview:
                                                </span>
                                                <EditStatusSection data={res} table_status="interview_status" />
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                    <FcApproval className="text-sm shrink-0" /> Final Status:
                                                </span>
                                                <EditStatusSection data={res} table_status="final_status" />
                                            </div>
                                        </div>
                                    </div>

                                    <ActionListSection props_data={res} />
                                </div>
                            }
                        />
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