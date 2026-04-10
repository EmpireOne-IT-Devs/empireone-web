import { FileBadge, FileCheck, User, Calendar } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import ImageUpload from "@/app/_components/image-upload";
import { useSelector } from "react-redux";

export default function DocumentsSection({ register, errors, form }) {
    const { data } = useSelector((store) => store.app);
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-4 md:px-6 md:py-5">
                {/* Header Section */}
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b border-purple-200 pb-2">
                    <FileBadge size={15} className="text-purple-600" />{" "}
                    Government-Issued IDs
                </span>

                {/* Responsive Grid: 1 column on mobile, 2 columns on tablet/desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Government ID Type"
                        name="government_type"
                        disabled={
                            data?.user?.personal_information?.government_type
                        }
                        {...register("government_type")}
                        placeholder="e.g. Passport, Driver's License"
                        error={errors.government_type}
                    />
                    <Input
                        label="Government ID Number"
                        name="id_number"
                        disabled={data?.user?.personal_information?.id_number}
                        {...register("id_number")}
                        placeholder="Enter ID number"
                        error={errors.id_number}
                    />
                    <Input
                        label="PhilHealth Number"
                        name="philhealth"
                        disabled={data?.user?.personal_information?.philhealth}
                        {...register("philhealth")}
                        placeholder="XX-XXXXXXXXX-X"
                        error={errors.philhealth}
                    />
                    <Input
                        label="SSS Number"
                        disabled={data?.user?.personal_information?.sss}
                        name="sss"
                        {...register("sss")}
                        placeholder="XX-XXXXXXX-X"
                        error={errors.sss}
                    />
                    <Input
                        label="Pag-IBIG Number"
                        name="pagibig"
                        disabled={data?.user?.personal_information?.pagibig}
                        {...register("pagibig")}
                        placeholder="XXXX-XXXX-XXXX"
                        error={errors.pagibig}
                    />
                    <Input
                        label="TIN Number"
                        name="tin"
                        disabled={data?.user?.personal_information?.tin}
                        {...register("tin")}
                        placeholder="XXX-XXX-XXX-000"
                        error={errors.tin}
                    />
                </div>
            </div>
        </div>
    );
}
