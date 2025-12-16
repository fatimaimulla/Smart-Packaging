import React from "react";
import { Box, Info } from "lucide-react";
import { motion } from "framer-motion";

const BoxPreview = ({ dimensions, padding }) => {
  // Calculate total internal dimensions
  const totalL = dimensions.l + padding * 2;
  const totalW = dimensions.w + padding * 2;
  const totalH = dimensions.h + padding * 2;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-1">
            Recommended Packaging
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Box size={16} />
            <span>Regular Slotted Container (RSC)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#0D1B2A] tracking-tight">
            FEFCO 0201
          </div>
          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block mt-1">
            Industry Standard
          </div>
        </div>
      </div>

      {/* 3D Box Illustration */}
      <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white rounded-xl -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-64 h-64"
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xl"
          >
            {/* Box Body */}
            <path
              d="M40 70 L100 40 L160 70 L160 150 L100 180 L40 150 Z"
              fill="#E5E7EB"
              stroke="#4B5563"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M40 70 L100 100 L160 70"
              fill="none"
              stroke="#4B5563"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M100 100 L100 180"
              fill="none"
              stroke="#4B5563"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Open Flaps (Top) */}
            <path
              d="M40 70 L100 40 L60 30 L10 55 Z"
              fill="#F3F4F6"
              stroke="#4B5563"
              strokeWidth="1"
              className="opacity-80"
            />
            <path
              d="M160 70 L100 40 L140 30 L190 55 Z"
              fill="#F3F4F6"
              stroke="#4B5563"
              strokeWidth="1"
              className="opacity-80"
            />

            {/* Dimensions Indicators */}
            <g className="text-[8px] font-mono fill-gray-500">
              <text x="20" y="130" transform="rotate(-25 20,130)">
                H: {totalH}
              </text>
              <text x="120" y="170" transform="rotate(25 120,170)">
                L: {totalL}
              </text>
              <text x="170" y="100" transform="rotate(-25 170,100)">
                W: {totalW}
              </text>
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Dimensions Summary */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            Internal Usable Dimensions
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Length
            </div>
            <div className="text-lg font-bold text-[#0D1B2A] bg-white border border-gray-200 rounded-lg py-1 shadow-sm">
              {totalL}{" "}
              <span className="text-xs font-normal text-gray-400">mm</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Width
            </div>
            <div className="text-lg font-bold text-[#0D1B2A] bg-white border border-gray-200 rounded-lg py-1 shadow-sm">
              {totalW}{" "}
              <span className="text-xs font-normal text-gray-400">mm</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Height
            </div>
            <div className="text-lg font-bold text-[#0D1B2A] bg-white border border-gray-200 rounded-lg py-1 shadow-sm">
              {totalH}{" "}
              <span className="text-xs font-normal text-gray-400">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxPreview;
