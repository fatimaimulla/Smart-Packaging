import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
// import LeftSettingsPanel from "../components/dieline/LeftSettingsPanel";
// import RightPreviewPanel from "../components/dieline/RightPreviewPanel";
import DieLineViewer from "../components/template/DieLineViewer";
import SidebarNav from "@/components/template/SidebarNav";
import LeftSettingsPanel from "@/components/template/LeftSettingsPanel";
import RightPreviewPanel from "@/components/template/RightPreviewPanel";
import { TEMPLATE_CONFIG } from "@/constants/template";
// import SidebarNav from "../components/dieline/SidebarNav";

const DieLineGeneratorPage = () => {
  const location = useLocation();
  const selectedTemplateId = location.state?.templateId || "0201";
  const templateDefaults =
    TEMPLATE_CONFIG[selectedTemplateId]?.defaultDimensions || {
      l: 191,
      w: 383,
      h: 245,
    };

  // Get dimensions from previous step or use defaults
  const initialDimensions = location.state?.dimensions || templateDefaults;

  // Centralized State
  const [settings, setSettings] = useState({
    l: initialDimensions.l,
    w: initialDimensions.w,
    h: initialDimensions.h,
    thickness: 0.5,
    material: "White card board",
    sizeMode: "manufacture", // 'manufacture' | 'inner'
    glueFlap: 15,
    topFlap: initialDimensions.w / 2,
    bottomFlap: initialDimensions.w / 2,
  });

  const handleRegenerate = () => {
    console.log("Regenerating with", settings);
  };

  // Derived dimensions object for the viewer
  const dimensions = {
    l: settings.l,
    w: settings.w,
    h: settings.h,
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] flex flex-col font-sans overflow-hidden">
      <Header />

      {/* Main Content Area - Fixed Height minus Header */}
      <main className="flex-1 pt-20 pb-0 flex overflow-hidden">
        {/* 1. Far Left Navigation Strip */}
        <SidebarNav />

        {/* 2. Settings Panel (Attached to Nav) */}
        <div className="w-[288px] h-full bg-white border-r border-gray-200 z-20 flex-shrink-0 shadow-sm overflow-y-auto">
          <LeftSettingsPanel
            settings={settings}
            setSettings={setSettings}
            onRegenerate={handleRegenerate}
          />
        </div>

        {/* 3. Center Viewer (Flexible) */}
        <div className="flex-1 h-full relative bg-[#F3F4F6] overflow-hidden">
          {/* Dotted Pattern Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.4]"
            style={{
              backgroundImage:
                "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <DieLineViewer
            fefcoCode={selectedTemplateId}
            dimensions={dimensions}
            settings={settings}
          />
        </div>

        {/* 4. Right Panel (Fixed Width) */}
        <div className="w-[408px] h-full bg-white border-l border-gray-200 z-20 flex-shrink-0 overflow-y-auto p-4 shadow-sm">
          <RightPreviewPanel
            fefcoCode={selectedTemplateId}
            dimensions={dimensions}
          />
        </div>
      </main>

      {/* Mobile/Tablet Fallback */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex justify-between items-center shadow-lg">
        <span className="text-sm font-bold text-[#0D1B2A]">
          Please use Desktop for Design View
        </span>
      </div>
    </div>
  );
};

export default DieLineGeneratorPage;
