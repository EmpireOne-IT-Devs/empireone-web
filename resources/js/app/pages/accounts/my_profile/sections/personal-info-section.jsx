import {
    UserCircle,
    MapPin,
    User,
    Calendar,
    GraduationCap,
} from "lucide-react";
import React from "react";
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
    watchedValues,
}) {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Basic Information Section */}
            <div className="flex flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-4 md:px-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UserCircle size={15} /> Basic Information
                </span>
                {/* Responsive Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    <Input
                        label={
                            <div className="flex">
                                First Name
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="first_name"
                        {...register("first_name")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label={
                            <div className="flex">
                                Middle Name
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        placeholder="Middlename || NA"
                        name="middle_name"
                        {...register("middle_name")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label={
                            <div className="flex">
                                Last Name
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
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
                        label={
                            <div className="flex">
                                Date of Birth
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="date_of_birth"
                        type="date"
                        {...register("date_of_birth")}
                        iconLeft={<Calendar size={14} />}
                    />
                    <Select
                        label={
                            <div className="flex">
                                Gender
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
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
                    <div
                        className="w-full"
                        style={{
                            pointerEvents: form.nationality ? "none" : "auto",
                        }}
                    >
                        <Input
                            label="Nationality *"
                            name="nationality"
                            {...register("nationality")}
                            value={form.nationality}
                            iconLeft={<User size={14} />}
                        />
                    </div>

                    <Input
                        label="Contact #"
                        name="contact"
                        {...register("contact")}
                        iconLeft={<User size={14} />}
                    />
                </div>
            </div>

            {/* Address Information Section */}
            <div className="flex flex-col gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4 md:px-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={15} /> Address Information
                </span>

                <AddressInformationSection
                    register={register}
                    errors={errors}
                    watchedValues={watchedValues}
                    setValue={setValue}
                />
            </div>

            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap size={15} /> Educational Background
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        label={
                            <div className="flex">
                                School Name
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="school_name"
                        {...register("school_name", {
                            required: "Required",
                        })}
                        error={errors.school_name}
                        placeholder="Name of School *"
                    />
                    <Select
                        label={
                            <div className="flex">
                                Degree
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="degree"
                        {...register("degree", {
                            required: true,
                        })}
                        options={[
                            { value: "Elementary", label: "Elementary" },
                            {
                                value: "High School Junior",
                                label: "High School Junior",
                            },
                            {
                                value: "High School Senior",
                                label: "High School Senior",
                            },
                            { value: "College", label: "College" },
                            { value: "Masteral", label: "Masteral" },
                            { value: "Doctoral", label: "Doctoral" },
                        ]}
                        error={errors.degree}
                        value={watchedValues.degree}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                        label={
                            <div className="flex">
                                Course
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="course"
                        {...register("course", {
                            required: "Required",
                        })}
                        error={errors.course}
                        placeholder="BSIT"
                    />

                    <Input
                        label={
                            <div className="flex">
                                Year Graduated
                                <div className="text-red-500 font-black">*</div>
                            </div>
                        }
                        name="year_graduated"
                        {...register("year_graduated", {
                            required: "Required",
                        })}
                        error={errors.year_graduated}
                        placeholder="2025"
                    />
                    <Input
                        label="Award"
                        name="awards"
                        {...register("awards")}
                        placeholder="Best In *"
                        error={errors.awards}
                    />
                </div>
            </div>
        </div>
    );
}
