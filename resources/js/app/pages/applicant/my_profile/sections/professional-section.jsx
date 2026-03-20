import { Building2, Award, GraduationCap } from "lucide-react";
import React from "react";
import { Field, SectionCard, PersonIcon, CalendarIcon } from "./share-section";
// import { Field, SectionCard, PersonIcon, CalendarIcon } from "./shared";

export default function ProfessionalSection({ form, set, editing }) {
    return (
        <>
            <SectionCard
                title="Work Experience"
                icon={<Building2 size={16} />}
                accent="violet"
            >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="Job Title *"
                        value={form.jobTitle}
                        onChange={set("jobTitle")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Company Name *"
                        value={form.companyName}
                        onChange={set("companyName")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Employment Type"
                        value={form.employmentType}
                        onChange={set("employmentType")}
                        editing={editing}
                        options={[
                            { label: "Full-time", value: "full_time" },
                            { label: "Part-time", value: "part_time" },
                            { label: "Contract", value: "contract" },
                            { label: "Freelance", value: "freelance" },
                            { label: "Internship", value: "internship" },
                        ]}
                    />
                    <Field
                        label="Industry"
                        value={form.industry}
                        onChange={set("industry")}
                        editing={editing}
                        options={[
                            { label: "Information Technology", value: "it" },
                            { label: "Healthcare", value: "healthcare" },
                            { label: "Education", value: "education" },
                            { label: "Finance", value: "finance" },
                            { label: "Manufacturing", value: "manufacturing" },
                            { label: "Retail", value: "retail" },
                            { label: "Government", value: "government" },
                            { label: "Other", value: "other" },
                        ]}
                    />
                    <Field
                        label="Start Date"
                        value={form.workStartDate}
                        onChange={set("workStartDate")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="date"
                    />
                    <Field
                        label="End Date"
                        value={form.workEndDate}
                        onChange={set("workEndDate")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="date"
                    />
                    <Field
                        label="Years of Experience"
                        value={form.yearsExp}
                        onChange={set("yearsExp")}
                        icon={<PersonIcon />}
                        editing={editing}
                        type="number"
                    />
                    <Field
                        label="Monthly Salary (₱)"
                        value={form.salary}
                        onChange={set("salary")}
                        icon={<PersonIcon />}
                        editing={editing}
                        type="number"
                    />
                </div>
            </SectionCard>

            {/* ── Skills & Expertise ── */}
            <SectionCard
                title="Skills & Expertise"
                icon={<Award size={16} />}
                accent="amber"
            >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="Primary Skill *"
                        value={form.primarySkill}
                        onChange={set("primarySkill")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Skill Level"
                        value={form.skillLevel}
                        onChange={set("skillLevel")}
                        editing={editing}
                        options={[
                            { label: "Beginner", value: "beginner" },
                            { label: "Intermediate", value: "intermediate" },
                            { label: "Advanced", value: "advanced" },
                            { label: "Expert", value: "expert" },
                        ]}
                    />
                    <Field
                        label="Secondary Skills"
                        value={form.secondarySkills}
                        onChange={set("secondarySkills")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Certifications"
                        value={form.certifications}
                        onChange={set("certifications")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="License / PRC No."
                        value={form.licenseNo}
                        onChange={set("licenseNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="License Expiry"
                        value={form.licenseExpiry}
                        onChange={set("licenseExpiry")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="date"
                    />
                </div>
            </SectionCard>

            {/* ── Educational Background ── */}
            <SectionCard
                title="Educational Background"
                icon={<GraduationCap size={16} />}
                accent="sky"
            >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="School Name *"
                        value={form.schoolName}
                        onChange={set("schoolName")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Degree Level"
                        value={form.degreeLevel}
                        onChange={set("degreeLevel")}
                        editing={editing}
                        options={[
                            { label: "High School", value: "high_school" },
                            {
                                label: "Vocational / TESDA",
                                value: "vocational",
                            },
                            { label: "Associate", value: "associate" },
                            { label: "Bachelor's", value: "bachelors" },
                            { label: "Master's", value: "masters" },
                            { label: "Doctorate", value: "doctorate" },
                        ]}
                    />
                    <Field
                        label="Course / Program"
                        value={form.course}
                        onChange={set("course")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Year Graduated"
                        value={form.yearGraduated}
                        onChange={set("yearGraduated")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="number"
                    />
                    <Field
                        label="Award / Honors"
                        value={form.awardHonors}
                        onChange={set("awardHonors")}
                        editing={editing}
                        options={[
                            { label: "Summa Cum Laude", value: "summa" },
                            { label: "Magna Cum Laude", value: "magna" },
                            { label: "Cum Laude", value: "cum_laude" },
                            { label: "With Distinction", value: "distinction" },
                            { label: "None", value: "none" },
                        ]}
                    />
                    <Field
                        label="School Address"
                        value={form.schoolAddress}
                        onChange={set("schoolAddress")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                </div>
            </SectionCard>
        </>
    );
}
