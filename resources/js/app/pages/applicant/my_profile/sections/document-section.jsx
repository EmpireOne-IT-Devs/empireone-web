import { FileBadge, FileCheck, User, Calendar } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import ImageUpload from "@/app/_components/image-upload";

export default function DocumentsSection({ form, set, editing }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-purple-100 border border-purple-300 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileBadge size={15} /> Government-Issued IDs
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="SSS Number"
                        name="sssNo"
                        value={form.sssNo}
                        onChange={set("sssNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="PhilHealth Number"
                        name="philhealthNo"
                        value={form.philhealthNo}
                        onChange={set("philhealthNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Pag-IBIG Number"
                        name="pagibigNo"
                        value={form.pagibigNo}
                        onChange={set("pagibigNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="TIN Number"
                        name="tinNo"
                        value={form.tinNo}
                        onChange={set("tinNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="UMID / National ID"
                        name="umidNo"
                        value={form.umidNo}
                        onChange={set("umidNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Passport Number"
                        name="passportNo"
                        value={form.passportNo}
                        onChange={set("passportNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Passport Expiry"
                        name="passportExpiry"
                        type="date"
                        value={form.passportExpiry}
                        onChange={set("passportExpiry")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Driver's License No."
                        name="driversLicenseNo"
                        value={form.driversLicenseNo}
                        onChange={set("driversLicenseNo")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 bg-green-100 border border-green-300 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileCheck size={15} /> File Uploads
                </span>
                <p className="text-xs text-gray-400 -mt-1">
                    Accepted formats: JPG, PNG — max 5 MB each.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <ImageUpload
                        label="Resume / CV *"
                        name="resumeFile"
                        onChange={set("resumeFile")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="Valid ID (Front)"
                        name="validIdFront"
                        onChange={set("validIdFront")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="Valid ID (Back)"
                        name="validIdBack"
                        onChange={set("validIdBack")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="Diploma / TOR"
                        name="diplomaFile"
                        onChange={set("diplomaFile")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="Certificate of Employment"
                        name="coeFile"
                        onChange={set("coeFile")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="PRC License / Certificate"
                        name="prcFile"
                        onChange={set("prcFile")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="NBI / Police Clearance"
                        name="clearanceFile"
                        onChange={set("clearanceFile")}
                        disabled={!editing}
                    />
                    <ImageUpload
                        label="Medical Certificate"
                        name="medicalFile"
                        onChange={set("medicalFile")}
                        disabled={!editing}
                    />
                </div>
            </div>
        </div>
    );
}
