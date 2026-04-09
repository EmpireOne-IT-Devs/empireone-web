import { Briefcase, Hash, Building2, Mail, UserCircle } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import { useSelector } from "react-redux";

export default function EmployeeInformationSection({ register, form }) {
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
                        {...register("employee_id")}
                        iconLeft={<Hash size={14} />}
                    />
                    <Input
                        label="Account"
                        name="account"
                        {...register("account")}
                        iconLeft={<UserCircle size={14} />}
                    />
                    <Input
                        label="Department"
                        name="department"
                        {...register("department")}
                        iconLeft={<Building2 size={14} />}
                    />
                    <Input
                        label="Position"
                        name="position"
                        {...register("position")}
                        iconLeft={<Briefcase size={14} />}  
                    />
                    <Input
                        label="Update Email"
                        name="eogs_email"
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("eogs_email")}
                        iconLeft={<Mail size={14} />}
                    />
                </div>
            </div>
        </div>
    );
}
