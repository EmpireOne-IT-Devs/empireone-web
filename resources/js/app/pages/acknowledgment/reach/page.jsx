'use client'

import { Link } from '@inertiajs/react';
import React, { useMemo } from 'react'
import {
    FiCheckCircle,
    FiAlertCircle,
    FiArrowLeft,
    FiFileText,
    FiCalendar,
    FiShield,
    FiCheckSquare,
} from 'react-icons/fi'

export default function Page() {
    // Safely parse URL search parameters on the client side
    const queryParams = useMemo(() => {
        if (typeof window === 'undefined') return { isAcknowledged: false, reachId: null }
        const params = new URLSearchParams(window.location.search)
        return {
            isAcknowledged: params.get('acknowledged') === 'true',
            reachId: params.get('id'),
        }
    }, [])

    const { isAcknowledged, reachId } = queryParams

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
                {/* HERO BANNER SECTION */}
                {isAcknowledged ? (
                    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-slate-900 p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                                <FiCheckCircle className="w-9 h-9 text-purple-300" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-200 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30 mb-2">
                                Confirmation Complete
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Session Acknowledged!
                            </h1>
                            <p className="text-sm text-purple-100/90 mt-2 max-w-md leading-relaxed">
                                Thank you for reviewing your REACH Coaching Session. Your acknowledgment has been recorded successfully.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-center text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                                <FiAlertCircle className="w-9 h-9 text-amber-400" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">REACH Coaching Session</h1>
                            <p className="text-sm text-slate-300 mt-2">
                                Session details record view.
                            </p>
                        </div>
                    </div>
                )}

                {/* DETAILS SUMMARY CARD */}
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <FiFileText className="text-sky-600" /> Session Summary
                            </span>
                            {reachId && (
                                <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-md">
                                    Ref ID: #{reachId}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="font-semibold text-slate-400 uppercase text-[10px]">Acknowledgment Status</p>
                                <p className="font-bold text-purple-600 text-sm mt-0.5 flex items-center gap-1">
                                    <FiCheckSquare className="w-4 h-4" />
                                    {isAcknowledged ? 'ACKNOWLEDGED' : 'PENDING REVIEW'}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-400 uppercase text-[10px]">Date Processed</p>
                                <p className="font-medium text-slate-800 text-sm mt-0.5 flex items-center gap-1">
                                    <FiCalendar className="w-4 h-4 text-slate-400" />
                                    {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href="/auth/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-lg transition-all"
                        >
                            <FiArrowLeft className="w-4 h-4" /> Go to login
                        </Link>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-4 text-center text-[11px] text-slate-400">
                    Need help or have questions regarding this session? Contact your direct supervisor or HR department.
                </div>
            </div>
        </div>
    )
}