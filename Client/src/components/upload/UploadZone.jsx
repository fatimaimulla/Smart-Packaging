import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { clsx } from "clsx";

const UploadZone = ({ onUpload, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/heic": [],
    },
    disabled,
    maxFiles: 2,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[240px]",
        isDragActive
          ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
          : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50/50 bg-gray-50/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-emerald-500">
        {isDragActive ? <UploadCloud size={32} /> : <ImageIcon size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {isDragActive ? "Drop images here" : "Drag & Drop or Click to Upload"}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        Upload Top View and Side View photos. JPG, PNG or HEIC supported.
      </p>
      <button className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
        Select from Computer
      </button>
    </div>
  );
};

export default UploadZone;
