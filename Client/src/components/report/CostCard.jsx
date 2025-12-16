import React from "react";
import { DollarSign, PieChart, TrendingDown } from "lucide-react";

const CostCard = ({ data }) => {
  const { area, cost, waste } = data;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 h-full border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <DollarSign size={20} />
        </div>
        <h3 className="text-2xl font-semibold text-[#0D1B2A]">Cost Analysis</h3>
      </div>

      {/* Main Cost Display */}
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 font-medium mb-1">
          Estimated Unit Cost
        </p>
        <div className="text-4xl font-extrabold text-[#0D1B2A] tracking-tight mb-2">
          ${cost}{" "}
          <span className="text-lg text-gray-400 font-normal">/ box</span>
        </div>
        <p className="text-xs text-gray-400">
          Based on current material pricing
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">
            Material Used
          </p>
          <p className="text-xl font-bold text-gray-800">{area} m²</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">
            Waste Ratio
          </p>
          <p className="text-xl font-bold text-blue-800">{waste}%</p>
        </div>
      </div>

      {/* Simple Bar Chart Visualization */}
      <div className="mt-auto">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Cost Breakdown</span>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden w-full">
          <div className="bg-blue-500 w-[65%]" title="Material (65%)"></div>
          <div
            className="bg-emerald-400 w-[25%]"
            title="Processing (25%)"
          ></div>
          <div className="bg-gray-300 w-[10%]" title="Waste (10%)"></div>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] text-gray-500">Material</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[10px] text-gray-500">Process</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span className="text-[10px] text-gray-500">Waste</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCard;
