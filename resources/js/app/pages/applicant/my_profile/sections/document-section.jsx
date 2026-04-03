import { FileBadge, FileCheck, User, Calendar } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import ImageUpload from "@/app/_components/image-upload";

export default function DocumentsSection({ register, errors }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-purple-100 border border-purple-300 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileBadge size={15} /> Government-Issued IDs
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Government ID Type"
                        name="government_type"
                        {...register("government_type")}
                        placeholder="*"
                        error={errors.government_type}
                    />
                    <Input
                        label="Government ID Number"
                        name="id_number"
                        {...register("id_number")}
                        placeholder="*"
                        error={errors.id_number}
                    />
                    <Input
                        label="PhilHealth Number"
                        name="philhealth"
                        {...register("philhealth")}
                        placeholder="*"
                        error={errors.philhealth}
                    />
                    <Input
                        label="SSS Number"
                        name="sss"
                        {...register("sss")}
                        placeholder="*"
                        error={errors.sss}
                    />
                    <Input
                        label="Pag-IBIG Number"
                        name="pagibig"
                        {...register("pagibig")}
                        placeholder="*"
                        error={errors.pagibig}
                    />
                    <Input
                        label="TIN Number"
                        name="tin"
                        {...register("tin")}
                        placeholder="*"
                        error={errors.tin}
                    />
                </div>
            </div>
        </div>
    );
}
