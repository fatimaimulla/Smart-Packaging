import React, { useState } from "react";
import {
  Edit2,
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
  ArrowRight,
  Box,
} from "lucide-react";
import { clsx } from "clsx";

const DimensionsPanel = ({ dimensions, onUpdateDimensions }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fragility, setFragility] = useState("low");

  const handleDimensionChange = (key, value) => {
    onUpdateDimensions({ ...dimensions, [key]: Number(value) });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 h-full border border-gray-100 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
          <Box className="text-blue-500" size={24} />
          Dimensions
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Edit</span>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={clsx(
              "w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative",
              isEditMode ? "bg-blue-500" : "bg-gray-200"
            )}
          >
            <div
              className={clsx(
                "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                isEditMode ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Dimensions List */}
      <div className="flex flex-col gap-4">
        {["L", "W", "H"].map((dim) => (
          <div
            key={dim}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <span className="text-gray-400 font-medium text-lg w-8">{dim}</span>
            <div className="flex items-baseline gap-1">
              {isEditMode ? (
                <input
                  type="number"
                  value={dimensions[dim.toLowerCase()]}
                  onChange={(e) =>
                    handleDimensionChange(dim.toLowerCase(), e.target.value)
                  }
                  className="w-24 text-right text-3xl font-bold text-[#0D1B2A] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <span className="text-4xl font-bold text-[#0D1B2A] tracking-tight">
                  {dimensions[dim.toLowerCase()]}
                </span>
              )}
              <span className="text-gray-400 font-medium ml-1">mm</span>
            </div>
          </div>
        ))}
      </div>

      {/* Warnings */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 items-start">
        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-bold text-yellow-800 mb-1">
            Check Side View
          </h4>
          <p className="text-xs text-yellow-700 leading-relaxed">
            Slight perspective tilt detected in side view. Verify height
            manually for best fit.
          </p>
        </div>
      </div>

      {/* Fragility Classifier */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          Fragility Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["low", "medium", "high"].map((level) => (
            <button
              key={level}
              onClick={() => setFragility(level)}
              className={clsx(
                "py-2 px-3 rounded-lg text-sm font-medium capitalize border transition-all",
                fragility === level
                  ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-semibold text-lg flex items-center justify-center gap-2 group">
          Accept & Continue
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <button className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors">
          <RefreshCcw size={14} />
          Re-run Detection
        </button>
      </div>
    </div>
  );
};

export default DimensionsPanel;
