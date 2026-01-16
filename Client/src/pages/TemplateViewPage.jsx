import React, { useEffect, useRef } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

import TemplateCanvas from "@/components/template/TemplateCanvas";
import TemplateRightPanel from "../components/template/TemplateRightPanel";

import { TEMPLATE_CONFIG } from "@/constants/template";

const TemplateViewPage = () => {
  /**
   * Later this will come from:
   * - route param (/template/:id)
   * - or state (clicked from library)
   */
  const selectedTemplateId = "0301";

  /** 🔑 single source of truth */
  const template = TEMPLATE_CONFIG[selectedTemplateId];

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Template not found
      </div>
    );
  }

  const { Dieline2D, defaultDimensions } = template;

  /** dimensions come from dieline metadata */
  const dimensions =
    defaultDimensions ?? {
      l: 0,
      w: 0,
      h: 0,
    };

  /** 🔁 ref to control 2D canvas imperatively */
  const canvasRef = useRef(null);

  /**
   * ✅ RESET 2D VIEW ON LOAD / TEMPLATE CHANGE
   * Same behavior as clicking the reset (4th) button
   */
  useEffect(() => {
    canvasRef.current?.resetView();
  }, [selectedTemplateId]);

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[600px]">

            {/* LEFT COLUMN: 2D CANVAS */}
            <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">

              {/* Legend */}
              <div className="absolute top-8 left-8 z-10 flex items-center gap-6 pointer-events-none select-none">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#4CBA33]" />
                  <span className="text-xs font-bold text-gray-600">
                    Bleed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#343CB7]" />
                  <span className="text-xs font-bold text-gray-600">
                    Trim
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#FC0707]" />
                  <span className="text-xs font-bold text-gray-600">
                    Crease
                  </span>
                </div>
              </div>

              {/* Canvas */}
              <TemplateCanvas
                ref={canvasRef}
                Dieline={Dieline2D}
                dimensions={dimensions}
              />
            </div>

            {/* RIGHT COLUMN: 3D + CONTROLS */}
            <div className="min-h-0 lg:col-span-4 flex flex-col">
              <TemplateRightPanel
                fefcoCode={selectedTemplateId}
                dimensions={dimensions}
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateViewPage;
