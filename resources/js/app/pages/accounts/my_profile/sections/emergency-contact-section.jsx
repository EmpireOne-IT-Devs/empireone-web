import { Phone, User, Heart, Users } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";

export default function EmergencyContactSection({ register }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-red-50 border border-red-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={15} /> Emergency Contact
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Contact Name *"
                        name="contact_name"
                        {...register("contact_name")}
                        iconLeft={<User size={14} />}
                    />
                     <Input
                        label="Contact Relationship *"
                        name="contact_relationship"
                        {...register("contact_relationship")}
                        iconLeft={<User size={14} />}
                    />
                     <Input
                        label="Contact Number *"
                        name="contact_number"
                        {...register("contact_number")}
                        iconLeft={<User size={14} />}
                    />
                    <Input
                        label="Contact Address *"
                        name="contact_address"
                        {...register("contact_address")}
                        iconLeft={<User size={14} />}
                    />
                </div>
            </div>

            {/* <div className="flex flex-col gap-3 bg-amber-50 border border-amber-200 rounded-xl px-6 py-4">
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
            </div> */}
        </div>
    );
}
