import moment from "moment";
import React from "react";

export default function FinalReviewSection({
    prevStep,
    watchedValues,
    getName,
    barangays,
    cities,
    provinces,
    regions,
    loading,
}) {
    return (
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
                            <strong>Name:</strong> {watchedValues.first_name}{" "}
                            {watchedValues.middle_name}{" "}
                            {watchedValues.last_name}
                        </p>
                        <p>
                            <strong>Gender:</strong> {watchedValues.gender}
                        </p>
                        <p>
                            <strong>Email:</strong> {watchedValues.email}
                        </p>
                        <p>
                            <strong>Contact:</strong> {watchedValues.contact}
                        </p>
                        <p>
                            <strong>DOB:</strong>
                            {moment(watchedValues.date_of_birth).format("LL")}
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
                        {getName(barangays, watchedValues.barangay)}{" "}
                        {getName(cities, watchedValues.city)}{" "}
                        {getName(provinces, watchedValues.province)}{" "}
                        {getName(regions, watchedValues.regions)}{" "}
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
                        watchedValues.experiences.map((exp, i) => (
                            <div
                                key={i}
                                className="border-l-2 border-blue-200 pl-3 mb-3"
                            >
                                <p className="font-semibold text-gray-800">
                                    {exp.position || exp.role}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {exp.company_name || exp.company}{" "}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {exp.start_at} to {exp.end_at}
                                </p>
                            </div>
                        ))
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
                        {watchedValues.skills?.map((skill, i) => (
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
                        ))}
                    </div>
                </div>

                {/* Document Review */}
                <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-blue-700 uppercase">
                            Attached CV
                        </p>
                        <p className="text-xs font-medium text-blue-900 truncate max-w-[200px]">
                            {watchedValues.cv?.[0]?.name || "No file uploaded"}
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
                    disabled={loading}
                    className={`w-1/2 py-3 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all
        ${loading ? "bg-green-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
    `}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            <span className=" text-white">Submitting...</span>
                        </div>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </div>
        </div>
    );
}
