import React, { useRef, useState, useEffect } from "react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_posts_thunk } from "@/app/redux/engagement-thunk";
import { upload_gallery_service } from "@/app/services/engagement-service";
import { setAlert } from "@/app/redux/app-slice";
import { Download, Images, UploadCloud, X } from "lucide-react";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);
const MAX_FILE_SIZE_MB = 999;

export default function UploadImageSection() {
  const dispatch = useDispatch();
  const { posts } = useSelector((s) => s.engagement);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", event: "", driveLink: "" });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) dispatch(get_engagement_posts_thunk());
  }, [isOpen, dispatch]);

  const eventOptions = [
    { value: "", label: "Select an event" },
    ...(posts || [])
      .filter((p) => p.category === "Event")
      .map((p) => ({ value: String(p.id), label: p.title ?? p.headline })),
  ];

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const updateForm = (field) => (e) => {
    let value;
    if (e && typeof e === "object" && "target" in e) {
      value = e.target.value;
    } else if (e && typeof e === "object" && "value" in e) {
      value = e.value;
    } else {
      value = e;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

    if (rejected.length > 0) {
      setFileError(rejected[0]);
    }

    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
      const newUrls = valid.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeFile = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!form.title.trim()) {
      setFileError("An event title is required.");
      return;
    }
    if (!form.event) {
      setFileError("Please select a linked event.");
      return;
    }
    if (files.length === 0) {
      setFileError("Please select or drop at least one image file to upload.");
      return;
    }

    setIsSubmitting(true);
    setFileError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("event", form.event);
    formData.append("driveLink", form.driveLink);

    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      await upload_gallery_service(formData);
      dispatch(
        setAlert({
          type: "success",
          title: "Gallery uploaded successfully!",
          open: true,
        })
      );
      dispatch(get_engagement_posts_thunk());
      handleClose();
    } catch (err) {
      const message =
        err.response?.data?.message ?? "Upload failed. Please try again.";
      setFileError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setIsOpen(false);
    setForm({ title: "", event: "", driveLink: "" });
    setFiles([]);
    setPreviewUrls([]);
    setFileError("");
    setIsSubmitting(false);
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
            disabled={isSubmitting}
          />

          <Select
            label="Linked event"
            name="event"
            value={form.event}
            onChange={updateForm("event")}
            options={eventOptions}
            disabled={isSubmitting}
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">Upload Photo</p>
            <div
              onClick={() => !isSubmitting && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                !isSubmitting && setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => !isSubmitting && handleDrop(e)}
              className={`cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-all
                ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {previewUrls.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 justify-center">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative group/thumb">
                      <img
                        src={url}
                        className="h-16 w-16 object-cover rounded-lg"
                        alt="Preview File"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
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
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Google Drive Folder Link (optional)"
            name="driveLink"
            value={form.driveLink}
            placeholder="https://drive.google.com/..."
            onChange={updateForm("driveLink")}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="secondary"
              outlined
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleUpload}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}