import React, { useState, Suspense } from "react";
import Fefco0201_3D from "../3dModel/Fefco0201";
import { Download, Loader2, MessageCircle } from "lucide-react";
import { clsx } from "clsx";

const RightPreviewPanel = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const handleDownloadDieline = () => {
    console.log("Download");
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      {/* 1. 3D Preview Card */}
      <div className="bg-[#D1D5DB] rounded-2xl overflow-hidden relative h-[240px] shadow-inner">
        {/* 3D Badge */}
        <div className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <span className="text-xs font-bold text-gray-800">3D</span>
        </div>

        {/* Canvas */}
        <div className="w-full h-full border rounded-2xl border-gray-200 border-2">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-white" />
              </div>
            }
          >
            <Fefco0201_3D sliderValue={sliderValue} />
          </Suspense>
        </div>

        {/* Floating Slider */}
      </div>

      {/* 2. File Formats */}
      {/* <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">File formats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "AI dieline", icon: "Ai", color: "text-[#FF9A00]" },
            { label: "PDF dieline", icon: "PDF", color: "text-[#F40F02]" },
            { label: "DXF dieline", icon: "DXF", color: "text-[#000000]" },
            { label: "3D mockup", icon: "JPG", color: "text-[#00A651]" },
          ].map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all bg-white"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <span
                  className={clsx(
                    "font-bold text-[10px] border px-0.5 rounded",
                    item.color,
                    `border-current`
                  )}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div> */}

      <button
        onClick={handleDownloadDieline}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <Download size={18} />
        <span>Download Dieline (PDF)</span>
      </button>

      {/* 3. You will get list */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-2">You will get</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></div>
            All dieline files can be generated and downloaded within a few
            minutes.
          </li>
          <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></div>
            All dieline files are rigorously structurally inspected. Dimensions,
            thickness, and calculations are precise.
          </li>
        </ul>
      </div>

      {/* Chat Bubble (Bottom Right) */}
      {/* <div className="mt-auto flex justify-end">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <MessageCircle size={24} fill="white" />
        </button>
      </div> */}
    </div>
  );
};

export default RightPreviewPanel;
