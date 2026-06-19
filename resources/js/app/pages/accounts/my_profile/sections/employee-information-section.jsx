import { Briefcase, Hash, Building2, Mail, UserCircle } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import { useSelector } from "react-redux";
import Select from "@/app/_components/select";

export default function EmployeeInformationSection({
    register,
    form,
    setValue,
    errors
}) {
    const { data } = useSelector((store) => store.app);
    const params = new URLSearchParams(window.location.search);
    const error_message = params.get("error_message") || "";
    return (
        <div className="flex flex-col gap-6 w-full">
            {
                error_message && <div className="text-red-500 px-3 text-sm">
                    {error_message}
                </div>
            }

            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 md:px-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase size={15} /> Employee Information
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    <Input
                        label="Employee ID"
                        name="employee_id"
                        disabled={data?.user?.account_employee?.employee_id}
                        {...register("employee_id", { required: true })}
                        error={errors.employee_id}
                        iconLeft={<Hash size={14} />}
                    />

                    <Input
                        label="Started At"
                        name="started_at"
                        type="date"
                        disabled={data?.user?.account_employee?.started_at}
                        {...register("started_at", { required: true })}
                        error={errors.started_at}
                    />
                    <Select
                        disabled={data?.user?.account_employee?.position_level}
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
                        disabled={data?.user?.account_employee?.e_r_leader_id}
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
                        disabled={data?.user?.account_employee?.account_id}
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
                        disabled={data?.user?.account_employee?.department_id}
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
                        disabled={data?.user?.account_employee?.position}
                        {...register("position", { required: true })}
                        iconLeft={<Briefcase size={14} />}
                        error={errors.position}
                    />
                    <Input
                        label="EOGS Email"
                        name="eogs_email"
                        disabled={data?.user?.account_employee?.eogs_email}
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("eogs_email", { required: true })}
                        iconLeft={<Mail size={14} />}
                        error={errors.eogs_email}
                    />

                    <Select
                        disabled={data?.user?.account_employee?.status}
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
                        disabled={data?.user?.account_employee?.basic_pay}
                        {...register("basic_pay", { required: true })}
                        error={errors.basic_pay}
                    />

                    <Input
                        label="Allowance"
                        name="allowance"
                        disabled={data?.user?.account_employee?.allowance}
                        type="number"
                        {...register("allowance", { required: true })}
                        error={errors.allowance}
                    />
                </div>
            </div>
        </div>
    );
}
