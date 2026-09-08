import Modal from '@/app/_components/modal'
import React, { useState } from 'react'
import { FcViewDetails } from 'react-icons/fc'

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Accepted: 'bg-green-100 text-green-800 border-green-200',
        Declined: 'bg-red-100 text-red-800 border-red-200',
        Cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.Pending}`}>
            {status || 'Pending'}
        </span>
    );
};

export default function ChangeFormDetailsSection({ props_data = {} }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="View Change Form Details"
            >
                <FcViewDetails className='text-2xl' />
            </button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width='max-w-4xl'
            >
                <div className="w-full mx-auto space-y-6 text-sm text-gray-700">

                    {/* Header Section */}
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Change Form Details</h2>
                            <p className="text-gray-500 mt-1">Employee ID: {props_data?.employee_id} | Effective: {props_data?.effective_date}</p>
                        </div>
                        <StatusBadge status={props_data?.status} />
                    </div>

                    {/* Change Type Flags */}
                    <div className="flex flex-wrap gap-2">
                        {props_data?.is_account_transfer == 1 && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">Account Transfer</span>}
                        {props_data?.is_department_transfer == 1 && <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-medium">Department Transfer</span>}
                        {props_data?.is_position_and_title == 1 && <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-medium">Title/Position Change</span>}
                        {props_data?.is_tiering == 1 && <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-medium">Tiering Change</span>}
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {/* Current/From Column */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span> Current Details
                            </h3>
                            <div className="space-y-2">
                                <p><span className="text-gray-500 w-24 inline-block">Department:</span> {props_data?.info_department_from || '-'}</p>
                                <p><span className="text-gray-500 w-24 inline-block">Account:</span> {props_data?.info_account_from || '-'}</p>
                                <p><span className="text-gray-500 w-24 inline-block">Position:</span> {props_data?.info_position_from || '-'} ({props_data?.info_position_level_from || '-'})</p>
                                <p><span className="text-gray-500 w-24 inline-block">Reports To:</span> {props_data?.info_reporting_from || '-'}</p>
                            </div>
                            <div className="pt-2 border-t space-y-2">
                                <p><span className="text-gray-500 w-24 inline-block">Basic Pay:</span> {props_data?.info_basic_pay_from ? `₱${props_data.info_basic_pay_from}` : '-'}</p>
                                <p><span className="text-gray-500 w-24 inline-block">Allowances:</span> {props_data?.info_allowances_from ? `₱${props_data.info_allowances_from}` : '-'}</p>
                            </div>
                        </div>

                        {/* Proposed/To Column */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-700 flex items-center gap-2 border-b pb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Proposed Changes
                            </h3>
                            <div className="space-y-2">
                                <p><span className="text-gray-500 w-24 inline-block">Department:</span> <span className="font-medium text-gray-900">{props_data?.department_to?.name || '-'}</span></p>
                                <p><span className="text-gray-500 w-24 inline-block">Account:</span> <span className="font-medium text-gray-900">{props_data?.account_to?.name || '-'}</span></p>
                                <p><span className="text-gray-500 w-24 inline-block">Position:</span> <span className="font-medium text-gray-900">{props_data?.info_position_to || '-'} ({props_data?.info_position_level_to || '-'})</span></p>
                                <p><span className="text-gray-500 w-24 inline-block">Reports To:</span> <span className="font-medium text-gray-900">{props_data?.info_reporting_to || '-'}</span></p>
                            </div>
                            <div className="pt-2 border-t space-y-2">
                                <p><span className="text-gray-500 w-24 inline-block">Basic Pay:</span> <span className="font-medium text-green-600">{props_data?.info_basic_pay_to ? `₱${props_data.info_basic_pay_to}` : '-'}</span></p>
                                <p><span className="text-gray-500 w-24 inline-block">Allowances:</span> <span className="font-medium text-green-600">{props_data?.info_allowances_to ? `₱${props_data.info_allowances_to}` : '-'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Reason & Notes Section */}
                    <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Reason for Change</h4>
                            <p className="text-gray-600">{props_data?.reason_for_change || "N/A"}</p>
                        </div>
                        {props_data?.notes && (
                            <div className="pt-3 border-t">
                                <h4 className="font-semibold text-gray-900 mb-1">Additional Notes</h4>
                                <p className="text-gray-600">{props_data.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    )
}