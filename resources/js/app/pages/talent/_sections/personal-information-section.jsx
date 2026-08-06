import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Radio from "@/app/_components/radio";
import Select from "@/app/_components/select";
import Dropdown from "@/Components/Dropdown";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { checking_applicant_service } from "@/app/services/applicants-service";

export default function PersonalInformationSection({
    register,
    errors,
    watchedValues,
    control,
    setValue,
    setCheckingStatus,
}) {
    const { departments } = useSelector((store) => store.departments);
    console.log("departments", departments);

    const typingTimer = useRef(null);

    function checking_applicant(e) {
        const email = e.target.value;

        // 1. Clear the timer stored in the ref
        clearTimeout(typingTimer.current);

        // 2. Assign the new timer to the ref
        typingTimer.current = setTimeout(async () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email !== "" && emailRegex.test(email)) {
                setValue("email", email);
                try {
                    // Call your API service
                    const result = await checking_applicant_service({
                        ...watchedValues,
                        email: email,
                    });
                    setCheckingStatus(result);
                    console.log("result", result);
                } catch (error) {
                    console.error("Error checking applicant:", error);
                }
            }
        }, 1500);
    }

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
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Input
                        label="Middle Name"
                        name="middle_name"
                        {...register("middle_name")}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Birthplace"
                    name="birth_place"
                    {...register("birth_place", {
                        required: true,
                    })}
                    error={errors.birth_place}
                />
                <Input
                    label="Nationality"
                    name="nationality"
                    {...register("nationality", {
                        required: true,
                    })}
                    error={errors.nationality}
                />
                <div className="flex flex-col flex-1 w-full">
                    <div className="flex flex-col flex-1 w-full">
                        <>
                            <label className="text-sm font-medium mb-2 text-center">
                                Have you previously worked for EmpireOne?
                            </label>
                            <div className="flex gap-4 items-center justify-center">
                                <Radio
                                    label="Yes"
                                    value="Yes"
                                    {...register("is_previous_employee", {
                                        required: true,
                                    })}
                                />
                                <Radio
                                    label="No"
                                    value="No"
                                    {...register("is_previous_employee", {
                                        required: true,
                                    })}
                                />
                            </div>
                            {errors.is_previous_employee && (
                                <span className="text-red-500 text-sm">
                                    This field is required.
                                </span>
                            )}
                        </>
                    </div>
                </div>

                {watchedValues.is_previous_employee === "Yes" && (
                    <div className="mt-4">
                        <Select
                            label="What department did you work for?"
                            {...register("previous_employee_status", {
                                required: "Please specify the department.",
                            })}
                            options={departments.map((res) => ({
                                ...res,
                                label: res.name,
                                value: res.name,
                            }))}
                            error={errors.previous_employee_status}
                            value={watchedValues.previous_employee_status}
                        />
                    </div>
                )}
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
                        onChange={checking_applicant}
                        error={errors.email}
                    />
                </div>
                <div className="flex flex-col">
                    <Controller
                        name="contact"
                        control={control}
                        rules={{
                            required: "Contact number is required",
                            validate: (value) =>
                                (value && isValidPhoneNumber(value)) ||
                                "Invalid phone number",
                        }}
                        render={({ field: { onChange, value } }) => (
                            <div className="w-full">
                                <div
                                    className={`relative flex items-center rounded-md border bg-white px-3 text-sm text-black transition-colors focus-within:ring-2 focus-within:ring-purple-500 ${
                                        errors.contact
                                            ? "border-red-500 focus-within:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <PhoneInput
                                        international
                                        defaultCountry="PH"
                                        value={value}
                                        onChange={onChange}
                                        className="w-full py-2.5"
                                    />
                                </div>
                                {errors.contact && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.contact.message}
                                    </p>
                                )}
                            </div>
                        )}
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
                    />
                </div>
                <div className="flex flex-col w-full md:flex-1">
                    <Input
                        label="Course"
                        name="course"
                        {...register("course", { required: true })}
                        error={errors.course}
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
                    />
                </div>

                {/* Second Row: Stacked on mobile, 3 columns on medium screens+ */}
                <div className="flex flex-wrap md:flex-nowrap w-full gap-4 mb-4">
                    <div className="flex flex-col w-full md:flex-1">
                        <Select
                            label="Educational Attainment"
                            name="degree"
                            {...register("degree", { required: true })}
                            options={[
                                { value: "N/A", label: "N/A" },
                                {
                                    value: "Elementary Undergraduate",
                                    label: "Elementary Undergraduate",
                                },
                                {
                                    value: "Elementary Graduate",
                                    label: "Elementary Graduate",
                                },
                                {
                                    value: "Highschool/K-12 Undergraduate",
                                    label: "Highschool/K-12 Undergraduate",
                                },
                                {
                                    value: "Highschool/K-12 Graduate",
                                    label: "Highschool/K-12 Graduate",
                                },
                                {
                                    value: "College Level",
                                    label: "College Level",
                                },
                                {
                                    value: "College Graduate",
                                    label: "College Graduate",
                                },
                                {
                                    value: "Vocational Graduate",
                                    label: "Vocational Graduate",
                                },
                                {
                                    value: "Masteral Degree",
                                    label: "Masteral Degree",
                                },
                                {
                                    value: "Doctoral Degree",
                                    label: "Doctoral Degree",
                                },
                            ]}
                            error={errors.degree}
                            value={watchedValues.degree}
                        />
                    </div>

                    <div className="flex flex-col w-full md:flex-1">
                        <Select
                            label="Source"
                            name="source"
                            value={watchedValues.source}
                            {...register("source")}
                            options={[
                                { value: "Facebook", label: "Facebook" },
                                { value: "LinkedIn", label: "LinkedIn" },
                                {
                                    value: "Online Application",
                                    label: "Online Application",
                                },
                                { value: "Referral", label: "Referral" },
                                { value: "Job Fair", label: "Job Fair" },
                                { value: "Walk-in", label: "Walk-in" },
                                { value: "Other", label: "Other" },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
