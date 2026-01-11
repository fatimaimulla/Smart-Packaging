import React from "react";
import {
  Package,
  Box,
  Layers,
  ShoppingBag,
  Grid,
  User,
  Globe,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";

const categories = [
  { id: "all", label: "All Dielines", icon: Grid },
  { id: "folding", label: "Folding Boxes", icon: Package },
  { id: "tuck", label: "Tuck End Boxes", icon: Box },
  { id: "tray", label: "Tray Boxes", icon: Layers },
  { id: "mailer", label: "Mailer Boxes", icon: Box },
  { id: "bag", label: "Paper Bags", icon: ShoppingBag },
];

const sources = [
  { id: "system", label: "System Dielines", icon: Globe },
  { id: "user", label: "My Creations", icon: User },
];

const LibrarySidebar = ({
  activeCategory,
  activeSource,
  onSelectCategory,
  onSelectSource,
  counts,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
      {/* Categories Section */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Categories
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={clsx(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />
                  <span>{cat.label}</span>
                </div>
                {count > 0 && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sources Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Source
        </h3>
        <div className="flex flex-col gap-1">
          {sources.map((src) => {
            const Icon = src.icon;
            const isActive = activeSource === src.id;

            return (
              <button
                key={src.id}
                onClick={() => onSelectSource(isActive ? null : src.id)} // Toggle logic
                className={clsx(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-emerald-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />
                  <span>{src.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LibrarySidebar;
