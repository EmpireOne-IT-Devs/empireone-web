import React from 'react'

export default function PersonalInformationSection({register,errors,nextStep,prevStep}) {
  return (
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
  )
}
