import { UserCircle, MapPin, User, Calendar } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";

export default function PersonalInfoSection({ form, set, editing }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UserCircle size={15} /> Basic Information
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="First Name *"
                        name="firstName"
                        value={form.firstName}
                        onChange={set("firstName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Middle Name"
                        name="middleName"
                        value={form.middleName}
                        onChange={set("middleName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Last Name *"
                        name="lastName"
                        value={form.lastName}
                        onChange={set("lastName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Suffix"
                        name="suffix"
                        value={form.suffix}
                        onChange={set("suffix")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={form.dob}
                        onChange={set("dob")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={set("gender")}
                        disabled={!editing}
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                        ]}
                    />
                    <Select
                        label="Marital Status"
                        name="maritalStatus"
                        value={form.maritalStatus}
                        onChange={set("maritalStatus")}
                        disabled={!editing}
                        options={[
                            { label: "Single", value: "single" },
                            { label: "Married", value: "married" },
                            { label: "Divorced", value: "divorced" },
                            { label: "Widowed", value: "widowed" },
                        ]}
                    />
                    <Input
                        label="Nationality *"
                        name="nationality"
                        value={form.nationality}
                        onChange={set("nationality")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-green-50 border border-green-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={15} /> Address Information
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Region *"
                        name="region"
                        value={form.region}
                        onChange={set("region")}
                        disabled={!editing}
                    />
                    <Input
                        label="Province *"
                        name="province"
                        value={form.province}
                        onChange={set("province")}
                        disabled={!editing}
                    />
                    <Input
                        label="City / Municipal *"
                        name="city_municipal"
                        value={form.city_municipal}
                        onChange={set("city_municipal")}
                        disabled={!editing}
                    />
                    <Input
                        label="Barangay *"
                        name="barangay"
                        value={form.barangay}
                        onChange={set("barangay")}
                        disabled={!editing}
                    />
                    <Input
                        label="Zip Code *"
                        name="zip_code"
                        type="number"
                        value={form.zip_code}
                        onChange={set("zip_code")}
                        disabled={!editing}
                    />
                    <Input
                        label="House / Lot / Street / Purok"
                        name="house_lot_street"
                        value={form.house_lot_street}
                        onChange={set("house_lot_street")}
                        disabled={!editing}
                    />
                </div>
            </div>
        </div>
    );
}
