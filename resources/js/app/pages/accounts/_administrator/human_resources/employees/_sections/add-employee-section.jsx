import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import Modal from '@/app/_components/modal'
import Select from '@/app/_components/select'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Hash, Building2, Briefcase, Mail, Clock, BriefcaseIcon, UserPlus } from 'lucide-react'
import { Clickup } from '@thesvg/react'
import store from '@/app/store/store'
import { get_employees_thunk } from '@/app/redux/employee-relation-thunk'
import { setAlert } from '@/app/redux/app-slice'
import { add_employee_service } from '@/app/services/account-service'
import moment from 'moment'

export default function AddEmployeeSection() {
    const { data } = useSelector((store) => store.app);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    // 1. Updated defaultValues to include all the new payload fields
    const { register, setValue, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            employee_id: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            date_of_birth: '',
            contact: '',
            account_id: '',
            department_id: '',
            position: '',
            status: '',
            started_at: '',
            work_type: '',
            sss: '',
            pagibig: '',
            tin: '',
            philhealth: '',
            eogs_email: '',
            email: ''
        }
    });

    const form = watch();

    const onSubmit = async (formData) => {
        console.log("Form Data Submitted:", formData);
        try {
            await add_employee_service({
                ...formData,
                started_at: moment(formData.started_at).format('LL')
            })
            await store.dispatch(get_employees_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Employee Added Successfully!",
                }),
            );
            setOpen(false)
        } catch (error) {

        }
        // Add your API call or dispatch here
        // setOpen(false); 
    };

    return (
        <div className='flex items-center justify-center h-full'>
            <Button
                className='py-5'
                outlined
                variant='secondary'
                onClick={() => setOpen(true)}
            >
                ADD EMPLOYEE
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <UserPlus />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Human Resources
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Add Employee
                            </h2>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-3 mt-4 min-h-96">

                    <Input
                        label="Employee ID"
                        name="employee_id"
                        {...register("employee_id")}
                        iconLeft={<Hash size={14} />}
                    />

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="First Name"
                                name="first_name"
                                {...register("first_name", {
                                    required: true,
                                })}
                                error={errors.first_name}
                                placeholder="John"
                            />
                        </div>
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Middle Name"
                                name="middle_name"
                                {...register("middle_name")}
                                placeholder="Quincy"
                            />
                        </div>
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Last Name"
                                name="last_name"
                                {...register("last_name", {
                                    required: true,
                                })}
                                error={errors.last_name}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                {...register("date_of_birth", {
                                    required: true,
                                })}
                                error={errors.date_of_birth}
                            />
                        </div>
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Contact"
                                name="contact"
                                type="number"
                                {...register("contact", {
                                    required: true,
                                })}
                                error={errors.contact}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 md:flex-row'>


                        <div className="w-full md:flex-1">
                            <Select
                                label="Select Department"
                                name="department_id"
                                value={form.department_id}
                                options={data?.departments?.map((res) => ({
                                    ...res,
                                    label: res.name,
                                    value: res.id,
                                }))}
                                onChange={(val) => setValue("department_id", val)}
                            />
                        </div>
                        {form.department_id == 4 && <div className="w-full md:flex-1">
                            <Select
                                label="Account"
                                name="account_id"
                                value={form.account_id}
                                options={data?.accounts?.map((res) => ({
                                    ...res,
                                    label: res.name,
                                    value: res.id,
                                }))}
                                onChange={(val) => setValue("account_id", val)}
                            />
                        </div>}


                    </div>

                    <div className='flex flex-col gap-4 md:flex-row'>
                        <div className="w-full md:flex-1">
                            <Input
                                label="Position"
                                name="position"
                                {...register("position")}
                                iconLeft={<Briefcase size={14} />}
                            />
                        </div>

                        <div className="w-full md:flex-1">
                            <Select
                                label="Employment Status"
                                name="status"
                                {...register("status", {
                                    required: true,
                                })}
                                error={errors.status}
                                value={form.status}
                                options={[
                                    { label: "Probationary", value: "Probationary" },
                                    { label: "Regular", value: "Regular" },
                                ]}
                                onChange={(val) => setValue("status", val)}
                            />

                        </div>
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row'>
                        <div className="w-full md:flex-1">
                            <Input
                                label="Started At"
                                name="started_at"
                                type="date"
                                {...register("started_at", {
                                    required: true,
                                })}
                                iconLeft={<Clock size={14} />}
                                error={errors.started_at}
                            />
                        </div>

                        <div className="w-full md:flex-1">
                            <Select
                                label="Work Type"
                                name="work_type"
                                {...register("work_type", {
                                    required: true,
                                })}
                                error={errors.work_type}
                                value={form.work_type}
                                options={[
                                    { label: "Full Time", value: "Full Time" },
                                    { label: "Part Time", value: "Part Time" },
                                ]}
                                onChange={(val) => setValue("work_type", val)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="SSS"
                                name="sss"
                                {...register("sss", {
                                    required: true,
                                })}
                                error={errors.sss} // 2. Fixed error prop mapping
                            />
                        </div>
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Pagibig"
                                name="pagibig"
                                type="number"
                                {...register("pagibig", {
                                    required: true,
                                })}
                                error={errors.pagibig}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="TIN"
                                name="tin"
                                {...register("tin", {
                                    required: true,
                                })}
                                error={errors.tin} // 3. Fixed error prop mapping
                            />
                        </div>
                        <div className="flex flex-col w-full md:flex-1">
                            <Input
                                label="Philhealth"
                                name="philhealth"
                                type="number"
                                {...register("philhealth", {
                                    required: true,
                                })}
                                error={errors.philhealth}
                            />
                        </div>
                    </div>
                    <Input
                        label="EOGS Email"
                        name="eogs_email"
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("eogs_email", {
                            required: true,
                        })}
                        iconLeft={<Mail size={14} />}
                        error={errors.eogs_email}
                    />
                    <Input
                        label="Personal Email"
                        name="email"
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("email", {
                            required: true,
                        })}
                        iconLeft={<Mail size={14} />}
                        error={errors.email}
                    />
                    <div className="flex justify-end pt-4 mt-2 border-t">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            className="w-full px-8 py-2 md:w-auto"
                        >
                            Save Employee
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}