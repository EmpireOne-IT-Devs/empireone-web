import { User, Calendar, Building2, Award, GraduationCap } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import WorkingExperienceSection from "./working-experience-section";
import SkillsSection from "./skills-section";

export default function ProfessionalSection({
    watchedValues,
    register,
    appendExperience,
    experienceFields,
    removeExperience,
    errors,
    appendSkill,
    skillFields,
    removeSkill,
    watch,
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-6 py-4">
                <WorkingExperienceSection
                    register={register}
                    errors={errors}
                    appendExperience={appendExperience}
                    experienceFields={experienceFields}
                    removeExperience={removeExperience}
                    watchedValues={watchedValues}
                />
            </div>

            <div className="flex flex-col gap-3 bg-orange-50 border border-orange-300 rounded-xl px-6 py-4">
                <SkillsSection
                    register={register}
                    errors={errors}
                    appendSkill={appendSkill}
                    skillFields={skillFields}
                    watch={watch}
                    removeSkill={removeSkill}
                />
            </div>

            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap size={15} /> Educational Background
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        label="School Name"
                        name="school_name"
                        {...register("school_name", {
                            required: "Required",
                        })}
                        error={errors.school_name}
                        placeholder="Central Philippine State University"
                    />
                    <Select
                        label="Degree"
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
                        label="Course"
                        name="course"
                        {...register("course", {
                            required: "Required",
                        })}
                        error={errors.course}
                        placeholder="BSIT"
                    />

                    <Input
                        label="Year Graduated"
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
