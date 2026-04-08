import { Phone, User, Heart, Users } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";

export default function EmergencyContactSection({ register }) {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Emergency Contact Section */}
            <div className="flex flex-col gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-4 md:px-6">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={15} className="text-red-500" /> Emergency
                    Contact
                </span>

                {/* Grid: 1 col on mobile, 2 cols on tablets/desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                        iconLeft={<Heart size={14} />} // Changed to Heart for relationship context
                    />
                    <Input
                        label="Contact Number *"
                        name="contact_number"
                        {...register("contact_number")}
                        iconLeft={<Phone size={14} />} // Changed to Phone for number context
                    />
                    <Input
                        label="Contact Address *"
                        name="contact_address"
                        {...register("contact_address")}
                        iconLeft={<User size={14} />}
                    />
                </div>
            </div>
        </div>
    );
}
