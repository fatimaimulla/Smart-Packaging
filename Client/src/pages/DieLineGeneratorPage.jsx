import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DieLineViewer from "../components/template/DieLineViewer";
import TemplateSettings from "../components/template/TemplateSettings";
import Header from "../common/Header";
import Footer from "../common/Footer";

const DieLineGeneratorPage = () => {
  const location = useLocation();

  // Get dimensions from previous step or use defaults
  // Note: These are "Internal" dimensions. The viewer might add thickness logic later.
  const initialDimensions = location.state?.dimensions || {
    l: 200,
    w: 150,
    h: 100,
  };

  const [settings, setSettings] = useState({
    thickness: 3,
    glueFlap: 35,
    topFlap: initialDimensions.w / 2 + 2, // Standard RSC flap is width/2
    bottomFlap: initialDimensions.w / 2 + 2,
  });

  const handleRegenerate = () => {
    // In a real app, this might fetch a new SVG from an API
    // Here, the state update automatically triggers the SVG redraw in DieLineViewer
    console.log("Regenerating with", settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* LEFT PANEL: Preview (2/3 width) */}
            <div className="md:col-span-2 h-[600px] md:h-[800px]">
              <DieLineViewer
                dimensions={initialDimensions}
                settings={settings}
              />
            </div>

            {/* RIGHT PANEL: Settings (1/3 width) */}
            <div className="md:col-span-1">
              <TemplateSettings
                settings={settings}
                setSettings={setSettings}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DieLineGeneratorPage;
