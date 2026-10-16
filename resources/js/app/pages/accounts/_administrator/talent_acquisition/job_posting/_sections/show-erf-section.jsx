import Modal from '@/app/_components/modal';
import moment from 'moment';
import React, { useState } from 'react';

export default function ShowErfSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const requisition = props_data?.job_requisition;

    const formatSalary = (salary) => {
        if (!salary) return 'Not Specified';
        return isNaN(salary) ? salary : `$${Number(salary).toLocaleString()}`;
    };

    const getPriorityBadge = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'urgent':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'medium':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition-colors underline decoration-blue-300 underline-offset-4 hover:decoration-blue-600"
            >
                <span>
                    {requisition?.title || 'Untitled Position'}
                    {requisition?.account?.name ? ` - ${requisition.account.name}` : ''}
                </span>
                <svg
                    className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </button>

            {/* Modal */}
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-5xl"
            >
                <div className="bg-white rounded-xl shadow-xl  border border-gray-100 flex flex-col">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950 p-6 text-white shrink-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getPriorityBadge(requisition?.priority)}`}>
                                        {requisition?.priority || 'Normal'} Priority
                                    </span>
                                    {requisition?.type && (
                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 backdrop-blur-sm border border-white/10">
                                            {requisition.type}
                                        </span>
                                    )}
                                    {requisition?.status && (
                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                                            {requisition.status}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {requisition?.title || 'Job Requisition Details'}
                                </h2>
                                <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Account: <span className="font-semibold text-white">{requisition?.account?.name || 'N/A'}</span>
                                </p>
                            </div>

                            {/* Openings Pill */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-4 min-w-[140px] justify-center">
                                <div className="text-center">
                                    <span className="text-3xl font-extrabold text-purple-400">
                                        {requisition?.number_of_positions ?? 0}
                                    </span>
                                    <span className="block text-xs uppercase tracking-wider text-slate-300 font-medium">
                                        Openings
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Body */}
                    <div className="p-6 overflow-y-auto space-y-8">

                        {/* Section 1: Overview Grid */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Position Overview
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="block text-xs font-semibold text-slate-400 uppercase">Employment Type</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{requisition?.employment_type || 'N/A'}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="block text-xs font-semibold text-slate-400 uppercase">Salary Range</span>
                                    <span className="text-emerald-700 font-semibold text-sm mt-1 block">{formatSalary(requisition?.salary_range)}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="block text-xs font-semibold text-slate-400 uppercase">Target Start Date</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{moment(requisition?.target_start_date).format('LL') || 'N/A'}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="block text-xs font-semibold text-slate-400 uppercase">Position Level</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{requisition?.position_level || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm">
                                    <span className="text-xs font-semibold text-gray-400 uppercase">ERF Classification</span>
                                    <p className="font-medium text-gray-800 mt-1 text-sm">{requisition?.erf_classification || 'N/A'}</p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm">
                                    <span className="text-xs font-semibold text-gray-400 uppercase">Category</span>
                                    <p className="font-medium text-gray-800 mt-1 text-sm">{requisition?.category || 'N/A'}</p>
                                </div>
                                <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm">
                                    <span className="text-xs font-semibold text-gray-400 uppercase">Target Audience</span>
                                    <p className="font-medium text-gray-800 mt-1 text-sm">{requisition?.target_audience || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Justification (if present) */}
                        {requisition?.justification_for_position && (
                            <div className="border border-purple-100 bg-purple-50/40 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Justification for Position
                                </h4>
                                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                                    {requisition.justification_for_position}
                                </p>
                            </div>
                        )}

                        {/* Section 3: Responsibilities (HTML) */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b pb-2">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                                </svg>
                                Responsibilities
                            </h3>
                            {requisition?.responsibilities ? (
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5"
                                    dangerouslySetInnerHTML={{ __html: requisition.responsibilities }}
                                />
                            ) : (
                                <p className="text-gray-400 italic text-sm">No responsibilities specified.</p>
                            )}
                        </div>

                        {/* Section 4: Qualifications */}
                        {requisition?.qualifications && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b pb-2">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Qualifications & Requirements
                                </h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 prose-ul:list-disc prose-ul:pl-5"
                                    dangerouslySetInnerHTML={{ __html: requisition.qualifications }}
                                />
                            </div>
                        )}

                        {/* Section 5: Interviewers */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b pb-2">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Interviewers & Schedule
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                                            1
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Primary Interviewer</span>
                                            <h4 className="font-semibold text-gray-900 text-sm">
                                                {requisition?.interviewer1 || 'Not Assigned'}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 border-t pt-2.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Availability:</span>
                                            <span className="font-medium text-gray-800">{requisition?.availability1 || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Preferred Time:</span>
                                            <span className="font-medium text-gray-800">{requisition?.interview_time1 || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                                            2
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secondary Interviewer</span>
                                            <h4 className="font-semibold text-gray-900 text-sm">
                                                {requisition?.interviewer2 || 'Not Assigned'}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 border-t pt-2.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Availability:</span>
                                            <span className="font-medium text-gray-800">{requisition?.availability2 || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Preferred Time:</span>
                                            <span className="font-medium text-gray-800">{requisition?.interview_time2 || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end shrink-0">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-all"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </Modal>
        </div>
    );
}