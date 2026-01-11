import React, { useState } from "react";
import { Box, Ruler, Sliders, MoreHorizontal, Info } from "lucide-react";
import { clsx } from "clsx";

const SidebarNav = () => {
  const [active, setActive] = useState("basic");

  const navItems = [
    { id: "models", icon: Box, label: "Models" },
    { id: "basic", icon: Ruler, label: "Basic" },
    // { id: "advanced", icon: Sliders, label: "Advanced" },
    // { id: "more", icon: MoreHorizontal, label: "More" },
  ];

  return (
    <div className="w-[72px] h-full bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-6 z-30 flex-shrink-0">
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={clsx(
              "flex flex-col items-center gap-1.5 w-full relative group",
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
            )}
          >
            {/* Active Indicator Line */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
            )}

            <div
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive ? "bg-blue-50" : "group-hover:bg-gray-50"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}

      <div className="mt-auto">
        <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
