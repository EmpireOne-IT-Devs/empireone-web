import React, { useState, useRef, forwardRef } from "react";
import { Upload, X, FileWarning } from "lucide-react";

const ImageUpload = forwardRef(
  ({ label, name, error, onChange, onBlur, ...props }, ref) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const internalInputRef = useRef(null);

    // Sync the external ref (from RHF) with our internal ref
    const setRefs = (node) => {
      internalInputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const handleFile = (file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Manually trigger RHF's onChange with a FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        onChange({ target: { name, value: dataTransfer.files } });
      }
    };

    const removeImage = (e) => {
      e.stopPropagation();
      setPreview(null);
      // Reset the input value so RHF knows it's empty
      onChange({ target: { name, value: null } });
      if (internalInputRef.current) internalInputRef.current.value = "";
    };

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        <div
          onClick={() => internalInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all
            flex flex-col items-center justify-center p-4 min-h-[160px]
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
            ${error ? "border-red-500 bg-red-50" : ""}
          `}
        >
          <input
            type="file"
            name={name}
            className="hidden"
            accept="image/*"
            ref={setRefs}
            onChange={(e) => handleFile(e.target.files[0])}
            onBlur={onBlur}
            {...props}
          />

          {preview ? (
            <div className="relative w-full h-40">
              <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className={`mx-auto h-10 w-10 mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              <p className="text-sm text-gray-600">Click or drag image</p>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error.message}</p>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;