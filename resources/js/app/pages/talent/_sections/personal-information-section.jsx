import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";

export default function PersonalInformationSection({
    register,
    errors,
    watchedValues,
}) {
    return (
        <div className="space-y-6">
            <h2
                className="text-2xl font-bold pb-2"
                style={{
                    background: "linear-gradient(90deg,#c084fc,#93c5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Personal Details
            </h2>

            <div className="flex flex-wrap gap-4">
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
                        placeholder="Doe"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                <Input
                    label="Birthplace"
                    name="birth_place"
                    {...register("birth_place", {
                        required: true,
                    })}
                    error={errors.birth_place}
                    placeholder="San Carlos City, Philippines"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col flex-1 w-full">
                    <Select
                        label="Marital Status"
                        name="marital_status"
                        {...register("marital_status", {
                            required: true,
                        })}
                        options={[
                            { value: "Single", label: "Single" },
                            { value: "Married", label: "Married" },
                            { value: "Widowed", label: "Widowed" },
                            { value: "Separated", label: "Separated" },
                            { value: "Divorced", label: "Divorced" },
                            { value: "Annulled", label: "Annulled" },
                            { value: "Other", label: "Other" },
                        ]}
                        error={errors.marital_status}
                        value={watchedValues.marital_status}
                        required
                    />
                </div>
                <div className="flex flex-col flex-1 w-full">
                    <Input
                        label="Nationality"
                        name="nationality"
                        {...register("nationality", {
                            required: true,
                        })}
                        error={errors.nationality}
                        placeholder="Filipino"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        {...register("email", {
                            required: true,
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email",
                            },
                        })}
                        error={errors.email}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="flex flex-col">
                    <Input
                        label="Contact Number"
                        name="contact"
                        {...register("contact", {
                            required: true,
                            pattern: {
                                value: /^(09|\+639)\d{9}$/,
                                message: "Invalid PH Number",
                            },
                        })}
                        error={errors.contact}
                        placeholder="09123456789"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
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
                <div className="flex flex-col">
                    <Select
                        label="Gender"
                        name="gender"
                        {...register("gender", {
                            required: true,
                        })}
                        options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Non-binary", label: "Non-binary" },
                            { value: "Genderqueer", label: "Genderqueer" },
                            { value: "Agender", label: "Agender" },
                            { value: "Bigender", label: "Bigender" },
                            { value: "Genderfluid", label: "Genderfluid" },
                            { value: "Two-Spirit", label: "Two-Spirit" },
                            { value: "Other", label: "Other" },
                            {
                                value: "Prefer not to say",
                                label: "Prefer not to say",
                            },
                        ]}
                        error={errors.gender}
                        value={watchedValues.gender}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* First Row: Stacked on mobile, 3 columns on medium screens+ */}
                <div className="flex flex-col w-full md:flex-1">
                    <Input
                        label="School Name"
                        name="school_name"
                        {...register("school_name", { required: true })}
                        error={errors.school_name}
                        placeholder="Central Philippine State University"
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Input
                        label="Course"
                        name="course"
                        {...register("course", { required: true })}
                        error={errors.course}
                        placeholder="BSIT"
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Input
                        label="Year Graduated"
                        name="year_graduated"
                        {...register("year_graduated", {
                            required: true,
                        })}
                        error={errors.year_graduated}
                        placeholder="2025"
                    />
                </div>

                {/* Second Row: Stacked on mobile, 3 columns on medium screens+ */}
                <div className="flex flex-wrap md:flex-nowrap w-full gap-4 mb-4">
                    <div className="flex flex-col w-full md:flex-1">
                        <Select
                            label="Degree"
                            name="degree"
                            {...register("degree", { required: true })}
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
                        />
                    </div>

                    <div className="flex flex-col w-full md:flex-1">
                        <Input
                            label="Source"
                            name="source"
                            value={watchedValues.source}
                            {...register("source")}
                            placeholder="e.g. LinkedIn, Facebook, Referral"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
