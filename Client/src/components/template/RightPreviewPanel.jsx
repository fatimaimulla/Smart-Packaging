import React, { useState, Suspense } from "react";
import { Download, FileText, Loader2, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { toast } from "sonner";

import jsPDF from "jspdf";
import "svg2pdf.js";
import { generateFefco0201DXF } from "@/utils/generateFefco0201DXF";
import { generateFefco0203DXF } from "@/utils/generateFefco0203DXF";
import { generateFefco0301DXF } from "@/utils/generateFefco0301DXF";
import { generateFefco0401DXF } from "@/utils/generateFefco0401DXF";
import { generateFefco0427DXF } from "@/utils/generateFefco0427DXF";
import Dieline3DViewer from "./DieLine3DViewer";
import { TEMPLATE_CONFIG } from "@/constants/template";
import { getReport } from "@/api/getReport";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RightPreviewPanel = ({ fefcoCode = "0201", dimensions }) => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(0);
  const templateDefaults = TEMPLATE_CONFIG[fefcoCode]?.defaultDimensions ||
    TEMPLATE_CONFIG["0201"]?.defaultDimensions || {
      l: 191,
      w: 383,
      h: 245,
    };

  const l =
    dimensions?.l ??
    dimensions?.length ??
    templateDefaults?.l ??
    templateDefaults?.length ??
    191;
  const w =
    dimensions?.w ??
    dimensions?.width ??
    templateDefaults?.w ??
    templateDefaults?.width ??
    383;
  const h =
    dimensions?.h ??
    dimensions?.height ??
    templateDefaults?.h ??
    templateDefaults?.height ??
    245;
  // const handleDownloadDieline = async () => {
  //   // console.log("Download");
  //   const svg = document.getElementById("fefco-0201-dieline");
  //   if (!svg) {
  //     toast.error("Dieline not found");
  //   }
  //   const viewBox = svg.viewBox.baseVal;
  //   const vbWidth = viewBox.width;
  //   const vbHeight = viewBox.height;
  //   const bbox = svg.getBBox();

  //   const pdf = new jsPDF({
  //     orientation: vbWidth > vbHeight ? "landscape" : "portrait",
  //     unit: "pt",
  //     format: [vbWidth, vbHeight],
  //   });

  //   const offsetX = (vbWidth - bbox.width) / 2 - bbox.x;
  //   const offsetY = (vbHeight - bbox.height) / 2 - bbox.y;

  //   await pdf.svg(svg, {
  //     x: offsetX,
  //     y: offsetY,
  //     width: vbWidth,
  //     height: vbHeight,
  //   });

  //   pdf.save("FEFCO_0201_Dieline.pdf");
  // };

  const handleDownloadDieline = async () => {
    const svg = document.getElementById(`fefco-${fefcoCode}-dieline`);
    if (!svg) return;

    // 1. Get actual drawn bounds
    const bbox = svg.getBBox();

    const pdfWidth = bbox.width;
    const pdfHeight = bbox.height;

    // 2. Create tightly-fitted PDF
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
    });

    // 3. Shift SVG so dieline starts at (0,0)
    await pdf.svg(svg, {
      x: -bbox.x,
      y: -bbox.y,
      width: svg.viewBox.baseVal.width,
      height: svg.viewBox.baseVal.height,
    });

    pdf.save("FEFCO_0201_Dieline.pdf");
    await generateReport();
  };

  const handleDownloadDXF = async () => {
    try {
      // Get dimensions from props or use defaults from Fefco0201Dieline
      const dims = {
        x: 100,
        y: 200,
        length: 191,
        width: 383,
        height: 245,
      };

      console.log("Generating DXF with dimensions:", dims);

      // Generate DXF content
      const dxfContent = generateFefco0201DXF(dims);
      // Create blob and download
      const blob = new Blob([dxfContent], { type: "application/dxf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FEFCO_0201_${dims.length}x${dims.width}x${dims.height}_Dieline.dxf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("DXF downloaded successfully!");
      await generateReport();
    } catch (error) {
      console.error("DXF generation error:", error);
      toast.error("Failed to generate DXF file. Please try again.");
    }
  };
  const aiData = useSelector((state) => state.image.aiResponse);
  const generateReport = async () => {
    try {
      const res = await getReport({ dimensions, aiData });
      if (res.data.success) {
        navigate("/report", {
          state: {
            reportData: res.data.data,
          },
        });
      }
      console.log(res);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      {/* 1. 3D Preview Card */}
      <div className="bg-[#D1D5DB] rounded-2xl overflow-hidden relative h-[288px] shadow-inner">
        <div className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <span className="text-xs font-bold text-gray-800">3D</span>
        </div>
        <div className="w-full h-full flex flex-col">
          {/* 3D Viewer */}
          <div className="flex-1 border border-gray">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              }
            >
              <Dieline3DViewer
                fefcoCode={fefcoCode}
                slider={sliderValue}
                width={w}
                length={l}
                height={h}
              />
            </Suspense>
          </div>

          {/* SLIDER */}
          <div className="px-3 pb-3 pt-2 bg-white/60 backdrop-blur-sm">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={sliderValue}
              onChange={(e) => setSliderValue(+e.target.value)}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Floating Slider */}
      </div>

      {/* 2. File Formats */}
      {/* <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">File formats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "AI dieline", icon: "Ai", color: "text-[#FF9A00]" },
            { label: "PDF dieline", icon: "PDF", color: "text-[#F40F02]" },
            { label: "DXF dieline", icon: "DXF", color: "text-[#000000]" },
            { label: "3D mockup", icon: "JPG", color: "text-[#00A651]" },
          ].map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all bg-white"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <span
                  className={clsx(
                    "font-bold text-[10px] border px-0.5 rounded",
                    item.color,
                    `border-current`
                  )}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div> */}

      <button
        onClick={handleDownloadDieline}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <Download size={18} />
        <span>Download Dieline (PDF)</span>
      </button>
      <button
        onClick={handleDownloadDXF}
        className="w-full px-4 py-3 bg-black text-white rounded-lg"
      >
        Download Dieline (DXF)
      </button>
      <button
        onClick={generateReport}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium transition-colors hover:bg-slate-50"
      >
        <FileText size={18} />
        <span>View Report</span>
      </button>

      {/* 3. You will get list */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-2">You will get</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></div>
            All dieline files can be generated and downloaded within a few
            minutes.
          </li>
          <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></div>
            All dieline files are rigorously structurally inspected. Dimensions,
            thickness, and calculations are precise.
          </li>
        </ul>
      </div>

      {/* Chat Bubble (Bottom Right) */}
      {/* <div className="mt-auto flex justify-end">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <MessageCircle size={24} fill="white" />
        </button>
      </div> */}
    </div>
  );
};

export default RightPreviewPanel;
