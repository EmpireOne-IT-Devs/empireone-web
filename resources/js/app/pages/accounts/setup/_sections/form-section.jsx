import Input from '@/app/_components/input';
import Select from '@/app/_components/select';
import Button from '@/app/_components/button';
import { Briefcase, Hash, Building2, Mail, UserCircle } from "lucide-react";
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { edit_information_service } from '@/app/services/account-service';
import store from '@/app/store/store';
import { get_app_data_thunk } from '@/app/redux/app-thunk';
import { setAlert } from '@/app/redux/app-slice';

const getName = (list, code) =>
    list.find((item) => item.code === code)?.name || code;

export default function FormSection() {
    const { data } = useSelector((store) => store.app);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: {} });

    const dispatch = useDispatch()
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const form = watch();

    useEffect(() => {
        if (data?.user?.personal_information) {
            reset({
                ...data?.user?.personal_information,
                e_r_leader_id: data?.user?.account_employee?.e_r_leader_id,
                started_at: data?.user?.account_employee?.started_at
                    ? moment(data.user.account_employee.started_at).format('YYYY-MM-DD')
                    : '',
                position_level: data?.user?.account_employee?.position_level,
                basic_pay: data?.user?.account_employee?.basic_pay,
                allowance: data?.user?.account_employee?.allowance,
                employee_id: data?.user?.account_employee?.employee_id,
                department_id: data?.user?.account_employee?.department_id,
                account_id: data?.user?.account_employee?.account_id,
                site_id: data?.user?.account_employee?.site_id,
                position: data?.user?.account_employee?.position,
                eogs_email: data?.user?.account_employee?.eogs_email,
                status: data?.user?.account_employee?.status,
                skills: data?.user?.skills,
                experiences: data?.user?.working_experience,
            });
        }
    }, [
        data?.user?.personal_information,
        data?.user?.skills,
        data?.user?.working_experience,
        reset,
    ]);

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            started_at: moment(data.started_at).format('LL'),
            region: getName(regions, data.region),
            province: getName(provinces, data.province),
            city: getName(cities, data.city),
            barangay: getName(barangays, data.barangay),
        };
        try {
            await edit_information_service(finalData);
            await store.dispatch(get_app_data_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                }),
            );
            router.visit('/dashboard')
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-4">
                <Input
                    label="Employee ID"
                    name="employee_id"
                    // disabled={data?.user?.account_employee?.employee_id}
                    {...register("employee_id", { required: true })}
                    error={errors.employee_id}
                    iconLeft={<Hash size={14} />}
                />

                <Input
                    label="Started At"
                    name="started_at"
                    type="date"
                    // disabled={data?.user?.account_employee?.started_at}
                    {...register("started_at", { required: true })}
                    error={errors.started_at}
                />
                <Select
                    // disabled={data?.user?.account_employee?.position_level}
                    label="Level of Position"
                    name="position_level"
                    value={form.position_level}
                    options={[
                        {
                            label: 'Rank and File (Agent,Support Etc.)',
                            value: 'Rank and File'
                        }, {
                            label: 'Supervisor',
                            value: 'Supervisor'
                        }, {
                            label: 'Manager',
                            value: 'Manager'
                        }, {
                            label: 'Executive',
                            value: 'Executive'
                        }
                    ]?.map((res) => ({
                        ...res,
                        label: res.label,
                        value: res.value,
                    }))}
                    onChange={(val) => setValue("position_level", val)}
                />
                <Select
                    // disabled={data?.user?.account_employee?.e_r_leader_id}
                    label="Leader"
                    name="e_r_leader_id"
                    value={form.e_r_leader_id}
                    options={data?.leaders?.map((res) => ({
                        ...res,
                        label: res?.user?.name,
                        value: res.id,
                    }))}
                    error={errors.e_r_leader_id}
                    onChange={(val) => setValue("e_r_leader_id", val)}
                />

                <Select
                    // disabled={data?.user?.account_employee?.account_id}
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


                <Select
                    label="Department"
                    name="department_id"
                    // disabled={data?.user?.account_employee?.department_id}
                    value={form.department_id}
                    options={data?.departments?.map((res) => ({
                        ...res,
                        label: res.name,
                        value: res.id,
                    }))}
                    onChange={(val) => setValue("department_id", val)}
                    iconLeft={<Building2 size={14} />}
                />

                <Input
                    label="Position"
                    name="position"
                    // disabled={data?.user?.account_employee?.position}
                    {...register("position", { required: true })}
                    iconLeft={<Briefcase size={14} />}
                    error={errors.position}
                />
                <Input
                    label="EOGS Email"
                    name="eogs_email"
                    // disabled={data?.user?.account_employee?.eogs_email}
                    placeholder="eogs.yourname@gmail.com"
                    type="email"
                    {...register("eogs_email", { required: true })}
                    iconLeft={<Mail size={14} />}
                    error={errors.eogs_email}
                />

                <Select
                    // disabled={data?.user?.account_employee?.status}
                    label="Employment Status"
                    name="status"
                    {...register("status", { required: true })}
                    value={form.status}
                    options={[
                        { label: "Probationary", value: "Probationary" },
                        { label: "Regular", value: "Regular" },
                        { label: "AWOL", value: "AWOL" },
                        { label: "Contractual", value: "Contractual" },
                        {
                            label: "End of Contract",
                            value: "End of Contract",
                        },
                        { label: "EOPE", value: "EOPE" },
                        {
                            label: "Extended Probationary",
                            value: "Extended Probationary",
                        },
                        { label: "Resigned", value: "Resigned" },
                        { label: "Terminated", value: "Terminated" },
                        {
                            label: "Trainee Fallout",
                            value: "Trainee Fallout",
                        },
                    ]}
                />
                <Input
                    label="Basic Pay"
                    name="basic_pay"
                    type="number"
                    // disabled={data?.user?.account_employee?.basic_pay}
                    {...register("basic_pay", { required: true })}
                    error={errors.basic_pay}
                />

                <Input
                    label="Allowance"
                    name="allowance"
                    // disabled={data?.user?.account_employee?.allowance}
                    type="number"
                    {...register("allowance", { required: true })}
                    error={errors.allowance}
                />
                <Button
                    type="submit"
                    variant='secondary'
                    loading={isSubmitting}
                >
                    SAVE CHANGES
                </Button>
            </div>


        </form>
    )
}
