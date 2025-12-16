import React from "react";
import { Leaf, Wind, Recycle, ArrowDown } from "lucide-react";

const ImpactCard = ({ data }) => {
  const { co2, standardCo2, savings, recyclability } = data;

  // Calculate width percentages for the chart
  const maxVal = Math.max(co2, standardCo2);
  const standardWidth = (standardCo2 / maxVal) * 100;
  const yourWidth = (co2 / maxVal) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 h-full border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <Leaf size={20} />
        </div>
        <h3 className="text-2xl font-semibold text-[#0D1B2A]">
          Environmental Impact
        </h3>
      </div>

      {/* Carbon Footprint Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h4 className="text-sm font-bold text-gray-700">
            Carbon Footprint (g CO₂)
          </h4>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
            <ArrowDown size={12} strokeWidth={3} />
            {savings}% Reduction
          </span>
        </div>

        {/* Comparison Chart */}
        <div className="space-y-3">
          {/* Standard */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Standard Packaging</span>
              <span>{standardCo2}g</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full"
                style={{ width: `${standardWidth}%` }}
              ></div>
            </div>
          </div>

          {/* Yours */}
          <div>
            <div className="flex justify-between text-xs font-bold text-emerald-700 mb-1">
              <span>Your Design</span>
              <span>{co2}g</span>
            </div>
            <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                style={{ width: `${yourWidth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Recyclability */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Recycle size={16} className="text-emerald-600" />
            <span className="text-sm font-bold text-gray-700">
              Recyclability Score
            </span>
          </div>
          <span className="text-sm font-bold text-emerald-600">
            {recyclability}/10
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${recyclability * 10}%` }}
          ></div>
        </div>
      </div>

      {/* Highlights */}
      <ul className="text-sm text-gray-600 space-y-2 mt-2">
        <li className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          Reduced material usage by {savings}%
        </li>
        <li className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          100% curbside recyclable material
        </li>
        <li className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          Optimized volumetric weight
        </li>
      </ul>
    </div>
  );
};

export default ImpactCard;
