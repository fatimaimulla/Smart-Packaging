import React from "react";
import { Box, Ruler, Layers, CheckCircle } from "lucide-react";

const OverviewCard = ({ data }) => {
  const { fefco, material, thickness, dimensions, internalDimensions } = data;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 h-full border border-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-semibold text-[#0D1B2A]">
          Packaging Summary
        </h3>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold flex items-center gap-1.5 border border-emerald-100">
          <CheckCircle size={14} />
          Optimal Fit
        </span>
      </div>

      <div className="space-y-6">
        {/* Box Info */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Box size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
              Box Type
            </h4>
            <p className="text-lg font-bold text-[#0D1B2A]">{fefco}</p>
            <p className="text-sm text-gray-600">
              {material} • {thickness}mm
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Dimensions Comparison */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
              <Ruler size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Dimensions (L × W × H)
              </h4>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Product</span>
                <span className="font-mono font-medium text-gray-800">
                  {dimensions.l} × {dimensions.w} × {dimensions.h} mm
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-700 font-medium">
                  Final Box (Internal)
                </span>
                <span className="font-mono font-bold text-[#0D1B2A] bg-emerald-50 px-2 py-0.5 rounded">
                  {internalDimensions.l} × {internalDimensions.w} ×{" "}
                  {internalDimensions.h} mm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
