import { UserCircle, MapPin, User, Calendar } from "lucide-react";
import React, { useState } from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { useSelector } from "react-redux";
import AddressInformationSection from "./address-information-section";

export default function PersonalInfoSection({
    form,
    register,
    errors,
    setValue,
    watch,
    regions,
    setRegions,
    provinces,
    setProvinces,
    cities,
    setCities,
    barangays,
    setBarangays,
}) {
    const { data } = useSelector((store) => store.app);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-1 flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UserCircle size={15} /> Basic Information
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="First Name *"
                        name="first_name"
                        {...register("first_name")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label="Middle Name"
                        name="middle_name"
                        {...register("middle_name")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label="Last Name *"
                        name="last_name"
                        {...register("last_name")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label="Suffix"
                        name="suffix"
                        {...register("suffix")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        {...register("date_of_birth")}
                        iconLeft={<Calendar size={14} />}
                    />
                    <Select
                        label="Gender"
                        name="gender"
                        {...register("gender")}
                        value={form.gender}
                        options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                            { label: "Other", value: "Other" },
                        ]}
                    />
                    <Select
                        label="Marital Status"
                        name="marital_status"
                        {...register("marital_status")}
                        value={form.marital_status}
                        options={[
                            { label: "Single", value: "Single" },
                            { label: "Married", value: "Married" },
                            { label: "Divorced", value: "Divorced" },
                            { label: "Widowed", value: "Widowed" },
                        ]}
                    />
                    <Input
                        label="Nationality *"
                        name="nationality"
                        {...register("nationality")}
                        iconLeft={<User size={14} />}
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 bg-green-50 border border-green-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={15} /> Address Information
                </span>
                <AddressInformationSection
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    barangays={barangays}
                    setBarangays={setBarangays}
                    regions={regions}
                    setRegions={setRegions}
                    provinces={provinces}
                    setProvinces={setProvinces}
                    cities={cities}
                    setCities={setCities}
                />
            </div>
        </div>
    );
}
