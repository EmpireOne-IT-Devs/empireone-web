import { User, Calendar, Building2, Award, GraduationCap } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";

export default function ProfessionalSection({ form, set, editing }) {
    return (
        <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Building2 size={15} /> Work Experience
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Job Title *"
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={set("jobTitle")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Company Name *"
                        name="companyName"
                        value={form.companyName}
                        onChange={set("companyName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Employment Type"
                        name="employmentType"
                        value={form.employmentType}
                        onChange={set("employmentType")}
                        disabled={!editing}
                        options={[
                            { label: "Full-time",  value: "full_time" },
                            { label: "Part-time",  value: "part_time" },
                            { label: "Contract",   value: "contract" },
                            { label: "Freelance",  value: "freelance" },
                            { label: "Internship", value: "internship" },
                        ]}
                    />
                    <Select
                        label="Industry"
                        name="industry"
                        value={form.industry}
                        onChange={set("industry")}
                        disabled={!editing}
                        options={[
                            { label: "Information Technology", value: "it" },
                            { label: "Healthcare",             value: "healthcare" },
                            { label: "Education",              value: "education" },
                            { label: "Finance",                value: "finance" },
                            { label: "Manufacturing",          value: "manufacturing" },
                            { label: "Retail",                 value: "retail" },
                            { label: "Government",             value: "government" },
                            { label: "Other",                  value: "other" },
                        ]}
                    />
                    <Input
                        label="Start Date"
                        name="workStartDate"
                        type="date"
                        value={form.workStartDate}
                        onChange={set("workStartDate")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="End Date"
                        name="workEndDate"
                        type="date"
                        value={form.workEndDate}
                        onChange={set("workEndDate")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Years of Experience"
                        name="yearsExp"
                        type="number"
                        value={form.yearsExp}
                        onChange={set("yearsExp")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Monthly Salary (₱)"
                        name="salary"
                        type="number"
                        value={form.salary}
                        onChange={set("salary")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-orange-50 border border-orange-300 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 ">
                    <Award size={15} /> Skills & Expertise
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Primary Skill *"
                        name="primarySkill"
                        value={form.primarySkill}
                        onChange={set("primarySkill")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Skill Level"
                        name="skillLevel"
                        value={form.skillLevel}
                        onChange={set("skillLevel")}
                        disabled={!editing}
                        options={[
                            { label: "Beginner",     value: "beginner" },
                            { label: "Intermediate", value: "intermediate" },
                            { label: "Advanced",     value: "advanced" },
                            { label: "Expert",       value: "expert" },
                        ]}
                    />
                    <Input
                        label="Secondary Skills"
                        name="secondarySkills"
                        value={form.secondarySkills}
                        onChange={set("secondarySkills")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Certifications"
                        name="certifications"
                        value={form.certifications}
                        onChange={set("certifications")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="License / PRC No."
                        name="licenseNo"
                        value={form.licenseNo}
                        onChange={set("licenseNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="License Expiry"
                        name="licenseExpiry"
                        type="date"
                        value={form.licenseExpiry}
                        onChange={set("licenseExpiry")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap size={15} /> Educational Background
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="School Name *"
                        name="schoolName"
                        value={form.schoolName}
                        onChange={set("schoolName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Degree Level"
                        name="degreeLevel"
                        value={form.degreeLevel}
                        onChange={set("degreeLevel")}
                        disabled={!editing}
                        options={[
                            { label: "High School",        value: "high_school" },
                            { label: "Vocational / TESDA", value: "vocational" },
                            { label: "Associate",          value: "associate" },
                            { label: "Bachelor's",         value: "bachelors" },
                            { label: "Master's",           value: "masters" },
                            { label: "Doctorate",          value: "doctorate" },
                        ]}
                    />
                    <Input
                        label="Course / Program"
                        name="course"
                        value={form.course}
                        onChange={set("course")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Year Graduated"
                        name="yearGraduated"
                        type="number"
                        value={form.yearGraduated}
                        onChange={set("yearGraduated")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Award / Honors"
                        name="awardHonors"
                        value={form.awardHonors}
                        onChange={set("awardHonors")}
                        disabled={!editing}
                        options={[
                            { label: "Summa Cum Laude",  value: "summa" },
                            { label: "Magna Cum Laude",  value: "magna" },
                            { label: "Cum Laude",        value: "cum_laude" },
                            { label: "With Distinction", value: "distinction" },
                            { label: "None",             value: "none" },
                        ]}
                    />
                    <Input
                        label="School Address"
                        name="schoolAddress"
                        value={form.schoolAddress}
                        onChange={set("schoolAddress")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

        </div>
    );
}