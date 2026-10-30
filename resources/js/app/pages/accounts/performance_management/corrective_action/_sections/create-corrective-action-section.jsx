import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FcCustomerSupport } from 'react-icons/fc'
import {
    FiUser,
    FiAlertTriangle,
    FiFolder,
    FiSend,
    FiCheckCircle,
    FiCpu,
    FiInfo,
    FiShield,
    FiClock,
    FiList,
    FiCheckSquare,
    FiSquare
} from 'react-icons/fi'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import InputSearch from '@/app/_components/input-search'
import Modal from '@/app/_components/modal'
import { search_employee_thunk } from '@/app/redux/employee-relation-thunk'
import { create_corrective_action_service, get_ai_cocd_service } from '@/app/services/human-resources-service'
import { setAlert } from '@/app/redux/app-slice'

// Penalty rank order to compute the highest applicable penalty
const PENALTY_WEIGHT = {
    'Verbal Warning (VW)': 1,
    'Verbal Warning': 1,
    'Written Warning (WW)': 2,
    'Written Warning': 2,
    'Final Written Warning (FWW)': 3,
    'Final Written Warning': 3,
    'Termination (T)': 4,
    'Termination': 4,
}

export default function CreateCorrectiveActionSection() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [isDetectingCocd, setIsDetectingCocd] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState(null)

    // Multi-select indices state
    const [selectedOffenseIndices, setSelectedOffenseIndices] = useState([])

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
            date_of_occurrence: '',
            description_of_infraction: '',
            evidence_drive_url: '',
            supervisor_user_id: '',
            manager_user_id: '',
            code_of_discipline_section: {},
            selected_offenses: [],
        },
    })

    const watchedValues = watch()
    const isEmployeeSelected = Boolean(watchedValues.employee_id)

    const selectedDepartmentName = useMemo(() => {
        if (!watchedValues.department_id || !data?.departments) return '—'
        const dept = data.departments.find((d) => String(d.id) === String(watchedValues.department_id))
        return dept ? dept.name : '—'
    }, [watchedValues.department_id, data?.departments])

    const employeeOptions = useMemo(() => {
        return (
            employee?.data?.map((res) => ({
                ...res,
                label: res.name,
                value: res,
            })) || []
        )
    }, [employee?.data])

    // Normalized list of detected offenses
    const detectedOffensesList = useMemo(() => {
        if (!aiAnalysis) return []

        const payload = aiAnalysis.data ? aiAnalysis.data : aiAnalysis

        if (Array.isArray(payload.offenses) && payload.offenses.length > 0) {
            return payload.offenses
        }

        if (Array.isArray(payload) && payload.length > 0) {
            return payload
        }

        if (payload.section_number) {
            return [payload]
        }

        return []
    }, [aiAnalysis])

    // Get array of all currently checked offenses
    const activeSelectedOffenses = useMemo(() => {
        return selectedOffenseIndices
            .map((idx) => detectedOffensesList[idx])
            .filter(Boolean)
    }, [selectedOffenseIndices, detectedOffensesList])

    // Compute the highest penalty among the selected offenses
    const highestRecommendedPenalty = useMemo(() => {
        if (activeSelectedOffenses.length === 0) return null
        let highest = activeSelectedOffenses[0]?.recommended_penalty || 'N/A'
        let maxWeight = PENALTY_WEIGHT[highest] || 0

        activeSelectedOffenses.forEach((off) => {
            const pen = off?.recommended_penalty
            const weight = PENALTY_WEIGHT[pen] || 0
            if (weight > maxWeight) {
                maxWeight = weight
                highest = pen
            }
        })
        return highest
    }, [activeSelectedOffenses])

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
        setAiAnalysis(null)
        setSelectedOffenseIndices([])
        setOpen(false)
    }

    const mapClassificationToCategory = (groupStr) => {
        if (!groupStr) return ''
        const lower = groupStr.toLowerCase()
        if (lower.includes('attendance')) return 'Attendance'
        if (lower.includes('conduct') || lower.includes('integrity') || lower.includes('decorum')) return 'Conduct'
        if (lower.includes('performance') || lower.includes('duties')) return 'Performance of Duties'
        if (lower.includes('quality')) return 'Quality'
        if (lower.includes('technology') || lower.includes('safety') || lower.includes('security') || lower.includes('health') || lower.includes('order')) {
            return 'Technology, safety, Security, Health & Order'
        }
        return ''
    }

    // Toggle Checkbox selection
    const handleToggleOffense = (index) => {
        const nextIndices = selectedOffenseIndices.includes(index)
            ? selectedOffenseIndices.filter((i) => i !== index)
            : [...selectedOffenseIndices, index]

        // Ensure at least one offense remains selected if items exist
        if (nextIndices.length === 0 && detectedOffensesList.length > 0) {
            return
        }

        setSelectedOffenseIndices(nextIndices)

        const selectedItems = nextIndices.map((i) => detectedOffensesList[i]).filter(Boolean)
        setValue('selected_offenses', selectedItems)
        setValue('code_of_discipline_section', {
            offenses: selectedItems,
            primary: selectedItems[0] || null,
        })

        // Pick category from primary/first selected infraction
        if (selectedItems[0]) {
            const mappedCat = mapClassificationToCategory(selectedItems[0].classification_group)
            if (mappedCat) {
                setValue('category', mappedCat, { shouldValidate: true })
            }
        }
    }

    // Select all detected offenses
    const handleSelectAll = () => {
        const allIndices = detectedOffensesList.map((_, idx) => idx)
        setSelectedOffenseIndices(allIndices)
        setValue('selected_offenses', detectedOffensesList)
        setValue('code_of_discipline_section', {
            offenses: detectedOffensesList,
            primary: detectedOffensesList[0] || null,
        })
    }

    // AI COCD Detection trigger
    const handleRunAiAnalysis = async () => {
        const description = watchedValues.description_of_infraction?.trim()
        if (!description) {
            dispatch(
                setAlert({
                    type: 'warning',
                    title: 'Description Needed',
                    message: 'Please provide a detailed infraction description before running AI classification.',
                    open: true,
                })
            )
            return
        }

        try {
            setIsDetectingCocd(true)
            const response = await get_ai_cocd_service({
                description_of_infraction: description,
            })

            if (response) {
                const unwrapped = response.data ? response.data : response
                setAiAnalysis(unwrapped)

                const offenses = Array.isArray(unwrapped.offenses) && unwrapped.offenses.length > 0
                    ? unwrapped.offenses
                    : (unwrapped.section_number ? [unwrapped] : [])

                // Default: SELECT ALL detected offenses
                const allIndices = offenses.map((_, idx) => idx)
                setSelectedOffenseIndices(allIndices)

                setValue('selected_offenses', offenses)
                setValue('code_of_discipline_section', {
                    offenses: offenses,
                    primary: offenses[0] || null,
                })

                if (offenses[0]?.classification_group) {
                    const detectedCategory = mapClassificationToCategory(offenses[0].classification_group)
                    if (detectedCategory) {
                        setValue('category', detectedCategory, { shouldValidate: true })
                    }
                }

                dispatch(
                    setAlert({
                        type: 'success',
                        title: 'COCD Match Complete',
                        message: `Identified ${offenses.length} policy violation(s). You can toggle any offense below.`,
                        open: true,
                    })
                )
            }
        } catch (error) {
            console.error('Failed to detect COCD section:', error)
            dispatch(
                setAlert({
                    type: 'error',
                    title: 'Analysis Failed',
                    message: error?.response?.data?.message || 'Could not analyze infraction. Please assign manually.',
                    open: true,
                })
            )
        } finally {
            setIsDetectingCocd(false)
        }
    }

    const onSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                user_id: selected?.user_id,
                code_of_discipline_section: {
                    offenses: activeSelectedOffenses,
                    primary: activeSelectedOffenses[0] || null,
                    recommended_penalty: highestRecommendedPenalty,
                },
                selected_offenses: activeSelectedOffenses,
            }
            await create_corrective_action_service(payload)

            dispatch(
                setAlert({
                    type: 'success',
                    title: 'Corrective Action Created!',
                    message: 'The corrective action has been submitted successfully and is ready for review.',
                    open: true,
                })
            )
            reset();
            handleClose()
        } catch (error) {
            console.error('Failed to create corrective action:', error)
            const errorMessage =
                error?.response?.data?.message ||
                (error?.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(' ')
                    : 'Something went wrong while submitting the form. Please try again.')

            dispatch(
                setAlert({
                    type: 'error',
                    title: 'Submission Failed',
                    message: errorMessage,
                    open: true,
                })
            )
        }
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
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* ==================== 1. PERSONNEL DETAILS ==================== */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="p-2.5 bg-indigo-50 rounded-lg">
                                    <FiUser className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                    Personnel Details
                                </h3>
                            </div>
                            {isEmployeeSelected && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
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
                                        setValue('name', val.name)
                                        setValue('employee_id', val.employee_id || '')
                                        setValue('department_id', val.department_id || '')
                                        setValue('first_name', val?.personal_information?.first_name || '')
                                        setValue('last_name', val?.personal_information?.last_name || '')
                                        setValue('eogs_email', val.eogs_email || '')

                                        setValue('supervisor_user_id', val?.er_leader?.user_id || '')
                                        setValue('manager_user_id', val?.department_manager?.user_id || '')
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                CATEGORY <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:border-slate-300"
                            >
                                <option value="" disabled selected>Select Category</option>
                                <option value="Attendance">Attendance</option>
                                <option value="Performance of Duties">Performance of Duties</option>
                                <option value="Quality">Quality</option>
                                <option value="Conduct">Conduct</option>
                                <option value="Technology, safety, Security, Health & Order">
                                    Technology, safety, Security, Health & Order
                                </option>
                            </select>
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

                    {/* ==================== 2. INFRACTION DETAILS ==================== */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="p-2.5 bg-indigo-50 rounded-lg">
                                    <FiAlertTriangle className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                    Infraction Details
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={handleRunAiAnalysis}
                                disabled={isDetectingCocd}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                            >
                                <FiCpu className={`w-3.5 h-3.5 ${isDetectingCocd ? 'animate-spin' : ''}`} />
                                {isDetectingCocd ? 'Analyzing Infraction...' : 'AI Detect Policy'}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                DETAILED DESCRIPTION OF INFRACTION <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('description_of_infraction', { required: 'Description is required' })}
                                rows={4}
                                placeholder="Provide a detailed description of the incident. Include dates, times, and context. Click 'AI Detect Policy' above to auto-assign the discipline section."
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-slate-300 resize-y"
                            />
                        </div>

                        {/* AI Multi-Select Offenses Section */}
                        {detectedOffensesList.length > 0 && (
                            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-200 shadow-xs space-y-5">

                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-indigo-600 text-white rounded-md">
                                            <FiShield className="w-4 h-4" />
                                        </span>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Identified Code of Discipline Infractions
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Check all applicable offenses that will be included in the Notice to Explain ({activeSelectedOffenses.length} selected):
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {detectedOffensesList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={handleSelectAll}
                                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline mr-2"
                                            >
                                                Select All
                                            </button>
                                        )}
                                        {highestRecommendedPenalty && (
                                            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                                                Highest Applicable Penalty: {highestRecommendedPenalty}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Multi-Offense Checkbox Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {detectedOffensesList.map((offense, index) => {
                                        const isSelected = selectedOffenseIndices.includes(index)
                                        return (
                                            <div
                                                key={offense.section_number || index}
                                                onClick={() => handleToggleOffense(index)}
                                                className={`relative flex items-start  gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                                                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                                                    : 'bg-white/60 border-slate-200 opacity-60 hover:opacity-100 hover:bg-white'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleOffense(index)}
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                                            Sec. {offense.section_number}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                                            {offense.recommended_penalty || 'Warning'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                                                        {offense.code_of_discipline_section || offense.title}
                                                    </p>
                                                    <span className="block text-[10px] text-slate-500 font-medium truncate">
                                                        {offense.classification_group}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Summary of All Selected Violations */}
                                {activeSelectedOffenses.length > 0 && (
                                    <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 shadow-2xs">
                                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                            <FiList className="w-3.5 h-3.5 text-indigo-600" /> Selected Offenses Detail ({activeSelectedOffenses.length})
                                        </h5>
                                        <div className="space-y-2">
                                            {activeSelectedOffenses.map((off, idx) => (
                                                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-slate-900">
                                                            Section {off.section_number}: {off.code_of_discipline_section}
                                                        </span>
                                                        <span className="font-semibold text-amber-700 text-[11px]">
                                                            Penalty: {off.recommended_penalty} | Clearing: {off.clearing_period || 'None'}[cite: 2]
                                                        </span>
                                                    </div>
                                                    {off.specific_violation_explanation && (
                                                        <p className="text-slate-600 text-[11px] italic">
                                                            {off.specific_violation_explanation}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Due Process Alert Box */}
                                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                                    <strong className="block font-semibold mb-0.5 text-amber-950">Disciplinary Rule on Multiple Offenses:</strong>
                                    When a single act or incident constitutes two or more infractions, the highest applicable penalty shall be imposed[cite: 25]. The employee must be given five (5) calendar days from receipt of the notice to submit a written explanation[cite: 26].
                                </div>
                            </div>
                        )}


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
                                    {...register('evidence_drive_url', { required: 'Evidence is required' })}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full pl-14 pr-3 h-11 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-slate-300"
                                />
                            </div>
                            <p className="mt-2 text-xs font-medium text-slate-400">
                                Ensure folder permissions allow viewing by HR and Management.
                            </p>
                        </div>
                    </section>

                    {/* ==================== SUBMIT BUTTON ==================== */}
                    <div className="flex justify-end gap-3 pt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            className="px-6 py-3 border border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={activeSelectedOffenses.length == 0}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5"
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