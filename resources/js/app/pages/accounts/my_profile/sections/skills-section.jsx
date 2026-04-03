import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import React from "react";
import { TbTrash } from "react-icons/tb";

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
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-100 transition"
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
                            <Input
                                label="     Skills"
                                name={`skills.${index}.skill`}
                                {...register(`skills.${index}.skill`, {
                                    required: "Required",
                                })}
                                error={errors.skills?.[index]?.skill}
                                placeholder="e.g. JavaScript"
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
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => removeSkill(index)}
                            variant="danger"
                            outlined
                        >
                            <TbTrash className="text-lg" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
