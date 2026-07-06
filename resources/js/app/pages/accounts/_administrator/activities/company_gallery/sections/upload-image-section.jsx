import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { Download, Images, UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";

const EVENT_OPTIONS = [
    { value: "", label: "Select an event" },
    { value: "1", label: "Q3 Townhall Meeting" },
    { value: "2", label: "New Health Benefits Rollout" },
    { value: "3", label: "Annual Company Picnic" },
    { value: "4", label: "Return to Office Preferences" },
    { value: "5", label: "Engineering Team Hackathon" },
];

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]);
const MAX_FILE_SIZE_MB = 5;

export default function UploadImageSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: "", event: "", driveLink: "" });
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState("");
    const inputRef = useRef(null);

    const updateForm = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleFiles = (incoming) => {
        setFileError("");
        const valid = [];
        const rejected = [];

        Array.from(incoming).forEach((f) => {
            if (!ALLOWED_TYPES.has(f.type)) {
                rejected.push(`"${f.name}" is not a supported image type.`);
            } else if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                rejected.push(`"${f.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
            } else {
                valid.push(f);
            }
        });

        if (rejected.length > 0) setFileError(rejected[0]);
        if (valid.length > 0) setFiles((prev) => [...prev, ...valid]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleClose = () => {
        setIsOpen(false);
        setForm({ title: "", event: "", driveLink: "" });
        setFiles([]);
        setFileError("");
    };

    return (
        <div>
            <Button variant="engagement" onClick={() => setIsOpen(true)}>
                <Download size={16} className="mr-2" />
                Upload Photo
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                width="max-w-lg"
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 shrink-0">
                            <Images size={20} />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Event Photo Gallery
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Create a photo gallery by uploading event images for attendees to view and download.
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col gap-4 pb-2 p-2">
                    <Input
                        label="Event title"
                        name="title"
                        value={form.title}
                        placeholder="e.g. Townhall Photos"
                        onChange={updateForm("title")}
                    />

                    <Select
                        label="Linked event"
                        name="event"
                        value={form.event}
                        onChange={updateForm("event")}
                        options={EVENT_OPTIONS}
                    />

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1.5">Upload Photo</p>
                        <div
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-all
                                ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
                        >
                            {files.length > 0 ? (
                                <div className="flex flex-wrap gap-2 p-3 justify-center">
                                    {files.map((f, i) => (
                                        <img key={i} src={URL.createObjectURL(f)} className="h-16 w-16 object-cover rounded-lg" alt="" />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={28} className="text-gray-400" />
                                    <p className="text-sm text-gray-400 text-center px-4">
                                        Drag & drop your photos here<br />
                                        <span className="text-xs">or click to browse and upload files.</span>
                                    </p>
                                </>
                            )}
                        </div>
                        {fileError && (
                            <p className="text-xs text-red-500 mt-1">{fileError}</p>
                        )}
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>

                    <Input
                        label="Google Drive Folder Link"
                        name="driveLink"
                        value={form.driveLink}
                        placeholder="https://drive.google.com/..."
                        onChange={updateForm("driveLink")}
                    />

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <Button variant="secondary" outlined onClick={handleClose}>Cancel</Button>
                        <Button variant="secondary" >Upload Photo</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
