'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FcCustomerSupport } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import Select from '@/app/_components/select'
import TextArea from '@/app/_components/textarea'
import { create_reach_service } from '@/app/services/human-resources-service'
import { setAlert } from '@/app/redux/app-slice'
import store from '@/app/store/store'
import { get_my_team_thunk } from '@/app/redux/department-thunk'
import { get_reach_specific_leader_thunk } from '@/app/redux/employee-relation-thunk'

export default function CreateREACHSection() {
    const [open, setOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const dispatch = useDispatch()
    const { users } = useSelector((store) => store.human_resources)
    const accountsData = useSelector((store) => store.app?.data?.accounts)

    const currentData = selectedUser;

    const personalInfo = currentData?.personal_information
    const accountEmployee = currentData?.account_employee

    const employeeId = accountEmployee?.employee_id ?? ''
    const firstName = personalInfo?.first_name ?? ''
    const lastName = personalInfo?.last_name ?? ''
    const employeeEmail = accountEmployee?.eogs_email || currentData?.email || personalInfo?.contact || ''

    // Account Details
    const accountId = accountEmployee?.account_id ?? currentData?.account_id ?? ''
    const accountName = accountEmployee?.account?.name ?? currentData?.account?.name ?? ''

    // Supervisor details
    const leaderEmp = accountEmployee?.er_leader?.employee
    const supervisorInfo = leaderEmp?.personal_information
    const supervisorId = leaderEmp?.employee_id ?? ''
    const supervisorName = supervisorInfo ? `${supervisorInfo.first_name} ${supervisorInfo.last_name}` : ''
    const supervisorEmail = leaderEmp?.eogs_email ?? ''

    const todayDate = useMemo(() => new Date().toISOString().split('T')[0], [])

    const accountOptions = useMemo(() => {
        return accountsData?.map((res) => ({
            label: res.name,
            value: res.id,
        })) || []
    }, [accountsData])

    // Format employee list for search dropdown
    const userSearchOptions = useMemo(() => {
        return users?.map((u) => {
            const fname = u?.personal_information?.first_name || ''
            const lname = u?.personal_information?.last_name || ''
            const nameLabel = fname || lname ? `${fname} ${lname}` : u?.name || u?.email || `User #${u?.id}`
            return {
                label: nameLabel,
                value: u?.id,
                rawData: u
            }
        }) || []
    }, [users])

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            supervisor_user_id:leaderEmp?.user_id,
            employee_id: employeeId,
            first_name: firstName,
            last_name: lastName,
            employee_email: employeeEmail,
            supervisor_id: supervisorId,
            supervisor_first_name: supervisorInfo?.first_name ?? '',
            supervisor_last_name: supervisorInfo?.last_name ?? '',
            supervisor_email: supervisorEmail,
            date_of_session: todayDate,
            account_id: accountId,
            account: accountId,
        },
    })
    console.log('waaa',leaderEmp?.user_id)

    // Synchronize form values whenever selected user changes
    useEffect(() => {
        setValue('employee_id', employeeId)
        setValue('first_name', firstName)
        setValue('last_name', lastName)
        setValue('employee_email', employeeEmail)
        setValue('supervisor_id', supervisorId)
        setValue('supervisor_first_name', supervisorInfo?.first_name ?? '')
        setValue('supervisor_last_name', supervisorInfo?.last_name ?? '')
        setValue('supervisor_email', supervisorEmail)
        setValue('account_id', accountId)
        setValue('account', accountId)
    }, [selectedUser, setValue, employeeId, firstName, lastName, employeeEmail, supervisorId, supervisorInfo, supervisorEmail, accountId])

    const watchedAccount = useWatch({ control, name: 'account_id' })

    const onSubmit = async (formData) => {
        try {
            await create_reach_service({
                ...formData,
                user_id: currentData?.id || currentData?.user_id,
            })
            await  store.dispatch(get_reach_specific_leader_thunk())
            dispatch(
                setAlert({
                    type: 'success',
                    title: 'Job REACH Created Successfully!',
                    message: 'The job REACH has been created and is ready for review.',
                    open: true,
                })
            )
            setOpen(false)
            setSelectedUser(null)
            reset()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <Button
                className="py-3"
                variant="secondary"
                onClick={() => setOpen(true)}
            >
                <FcCustomerSupport size={20} /> REACH FORM
            </Button>

            <Modal
                width="max-w-7xl"
                isOpen={open}
                onClose={() => {
                    setOpen(false)
                    setSelectedUser(null)
                }}
                title="Create REACH Coaching Session"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4 text-slate-800">
                    {/* Hidden inputs to preserve form submission payload */}
                    <input type="hidden" {...register('employee_id')} />
                    <input type="hidden" {...register('first_name')} />
                    <input type="hidden" {...register('last_name')} />
                    <input type="hidden" {...register('employee_email')} />
                    <input type="hidden" {...register('supervisor_id')} />
                    <input type="hidden" {...register('supervisor_first_name')} />
                    <input type="hidden" {...register('supervisor_last_name')} />
                    <input type="hidden" {...register('supervisor_email')} />
                    <input type="hidden" {...register('account_id')} />

                    {/* Employee Search Field */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <Select
                            label="SEARCH EMPLOYEE"
                            name="search_employee"
                            options={userSearchOptions}
                            value={selectedUser?.id ?? ''}
                            onChange={(val) => {
                                const selectedOption = userSearchOptions.find((opt) => opt.value === val)
                                if (selectedOption) {
                                    setSelectedUser(selectedOption.rawData)
                                }
                            }}
                            className="w-full"
                        />
                    </div>

                    {/* READ-ONLY DISPLAY SECTION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                🪪
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Employee & Supervisor Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                            {/* Employee Info Card */}
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded">
                                    Employee Info
                                </span>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Employee ID</p>
                                        <p className="font-medium text-slate-800">{employeeId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Name</p>
                                        <p className="font-medium text-slate-800">{firstName} {lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                                        <p className="font-medium text-slate-800">{employeeEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Account</p>
                                        <p className="font-medium text-slate-800">
                                            {accountName} {accountId ? `(ID: ${accountId})` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Supervisor Info Card */}
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                    Supervisor Info
                                </span>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Supervisor ID</p>
                                        <p className="font-medium text-slate-800">{supervisorId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Name</p>
                                        <p className="font-medium text-slate-800">{supervisorName}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                                        <p className="font-medium text-slate-800">{supervisorEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <Select
                                label="ACCOUNT *"
                                name="account"
                                disabled
                                options={accountOptions}
                                value={watchedAccount}
                                onChange={(val) => {
                                    setValue('account', val, { shouldValidate: true })
                                    setValue('account_id', val)
                                }}
                                error={errors?.account?.message ?? ''}
                                className="w-full"
                            />
                            <Input
                                label="DATE OF SESSION *"
                                type="date"
                                min={todayDate}
                                {...register('date_of_session', {
                                    required: 'Date of Session is required',
                                })}
                                error={errors.date_of_session?.message}
                            />
                        </div>
                    </div>

                    {/* RECOGNITION & OPPORTUNITY SECTION */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                🏅
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Recognition & Opportunity
                            </h2>
                        </div>

                        <TextArea
                            label="RECOGNITION STATEMENT 1 *"
                            placeholder="Specific strength or recent win..."
                            {...register('recognition_statement_1', {
                                required: 'Recognition statement 1 is required',
                            })}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.recognition_statement_1?.message ?? ''}
                            onChange={(e) => setValue('recognition_statement_1', e.target.value, { shouldValidate: true })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextArea
                                label="RECOGNITION STATEMENT 2 (optional)"
                                placeholder="Additional acknowledgment..."
                                {...register('recognition_statement_2')}
                                className="bg-transparent w-full outline-none text-black"
                                error={errors?.recognition_statement_2?.message ?? ''}
                                onChange={(e) => setValue('recognition_statement_2', e.target.value, { shouldValidate: true })}
                            />

                            <TextArea
                                label="RECOGNITION STATEMENT 3 (optional)"
                                placeholder="Additional acknowledgment..."
                                {...register('recognition_statement_3')}
                                className="bg-transparent w-full outline-none text-black"
                                error={errors?.recognition_statement_3?.message ?? ''}
                                onChange={(e) => setValue('recognition_statement_3', e.target.value, { shouldValidate: true })}
                            />
                        </div>

                        <TextArea
                            label="AREA OF OPPORTUNITY *"
                            placeholder="Main performance gap impacting results..."
                            {...register('area_of_opportunity', {
                                required: 'Area of opportunity is required',
                            })}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.area_of_opportunity?.message ?? ''}
                            onChange={(e) => setValue('area_of_opportunity', e.target.value, { shouldValidate: true })}
                        />
                    </div>

                    {/* EVALUATION OF PERFORMANCE SECTION */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                📊
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Evaluation of Performance
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="KPI *"
                                placeholder="e.g. AHT, CSAT, FCR"
                                {...register('kpi', { required: 'KPI is required' })}
                                error={errors.kpi?.message}
                            />
                            <Input
                                label="ACTUAL METRIC *"
                                placeholder="e.g. 93.5"
                                {...register('actual_metric', { required: 'Actual Metric is required' })}
                                error={errors.actual_metric?.message}
                            />
                            <Input
                                label="GOAL / TARGET *"
                                placeholder="e.g. 95"
                                {...register('goal_target', { required: 'Goal/Target is required' })}
                                error={errors.goal_target?.message}
                            />
                        </div>

                        <TextArea
                            label="BIGGEST ROCK *"
                            placeholder="Behavior impacting this KPI"
                            {...register('biggest_rock', {
                                required: 'Biggest Rock is required',
                            })}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.biggest_rock?.message ?? ''}
                            onChange={(e) => setValue('biggest_rock', e.target.value, { shouldValidate: true })}
                        />

                        <TextArea
                            label="BEHAVIORAL ROOT CAUSE *"
                            placeholder="Why is this behavior happening?"
                            {...register('behavioral_root_cause', {
                                required: 'Behavioral Root Cause is required',
                            })}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.behavioral_root_cause?.message ?? ''}
                            onChange={(e) => setValue('behavioral_root_cause', e.target.value, { shouldValidate: true })}
                        />
                    </div>

                    {/* ACTION PLAN SECTION */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                🎯
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Action Plan
                            </h2>
                        </div>

                        <Input
                            label="SMART GOAL (XYZ METHOD) *"
                            placeholder="X to Y by Date Z"
                            {...register('smart_goal', { required: 'SMART Goal is required' })}
                            error={errors.smart_goal?.message}
                        />

                        <Input
                            label="TASK NAME *"
                            placeholder="Enter specific task name"
                            {...register('task_name', { required: 'Task name is required' })}
                            error={errors.task_name?.message}
                        />

                        <TextArea
                            label="TASK DESCRIPTION *"
                            placeholder="Provide a detailed description of the task..."
                            {...register('task_description', {
                                required: 'Task description is required',
                            })}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.task_description?.message ?? ''}
                            onChange={(e) => setValue('task_description', e.target.value, { shouldValidate: true })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="DUE DATE *"
                                type="date"
                                {...register('due_date', { required: 'Due date is required' })}
                                error={errors.due_date?.message}
                            />
                            <Input
                                label="FREQUENCY *"
                                placeholder="e.g. Daily, Weekly"
                                {...register('frequency', { required: 'Frequency is required' })}
                                error={errors.frequency?.message}
                            />
                        </div>
                    </div>

                    {/* COMMITMENT SECTION */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                🤝
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Commitment
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextArea
                                label="EMPLOYEE'S COMMITMENT (WWW) *"
                                placeholder="Who does What by When"
                                {...register('employee_commitment', {
                                    required: "Employee's commitment is required",
                                })}
                                className="bg-transparent w-full outline-none text-black"
                                error={errors?.employee_commitment?.message ?? ''}
                                onChange={(e) => setValue('employee_commitment', e.target.value, { shouldValidate: true })}
                            />

                            <TextArea
                                label="LEADER'S ACTION & COMMITMENT (WWW) *"
                                placeholder="Who does What by When"
                                {...register('leader_commitment', {
                                    required: "Leader's commitment is required",
                                })}
                                className="bg-transparent w-full outline-none text-black"
                                error={errors?.leader_commitment?.message ?? ''}
                                onChange={(e) => setValue('leader_commitment', e.target.value, { shouldValidate: true })}
                            />
                        </div>
                    </div>

                    {/* HANDOFF & FOLLOW-UP SECTION */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3 border-b pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                📅
                            </div>
                            <h2 className="text-xl font-bold text-sky-900">
                                Handoff & Follow-Up
                            </h2>
                        </div>

                        <div className="w-full md:w-1/3">
                            <Input
                                label="NEXT FOLLOW-UP DATE *"
                                type="date"
                                {...register('next_follow_up_date', { required: 'Next follow-up date is required' })}
                                error={errors.next_follow_up_date?.message}
                            />
                        </div>

                        <TextArea
                            label="FOLLOW-UP NOTES"
                            placeholder="Describe the plan for the next check-in"
                            {...register('follow_up_notes')}
                            className="bg-transparent w-full outline-none text-black"
                            error={errors?.follow_up_notes?.message ?? ''}
                            onChange={(e) => setValue('follow_up_notes', e.target.value, { shouldValidate: true })}
                        />
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            variant="secondary"
                        >
                            <span>▷</span> Submit Coaching Session
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}