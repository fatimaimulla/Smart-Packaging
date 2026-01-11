import React from "react";
import { Download, Edit, ArrowRight, Printer, Box, User } from "lucide-react";
import { clsx } from "clsx";

const DielineCard = ({ dieline, onUse, onPreview }) => {
  const isUserGenerated = dieline.source === "user";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Preview Area */}
      <div className="relative h-48 bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Dieline Image Placeholder (Using SVG logic or Image) */}
        {dieline.image ? (
          <img
            src={dieline.image}
            alt={dieline.name}
            className="w-full h-full object-contain relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Box className="text-gray-300 w-20 h-20" strokeWidth={1} />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          {isUserGenerated && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <User size={10} />
              Created by You
            </span>
          )}
          {dieline.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-30">
          <button
            onClick={() => onPreview(dieline)}
            className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#0D1B2A] text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {dieline.name}
          </h3>
        </div>

        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {dieline.description ||
            "Standard industry packaging template suitable for various retail products."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {dieline.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200"
            >
              {tag}
            </span>
          ))}
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
            <Printer size={10} /> Printable
          </span>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onUse(dieline)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-400 text-white text-sm font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Use Template
            <ArrowRight size={14} />
          </button>

          {isUserGenerated ? (
            <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
              <Edit size={18} />
            </button>
          ) : (
            <button className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-gray-200">
              <Download size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DielineCard;
