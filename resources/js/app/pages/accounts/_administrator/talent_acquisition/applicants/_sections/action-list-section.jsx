import React, { useState, useEffect, useRef, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
    FileText,
    Folder,
    XCircle,
    Zap,
} from 'lucide-react';

// UI Imports
import Button from '@/app/_components/button';

// Section Imports
import SendJobOfferSection from './send-job-offer-section';
import ResendJobOfferSection from './resend-job-offer-section';
import SendDocumentsSection from './send-documents-section';
import ShowApplicantDetailsSection from './show-applicant-details-section';
import DeleteApplicantSection from './delete-applicant-section';
import TransferApplicant from './transfer-applicant';

export default function ActionListSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});

    // Ref attached to component container to detect outside clicks
    const containerRef = useRef(null);

    // Safe extraction of applicant parameters
    const currentEmployeeId = props_data?.applicant?.account_employee?.employee_id;
    const finalStatus = props_data?.final_status;
    const isPassedOrPooled = finalStatus === 'Passed' || finalStatus === 'Pooled';
    const canSendOffer = String(props_data?.user?.role) === '3' && isPassedOrPooled;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Calculate total count, done count, and incomplete count
    const { totalDocs, doneCount, incompleteCount } = useMemo(() => {
        const acks = props_data?.acknowledgements || [];
        let done = 0;
        let incomplete = 0;

        acks.forEach((item) => {
            if (item?.is_already_acknowledged) {
                done++;
            } else {
                incomplete++;
            }

            if (item?.items && item.items.length > 0) {
                item.items.forEach((subItem) => {
                    if (subItem?.is_already_acknowledged) {
                        done++;
                    } else {
                        incomplete++;
                    }
                });
            }
        });

        return {
            totalDocs: acks.length,
            doneCount: done,
            incompleteCount: incomplete,
        };
    }, [props_data?.acknowledgements]);

    const toggleAccordion = (ackId) => {
        setOpenItems((prev) => ({
            ...prev,
            [ackId]: !prev[ackId],
        }));
    };

    return (
        <div
            ref={containerRef}
            className="pt-3 border-t border-gray-100/80 w-full relative"
        >
            {/* Header / Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-slate-100/70 transition-colors group cursor-pointer select-none"
            >
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Folder className="w-4 h-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <span className="text-xs font-bold text-left text-gray-700 group-hover:text-gray-900 uppercase tracking-wider">
                        Actions & Documents
                    </span>

                    {/* Count Badges */}
                    {totalDocs > 0 && (
                        <div className="flex items-center gap-1 ml-1">
                            {/* Done Count Badge */}
                            <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {doneCount}
                            </span>

                            {/* Incomplete Count Badge */}
                            <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                                <XCircle className="w-2.5 h-2.5" /> {incompleteCount}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 shrink-0">
                    <span>{open ? 'Hide' : 'Show'}</span>
                    <div
                        className={`transition-transform duration-200 ease-in-out ${open ? 'rotate-180' : 'rotate-0'
                            }`}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </button>

            {/* FLOATING OVERLAY DROPDOWN */}
            {open && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl max-h-[380px] overflow-y-auto flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                    {/* 1. Document Acknowledgements List */}
                    {totalDocs > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Assigned Documents
                            </span>
                            {props_data?.acknowledgements?.map((ress) => {
                                const hasSubItems = ress?.items && ress?.items?.length > 0;
                                const isOpen = !!openItems[ress.id];

                                return (
                                    <div
                                        key={ress.id}
                                        className="flex flex-col bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 transition-all"
                                    >
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                                                <span className="font-semibold text-gray-800 text-xs truncate">
                                                    {ress.title}
                                                </span>
                                            </div>

                                            {hasSubItems ? (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleAccordion(ress.id)}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-200/80 px-2 py-0.5 rounded-md transition-all shrink-0 cursor-pointer"
                                                >
                                                    <span>
                                                        {ress.items.length} Sub-policies
                                                    </span>
                                                    <div
                                                        className={`transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'
                                                            }`}
                                                    >
                                                        <ChevronDown className="w-3 h-3" />
                                                    </div>
                                                </button>
                                            ) : (
                                                <StatusBadge
                                                    isDone={ress?.is_already_acknowledged}
                                                    size="sm"
                                                />
                                            )}
                                        </div>

                                        {/* Inner Sub-items Accordion */}
                                        {hasSubItems && isOpen && (
                                            <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-col gap-1.5 pl-1 animate-in slide-in-from-top-2 fade-in duration-200">
                                                {ress.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between text-xs py-0.5 hover:bg-slate-100/50 rounded-md px-1 transition-colors"
                                                    >
                                                        <span className="text-gray-600 font-medium flex items-center gap-1.5 truncate pr-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                                                            <span className="truncate">
                                                                {item?.title}
                                                            </span>
                                                        </span>
                                                        <StatusBadge
                                                            isDone={item?.is_already_acknowledged}
                                                            size="sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 2. Workflow Actions Section */}
                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 text-purple-600" /> Workflow Actions
                        </span>

                        {/* Workflow Action Buttons */}
                        <div className="flex flex-col gap-2 w-full">
                            {/* Send Job Offer */}
                            {canSendOffer && <SendJobOfferSection data={props_data} />}

                            {/* Resend Job Offer */}
                            {finalStatus === 'Declined Job Offer' && (
                                <ResendJobOfferSection data={props_data} />
                            )}

                            {/* Accepted Job Offer Documents */}
                            {finalStatus === 'Accepted Job Offer' && (
                                <>
                                    <SendDocumentsSection data={props_data} />
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={() =>
                                            window.open(
                                                `/accounts/my_documents/${props_data?.user_id}/contract`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        CONTRACT
                                    </Button>
                                </>
                            )}

                            {/* Sent Documents Actions */}
                            {finalStatus === 'Sent Documents' && (
                                <>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={() =>
                                            window.open(
                                                `/accounts/my_documents/${props_data?.user_id}/contract`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        CONTRACT
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={() =>
                                            window.open(
                                                `/accounts/my_documents/${props_data?.user_id}/onboarding`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        ONBOARDING
                                    </Button>
                                </>
                            )}

                            {/* Internal Movement / ECF */}
                            {finalStatus === 'Passed' && currentEmployeeId && (
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() =>
                                        router.visit(
                                            `/accounts/administrator/human_resources/employee_movements/assessment_process/promotions?employee_id=${currentEmployeeId}`
                                        )
                                    }
                                >
                                    CREATE ECF
                                </Button>
                            )}
                        </div>

                        {/* Common Modals / View / Delete Row */}
                        <div className="flex items-center flex-col justify-between gap-2 pt-2 border-t border-slate-100 w-full">
                            <TransferApplicant data={props_data} />
                            <ShowApplicantDetailsSection data={props_data} />
                            <DeleteApplicantSection data={props_data} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Badge Component
function StatusBadge({ isDone, size = 'md' }) {
    if (isDone) {
        return (
            <span
                className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 rounded-lg shrink-0 ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                    }`}
            >
                <CheckCircle2
                    className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}
                />{' '}
                Done
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50/90 border border-amber-200/80 rounded-lg shrink-0 ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                }`}
        >
            <XCircle
                className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}
            />{' '}
            Incomplete
        </span>
    );
}