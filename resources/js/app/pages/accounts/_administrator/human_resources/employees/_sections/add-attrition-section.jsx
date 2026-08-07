import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import Radio from '@/app/_components/radio'
import Select from '@/app/_components/select'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiUserMinus, FiUser, FiMail, FiBriefcase, FiMapPin, FiLayers, FiCalendar, FiUserCheck } from 'react-icons/fi'

const terminationReasons = [
    "Resignation - Personal",
    "Resignation - Better Opportunity",
    "Resignation - Career Change",
    "Resignation - Medical",
    "Resignation - Education",
    "Resignation - Relocation",
    "Resignation - Compensation",
    "Resignation - Management",
    "Resignation - Culture",
    "Resignation - Schedule",
    "Resignation - Job Misfit",
    "Termination - Attendance",
    "Termination - Behavior",
    "Termination - Performance",
    "Termination - Company Policy Violation",
    "Termination - Training Fall-Out (Language Training)",
    "Termination - Training Fall-Out (Process Training)",
    "Termination - Training Fall-Out (On-The-Job Training)",
    "Termination - Non-Regularization",
    "Termination - Absconding/ AWOL Redundancy",
    "End of Contract (Fixed Term)"
];

export default function AddAttritionSection({ props_data }) {
    const [open, setOpen] = useState(false)

    // Initialize React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    function close_modal() {
        setOpen(false)
        reset() // Optional: clears the form when the modal closes
    }

    // Form submission handler
    const onSubmit = (data) => {
        console.log("Form Data Submitted:", data)
        // Add your API submission logic here

        close_modal() // Close modal after successful submission
    }

    return (
        <div className="w-full">
            {/* Styled Interactive Button */}
            <button
                onClick={() => setOpen(true)}
                className='flex items-center gap-2'
            >
                <FiUserMinus
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-200 group-hover:scale-110"
                />
                ADD TO ATTRITION
            </button>

            <Modal
                isOpen={open}
                onClose={() => close_modal()}
                title={props_data?.user?.name}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex-col flex min-h-96 items-center justify-between'
                >
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className='flex items-center justify-center gap-2'>
                                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                    Employee Details
                                </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-gray-500">
                                #{props_data?.employee_id || 'N/A'}
                            </span>
                        </div>

                        {/* Fullname */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiUser className="w-4 h-4 text-purple-600" /> Fullname
                            </span>
                            <span className="font-semibold text-gray-900 text-right truncate">
                                {props_data?.user?.name || props_data?.personal_information?.first_name || 'N/A'}
                            </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiMail className="w-4 h-4 text-purple-600" /> Email
                            </span>
                            <span className="text-gray-900 font-medium truncate max-w-[180px] text-right" title={props_data?.user?.email || props_data?.eogs_email}>
                                {props_data?.user?.email || props_data?.eogs_email || 'N/A'}
                            </span>
                        </div>

                        {/* Department */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiLayers className="w-4 h-4 text-purple-600" /> Department
                            </span>
                            <span className="text-gray-900 font-medium text-right truncate">
                                {props_data?.department?.name || 'N/A'}
                            </span>
                        </div>

                        {/* Account */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiBriefcase className="w-4 h-4 text-purple-600" /> Account
                            </span>
                            <span className="text-gray-900 font-medium text-right truncate">
                                {props_data?.account?.name || props_data?.account || 'N/A'}
                            </span>
                        </div>

                        {/* Site */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiMapPin className="w-4 h-4 text-purple-600" /> Site
                            </span>
                            <span className="text-gray-900 font-medium text-right truncate">
                                {props_data?.site?.location?.name || 'N/A'}
                            </span>
                        </div>

                        {/* Supervisor */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiUserCheck className="w-4 h-4 text-purple-600" /> Supervisor
                            </span>
                            <span className="text-gray-900 font-medium text-right truncate">
                                {`${props_data?.reporting_to?.leader?.user?.personal_information?.first_name || ''} ${props_data?.reporting_to?.leader?.user?.personal_information?.last_name || ''}`.trim() || 'N/A'}
                            </span>
                        </div>

                        {/* Hired Date */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-500 flex items-center gap-1.5 shrink-0">
                                <FiCalendar className="w-4 h-4 text-purple-600" /> Hired Date
                            </span>
                            <span className="text-gray-900 font-medium text-right truncate">
                                {props_data?.started_at || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-3 m-3 px-2 w-full mt-6'>

                        {/* Separation Date Input with Error */}
                        <div className="flex flex-col">
                            <Input
                                type="date"
                                label="Separation Date"
                                {...register("separation_date", { required: "Separation date is required" })}
                            />
                            {errors.separation_date && (
                                <span className="text-xs text-red-500 mt-1">{errors.separation_date.message}</span>
                            )}
                        </div>

                        {/* Termination Reason Select with Error */}
                        <div className="flex flex-col">
                            <Select
                                label="Reason for separation"
                                options={terminationReasons.map((reason) => ({
                                    label: reason,
                                    value: reason
                                }))}
                                {...register("termination_reason", { required: "Please select a reason for separation" })}
                            />
                            {errors.termination_reason && (
                                <span className="text-xs text-red-500 mt-1">{errors.termination_reason.message}</span>
                            )}
                        </div>

                        {/* Rehire Radio Group with Error */}
                        <div className="flex flex-col">
                            <div>Eligible for rehire</div>
                            <div className='flex gap-3 mt-1'>
                                <Radio
                                    label="Yes"
                                    value="Yes"
                                    {...register("is_rehire", { required: "Please confirm rehire eligibility" })}
                                />
                                <Radio
                                    label="No"
                                    value="No"
                                    {...register("is_rehire", { required: "Please confirm rehire eligibility" })}
                                />
                            </div>
                            {errors.is_rehire && (
                                <span className="text-xs text-red-500 mt-1">{errors.is_rehire.message}</span>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className='w-full mt-4'
                    >
                        SUBMIT
                    </Button>
                </form>
            </Modal>
        </div>
    )
}