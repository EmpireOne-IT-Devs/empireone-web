import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import JobPostingSection from "./job-posting-section";

const FormSection = () => {
    const [step, setStep] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            position: "Frontend Developer",
            gender: "",
            experiences: [],
            skills: [{ name: "", percentage: 0 }],
            region: "",
            province: "",
            city: "",
            barangay: "",
            zip_code: "",
            cv: "",
        },
    });

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({ control, name: "experiences" });

    const {
        fields: skillFields,
        append: appendSkill,
        remove: removeSkill,
    } = useFieldArray({ control, name: "skills" });

    const watchedValues = watch();
    const cvFile = watch("cv");
    const fileName = cvFile?.[0]?.name;

    const getName = (list, code) =>
        list.find((item) => item.code === code)?.name || code;

    const nextStep = async () => {
        const fieldsToValidate =
            step == 1
                ? [
                      "first_name",
                      "last_name",
                      "middle_name",
                      "email",
                      "contact",
                      "date_of_birth",
                      "gender",
                      "school_name",
                      "course",
                      "year_graduated",
                      "degree",
                  ]
                : step == 2
                  ? ["region", "province", "city", "barangay", "zip_code"]
                  : step == 3
                    ? ["experiences"]
                    : step == 4
                      ? ["skills"]
                      : ["cv"];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep((curr) => curr + 1);
    };

    const prevStep = () => setStep((curr) => curr - 1);

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const onSubmit = (data) => {
        const finalData = {
            ...data,
            region: getName(regions, data.region),
            province: getName(provinces, data.province),
            city: getName(cities, data.city),
            barangay: getName(barangays, data.barangay),
        };
        alert(`Application submitted for ${data.first_name}!`);
        console.log("Final Data:", finalData);
        console.log("Final Data:", data);
    };

    // Watch the values of the dropdowns to trigger dependent fetches
    const selectedRegion = watch("region");
    const selectedProvince = watch("province");
    const selectedCity = watch("city");

    const API_BASE = "https://psgc.gitlab.io/api";

    // 1. Fetch Regions on Mount
    useEffect(() => {
        axios.get(`${API_BASE}/regions`).then((res) => setRegions(res.data));
    }, []);

    // 2. Fetch Provinces when Region changes
    useEffect(() => {
        if (selectedRegion) {
            axios
                .get(`${API_BASE}/regions/${selectedRegion}/provinces`)
                .then((res) => {
                    setProvinces(res.data);
                    // Reset dependent fields
                    // setValue("province", "");
                    // setValue("city", "");
                    // setValue("barangay", "");
                });
        }
    }, [selectedRegion, setValue]);

    // 3. Fetch Cities when Province changes
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(
                    `${API_BASE}/provinces/${selectedProvince}/cities-municipalities`,
                )
                .then((res) => {
                    setCities(res.data);
                    setValue("city", "");
                    setValue("barangay", "");
                });
        }
    }, [selectedProvince, setValue]);

    // 4. Fetch Barangays when City changes
    useEffect(() => {
        if (selectedCity) {
            axios
                .get(
                    `${API_BASE}/cities-municipalities/${selectedCity}/barangays`,
                )
                .then((res) => {
                    setBarangays(res.data);
                    setValue("barangay", "");
                });
        }
    }, [selectedCity, setValue]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-500">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase">
                            Step {step} of 6
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                            {Math.round((step / 6) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 6) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 0 && <JobPostingSection setStep={setStep} />}
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                                Personal Details
                            </h2>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        {...register("first_name", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.first_name
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="John"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Middle Name
                                    </label>
                                    <input
                                        {...register("middle_name")}
                                        className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Quincy"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        {...register("last_name", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.last_name
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        {...register("email", {
                                            required: "Required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email",
                                            },
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.email
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Contact Number
                                    </label>
                                    <input
                                        {...register("contact", {
                                            required: "Required",
                                            pattern: {
                                                value: /^(09|\+639)\d{9}$/,
                                                message: "Invalid PH Number",
                                            },
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.contact
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="09123456789"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        {...register("date_of_birth", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.date_of_birth
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        {...register("gender", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.gender
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select Gender
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Non-binary">
                                            Non-binary
                                        </option>
                                        <option value="Genderqueer">
                                            Genderqueer
                                        </option>
                                        <option value="Agender">Agender</option>
                                        <option value="Bigender">
                                            Bigender
                                        </option>
                                        <option value="Genderfluid">
                                            Genderfluid
                                        </option>
                                        <option value="Two-Spirit">
                                            Two-Spirit
                                        </option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">
                                            Prefer not to say
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        School Name
                                    </label>
                                    <input
                                        {...register("school_name", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.school_name
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="Central Philippine State University"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Course
                                    </label>
                                    <input
                                        {...register("course", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.course
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="BSIT"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Year Graduated
                                    </label>
                                    <input
                                        {...register("year_graduated", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.year_graduated
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        placeholder="2025"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Award
                                    </label>
                                    <input
                                        {...register("award")}
                                        className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Best In *"
                                    />
                                </div>

                                <div className="flex flex-col flex-1 w-full">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Degree
                                    </label>
                                    <select
                                        {...register("degree", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                            errors.degree
                                                ? "border-red-400"
                                                : "focus:ring-blue-400"
                                        }`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select Degree
                                        </option>
                                        <option value="Elementary">
                                            Elementary
                                        </option>
                                        <option value="High School Junior">
                                            High School Junior
                                        </option>
                                        <option value="High School Senior">
                                            High School Senior
                                        </option>
                                        <option value="College">College</option>
                                        <option value="Masteral">
                                            Masteral
                                        </option>
                                        <option value="Doctoral">
                                            Doctoral
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-[0.98]"
                                >
                                    Continue to Address
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                                Address Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Region Select */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Region
                                    </label>
                                    <select
                                        {...register("region", {
                                            required: "Required",
                                        })}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.region ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map((r) => (
                                            <option key={r.code} value={r.code}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Province Select */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Province
                                    </label>
                                    <select
                                        {...register("province", {
                                            required: "Required",
                                        })}
                                        disabled={!selectedRegion}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.province ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                                    >
                                        <option value="">
                                            Select Province
                                        </option>
                                        {provinces.map((p) => (
                                            <option key={p.code} value={p.code}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {/* City Select */}
                                <div className="flex flex-col w-full flex-1">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        City / Municipality
                                    </label>
                                    <select
                                        {...register("city", {
                                            required: "Required",
                                        })}
                                        disabled={!selectedProvince}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.city ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col w-full flex-1">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Zip Code
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="4"
                                        {...register("zip_code", {
                                            required: "Required",
                                            pattern: {
                                                value: /^\d{4}$/,
                                                message: "Must be 4 digits",
                                            },
                                        })}
                                        placeholder="e.g. 6127"
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.zip_code ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                                        onInput={(e) => {
                                            // Interactive: Prevent non-numeric characters
                                            e.target.value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    "",
                                                );
                                        }}
                                    />
                                </div>

                                {/* Barangay Select */}
                                <div className="flex flex-col w-full flex-1">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        Barangay
                                    </label>
                                    <select
                                        {...register("barangay", {
                                            required: "Required",
                                        })}
                                        disabled={!selectedCity}
                                        className={`p-3 border rounded-lg outline-none focus:ring-2 ${errors.barangay ? "border-red-400 ring-red-100" : "focus:ring-blue-400"}`}
                                    >
                                        <option value="">
                                            Select Barangay
                                        </option>
                                        {barangays.map((b) => (
                                            <option key={b.code} value={b.code}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Manual Entry for Street/House */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        House/Lot/Street/ Purok/Sitio etc.
                                    </label>
                                    <input
                                        {...register("street")}
                                        className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Blk 1 Lot 2"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700"
                                >
                                    Continue To Working Experience
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Working Experiences */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Working Experience
                                </h2>
                                <button
                                    type="button"
                                    onClick={() =>
                                        appendExperience({
                                            company_name: "",
                                            position: "",
                                            start_at: "",
                                            end_at: "",
                                            job_description: "",
                                        })
                                    }
                                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-100 transition"
                                >
                                    + Add Job
                                </button>
                            </div>

                            {experienceFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border rounded-xl bg-gray-50 space-y-4 relative"
                                >
                                    <div className="flex flex-wrap w-full gap-4">
                                        <div className="flex flex-1 flex-col">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                Company Name
                                            </label>
                                            <input
                                                {...register(
                                                    `experiences.${index}.company_name`,
                                                    {
                                                        required: "Required",
                                                    },
                                                )}
                                                placeholder="e.g. Acme Corp"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.experiences?.[index]
                                                        ?.company_name
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                Position
                                            </label>
                                            <input
                                                {...register(
                                                    `experiences.${index}.position`,
                                                    {
                                                        required: "Required",
                                                    },
                                                )}
                                                placeholder="e.g. Developer"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.experiences?.[index]
                                                        ?.position
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap w-full gap-4">
                                        <div className="flex flex-1 flex-col">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                Start Year
                                            </label>
                                            <input
                                                {...register(
                                                    `experiences.${index}.start_at`,
                                                    {
                                                        required: "Required",
                                                    },
                                                )}
                                                type="number"
                                                min={1900}
                                                max={new Date().getFullYear()}
                                                placeholder="YYYY"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.experiences?.[index]
                                                        ?.start_at
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                End Year
                                            </label>
                                            <input
                                                {...register(
                                                    `experiences.${index}.end_at`,
                                                    {
                                                        required: "Required",
                                                        validate: (val) =>
                                                            parseInt(val, 10) >=
                                                                parseInt(
                                                                    watchedValues
                                                                        .experiences[
                                                                        index
                                                                    ]
                                                                        .start_at ||
                                                                        0,
                                                                    10,
                                                                ) ||
                                                            "End year must be after Start year",
                                                    },
                                                )}
                                                type="number"
                                                min={1900}
                                                max={new Date().getFullYear()}
                                                placeholder="YYYY"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.experiences?.[index]
                                                        ?.end_at
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-4">
                                        <div className="flex flex-col flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                Job Description
                                            </label>
                                            <textarea
                                                rows={3}
                                                {...register(
                                                    `experiences.${index}.job_description`,
                                                    { required: true },
                                                )}
                                                placeholder="Job description"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.experiences?.[index]
                                                        ?.job_description
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExperience(index)
                                            }
                                            className="text-red-500 hover:text-red-700 font-bold text-sm mb-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    appendExperience({
                                        company_name: "",
                                        position: "",
                                        start_at: "",
                                        end_at: "",
                                        job_description: "",
                                    })
                                }
                            >
                                + Add Job
                            </button>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                                >
                                    Continue To Skill
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Skills
                                </h2>
                                <button
                                    type="button"
                                    onClick={() =>
                                        appendSkill({
                                            skill: "",
                                            percentage: 0,
                                        })
                                    }
                                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-100 transition"
                                >
                                    + Add Skill
                                </button>
                            </div>

                            {skillFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 border rounded-xl bg-gray-50 space-y-4 relative"
                                >
                                    <div className="flex flex-wrap w-full gap-4">
                                        <div className="flex flex-1 flex-col">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                Skills
                                            </label>
                                            <input
                                                {...register(
                                                    `skills.${index}.skill`,
                                                    {
                                                        required: "Required",
                                                    },
                                                )}
                                                placeholder="e.g. Software Engineer"
                                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                                    errors.skills?.[index]
                                                        ?.skill
                                                        ? "border-red-400"
                                                        : "focus:ring-blue-400"
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-4">
                                        <div className="flex flex-col flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                    Proficiency Level
                                                </label>
                                                {/* Display dynamic percentage value */}
                                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {watch(
                                                        `skills.${index}.percentage`,
                                                    ) || 0}
                                                    %
                                                </span>
                                            </div>

                                            <div className="relative flex items-center h-12">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    {...register(
                                                        `skills.${index}.percentage`,
                                                        {
                                                            required:
                                                                "Required",
                                                        },
                                                    )}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                                />
                                            </div>

                                            {/* Visual Indicator Labels */}
                                            <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
                                                <span>BEGINNER</span>
                                                <span>INTERMEDIATE</span>
                                                <span>EXPERT</span>
                                            </div>

                                            {errors.skills?.[index]
                                                ?.percentage && (
                                                <p className="text-red-500 text-[10px] mt-1 font-bold">
                                                    {
                                                        errors.skills[index]
                                                            .percentage.message
                                                    }
                                                </p>
                                            )}
                                        </div>{" "}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm mb-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                                >
                                    Continue To Document
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex flex-col">
                                <label className="font-bold text-gray-700 mb-2">
                                    Upload Your CV
                                </label>

                                {/* Interactive Dropzone */}
                                <div className="relative group">
                                    <label
                                        htmlFor="cv-upload"
                                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all
              ${fileName ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400"}
              ${errors.cv ? "border-red-400 bg-red-50" : ""}
            `}
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {/* Dynamic Icon based on state */}
                                            {fileName ? (
                                                <svg
                                                    className="w-10 h-10 mb-3 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    ></path>
                                                </svg>
                                            )}

                                            <p className="mb-2 text-sm text-gray-700">
                                                <span className="font-semibold">
                                                    {fileName
                                                        ? "File selected!"
                                                        : "Click to upload"}
                                                </span>{" "}
                                                {fileName
                                                    ? ""
                                                    : "or drag and drop"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {fileName
                                                    ? fileName
                                                    : "PDF, DOC, or DOCX (MAX. 5MB)"}
                                            </p>
                                        </div>

                                        {/* Hidden Input managed by React Hook Form */}
                                        <input
                                            id="cv-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            {...register("cv", {
                                                required: "CV is required",
                                                validate: {
                                                    lessThan5MB: (files) =>
                                                        files[0]?.size <
                                                            5000000 ||
                                                        "Max size is 5MB",
                                                },
                                            })}
                                        />
                                    </label>
                                </div>

                                {/* Error Message */}
                                {errors.cv && (
                                    <p className="text-red-500 text-xs mt-2 font-medium flex items-center">
                                        <span className="mr-1">⚠️</span>{" "}
                                        {errors.cv.message}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                                >
                                    Continue To Review
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 6 && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                                Final Review
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100">
                                {/* Personal & Contact Info */}
                                <div>
                                    <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                        Personal & Contact Details
                                    </p>
                                    <div className="grid grid-cols-2 gap-y-1">
                                        <p>
                                            <strong>Name:</strong>{" "}
                                            {watchedValues.first_name}{" "}
                                            {watchedValues.middle_name}{" "}
                                            {watchedValues.last_name}
                                        </p>
                                        <p>
                                            <strong>Gender:</strong>{" "}
                                            {watchedValues.gender}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {watchedValues.email}
                                        </p>
                                        <p>
                                            <strong>Contact:</strong>{" "}
                                            {watchedValues.contact}
                                        </p>
                                        <p>
                                            <strong>DOB:</strong>
                                            {moment(
                                                watchedValues.date_of_birth,
                                            ).format("LL")}
                                        </p>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div>
                                    <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                        Current Address
                                    </p>
                                    <p className="capitalize">
                                        {watchedValues.street},{" "}
                                        {getName(
                                            barangays,
                                            watchedValues.barangay,
                                        )}{" "}
                                        {getName(cities, watchedValues.city)}{" "}
                                        {getName(
                                            provinces,
                                            watchedValues.province,
                                        )}{" "}
                                        {getName(
                                            regions,
                                            watchedValues.regions,
                                        )}{" "}
                                        {watchedValues.zip_code}
                                    </p>
                                    <p>
                                        <strong>Zip Code:</strong>{" "}
                                        {watchedValues.zip_code}
                                    </p>
                                </div>

                                {/* Working Experiences */}
                                <div>
                                    <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                        Working Experience
                                    </p>
                                    {watchedValues.experiences &&
                                    watchedValues.experiences.length > 0 ? (
                                        watchedValues.experiences.map(
                                            (exp, i) => (
                                                <div
                                                    key={i}
                                                    className="border-l-2 border-blue-200 pl-3 mb-3"
                                                >
                                                    <p className="font-semibold text-gray-800">
                                                        {exp.position ||
                                                            exp.role}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {exp.company_name ||
                                                            exp.company}{" "}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {exp.start_at} to{" "}
                                                        {exp.end_at}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-gray-400 italic">
                                            No experience listed
                                        </p>
                                    )}
                                </div>

                                {/* Skills & Proficiency */}
                                <div>
                                    <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                        Skills & Proficiency
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {watchedValues.skills?.map(
                                            (skill, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
                                                >
                                                    <span className="font-medium mr-2">
                                                        {skill.skill}
                                                    </span>
                                                    <span className="text-blue-600 font-bold text-[10px]">
                                                        {skill.percentage}%
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Document Review */}
                                <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-700 uppercase">
                                            Attached CV
                                        </p>
                                        <p className="text-xs font-medium text-blue-900 truncate max-w-[200px]">
                                            {watchedValues.cv?.[0]?.name ||
                                                "No file uploaded"}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 text-gray-500 font-bold py-3 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Edit Details
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg transform active:scale-95 transition-all"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default FormSection;
