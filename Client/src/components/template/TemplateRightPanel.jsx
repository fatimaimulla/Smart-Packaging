import React, { useState, useEffect, Suspense, memo } from "react";
import { Edit3, Box, FileText } from "lucide-react";
import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import Dieline3DViewer from "../template/DieLine3DViewer";

const TemplateRightPanel = ({
  dimensions,
  fefcoCode = "0301", // default, can be dynamic later
}) => {
  const { l = 0, w = 0, h = 0 } = dimensions || {};

  const Memoized3DViewer = memo(Dieline3DViewer);

  const [sliderValue, setSliderValue] = useState(0);
  const [unit, setUnit] = useState("mm");
  useEffect(() => {
    setSliderValue(0);
    }, [fefcoCode]);

  const MM_TO_IN = 0.0393701;

  const displayValues =
    unit === "mm"
      ? { l, w, h }
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
          <FileText size={18} />
          <span>Download</span>
        </button>

        <button
          onClick={() => navigate("/dieline")}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#007AFF] hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Edit3 size={18} />
          <span>Open in editor</span>
        </button>
      </div>

      {/* 2. Preview Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">
          Preview
        </h3>

        <div className="bg-[#E5E5E5] rounded-2xl overflow-hidden relative h-[260px] shadow-inner border border-gray-300">
          
          {/* 3D badge */}
          <div className="absolute top-3 right-3 z-10">
            <Box size={22} className="text-black opacity-60" />
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                </div>
              }
            >
              <Memoized3DViewer
                fefcoCode={fefcoCode}
                slider={sliderValue}
                width={w}
                length={l}
                height={h}
              />
            </Suspense>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={sliderValue}
          onChange={(e) => setSliderValue(+e.target.value)}
          className="mt-3 w-full accent-black"
        />
      </div>

      {/* 3. Choose Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">
          Choose
        </h3>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dieline-library")}
            className="w-20 h-20 border border-gray-200 rounded-xl p-2 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 transition-colors shadow-sm"
          >
            <span className="text-sm font-bold text-gray-800 underline">
              More
            </span>
          </button>
        </div>
      </div>

      {/* 4. Size Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-gray-900">
            Size
          </h3>

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

        <div className="w-full bg-white border border-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow-sm text-sm">
          {displayValues.l} × {displayValues.w} × {displayValues.h} {unit}
        </div>
      </div>
    </div>
  );
};

export default TemplateRightPanel;
