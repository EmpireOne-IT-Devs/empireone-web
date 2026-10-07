import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import {
    LuCheckCheck,
    LuChevronDown,
    LuFileText,
    LuFolder,
    LuX,
    LuZap,
} from 'react-icons/lu';

// UI Imports
import Button from '@/app/_components/button';

// Section Imports
import SendJobOfferSection from './send-job-offer-section';
import ResendJobOfferSection from './resend-job-offer-section';
import SendDocumentsSection from './send-documents-section';
import ShowApplicantDetailsSection from './show-applicant-details-section';
import DeleteApplicantSection from './delete-applicant-section';
import TransferApplicant from './transfer-applicant';
import { useSelector } from 'react-redux';
import { FcMenu } from 'react-icons/fc';

export default function ActionListSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const { data } = useSelector(
        (store) => store.app,
    );

    // Ref attached to component container to detect outside clicks
    const containerRef = useRef(null);

    // Safe extraction of applicant parameters
    const currentEmployeeId =
        props_data?.applicant?.account_employee?.employee_id;
    const isPassedOrPooled =
        props_data?.final_status == 'Passed' || props_data?.final_status == 'Pooled';
    const canSendOffer =
        String(props_data?.user?.role) == '3' && isPassedOrPooled;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
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
        const acks = props_data?.acknowledgements || props_data?.acknowledgements || [];
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
    }, [props_data?.acknowledgements, props_data?.acknowledgements]);

    const toggleAccordion = (employeeId, ackId) => {
        const key = `${employeeId}-${ackId}`;
        setOpenItems((prev) => ({
            ...prev,
            [key]: !prev[key],
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
                className={`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${open ? 'bg-black/10' : ''}
                `}  >
                <div className="flex items-center gap-1.5 flex-wrap">
                    <FcMenu size={20} />
                </div>

            </button>

            <div
                className={`
        absolute right-0 top-full mt-1 min-w-[200px] py-1.5 bg-white rounded-md z-[9999]
        shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
        transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
        ${open
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
    `}
            >

                {/* Send Job Offer */}
                <div className='flex flex-col w-full gap-2 pt-3'>
                    {canSendOffer && (
                        <div className="w-full hover:bg-black/[0.04] px-3 active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                            <SendJobOfferSection data={props_data} />
                        </div>
                    )}

                    {/* Resend Job Offer */}
                    {props_data?.final_status === 'Declined Job Offer' && (
                        <div className="w-full hover:bg-black/[0.04] px-3 active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                            <ResendJobOfferSection data={props_data} />
                        </div>
                    )}

                    {/* Send Documents */}
                    {props_data?.final_status === 'Accepted Job Offer' && (
                        <div className="w-full hover:bg-black/[0.04] px-3 active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                            <SendDocumentsSection data={props_data} />
                        </div>
                    )}
                    {props_data?.job_offer && (
                        <div className="w-full hover:bg-black/[0.04] px-3 active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                            <Button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        `/accounts/administrator/job_offers/${props_data?.job_offer?.id}`,
                                        '_blank'
                                    )
                                }
                            >
                                <div className='text-white'>
                                    JOB OFFER
                                </div>
                            </Button>
                        </div>
                    )}


                    {/* Contract & Onboarding */}
                    {props_data?.contract_type && props_data?.final_status === 'Sent Documents' && (
                        <>
                            <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] px-3 transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        window.open(
                                            `/accounts/my_documents/${props_data?.user_id}/contract`,
                                            '_blank'
                                        )
                                    }
                                >
                                    CONTRACT
                                </Button>
                            </div>
                            <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] px-3 transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        window.open(
                                            `/accounts/my_documents/${props_data?.user_id}/onboarding`,
                                            '_blank'
                                        )
                                    }
                                >
                                    ONBOARDING
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Create ECF */}
                    {props_data?.final_status === 'Passed' && currentEmployeeId && (
                        <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] px-3 transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                            <Button
                                type="button"
                                onClick={() =>
                                    router.visit(
                                        `/accounts/administrator/human_resources/employee_movements/promotions?employee_id=${currentEmployeeId}&location_id=${data?.user?.account_employee?.location_id}`
                                    )
                                }
                            >
                                CREATE ECF
                            </Button>
                        </div>
                    )}
                </div>

                {/* View Job Offer */}



                {/* Transfer, Details, and Delete Modals / Actions */}
                <div className="border-t border-gray-100 flex flex-col gap-2 mt-1 pt-1 p-3">
                    <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                        <TransferApplicant data={props_data} />
                    </div>
                    <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800">
                        <ShowApplicantDetailsSection data={props_data} />
                    </div>
                    <div className="w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150 [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-red-600">
                        <DeleteApplicantSection data={props_data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
