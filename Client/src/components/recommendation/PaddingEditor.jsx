import React from "react";
import { Sliders, CheckCircle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

const PaddingEditor = ({ padding, setPadding }) => {
  // Simple logic for fit status
  const getFitStatus = (val) => {
    if (val < 2)
      return {
        label: "Tight Fit",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: AlertCircle,
      };
    if (val > 10)
      return {
        label: "Loose Fit",
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: AlertCircle,
      };
    return {
      label: "Optimal Fit",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle,
    };
  };

  const status = getFitStatus(padding);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
            <Sliders size={20} className="text-blue-500" />
            Padding & Fit
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Adjust filler thickness for safe clearance.
          </p>
        </div>

        <div
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
            status.bg,
            status.color
          )}
        >
          <StatusIcon size={14} />
          {status.label}
        </div>
      </div>

      <div className="space-y-6">
        {/* Padding Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Protective Padding
            </label>
            <span className="text-sm font-bold text-[#0D1B2A]">
              {padding} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0mm (Tight)</span>
            <span>20mm (Loose)</span>
          </div>
        </div>

        {/* Read-only sliders for visual effect */}
        <div className="opacity-60 pointer-events-none grayscale">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Side Clearance
            </label>
            <span className="text-sm font-bold text-[#0D1B2A]">
              {padding} mm
            </span>
          </div>
          <input
            type="range"
            value={padding}
            readOnly
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none"
          />
        </div>
      </div>

      {padding > 15 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-2 items-start">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-700">
            Large padding values increase box volume and material costs.
            Consider reducing if product is not fragile.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaddingEditor;
