import React, { useState, Suspense } from "react";
import { Edit3, ChevronDown, Box, FileText } from "lucide-react";
import { clsx } from "clsx";
import Fefco0201_3D from "../3dModel/Fefco0201";
import { useNavigate } from "react-router-dom";

const TemplateRightPanel = ({ dimensions }) => {
  const { l = 0, w = 0, h = 0 } = dimensions || {};
  const [sliderValue, setSliderValue] = useState(0);
  const [unit, setUnit] = useState("mm");

  const MM_TO_IN = 0.0393701;

  const displayValues = unit === "mm" ? { l, w, h }
        : {
            l: (l * MM_TO_IN).toFixed(2),
            w: (w * MM_TO_IN).toFixed(2),
            h: (h * MM_TO_IN).toFixed(2),
        };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 h-full font-sans">
      
      {/* 1. Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 text-black rounded-lg text-sm font-bold transition-colors shadow-sm">
          <FileText size={18} className="text-black" />
          <span>Download</span>
        </button>
        <button onClick={() => navigate("/dieline")} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#007AFF] hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
          <Edit3 size={18} />
          <span>Open in editor</span>
        </button>
      </div>

      {/* 2. Preview Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Preview</h3>
        <div className="bg-[#E5E5E5] rounded-2xl overflow-hidden relative h-[260px] shadow-inner border border-gray-300 group">
          {/* 3D Badge */}
          <div className="absolute top-3 right-3 z-10">
             <Box size={24} className="text-black opacity-60" strokeWidth={1.5} />
          </div>

          {/* Canvas */}
          <div className="w-full h-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                </div>
              }
            >
              <Fefco0201_3D slider={sliderValue} />
            </Suspense>
          </div>

          {/* Floating Slider Control */}
          {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-md px-5 py-2 flex items-center gap-3 border border-gray-200">
              <span className="text-[11px] font-bold text-gray-800">
                Open
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <span className="text-[11px] font-bold text-gray-400">
                Close
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* 3. Choose Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Choose</h3>
        <div className="flex gap-3">
          {/* Selected Item */}
          <button className="w-20 h-20 border-2 border-black rounded-xl p-2 bg-[#F5F5F5] flex flex-col items-center justify-center gap-2 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 relative z-10">
               {/* Simple Box Icon Placeholder */}
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-[#8B6E4E] fill-[#CBAE91]">
                 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                 <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                 <line x1="12" y1="22.08" x2="12" y2="12"></line>
               </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-900 mt-1">FEFCO 0215</span>
          </button>

          {/* More Item */}
          <button onClick={() => navigate("/dieline-library")} className="w-20 h-20 border border-gray-200 rounded-xl p-2 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 group transition-colors shadow-sm">
             <span className="text-sm font-bold text-gray-800 underline decoration-2 decoration-gray-300 underline-offset-4 group-hover:decoration-gray-400">
              More
            </span>
          </button>
        </div>
      </div>

      {/* 4. Size Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-gray-900">Size</h3>
          {/* Unit Toggle */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setUnit("mm")}
              className={clsx(
                "px-3 py-0.5 text-[11px] font-bold rounded-md transition-all",
                unit === "mm"
                  ? "bg-blue-100 text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              mm
            </button>
            <button
              onClick={() => setUnit("in")}
              className={clsx(
                "px-3 py-0.5 text-[11px] font-bold rounded-md transition-all",
                unit === "in"
                  ? "bg-blue-100 text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              in
            </button>
          </div>
        </div>

        {/* Size Dropdown */}
        <div className="w-full bg-white border border-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow-sm text-sm">
        {displayValues.l} × {displayValues.w} × {displayValues.h} {unit}
        </div>
        {/* <div className="relative">
          <button className="w-full flex items-center justify-between bg-white border border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-3 px-4 rounded-lg shadow-sm transition-all text-sm">
            <span>400 × 300 × 200 mm</span>
            <ChevronDown size={18} className="text-gray-400" />
          </button>
        </div> */}

      </div>
    </div>
  );
};

export default TemplateRightPanel;
