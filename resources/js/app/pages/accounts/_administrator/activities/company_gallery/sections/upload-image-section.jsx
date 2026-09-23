
import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { create_company_gallery } from "@/app/services/engagement-gallery-service";
import { setAlert } from "@/app/redux/app-slice";
import { Download, Images, UploadCloud, X } from "lucide-react";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const MIN_IMAGES = 5;
const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 999;

export default function UploadImageSection({ onUploadSuccess }) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    driveLink: "",
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);

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

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle selected / dropped files
   */
  const handleFiles = (incoming) => {
    setFileError("");

    const incomingFiles = Array.from(incoming || []);

    if (incomingFiles.length === 0) {
      return;
    }

    // Check maximum image count
    if (files.length + incomingFiles.length > MAX_IMAGES) {
      const remainingSlots = MAX_IMAGES - files.length;

      if (remainingSlots <= 0) {
        setFileError(
          `You have already selected the maximum of ${MAX_IMAGES} images.`
        );
      } else {
        setFileError(
          `You can only add ${remainingSlots} more image${
            remainingSlots > 1 ? "s" : ""
          }. Maximum is ${MAX_IMAGES} images.`
        );
      }

      return;
    }

    const valid = [];
    const rejected = [];

    incomingFiles.forEach((file) => {
      // Validate image type
      if (!ALLOWED_TYPES.has(file.type)) {
        rejected.push(
          `"${file.name}" is not a supported image type.`
        );
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        rejected.push(
          `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`
        );
        return;
      }

      valid.push(file);
    });

    // Show first validation error
    if (rejected.length > 0) {
      setFileError(rejected[0]);
    }

    // Add valid files
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);

      const newUrls = valid.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  /**
   * Remove selected image
   */
  const removeFile = (indexToRemove) => {
    if (previewUrls[indexToRemove]) {
      URL.revokeObjectURL(previewUrls[indexToRemove]);
    }

    setFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setFileError("");
  };

  /**
   * Handle drag and drop
   */
  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    if (isSubmitting) {
      return;
    }

    handleFiles(e.dataTransfer.files);
  };

  /**
   * Upload gallery
   */
  const handleUpload = async () => {
    // Validate gallery title
    if (!form.title.trim()) {
      setFileError("A gallery title is required.");
      return;
    }

    // Validate minimum images
    if (files.length < MIN_IMAGES) {
      setFileError(
        `Please select at least ${MIN_IMAGES} images to create a gallery.`
      );
      return;
    }

    // Validate maximum images
    if (files.length > MAX_IMAGES) {
      setFileError(
        `You can upload a maximum of ${MAX_IMAGES} images per gallery.`
      );
      return;
    }

    setIsSubmitting(true);
    setFileError("");

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("driveLink", form.driveLink);

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      await create_company_gallery(formData);

      dispatch(
        setAlert({
          type: "success",
          title: "Gallery uploaded successfully!",
          open: true,
        })
      );

      if (typeof onUploadSuccess === "function") {
        onUploadSuccess();
      }

      handleClose();
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "Upload failed. Please try again.";

      setFileError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Close modal and reset form
   */
  const handleClose = () => {
    previewUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setIsOpen(false);

    setForm({
      title: "",
      description: "",
      driveLink: "",
    });

    setFiles([]);
    setPreviewUrls([]);
    setFileError("");
    setIsDragging(false);
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Upload Button */}
      <Button
        variant="engagement"
        onClick={() => setIsOpen(true)}
      >
        <Download size={16} className="mr-2" />
        Upload Photo
      </Button>

      {/* Upload Modal */}
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
                Create a photo gallery by uploading event images
                for attendees to view and download.
              </p>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4 pb-2 p-2">
          {/* Gallery Title */}
          <Input
            label="Gallery title"
            name="title"
            value={form.title}
            placeholder="e.g. Townhall Photos"
            onChange={updateForm("title")}
            disabled={isSubmitting}
          />

          {/* Gallery Description */}
          <Input
            label="Gallery description"
            name="description"
            value={form.description}
            placeholder="Add a short description for this gallery"
            onChange={updateForm("description")}
            disabled={isSubmitting}
          />

          {/* Image Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-gray-700">
                Upload Photos
              </p>

              <span className="text-xs text-gray-400">
                {files.length}/{MAX_IMAGES} images
              </span>
            </div>

            <div
              onClick={() => {
                if (
                  !isSubmitting &&
                  files.length < MAX_IMAGES
                ) {
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();

                if (
                  !isSubmitting &&
                  files.length < MAX_IMAGES
                ) {
                  setIsDragging(true);
                }
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-all
                ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                ${
                  files.length >= MAX_IMAGES
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
            >
              {previewUrls.length > 0 ? (
                <div className="flex flex-col items-center gap-3 p-3 w-full">
                  {/* Image Preview Grid */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {previewUrls.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="relative group/thumb"
                      >
                        <img
                          src={url}
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                          alt={`Preview ${index + 1}`}
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          disabled={isSubmitting}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/thumb:opacity-100 transition-opacity disabled:cursor-not-allowed"
                          aria-label="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Image Count */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-600">
                      {files.length} of {MAX_IMAGES} images selected
                    </p>

                    {files.length < MIN_IMAGES && (
                      <p className="text-xs text-orange-500 mt-1">
                        Select at least {MIN_IMAGES} images
                      </p>
                    )}

                    {files.length >= MIN_IMAGES &&
                      files.length < MAX_IMAGES && (
                        <p className="text-xs text-gray-400 mt-1">
                          You can add up to{" "}
                          {MAX_IMAGES - files.length} more
                          {MAX_IMAGES - files.length > 1
                            ? " images"
                            : " image"}
                        </p>
                      )}

                    {files.length === MAX_IMAGES && (
                      <p className="text-xs text-green-600 mt-1">
                        Maximum of {MAX_IMAGES} images reached
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud
                    size={28}
                    className="text-gray-400"
                  />

                  <p className="text-sm text-gray-400 text-center px-4">
                    Drag & drop your photos here
                    <br />

                    <span className="text-xs">
                      or click to browse and upload files.
                    </span>

                    <br />

                    <span className="text-xs text-gray-400">
                      Minimum {MIN_IMAGES} · Maximum{" "}
                      {MAX_IMAGES} images
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* File Error */}
            {fileError && (
              <p className="text-xs text-red-500 mt-1">
                {fileError}
              </p>
            )}

            {/* File Input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);

                // Reset input so the same files can be selected again
                e.target.value = "";
              }}
              disabled={
                isSubmitting || files.length >= MAX_IMAGES
              }
            />
          </div>

          {/* Google Drive Link */}
          <Input
            label="Google Drive Folder Link (optional)"
            name="driveLink"
            value={form.driveLink}
            placeholder="https://drive.google.com/..."
            onChange={updateForm("driveLink")}
            disabled={isSubmitting}
          />

          {/* Footer */}
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
              disabled={
                isSubmitting ||
                files.length < MIN_IMAGES ||
                files.length > MAX_IMAGES
              }
            >
              {isSubmitting
                ? "Uploading..."
                : `Upload ${files.length > 0 ? `(${files.length})` : "Photo"}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}