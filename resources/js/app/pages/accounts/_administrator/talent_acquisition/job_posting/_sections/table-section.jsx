import Table from '@/app/_components/table';
import { Link, router } from '@inertiajs/react';
import moment from 'moment';
import React from 'react';
import {
    FiBriefcase,
    FiMoreHorizontal
} from 'react-icons/fi';
import { LuArrowUpDown } from 'react-icons/lu';
import { useSelector } from 'react-redux';




export default function TableSection() {
    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );
    const { data } = useSelector(
        (state) => state.app,
    );

    // Extract the current location_id from the URL query string
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentLocationId = searchParams.get('location_id') ?? data?.user?.account_employee?.location_id;

    console.log('job_postings', job_postings)
    const tableColumns = [
        {
            key: 'id',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Job Posting ID</div>,
            render: (row) => (
                <>
                    <span className="ml-2 font-medium">{row?.id}</span>
                </>
            )
        },
        {
            key: 'Location',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Location <LuArrowUpDown className="w-3 h-3 text-purple-500" /></div>,
            render: (row) => (
                <button

                    className="font-medium text-left"
                >
                    {row?.job_requisition?.location?.name}
                </button>
            )
        },
        {
            key: 'title',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Job <LuArrowUpDown className="w-3 h-3 text-purple-500" /></div>,
            render: (row) => (
                <button

                    className="font-medium text-left"
                >
                    {row?.job_requisition?.title + ' - ' + row?.job_requisition?.account?.name}
                </button>
            )
        },
        {
            key: 'candidates',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Candidates <LuArrowUpDown className="w-3 h-3" /></div>,
            render: (row) => (
                <button
                    onClick={() =>
                        window.open(
                            `/accounts/administrator/talent_acquisition/applicants?job_posting_id=${row.id}&location_id=${currentLocationId}`,
                            '_blank',
                            'noopener,noreferrer'
                        )
                    }
                >
                    {row?.applications?.length > 0 && (
                        <span className=" ml-2 font-medium underline text-blue-500">{row?.applications?.length}</span>
                    )}
                </button>
            )
        },
        {
            key: 'erp',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">ERP <LuArrowUpDown className="w-3 h-3" /></div>,
            render: (row) => (
                <button
                    onClick={() =>
                        window.open(
                            `/accounts/administrator/talent_acquisition/erp?job_posting_id=${row.id}&location_id=${currentLocationId}`,
                            '_blank',
                            'noopener,noreferrer'
                        )
                    }
                >
                    {row?.erps?.length > 0 && (
                        <span className=" ml-2 font-medium underline text-blue-500">{row?.erps?.length}</span>
                    )}
                </button>
            )
        },
        {
            key: 'inProcess',
            header: (
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    In process <LuArrowUpDown className="w-3 h-3" />
                </div>
            ),
            render: (row) => {
                const inProcessCount = row?.applications?.filter(app => {
                    const hasPassedScreening = app.screening_status?.includes('Passed');
                    const hasPassedInterview = app.interview_status?.includes('Passed');

                    return hasPassedScreening || hasPassedInterview;
                }).length || 0;

                return (
                    <span className="text-gray-800">
                        {inProcessCount > 0 ? inProcessCount : '0'}
                    </span>
                );
            }
        },
        {
            key: 'hired',
            header: (
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Hired <LuArrowUpDown className="w-3 h-3" />
                </div>
            ),
            render: (row) => {
                const hiredCount = row?.applications?.filter(app => {
                    return app.final_status === 'Hired';
                }).length || 0;

                return (
                    <span className="text-gray-800">
                        {hiredCount > 0 ? hiredCount : '0'}
                    </span>
                );
            }
        },
        {
            key: 'failed',
            header: (
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Failed <LuArrowUpDown className="w-3 h-3" />
                </div>
            ),
            render: (row) => {
                const failedCount = row?.applications?.filter(app => {
                    const hasFailedScreening = app.screening_status?.includes('Failed');
                    const hasFailedInterview = app.interview_status?.includes('Failed');
                    const hasFailedFinal = app.final_status?.includes('Failed');

                    return hasFailedScreening || hasFailedInterview || hasFailedFinal;
                }).length || 0;

                return (
                    <span className="text-gray-800">
                        {failedCount > 0 ? failedCount : '0'}
                    </span>
                );
            }
        },
        {
            key: 'created',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Created <LuArrowUpDown className="w-3 h-3" /></div>,
            render: (row) => <span className="text-gray-500">{moment(row.created_at).format('LL')}</span>
        },
        {
            key: 'start_date',
            header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Start Date <LuArrowUpDown className="w-3 h-3" /></div>,
            render: (row) => <span className="text-gray-500">{moment(job_postings?.job_requisition?.target_start_date).format('LL')}</span>
        },
        // {
        //     key: 'status',
        //     header: <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Status <LuArrowUpDown className="w-3 h-3" /></div>,
        //     render: (row) => <StatusBadge status={row.status} />
        // },
        {
            key: 'actions',
            width: 'w-12',
            header: '',
            render: () => (
                <button className="p-1 rounded hover:bg-gray-200 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiMoreHorizontal className="w-4 h-4" />
                </button>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row gap-4 md:gap-6 text-sm font-sans text-gray-800">

            {/* ADDED: min-w-0 to prevent flex blowout if the table scales too large */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Jobs Table Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                    {/* Tabs */}
                    {/* ADDED: overflow-x-auto whitespace-nowrap to allow tabs to scroll horizontally on small screens */}
                    <div className="flex border-b border-gray-200 px-2 text-sm overflow-x-auto whitespace-nowrap">
                        <button className="flex items-center gap-2 px-4 md:px-6 py-3 border-b-2 border-purple-600 text-purple-600 font-medium">
                            <FiBriefcase className="w-4 h-4" /> All jobs <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs">{job_postings.length}</span>
                        </button>
                    </div>

                    {/* Dynamic Table Component injected here */}
                    {/* (Assuming your `<Table />` component still has the mobile card view built-in from the earlier steps) */}
                    <Table columns={tableColumns} data={job_postings} />

                </div>
            </div>
        </div>
    );
}