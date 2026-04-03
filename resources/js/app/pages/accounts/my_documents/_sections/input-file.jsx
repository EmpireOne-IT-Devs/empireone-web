import React, { useState } from 'react';

const FileUpload = () => {
  // State to store the selected file and track drag events
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle standard click-to-upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Prevent default behavior to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Remove visual indicator when item leaves the drop zone
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle the actual drop event
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto p-4">
      <label
        htmlFor="interactive-file-input"
        // Dynamic classes based on drag state
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group
          ${isDragging 
            ? 'border-blue-500 bg-blue-100 scale-[1.02]' 
            : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-500'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <svg 
            // SVG bounces higher if the user is actively dragging a file over it
            className={`w-10 h-10 mb-4 text-blue-500 transition-transform duration-300 ${isDragging ? '-translate-y-2' : 'group-hover:-translate-y-1'}`} 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 16"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          
          <p className="mb-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or PDF (Max 10MB)</p>

          {/* Conditional rendering for the file name */}
          {file && (
            <div className="mt-4 px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200 max-w-xs">
              <p className="text-sm font-medium text-gray-800 truncate">
                Selected: {file.name}
              </p>
            </div>
          )}
        </div>
        
        <input 
          id="interactive-file-input" 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept=".svg,.png,.jpg,.jpeg,.pdf"
        />
      </label>
    </div>
  );
};

export default FileUpload;