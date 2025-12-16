import React from "react";
import { RefreshCw, AlertTriangle, FileDown, FileCode } from "lucide-react";
import { clsx } from "clsx";

const TemplateSettings = ({ settings, setSettings, onRegenerate }) => {
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // Mock Material Usage Calculation
  // Area in m2 roughly
  const totalWidth = settings.glueFlap + 500; // Simplified
  const totalHeight = settings.topFlap + settings.bottomFlap + 300;
  const area = ((totalWidth * totalHeight) / 1000000).toFixed(3);
  const waste = 12; // Mock %

  return (
    <div className="flex flex-col gap-8">
      {/* Settings Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-gray-100">
        <h3 className="text-xl font-bold text-[#0D1B2A]">Configuration</h3>

        {/* Material Thickness */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Material Thickness
          </label>
          <select
            value={settings.thickness}
            onChange={(e) => handleChange("thickness", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white text-gray-700"
          >
            <option value="3">3mm (B-Flute)</option>
            <option value="5">5mm (BC-Flute)</option>
            <option value="1.5">1.5mm (E-Flute)</option>
          </select>
        </div>

        {/* Flap Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Flap Dimensions (mm)
          </h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Glue Flap Width
              </label>
              <input
                type="number"
                value={settings.glueFlap}
                onChange={(e) => handleChange("glueFlap", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Top Flap
                </label>
                <input
                  type="number"
                  value={settings.topFlap}
                  onChange={(e) => handleChange("topFlap", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Bottom Flap
                </label>
                <input
                  type="number"
                  value={settings.bottomFlap}
                  onChange={(e) => handleChange("bottomFlap", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {settings.glueFlap < 20 && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex gap-2 items-start">
            <AlertTriangle
              size={16}
              className="text-yellow-600 mt-0.5 shrink-0"
            />
            <p className="text-xs text-yellow-700">
              Glue flap is very narrow. Standard is 30mm+.
            </p>
          </div>
        )}

        {/* Material Usage Summary */}
        <div className="bg-gray-50 rounded-xl p-5 shadow-inner border border-gray-100 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-gray-700">Estimated Usage</h4>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-sm text-gray-500">Sheet Area</span>
            <span className="text-sm font-mono font-bold text-gray-800">
              {area} m²
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Waste Ratio</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              ~{waste}%
            </span>
          </div>
        </div>

        <button
          onClick={onRegenerate}
          className="w-full border border-gray-400 rounded-full px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Regenerate Die-line
        </button>
      </div>

      {/* Download Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 border border-gray-100">
        <h3 className="text-xl font-bold text-[#0D1B2A]">Download</h3>

        <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg px-8 py-4 hover:scale-[1.02] transition-all font-bold flex items-center justify-center gap-2">
          <FileDown size={20} />
          Download PDF
        </button>

        <button className="w-full border border-gray-300 rounded-full px-8 py-4 hover:bg-gray-50 transition-colors font-semibold text-gray-700 flex items-center justify-center gap-2">
          <FileCode size={20} />
          Download DXF / SVG
        </button>
      </div>
    </div>
  );
};

export default TemplateSettings;
