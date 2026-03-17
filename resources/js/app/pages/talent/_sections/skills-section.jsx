import React from "react";

export default function SkillsSection({
    register,
    errors,
    nextStep,
    prevStep,
    appendSkill,
    skillFields,
    watch,
    removeSkill,
}) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
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
                                {...register(`skills.${index}.skill`, {
                                    required: "Required",
                                })}
                                placeholder="e.g. Software Engineer"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.skills?.[index]?.skill
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
                                    {watch(`skills.${index}.percentage`) || 0}%
                                </span>
                            </div>

                            <div className="relative flex items-center h-12">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    {...register(`skills.${index}.percentage`, {
                                        required: "Required",
                                    })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                />
                            </div>

                            {/* Visual Indicator Labels */}
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
                                <span>BEGINNER</span>
                                <span>INTERMEDIATE</span>
                                <span>EXPERT</span>
                            </div>

                            {errors.skills?.[index]?.percentage && (
                                <p className="text-red-500 text-[10px] mt-1 font-bold">
                                    {errors.skills[index].percentage.message}
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
    );
}
