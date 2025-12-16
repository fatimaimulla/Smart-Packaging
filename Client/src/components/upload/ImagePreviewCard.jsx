import React from "react";
import {
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";

const StatusBadge = ({ type, text }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    success: <CheckCircle size={12} />,
    warning: <AlertTriangle size={12} />,
    error: <AlertCircle size={12} />,
  };

  return (
    <span
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        styles[type]
      )}
    >
      {icons[type]}
      {text}
    </span>
  );
};

const ImagePreviewCard = ({ image, onDelete, onReplace }) => {
  // Mock validation logic based on props (in a real app, this comes from the backend/AI)
  const isReferenceDetected = image.validation?.referenceDetected;
  const isTiltOk = image.validation?.tilt < 5;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex gap-4 transition hover:shadow-lg border border-gray-100">
      {/* Thumbnail */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <img
          src={image.preview}
          alt={image.type}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-medium text-center py-1 backdrop-blur-sm">
          {image.type}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800 text-sm">
              {image.name}
            </h4>
            <div className="flex gap-1">
              <button
                onClick={onReplace}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Replace"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isReferenceDetected ? (
              <StatusBadge type="success" text={`Ref: Coin (92%)`} />
            ) : (
              <StatusBadge type="error" text="Ref not detected" />
            )}

            {isTiltOk ? (
              <StatusBadge type="success" text="Tilt OK" />
            ) : (
              <StatusBadge type="warning" text="High Tilt detected" />
            )}
          </div>
        </div>

        {/* Warnings */}
        {!isTiltOk && (
          <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
            <AlertTriangle size={10} />
            Try taking the photo directly from above.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewCard;
