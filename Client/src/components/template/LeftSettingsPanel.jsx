import React from "react";
import { Info, Minus, Plus, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

const LeftSettingsPanel = ({ settings, setSettings }) => {
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const incrementThickness = () => {
    handleChange(
      "thickness",
      parseFloat((settings.thickness + 0.1).toFixed(1))
    );
  };

  const decrementThickness = () => {
    handleChange(
      "thickness",
      Math.max(0.1, parseFloat((settings.thickness - 0.1).toFixed(1)))
    );
  };

  return (
    <div className="p-5 flex flex-col gap-8">
      {/* 1. Custom Size Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Custom size</h3>
            <Info size={14} className="text-gray-400" />
          </div>

          {/* Unit Toggle */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white shadow-sm rounded-md transition-all">
              mm
            </button>
            <button className="px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:text-gray-700 transition-all">
              in
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Length */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Length
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.l}
                onChange={(e) => handleChange("l", Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                mm
              </span>
            </div>
          </div>

          {/* Width */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Width
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.w}
                onChange={(e) => handleChange("w", Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                mm
              </span>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Height
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.h}
                onChange={(e) => handleChange("h", Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                mm
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Custom Thickness */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">
          Custom thickness
        </label>
        <span className="text-xs text-gray-400 mb-3 block">(0.2~3mm)</span>

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
          <button
            onClick={decrementThickness}
            className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 border-r border-gray-300 transition-colors"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <div className="flex-1 flex items-center justify-center font-semibold text-sm text-gray-800 bg-white">
            {settings.thickness}
          </div>
          <button
            onClick={incrementThickness}
            className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 border-l border-gray-300 transition-colors"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 3. Choose Material */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-bold text-gray-900">
            Choose material
          </label>
          <Info size={14} className="text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={settings.material}
            onChange={(e) => handleChange("material", e.target.value)}
            className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="3ply">3-Ply Corrugated</option>
            <option value="5ply">5-Ply Heavy Duty</option>
            <option value="recycled">100% Recycled Kraft</option>
            <option value="White card board">White card board</option>
            <option value="Kraft paper">Kraft paper</option>
            <option value="Corrugated Board">Corrugated Board</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 4. Size Mode */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-bold text-gray-900">Size mode</label>
          <Info size={14} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200">
          <button
            onClick={() => handleChange("sizeMode", "manufacture")}
            className={clsx(
              "py-1.5 text-xs font-bold rounded-md transition-all",
              settings.sizeMode === "manufacture"
                ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Manufacture
          </button>
          <button
            onClick={() => handleChange("sizeMode", "inner")}
            className={clsx(
              "py-1.5 text-xs font-bold rounded-md transition-all",
              settings.sizeMode === "inner"
                ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Inner
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSettingsPanel;
