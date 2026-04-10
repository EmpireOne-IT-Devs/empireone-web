import { Briefcase, Hash, Building2, Mail, UserCircle } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import { useSelector } from "react-redux";
import Select from "@/app/_components/select";

export default function EmployeeInformationSection({
    register,
    form,
    setValue,
}) {
    const { data } = useSelector((store) => store.app);
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 md:px-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase size={15} /> Employee Information
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    <Input
                        label="Employee ID"
                        name="employee_id"
                        disabled={data?.user?.account_employee?.employee_id}
                        {...register("employee_id")}
                        iconLeft={<Hash size={14} />}
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
                        label="Select Department"
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
                        {...register("position")}
                        iconLeft={<Briefcase size={14} />}
                    />
                    <Input
                        label="EOGS Email"
                        name="eogs_email"
                        disabled={data?.user?.account_employee?.eogs_email}
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("eogs_email")}
                        iconLeft={<Mail size={14} />}
                    />

                    <Select
                        disabled={data?.user?.account_employee?.status}
                        label="Employment Status"
                        name="status"
                        {...register("status")}
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
                </div>
            </div>
        </div>
    );
}
