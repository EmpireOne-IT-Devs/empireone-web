import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FcCustomerSupport } from 'react-icons/fc'
import { FiUser, FiAlertTriangle, FiFolder, FiSend, FiCheckCircle } from 'react-icons/fi'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import InputSearch from '@/app/_components/input-search'
import Modal from '@/app/_components/modal'
import { search_employee_thunk } from '@/app/redux/employee-relation-thunk'

export default function CreateCorrectiveActionSection() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null)

    const searchTimeoutRef = useRef(null)

    const { data } = useSelector((store) => store.app)
    const { employee } = useSelector((store) => store.human_resources)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            employee_id: '',
            department_id: '',
            eogs_email: '',
            first_name: '',
            last_name: '',
            supervisor_id: '',
            supervisor_email: '',
            supervisor_first_name: '',
            supervisor_last_name: '',
            manager_id: '',
            manager_email: '',
            manager_first_name: '',
            manager_last_name: '',
            category: '',
            code_of_discipline_section: '',
            date_of_occurrence: '',
            description_of_infraction: '',
            evidence_drive_url: '',
        },
    })

    // Watch form fields
    const watchedValues = watch()
    const isEmployeeSelected = Boolean(watchedValues.employee_id)

    // Find selected department name for display
    const selectedDepartmentName = useMemo(() => {
        if (!watchedValues.department_id || !data?.departments) return '—'
        const dept = data.departments.find((d) => String(d.id) === String(watchedValues.department_id))
        return dept ? dept.name : '—'
    }, [watchedValues.department_id, data?.departments])

    // Memoize employee options for search select
    const employeeOptions = useMemo(() => {
        return (
            employee?.data?.map((res) => ({
                ...res,
                label: res.name,
                value: res,
            })) || []
        )
    }, [employee?.data])

    // Debounced employee search handler
    const handleSearchEmployee = useCallback(
        (value) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
            searchTimeoutRef.current = setTimeout(() => {
                dispatch(search_employee_thunk(value))
            }, 500)
        },
        [dispatch]
    )

    const handleClose = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        reset()
        setSelected(null)
        setOpen(false)
    }

    const onSubmit = async (formData) => {
        console.log('Corrective Action Form Data:', formData)
        handleClose()
    }

    return (
        <>
            <Button
                className="py-3 transition-transform active:scale-95"
                variant="secondary"
                onClick={() => setOpen(true)}
            >
                <FcCustomerSupport size={20} /> CORRECTIVE ACTION FORM
            </Button>

            <Modal
                width="max-w-7xl"
                isOpen={open}
                onClose={handleClose}
                title="Create Corrective Action Form"
            >
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>

                    {/* ==================== 1. PERSONNEL DETAILS ==================== */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <FiUser className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                    Personnel Details
                                </h3>
                            </div>
                            {isEmployeeSelected && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full animate-fade-in">
                                    <FiCheckCircle className="w-3.5 h-3.5" /> Auto-filled
                                </span>
                            )}
                        </div>

                        {/* Search Field */}
                        <div className="max-w-md">
                            <InputSearch
                                label="SEARCH EMPLOYEE"
                                name="name"
                                className="w-full"
                                options={employeeOptions}
                                value={watchedValues.name}
                                onChange={(val) => {
                                    setValue('name', val)
                                    handleSearchEmployee(val)
                                }}
                                onSelect={(val) => {
                                    setSelected(val)
                                    if (val) {
                                        console.log('vallll',val)
                                        setValue('name', val.name)
                                        setValue('employee_id', val.employee_id || '')
                                        setValue('department_id', val.department_id || '')
                                        setValue('first_name', val?.personal_information?.first_name || '')
                                        setValue('last_name', val?.personal_information?.last_name || '')
                                        setValue('eogs_email', val.eogs_email || '')

                                        setValue('supervisor_id', val?.er_leader?.employee?.employee_id || '')
                                        setValue('supervisor_email', val?.er_leader?.employee?.eogs_email || '')
                                        setValue('supervisor_first_name', val?.er_leader?.employee?.personal_information?.first_name || '')
                                        setValue('supervisor_last_name', val?.er_leader?.employee?.personal_information?.last_name || '')

                                        setValue('manager_id', val?.department_manager?.second_level_manager?.employee_id || '')
                                        setValue('manager_email', val?.department_manager?.second_level_manager?.eogs_email || '')
                                        setValue('manager_first_name', val?.department_manager?.second_level_manager?.personal_information?.first_name || '')
                                        setValue('manager_last_name', val?.department_manager?.second_level_manager?.personal_information?.last_name || '')
                                    }
                                }}
                                error={!watchedValues.name}
                            />
                        </div>

                        {/* Read-only Employee Info Card */}
                        <div className={`p-4 rounded-xl space-y-4 transition-all duration-200 border ${isEmployeeSelected
                                ? 'bg-indigo-50/30 border-indigo-200/80'
                                : 'bg-slate-50 border-slate-200/80 border-dashed'
                            }`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        EMPLOYEE ID
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.employee_id || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        ACCOUNT / DEPARTMENT
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {selectedDepartmentName}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        EMPLOYEE EMAIL
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {watchedValues.eogs_email || '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/60 pt-3">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        FIRST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.first_name || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        LAST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.last_name || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Immediate Supervisor Card */}
                        <div className={`p-4 rounded-xl space-y-3 transition-all duration-200 border ${isEmployeeSelected
                                ? 'bg-indigo-50/30 border-indigo-200/80'
                                : 'bg-slate-50 border-slate-200/80 border-dashed'
                            }`}>
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
                                IMMEDIATE SUPERVISOR
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        SUPERVISOR ID
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.supervisor_id || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        SUPERVISOR EMAIL
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {watchedValues.supervisor_email || '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/60 pt-3">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        SUPERVISOR FIRST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.supervisor_first_name || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        SUPERVISOR LAST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.supervisor_last_name || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Next Level Manager Card */}
                        <div className={`p-4 rounded-xl space-y-3 transition-all duration-200 border ${isEmployeeSelected
                                ? 'bg-indigo-50/30 border-indigo-200/80'
                                : 'bg-slate-50 border-slate-200/80 border-dashed'
                            }`}>
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
                                NEXT LEVEL MANAGER
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        MANAGER ID
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.manager_id || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        MANAGER EMAIL
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {watchedValues.manager_email || '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/60 pt-3">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        MANAGER FIRST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.manager_first_name || '—'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        MANAGER LAST NAME
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {watchedValues.manager_last_name || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================== 2. INFRACTION DETAILS ==================== */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3 text-indigo-600 border-b border-slate-100 pb-4">
                            <div className="p-2.5 bg-indigo-50 rounded-lg">
                                <FiAlertTriangle className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                Infraction Details
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    CATEGORY <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:border-slate-300"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Attendance">Attendance</option>
                                    <option value="Performance">Performance</option>
                                    <option value="Behavior/Conduct">Behavior/Conduct</option>
                                    <option value="Security Policy">Security Policy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    CODE OF DISCIPLINE SECTION <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    {...register('code_of_discipline_section', { required: 'Code section is required' })}
                                    placeholder="e.g., 1.1, 1.2, 1.3"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    DATE OF OCCURRENCE <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    {...register('date_of_occurrence', { required: 'Date is required' })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                DETAILED DESCRIPTION OF INFRACTION <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('description_of_infraction', { required: 'Description is required' })}
                                rows={4}
                                placeholder="Provide a detailed description of the behavior or incident that requires corrective action. Include dates, times, and any witnesses if applicable."
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-slate-300 resize-y"
                            />
                        </div>
                    </section>

                    {/* ==================== 3. SUPPORTING DOCUMENTS ==================== */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3 text-indigo-600 border-b border-slate-100 pb-4">
                            <div className="p-2.5 bg-indigo-50 rounded-lg">
                                <FiFolder className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                Supporting Documents
                            </h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                GOOGLE DRIVE LINK FOR EVIDENCE/DOCUMENTS
                            </label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-0 top-0 bottom-0 px-3 bg-slate-100 border-r border-slate-200 text-slate-500 text-xs font-bold flex items-center rounded-l-lg select-none group-focus-within:border-indigo-500 transition-colors">
                                    URL
                                </span>
                                <input
                                    type="url"
                                    {...register('evidence_drive_url')}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full pl-14 pr-3 h-11 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-slate-300"
                                />
                            </div>
                            <p className="mt-2 text-xs font-medium text-slate-400">
                                Ensure the folder permissions allow viewing by HR and Management.
                            </p>
                        </div>
                    </section>

                    {/* ==================== SUBMIT BUTTON ==================== */}
                    <div className="flex justify-center pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
                        >
                            <FiSend className="w-4 h-4" />
                            Submit Corrective Action
                        </Button>
                    </div>

                </form>
            </Modal>
        </>
    )
}