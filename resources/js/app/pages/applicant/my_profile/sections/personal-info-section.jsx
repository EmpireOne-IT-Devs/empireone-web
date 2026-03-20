import { UserCircle, MapPin } from "lucide-react";
import React from "react";
import { Field, SectionCard, PersonIcon, CalendarIcon } from "./share-section";
// import { Field, SectionCard, PersonIcon, CalendarIcon } from "./shared";

export default function PersonalInfoSection({ form, set, editing }) {
    return (
        <>
            {/* ── Basic Information ── */}
            <SectionCard title="Basic Information" icon={<UserCircle size={16} />} accent="indigo">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="First Name *"
                        value={form.firstName}
                        onChange={set("firstName")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Middle Name"
                        value={form.middleName}
                        onChange={set("middleName")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Last Name *"
                        value={form.lastName}
                        onChange={set("lastName")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Suffix"
                        value={form.suffix}
                        onChange={set("suffix")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Date of Birth"
                        value={form.dob}
                        onChange={set("dob")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="date"
                    />
                    <Field
                        label="Gender"
                        value={form.gender}
                        onChange={set("gender")}
                        editing={editing}
                        options={[
                            { label: "Male",   value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other",  value: "other" },
                        ]}
                    />
                    <Field
                        label="Marital Status"
                        value={form.maritalStatus}
                        onChange={set("maritalStatus")}
                        editing={editing}
                        options={[
                            { label: "Single",   value: "single" },
                            { label: "Married",  value: "married" },
                            { label: "Divorced", value: "divorced" },
                            { label: "Widowed",  value: "widowed" },
                        ]}
                    />

                    {/* Nationality — always read-only */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Nationality
                        </label>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/60 border border-white/80 rounded-xl">
                            <span className="text-slate-400"><PersonIcon /></span>
                            <span className="text-sm font-semibold text-slate-700">Filipino</span>
                            <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-medium">
                                Fixed
                            </span>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ── Address Information ── */}
            <SectionCard title="Address Information" icon={<MapPin size={16} />} accent="emerald">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="Region *"
                        value={form.region}
                        onChange={set("region")}
                        editing={editing}
                    />
                    <Field
                        label="Province *"
                        value={form.province}
                        onChange={set("province")}
                        editing={editing}
                    />
                    <Field
                        label="City / Municipal *"
                        value={form.city_municipal}
                        onChange={set("city_municipal")}
                        editing={editing}
                    />
                    <Field
                        label="Barangay *"
                        value={form.barangay}
                        onChange={set("barangay")}
                        editing={editing}
                    />
                    <Field
                        label="Zip Code *"
                        value={form.zip_code}
                        onChange={set("zip_code")}
                        editing={editing}
                        type="number"
                    />
                    <Field
                        label="House / Lot / Street / Purok"
                        value={form.house_lot_street}
                        onChange={set("house_lot_street")}
                        editing={editing}
                    />
                </div>
            </SectionCard>
        </>
    );
}