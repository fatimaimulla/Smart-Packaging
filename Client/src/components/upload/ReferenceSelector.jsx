import React from "react";
import { Check, Download } from "lucide-react";
import { clsx } from "clsx";

const references = [
  { id: "coin", label: "Coin" },
  { id: "card", label: "ATM Card" },
  { id: "marker", label: "2x2 Marker", hasDownload: true },
];

const ReferenceSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Reference Object
      </label>
      <div className="flex flex-wrap gap-3">
        {references.map((ref) => (
          <button
            key={ref.id}
            onClick={() => onSelect(ref.id)}
            className={clsx(
              "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2",
              selected === ref.id
                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-gray-50"
            )}
          >
            {selected === ref.id && <Check size={14} strokeWidth={3} />}
            {ref.label}
          </button>
        ))}
        {selected === "marker" && (
          <button className="text-xs text-blue-500 hover:text-blue-700 underline flex items-center gap-1 ml-2">
            <Download size={12} /> Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default ReferenceSelector;
