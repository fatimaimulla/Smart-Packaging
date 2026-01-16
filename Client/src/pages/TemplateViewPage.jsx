import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Fefco0201 from "../components/dieline/Fefco0201";
import TemplateRightPanel from "../components/template/TemplateRightPanel";
// import DieLineViewer from "@/components/template/DieLineViewer";

const TemplateViewPage = () => {
  const dimensions = {
    l: 400,
    w: 300,
    h: 200,
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[600px]">
            
            {/* LEFT COLUMN: Canvas (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
              
              {/* Legend */}
              <div className="min-h-0 absolute top-8 left-8 z-10 flex items-center gap-6 pointer-events-none select-none">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#4CBA33]"></div>
                  <span className="text-xs font-bold text-gray-600">Bleed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#343CB7]"></div>
                  <span className="text-xs font-bold text-gray-600">Trim</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#FC0707]"></div>
                  <span className="text-xs font-bold text-gray-600">Crease</span>
                </div>
              </div>

              {/* Canvas Area */}
              {/* <div className="flex-1 bg-[#F9FAFB]">
                <DieLineViewer>
                  <Fefco0201 width={400} length={300} height={200} />
                </DieLineViewer>
              </div> */}
              <div className="flex-1 flex items-center justify-center p-12 bg-[#F9FAFB]">
                <div className="w-full h-full max-w-4xl">
                   <Fefco0201 width={400} depth={300} height={200} />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Controls (4 cols) */}
            <div className="min-h-0 lg:col-span-4 flex flex-col">
               <TemplateRightPanel dimensions={dimensions} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateViewPage;
