import React from "react";
import { Leaf, Layers, Shield } from "lucide-react";
import { clsx } from "clsx";

const materials = [
  {
    id: "3ply",
    name: "3-Ply Corrugated",
    desc: "Standard B-Flute",
    strength: "Medium",
    eco: false,
    icon: Layers,
  },
  {
    id: "5ply",
    name: "5-Ply Heavy Duty",
    desc: "Double Wall BC-Flute",
    strength: "High",
    eco: false,
    icon: Shield,
  },
  {
    id: "recycled",
    name: "100% Recycled Kraft",
    desc: "Eco-Friendly E-Flute",
    strength: "Medium",
    eco: true,
    icon: Leaf,
  },
];

const MaterialSelector = ({ selected, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
      <div>
        <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">
          Material Recommendation
        </h3>
        <p className="text-sm text-gray-500">
          Select the board grade for your packaging.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {materials.map((mat) => {
          const isSelected = selected === mat.id;
          const Icon = mat.icon;

          return (
            <div
              key={mat.id}
              onClick={() => onSelect(mat.id)}
              className={clsx(
                "relative border rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 group",
                isSelected
                  ? "border-emerald-500 bg-emerald-50/30 shadow-md ring-1 ring-emerald-500"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 hover:shadow-sm"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-emerald-500"
                )}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4
                    className={clsx(
                      "font-bold text-sm",
                      isSelected ? "text-[#0D1B2A]" : "text-gray-700"
                    )}
                  >
                    {mat.name}
                  </h4>
                  {mat.eco && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Eco Choice
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{mat.desc}</p>
              </div>

              {/* Radio Indicator */}
              <div
                className={clsx(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  isSelected ? "border-emerald-500" : "border-gray-300"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialSelector;
