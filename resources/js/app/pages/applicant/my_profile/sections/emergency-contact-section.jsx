import { Phone, User, Heart, Users } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";

export default function EmergencyContactSection({ form, set, editing }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-red-50 border border-red-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={15} /> Emergency Contact
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Contact Name *"
                        name="emergencyContactName"
                        value={form.emergencyContactName}
                        onChange={set("emergencyContactName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Relationship *"
                        name="emergencyContactRelationship"
                        value={form.emergencyContactRelationship}
                        onChange={set("emergencyContactRelationship")}
                        disabled={!editing}
                        options={[
                            { label: "Spouse", value: "spouse" },
                            { label: "Parent", value: "parent" },
                            { label: "Sibling", value: "sibling" },
                            { label: "Child", value: "child" },
                            { label: "Relative", value: "relative" },
                            { label: "Friend", value: "friend" },
                            { label: "Other", value: "other" },
                        ]}
                    />
                    <Input
                        label="Phone Number *"
                        name="emergencyContactPhone"
                        value={form.emergencyContactPhone}
                        onChange={set("emergencyContactPhone")}
                        iconLeft={<Phone size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Email Address"
                        name="emergencyContactEmail"
                        type="email"
                        value={form.emergencyContactEmail}
                        onChange={set("emergencyContactEmail")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <div className="col-span-2">
                        <Input
                            label="Address"
                            name="emergencyContactAddress"
                            value={form.emergencyContactAddress}
                            onChange={set("emergencyContactAddress")}
                            iconLeft={<User size={14} />}
                            disabled={!editing}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-amber-50 border border-amber-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={15} /> Father's Information
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="First Name *"
                        name="fatherFirstName"
                        value={form.fatherFirstName}
                        onChange={set("fatherFirstName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Middle Name"
                        name="fatherMiddleName"
                        value={form.fatherMiddleName}
                        onChange={set("fatherMiddleName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Last Name *"
                        name="fatherLastName"
                        value={form.fatherLastName}
                        onChange={set("fatherLastName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Contact No."
                        name="fatherContactNo"
                        value={form.fatherContactNo}
                        onChange={set("fatherContactNo")}
                        iconLeft={<Phone size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-pink-50 border border-pink-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Heart size={15} /> Mother's Information
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="First Name *"
                        name="motherFirstName"
                        value={form.motherFirstName}
                        onChange={set("motherFirstName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Middle Name"
                        name="motherMiddleName"
                        value={form.motherMiddleName}
                        onChange={set("motherMiddleName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Last Name *"
                        name="motherLastName"
                        value={form.motherLastName}
                        onChange={set("motherLastName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Contact No."
                        name="motherContactNo"
                        value={form.motherContactNo}
                        onChange={set("motherContactNo")}
                        iconLeft={<Phone size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>
        </div>
    );
}
