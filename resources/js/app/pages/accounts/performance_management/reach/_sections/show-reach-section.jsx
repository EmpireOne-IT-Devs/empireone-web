'use client'

import React, { useState } from 'react'
import { FcCustomerSupport } from 'react-icons/fc'
import {
    FiUser,
    FiAward,
    FiBarChart2,
    FiTarget,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCopy,
    FiChevronDown,
    FiChevronUp,
    FiMail,
    FiBriefcase,
} from 'react-icons/fi'

import Modal from '@/app/_components/modal'

export default function ShowReachModal({ props_data }) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [openSections, setOpenSections] = useState({
        employee: true,
        recognition: true,
        evaluation: true,
        actionPlan: true,
        commitment: true,
        followUp: true,
    })

    const {
        employee_id,
        first_name,
        last_name,
        employee_email,
        supervisor_id,
        supervisor_first_name,
        supervisor_last_name,
        supervisor_email,
        account,
        account_id,
        date_of_session,
        recognition_statement_1,
        recognition_statement_2,
        recognition_statement_3,
        area_of_opportunity,
        kpi,
        actual_metric,
        goal_target,
        biggest_rock,
        behavioral_root_cause,
        smart_goal,
        task_name,
        task_description,
        due_date,
        frequency,
        employee_commitment,
        leader_commitment,
        next_follow_up_date,
        follow_up_notes,
        status,
    } = props_data || {}

    const employeeFullName = [first_name, last_name].filter(Boolean).join(' ') || 'N/A'
    const supervisorFullName = [supervisor_first_name, supervisor_last_name].filter(Boolean).join(' ') || 'N/A'

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    const handleCopySummary = () => {
        const summaryText = `REACH SESSION SUMMARY\nEmployee: ${employeeFullName}\nSupervisor: ${supervisorFullName}\nKPI: ${kpi || 'N/A'} (Actual: ${actual_metric || 'N/A'}, Target: ${goal_target || 'N/A'})\nSMART Goal: ${smart_goal || 'N/A'}\nStatus: ${status || 'PENDING'}`
        navigator.clipboard.writeText(summaryText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div>
            <a
                className="group flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-black/[0.04] active:bg-black/[0.08] hover:text-gray-900 transition-colors duration-150 cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <FcCustomerSupport size={20} /> REACH DETAILS
            </a>

            <Modal
                width="max-w-5xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="REACH Coaching Session Details"
            >
                {!props_data ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <FiClock className="w-10 h-10 mb-2 text-slate-300" />
                        <p className="font-medium text-slate-600">No session details available.</p>
                        <p className="text-xs text-slate-400 mt-1">Select or create a REACH session to view details.</p>
                    </div>
                ) : (
                    <div className="space-y-6 text-slate-800  pr-1">
                        {/* HERO HEADER / STATUS BANNER */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-purple-900 to-slate-900 p-6 text-white shadow-xl">
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
                                        <FiBriefcase className="w-3.5 h-3.5" />
                                        {account?.name || (account_id ? `Account ID: ${account_id}` : 'Coaching Session')}
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">{employeeFullName}</h2>
                                    <p className="text-xs text-purple-200/80 mt-1 flex items-center gap-2">
                                        <span>ID: {employee_id || 'N/A'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <FiMail className="w-3 h-3" /> {employee_email || 'N/A'}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col sm:items-end gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-inner border ${status === 'ACKNOWLEDGED'
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            }`}
                                    >
                                        {status === 'ACKNOWLEDGED' ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiClock className="w-3.5 h-3.5" />}
                                        {status || 'PENDING'}
                                    </span>

                                    <button
                                        onClick={handleCopySummary}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg transition-all"
                                    >
                                        <FiCopy className="w-3.5 h-3.5" />
                                        {copied ? 'Copied!' : 'Copy Summary'}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Metric Highlights Bar */}
                            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Session Date</span>
                                    <p className="text-sm font-semibold text-white mt-0.5">
                                        {date_of_session ? new Date(date_of_session).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">KPI Target</span>
                                    <p className="text-sm font-semibold text-amber-300 mt-0.5">{goal_target || 'N/A'}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Actual Metric</span>
                                    <p className="text-sm font-semibold text-emerald-300 mt-0.5">{actual_metric || 'N/A'}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Next Follow-Up</span>
                                    <p className="text-sm font-semibold text-purple-300 mt-0.5">
                                        {next_follow_up_date ? new Date(next_follow_up_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 1: STAKEHOLDER INFORMATION */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div
                                onClick={() => toggleSection('employee')}
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer border-b border-slate-200 hover:bg-slate-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <FiUser className="text-purple-600" /> Stakeholder Information
                                </div>
                                {openSections.employee ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                            </div>

                            {openSections.employee && (
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
                                            Employee Details
                                        </span>
                                        <div className="mt-2 space-y-2 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p>
                                                <p className="font-semibold text-slate-800">{employeeFullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                                <p className="font-medium text-slate-700">{employee_email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Employee ID</p>
                                                <p className="font-medium text-slate-700">{employee_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
                                            Supervisor Details
                                        </span>
                                        <div className="mt-2 space-y-2 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p>
                                                <p className="font-semibold text-slate-800">{supervisorFullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                                <p className="font-medium text-slate-700">{supervisor_email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Supervisor ID</p>
                                                <p className="font-medium text-slate-700">{supervisor_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 2: RECOGNITION & OPPORTUNITY */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div
                                onClick={() => toggleSection('recognition')}
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer border-b border-slate-200 hover:bg-slate-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <FiAward className="text-amber-500" /> Recognition & Opportunity
                                </div>
                                {openSections.recognition ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                            </div>

                            {openSections.recognition && (
                                <div className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recognitions</p>
                                        <div className="space-y-2">
                                            {[recognition_statement_1, recognition_statement_2, recognition_statement_3]
                                                .filter(Boolean)
                                                .map((statement, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100/80 text-xs text-slate-800">
                                                        <span className="bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                                            ✓
                                                        </span>
                                                        <span>{statement}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Area of Opportunity</p>
                                        <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200/60 text-xs text-amber-950">
                                            {area_of_opportunity || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 3: EVALUATION OF PERFORMANCE */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div
                                onClick={() => toggleSection('evaluation')}
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer border-b border-slate-200 hover:bg-slate-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <FiBarChart2 className="text-purple-600" /> Evaluation of Performance
                                </div>
                                {openSections.evaluation ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                            </div>

                            {openSections.evaluation && (
                                <div className="p-5 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-slate-50 to-purple-50/50 p-4 rounded-xl border border-purple-100 text-center">
                                            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Targeted KPI</span>
                                            <p className="text-lg font-black text-purple-900 mt-1">{kpi || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-purple-50/50 p-4 rounded-xl border border-purple-100 text-center">
                                            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Actual Metric</span>
                                            <p className="text-lg font-black text-purple-900 mt-1">{actual_metric || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
                                            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Goal / Target</span>
                                            <p className="text-lg font-black text-emerald-900 mt-1">{goal_target || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Biggest Rock</span>
                                            <p className="text-xs text-slate-800 leading-relaxed">{biggest_rock || 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Behavioral Root Cause</span>
                                            <p className="text-xs text-slate-800 leading-relaxed">{behavioral_root_cause || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 4: ACTION PLAN & SMART GOAL */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div
                                onClick={() => toggleSection('actionPlan')}
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer border-b border-slate-200 hover:bg-slate-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <FiTarget className="text-purple-600" /> Action Plan & SMART Goal
                                </div>
                                {openSections.actionPlan ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                            </div>

                            {openSections.actionPlan && (
                                <div className="p-5 space-y-4">
                                    <div className="bg-purple-50/60 border border-purple-100 p-4 rounded-xl space-y-1">
                                        <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">SMART Goal (XYZ Method)</span>
                                        <p className="text-xs font-semibold text-purple-950 leading-relaxed">{smart_goal || 'N/A'}</p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-200 pb-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Task Name</span>
                                                <p className="text-xs font-bold text-slate-800">{task_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Due Date</span>
                                                <p className="text-xs font-medium text-slate-800">
                                                    {due_date ? new Date(due_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Frequency</span>
                                                <p className="text-xs font-medium text-slate-800">{frequency || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Task Description</span>
                                            <p className="text-xs text-slate-700 leading-relaxed mt-1">{task_description || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 5: COMMITMENTS & FOLLOW-UP */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div
                                onClick={() => toggleSection('commitment')}
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer border-b border-slate-200 hover:bg-slate-100/80 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                    <FiCalendar className="text-emerald-600" /> Commitments & Follow-Up
                                </div>
                                {openSections.commitment ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                            </div>

                            {openSections.commitment && (
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                                            <span className="text-xs font-bold text-purple-700 uppercase">Employee's Commitment (WWW)</span>
                                            <p className="text-xs text-slate-800 leading-relaxed mt-1">{employee_commitment || 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                                            <span className="text-xs font-bold text-purple-700 uppercase">Leader's Commitment (WWW)</span>
                                            <p className="text-xs text-slate-800 leading-relaxed mt-1">{leader_commitment || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 pt-3">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Next Follow-Up Date</span>
                                            <p className="text-xs font-bold text-purple-900 mt-0.5">
                                                {next_follow_up_date ? new Date(next_follow_up_date).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'N/A'}
                                            </p>
                                        </div>
                                        {follow_up_notes && (
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Follow-Up Notes</span>
                                                <p className="text-xs text-slate-700 leading-relaxed mt-0.5">{follow_up_notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}