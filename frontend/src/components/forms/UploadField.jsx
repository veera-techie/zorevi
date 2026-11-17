import React, { useRef, useState } from 'react';
import { UploadCloud, Check, Image as ImageIcon } from 'lucide-react';

const UploadField = ({ label, onFileSelect, accept = 'image/*', helperText }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    setSelectedFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    if (onFileSelect) onFileSelect(file, objectUrl);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-[#1E1B2E]">{label}</label>}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#6B35D9] bg-[#F3EEFF]'
            : 'border-[#D9D2E9] hover:border-[#6B35D9] bg-[#FAF8FE]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EAE4F5] mb-2 shadow-sm">
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-semibold text-[#6B35D9] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{selectedFileName}</span>
            </p>
            <span className="text-[10px] text-[#6B7280]">Click or drop to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#EDE8F8] flex items-center justify-center text-[#6B35D9] mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#1E1B2E]">
              Click to upload or drag & drop
            </p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">
              {helperText || 'PNG, JPG, or WEBP up to 10MB'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadField;
