import React, { useEffect, useRef, useState, Suspense } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import TemplateCanvas from "@/components/template/TemplateCanvas";
import Dieline3DViewer from "../components/template/DieLine3DViewer";
import { TEMPLATE_CONFIG } from "@/constants/template";
import {
  Download,
  Edit3,
  MoreHorizontal,
  Sparkles,
  Box,
  FileText,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { getAiResponse } from "@/api/getAiResponse";
import { toast } from "sonner";

const TemplateViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topImageUrl = useSelector((state) => state.image.topImageUrl);
  const sideImageUrl = useSelector((state) => state.image.sideImageUrl);
  const imageDimensions = useSelector((state) => state.image.dimensions);

  const { dimensions } = location.state || {
    dimensions: {
      l: imageDimensions.l,
      w: imageDimensions.w,
      h: imageDimensions.h,
    },
  };
  const selectedTemplateId = "0301";
  const template = TEMPLATE_CONFIG[selectedTemplateId];

  // 2D Canvas Ref
  const canvasRef = useRef(null);

  // State for Right Panel Logic
  const [sliderValue, setSliderValue] = useState(0);
  const [unit, setUnit] = useState("mm");

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    canvasRef.current?.resetView();
    setSliderValue(0);
  }, [selectedTemplateId]);

  const hasCalledAI = useRef(false);

useEffect(() => {
  if (
    !topImageUrl ||
    !sideImageUrl ||
    !imageDimensions?.l ||
    hasCalledAI.current
  ) {
    return;
  }

  hasCalledAI.current = true;
  handleAskAI();
}, [topImageUrl, sideImageUrl, imageDimensions]);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Template not found
      </div>
    );
  }

  const { Dieline2D } = template;
  const { l = 0, w = 0, h = 0 } = dimensions;

  // Unit Conversion
  const MM_TO_IN = 0.0393701;
  const displayValues =
    unit === "mm"
      ? { l, w, h }
      : {
          l: (l * MM_TO_IN).toFixed(2),
          w: (w * MM_TO_IN).toFixed(2),
          h: (h * MM_TO_IN).toFixed(2),
        };

  // AI Handler
  // const handleAskAI = async () => {
  //   try {
  //     setIsAiLoading(true);
  //     const res = await getAiResponse({
  //       imageUrl1: topImageUrl,
  //       imageUrl2: topImageUrl,
  //       dimensions: imageDimensions,
  //     });
  //     console.log(res);
  //     if (res.data.success) {
  //       setAiData({
  //         productName: res.data.data.productName,
  //         fragilityLevel: res.data.data.fragilityLevel,
  //         estimatedWeight: res.data.data.estimatedWeight,
  //         recommendedFefcoBox: res.data.data.recommendedFefcoBox,
  //       })
  //       toast.success(res.data.message);
  //       setIsAiLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     toast.error(error.response?.data?.message || error.message);
  //   }finally{
  //     setIsAiLoading(false);
  //   }
  //   // setIsAiLoading(true);
  //   // // Simulate API call
  //   // setTimeout(() => {
  //   //   setAiData({
  //   //     productName: "Hair Clip",
  //   //     fragilityLevel: "Medium",
  //   //     estimatedWeight: "35g",
  //   //     recommendedFefcoBox: "Fefco0201",
  //   //   });
  //   //   setIsAiLoading(false);
  //   // }, 2000);
  // };
  const handleAskAI = async () => {
    try {
      setIsAiLoading(true);

      const res = await getAiResponse({
        imageUrl1: topImageUrl,
        imageUrl2: sideImageUrl, // FIXED
        dimensions: imageDimensions,
      });

      if (res.data.success) {
        setAiData(res.data.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsAiLoading(false);
    }
  };

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
                  <span className="text-xs font-bold text-gray-600">Bleed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#343CB7]" />
                  <span className="text-xs font-bold text-gray-600">Trim</span>
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

            {/* RIGHT COLUMN: RESTRUCTURED UI */}
            <div className="min-h-0 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1">
              {/* 1. Action Row */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 text-black rounded-lg text-sm font-bold transition-colors shadow-sm border border-transparent">
                  <FileText size={18} />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => navigate("/dieline")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#007AFF] hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <Edit3 size={18} />
                  <span>Open in editor</span>
                </button>

                <button
                  onClick={() => navigate("/dieline-library")}
                  className="p-3 bg-white hover:bg-gray-100 text-gray-600 rounded-lg transition-colors shadow-sm border border-transparent"
                  title="More options"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
              {/* 3d View */}

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Preview
                </h3>
                <div className="bg-[#E5E5E5] rounded-2xl overflow-hidden relative h-[240px] shadow-inner border border-gray-300">
                  <div className="absolute top-3 right-3 z-10">
                    <Box size={22} className="text-black opacity-60" />
                  </div>
                  <div className="w-full h-full">
                    <Suspense
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                        </div>
                      }
                    >
                      <Dieline3DViewer
                        fefcoCode={selectedTemplateId}
                        slider={sliderValue}
                        width={w}
                        length={l}
                        height={h}
                      />
                    </Suspense>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(+e.target.value)}
                  className="mt-3 w-full accent-black cursor-pointer"
                />
              </div>

              {/* 2. AI Assist Section */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-500" />
                    AI Assistant
                  </h3>
                </div>

                {/* {!aiData && !isAiLoading && (
                  <button
                    onClick={handleAskAI}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    Ask AI
                  </button>
                )} */}

                {isAiLoading && (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <Sparkles className="text-purple-400 w-8 h-8 animate-[pulse_2s_ease-in-out_infinite]" />
                      <Sparkles className="text-indigo-400 w-4 h-4 absolute top-0 right-0 animate-[bounce_1.5s_infinite]" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 animate-pulse">
                      Analyzing specs...
                    </p>
                  </div>
                )}

                {aiData && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Product
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {aiData.productName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Fragility
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {aiData.fragilityLevel}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Est. Weight
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {aiData.estimatedWeight}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Rec. Box
                        </span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {aiData.recommendedFefcoBox}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Preview Section */}

              {/* 4. Size Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-900">Size</h3>
                  <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setUnit("mm")}
                      className={clsx(
                        "px-3 py-0.5 text-[11px] font-bold rounded-md transition-all",
                        unit === "mm"
                          ? "bg-blue-100 text-blue-600 shadow-sm"
                          : "text-gray-400 hover:text-gray-600",
                      )}
                    >
                      mm
                    </button>
                    <button
                      onClick={() => setUnit("in")}
                      className={clsx(
                        "px-3 py-0.5 text-[11px] font-bold rounded-md transition-all",
                        unit === "in"
                          ? "bg-blue-100 text-blue-600 shadow-sm"
                          : "text-gray-400 hover:text-gray-600",
                      )}
                    >
                      in
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white border border-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow-sm text-sm">
                  {displayValues.l} × {displayValues.w} × {displayValues.h}{" "}
                  {unit}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateViewPage;
