import { FileBadge, FileCheck } from "lucide-react";
import React from "react";
import { Field, FileUploadField, SectionCard, PersonIcon, CalendarIcon } from "./share-section";
// import { Field, FileUploadField, SectionCard, PersonIcon, CalendarIcon } from "./shared";

export default function DocumentsSection({ form, set, editing }) {
    return (
        <>
            {/* ── Government-Issued IDs ── */}
            <SectionCard title="Government-Issued IDs" icon={<FileBadge size={16} />} accent="indigo">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                        label="SSS Number"
                        value={form.sssNo}
                        onChange={set("sssNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="PhilHealth Number"
                        value={form.philhealthNo}
                        onChange={set("philhealthNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Pag-IBIG Number"
                        value={form.pagibigNo}
                        onChange={set("pagibigNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="TIN Number"
                        value={form.tinNo}
                        onChange={set("tinNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="UMID / National ID"
                        value={form.umidNo}
                        onChange={set("umidNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Passport Number"
                        value={form.passportNo}
                        onChange={set("passportNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                    <Field
                        label="Passport Expiry"
                        value={form.passportExpiry}
                        onChange={set("passportExpiry")}
                        icon={<CalendarIcon />}
                        editing={editing}
                        type="date"
                    />
                    <Field
                        label="Driver's License No."
                        value={form.driversLicenseNo}
                        onChange={set("driversLicenseNo")}
                        icon={<PersonIcon />}
                        editing={editing}
                    />
                </div>
            </SectionCard>

            {/* ── File Uploads ── */}
            <SectionCard title="File Uploads" icon={<FileCheck size={16} />} accent="emerald">
                <p className="text-xs text-slate-400 mb-4">
                    Accepted formats: PDF, JPG, PNG — max 5 MB each.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <FileUploadField
                        label="Resume / CV *"
                        description="Upload your latest resume"
                        accept=".pdf,.doc,.docx"
                        editing={editing}
                        fileName={form.resumeFile}
                        onChange={set("resumeFile")}
                    />
                    <FileUploadField
                        label="Valid ID (Front)"
                        description="Upload front of valid ID"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.validIdFront}
                        onChange={set("validIdFront")}
                    />
                    <FileUploadField
                        label="Valid ID (Back)"
                        description="Upload back of valid ID"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.validIdBack}
                        onChange={set("validIdBack")}
                    />
                    <FileUploadField
                        label="Diploma / TOR"
                        description="Upload diploma or transcript"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.diplomaFile}
                        onChange={set("diplomaFile")}
                    />
                    <FileUploadField
                        label="Certificate of Employment"
                        description="Upload COE from previous employer"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.coeFile}
                        onChange={set("coeFile")}
                    />
                    <FileUploadField
                        label="PRC License / Certificate"
                        description="Upload professional license"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.prcFile}
                        onChange={set("prcFile")}
                    />
                    <FileUploadField
                        label="NBI / Police Clearance"
                        description="Upload clearance document"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.clearanceFile}
                        onChange={set("clearanceFile")}
                    />
                    <FileUploadField
                        label="Medical Certificate"
                        description="Upload medical certificate"
                        accept="image/*,.pdf"
                        editing={editing}
                        fileName={form.medicalFile}
                        onChange={set("medicalFile")}
                    />
                </div>
            </SectionCard>
        </>
    );
}