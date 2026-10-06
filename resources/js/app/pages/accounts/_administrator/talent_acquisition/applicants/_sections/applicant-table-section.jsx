import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
    FcApproval,
    FcButtingIn,
    FcVideoCall,
} from 'react-icons/fc';

import Table from '@/app/_components/table';
import Tooltip from '@/app/_components/tooltip';
import EditStatusSection from './edit-status-section';
import ActionListSection from './action-list-section';

export default function ApplicantTableSection({ loading=false }) {
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

    const columns = [
        {
            header: "Applied Date",
            render: (row) => (
                <span className="font-mono text-xs font-semibold text-gray-600">
                    {row?.created_at
                        ? moment(row.created_at).format('MMM DD, YYYY')
                        : 'N/A'}
                </span>
            ),
        },
        {
            header: "Full Name",
            render: (row) => {
                const personalInfo = row?.applicant?.personal_information;
                const currentEmployeeId = row?.applicant?.account_employee?.employee_id;
                const previousStatus = personalInfo?.previous_employee_status;

                const firstName = personalInfo?.first_name || '';
                const lastName = personalInfo?.last_name || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Applicant';

                return (
                    <div className="flex items-center gap-1.5">
                        {currentEmployeeId && (
                            <Tooltip title="Current Employee">
                                <FcApproval className="text-lg shrink-0" />
                            </Tooltip>
                        )}
                        {previousStatus && (
                            <Tooltip title={`Former employee in the ${previousStatus}`}>
                                <FcButtingIn className="text-lg shrink-0" />
                            </Tooltip>
                        )}
                        <span className="font-semibold text-gray-900 truncate">
                            {fullName}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Position",
            render: (row) => row?.job_posting?.job_requisition?.title || 'N/A',
        },
        {
            header: "Account",
            render: (row) => row?.job_posting?.job_requisition?.account?.name || 'Unassigned',
        },
        {
            header: "Interview Schedule",
            render: (row) => {
                const scheduledDate = row?.schedule?.scheduled_date;
                const isToday =
                    scheduledDate &&
                    moment(scheduledDate).isSame(moment(), 'day');

                if (!scheduledDate) {
                    return (
                        <span className="text-xs text-gray-400 italic">
                            Not Scheduled
                        </span>
                    );
                }

                return (
                    <button
                        type="button"
                        onClick={() => window.open(row?.schedule?.meeting_link, '_blank')}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                    >
                        <FcVideoCall className="text-lg shrink-0" />
                        <div className="flex gap-2 items-center leading-tight">
                            <span
                                className={`font-semibold text-xs ${isToday ? 'text-rose-600 font-bold' : 'text-gray-900'
                                    }`}
                            >
                                {isToday ? 'Today' : moment(scheduledDate).format('MMM DD')}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                                {row?.schedule?.start_time
                                    ? moment(row.schedule.start_time, 'HH:mm:ss').format('h:mm A')
                                    : ''}
                            </span>
                        </div>
                    </button>
                );
            },
        },
        {
            header: "Screening Status",
            render: (row) => (
                <EditStatusSection data={row} table_status="screening_status" />
            ),
        },
        {
            header: "Interview Status",
            render: (row) => (
                <EditStatusSection data={row} table_status="interview_status" />
            ),
        },
        {
            header: "Final Status",
            render: (row) => (
                <EditStatusSection data={row} table_status="final_status" />
            ),
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ActionListSection props_data={row} />
                </div>
            ),
        },
    ];

    return (
        <div className="w-full h-96">
            <Table
                isloading={loading}
                columns={columns}
                data={filteredApplications}
            />
        </div>
    );
}