

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
    FiUserMinus,
    FiUser,
    FiMail,
    FiBriefcase,
    FiMapPin,
    FiLayers,
    FiCalendar,
    FiUserCheck,
    FiLoader
} from 'react-icons/fi'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import Radio from '@/app/_components/radio'
import Select from '@/app/_components/select'
import { setAlert } from '@/app/redux/app-slice'
import { add_attrition_service } from '@/app/services/employee-relation-service'

const TERMINATION_REASONS = [
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
    "Termination - Absconding/ AWOL Redundancy",
    "Termination - Non-Regularization",
    "End of Contract (Fixed Term)"
];

const REASON_OPTIONS = TERMINATION_REASONS.map((reason) => ({
    label: reason,
    value: reason
}));

const EMPLOYMENT_STATUS_OPTIONS = ['Terminated', 'Resigned', 'EOPE', 'AWOL', 'End of Contract', 'Trainee Fallout'].map((status) => ({
    label: status,
    value: status
}));

export default function AddAttritionSection({ props_data }) {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            separation_date: '',
            reason_for_separation: '',
            is_rehire: '',
            employment_status: ''
        }
    })

    const handleCloseModal = () => {
        setOpen(false)
        reset()
    }

    const onSubmit = async (data) => {
        try {
            await add_attrition_service({
                ...props_data,
                ...data
            })
            dispatch(
                setAlert({
                    type: "success",
                    title: "Attrition Created Successfully!",
                    message: "The attrition has been created and is ready for review.",
                    open: true,
                })
            );
            handleCloseModal()
        } catch (error) {
            console.error("Failed to add attrition:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Error",
                    message: error?.response?.data?.message || "Failed to submit attrition. Please try again.",
                    open: true,
                })
            );
        }
    }

    const leaderInfo = props_data?.reporting_to?.leader?.user?.personal_information;
    const supervisorName = leaderInfo?.first_name || leaderInfo?.last_name
        ? `${leaderInfo?.first_name || ''} ${leaderInfo?.last_name || ''}`.trim()
        : 'N/A';

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2 font-medium"
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
                onClose={handleCloseModal}
                title={props_data?.user?.name || "Attrition Form"}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col min-h-96 items-center justify-between"
                >
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center justify-center gap-2">
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
                            <span
                                className="text-gray-900 font-medium truncate max-w-[180px] text-right"
                                title={props_data?.user?.email || props_data?.eogs_email || ''}
                            >
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
                                {typeof props_data?.account === 'object' ? props_data?.account?.name : props_data?.account || 'N/A'}
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
                                {supervisorName}
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

                    <div className="flex flex-col gap-3 px-2 w-full mt-6">


                        {/* Rehire eligibility - FIXED WITH CONTROLLER */}
                        <div className="flex flex-col">
                            <label className={`text-sm font-medium text-gray-700 ${isSubmitting ? 'opacity-50' : ''}`}>
                                Eligible for rehire
                            </label>
                            <Controller
                                name="is_rehire"
                                control={control}
                                rules={{ required: "Please confirm rehire eligibility" }}
                                render={({ field }) => (
                                    <div className="flex gap-4 mt-1.5">
                                        <Radio
                                            label="Yes"
                                            value="Yes"
                                            checked={field.value === "Yes"}
                                            onChange={() => field.onChange("Yes")}
                                            disabled={isSubmitting}
                                        />
                                        <Radio
                                            label="No"
                                            value="No"
                                            checked={field.value === "No"}
                                            onChange={() => field.onChange("No")}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                )}
                            />
                            {errors.is_rehire && (
                                <span className="text-xs text-red-500 mt-1">{errors.is_rehire.message}</span>
                            )}
                        </div>

                        {/* Separation Date */}
                        <div className="flex flex-col">
                            <Input
                                type="date"
                                label="Separation Date"
                                disabled={isSubmitting}
                                {...register("separation_date", { required: "Separation date is required" })}
                            />
                            {errors.separation_date && (
                                <span className="text-xs text-red-500 mt-1">{errors.separation_date.message}</span>
                            )}
                        </div>

                        {/* Reason for separation */}
                        <div className="flex flex-col">
                            <Select
                                label="Reason for separation"
                                disabled={isSubmitting}
                                options={REASON_OPTIONS}
                                {...register("reason_for_separation", { required: "Please select a reason for separation" })}
                            />
                            {errors.reason_for_separation && (
                                <span className="text-xs text-red-500 mt-1">{errors.reason_for_separation.message}</span>
                            )}
                        </div>

                        {/* Employment Status */}
                        <div className="flex flex-col">
                            <Select
                                label="Employment Status"
                                disabled={isSubmitting}
                                options={EMPLOYMENT_STATUS_OPTIONS}
                                {...register("employment_status", { required: "Please select an employment status" })}
                            />
                            {errors.employment_status && (
                                <span className="text-xs text-red-500 mt-1">{errors.employment_status.message}</span>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6 flex justify-center items-center gap-2"
                        loading={isSubmitting}
                    >
                        SUBMIT
                    </Button>
                </form>
            </Modal>
        </div>
    )
}