import React, { useState, useEffect } from "react";

import ImageViewer from "../components/review/ImageViewer";
import DimensionsPanel from "../components/review/DimensionsPanel";
import { clsx } from "clsx";
import { Layers, Box } from "lucide-react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import getImageId from "@/api/imageId";
import { useParams } from "react-router-dom";
import { getDimensions } from "@/api/getDimensions";

const ReviewPage = () => {
  const [topUrl, setTopUrl] = useState(null);
  const [sideUrl, setSideUrl] = useState(null);
  const params = useParams();
  const [topDimensions, setTopDimensions] = useState(null);
  const [sideDimensions, setSideDimensions] = useState(null);
  const [topViewData, setTopViewData] = useState(null);
  const [sideViewData, setSideViewData] = useState(null);

  const sessionId = params.sessionId;

  const convertXYXYtoXYWH = ([x1, y1, x2, y2]) => ({
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
  });

  useEffect(() => {
    console.log(sessionId);
    const fetchImages = async () => {
      try {
        const res = await getImageId({ sessionId: sessionId });
        if (res.data.success) {
          setTopUrl(res.data.data.topImageUrl);
          setSideUrl(res.data.data.sideImageUrl);
        }
        console.log(res);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, [sessionId]);

  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const res = await getDimensions({ sessionId: sessionId });
        if (res.data.success) {
          console.log(res.data.data);
          const topView = res.data.data.topView;
          setTopDimensions(topView);
          const sideView = res.data.data.sideView;
          setSideDimensions(sideView);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDimensions();
  }, [sessionId]);
useEffect(() => {
  if (!topDimensions || !topUrl) return;

  const topProduct = topDimensions.product?.[0];
  const topReferenceObject = topDimensions.referenceObject?.[0];

  if (!topProduct || !topReferenceObject) return;

  setTopViewData({
    image: topUrl,
    productBox: convertXYXYtoXYWH(topProduct),
    referenceBox: convertXYXYtoXYWH(topReferenceObject),
  });
}, [topDimensions, topUrl]);

useEffect(() => {
  if (!sideDimensions || !sideUrl) return;

  const sideProduct = sideDimensions.product?.[0];
  const sideReferenceObject = sideDimensions.referenceObject?.[0];

  if (!sideProduct || !sideReferenceObject) return;

  setSideViewData({              // ✅ CORRECT STATE
    image: sideUrl,              // ✅ CORRECT IMAGE
    productBox: convertXYXYtoXYWH(sideProduct),
    referenceBox: convertXYXYtoXYWH(sideReferenceObject),
  });
}, [sideDimensions, sideUrl]);




  const [activeView, setActiveView] = useState("top"); // 'top' | 'side'

  

  const [dimensions, setDimensions] = useState({ l: 0, w: 0, h: 0 });

  // Mock Calculation Logic
  // 1. Determine pixel-to-mm ratio from reference box (assuming reference is 25mm coin)
  // 2. Apply ratio to product box dimensions
  useEffect(() => {
  if (
    !topViewData?.productBox ||
    !topViewData?.referenceBox ||
    !sideViewData?.productBox ||
    !sideViewData?.referenceBox
  ) {
    return;
  }

  const REFERENCE_SIZE_MM = 25;

  const topRatio = REFERENCE_SIZE_MM / topViewData.referenceBox.w;
  const length = Math.round(topViewData.productBox.h * topRatio);
  const width = Math.round(topViewData.productBox.w * topRatio);

  const sideRatio = REFERENCE_SIZE_MM / sideViewData.referenceBox.w;
  const height = Math.round(sideViewData.productBox.h * sideRatio);

  setDimensions({ l: length, w: width, h: height });
}, [topViewData, sideViewData]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">
              Review Dimensions
            </h1>
            <p className="text-gray-600">
              Verify the AI detection. Adjust the blue bounding box to fit your
              product perfectly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT PANEL: Image Review (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* View Switcher Tabs */}
              <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full inline-flex w-fit border border-white/60 shadow-sm">
                <button
                  onClick={() => setActiveView("top")}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                    activeView === "top"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <Layers size={16} />
                  Top View
                </button>
                <button
                  onClick={() => setActiveView("side")}
                  className={clsx(
                    "px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                    activeView === "side"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <Box size={16} />
                  Side View
                </button>
              </div>

              {/* Image Viewer */}
              {/* {activeView === "top" && topViewData ? (
                <ImageViewer
                  view="Top"
                  imageUrl={topUrl}
                  productBox={topViewData.productBox}
                  referenceBox={topViewData.referenceBox}
                  onProductBoxChange={(newBox) =>
                    setTopViewData((prev) => ({ ...prev, productBox: newBox }))
                  }
                  onReferenceBoxChange={(newBox) =>
                    setTopViewData((prev) => ({
                      ...prev,
                      referenceBox: newBox,
                    }))
                  }
                />
              ) :  activeView === "side" && sideViewData ? (
                <ImageViewer
                  view="Side"
                  imageUrl={sideUrl}
                  productBox={sideViewData.productBox}
                  referenceBox={sideViewData.referenceBox}
                  onProductBoxChange={(newBox) =>
                    setSideViewData((prev) => ({ ...prev, productBox: newBox }))
                  }
                  onReferenceBoxChange={(newBox) =>
                    setSideViewData((prev) => ({
                      ...prev,
                      referenceBox: newBox,
                    }))
                  }
                />
              )} */}

             {activeView === "top" && topViewData ? (
                <ImageViewer
                  view="Top"
                  imageUrl={topUrl}
                  productBox={topViewData.productBox}
                  referenceBox={topViewData.referenceBox}
                  onProductBoxChange={(newBox) =>
                    setTopViewData((prev) => ({
                      ...prev,
                      productBox: newBox,
                    }))
                  }
                  onReferenceBoxChange={(newBox) =>
                    setTopViewData((prev) => ({
                      ...prev,
                      referenceBox: newBox,
                    }))
                  }
                />
              ) : activeView === "side" && sideViewData ? (
                <ImageViewer
                  view="Side"
                  imageUrl={sideUrl}
                  productBox={sideViewData.productBox}
                  referenceBox={sideViewData.referenceBox}
                  onProductBoxChange={(newBox) =>
                    setSideViewData((prev) => ({
                      ...prev,
                      productBox: newBox,
                    }))
                  }
                  onReferenceBoxChange={(newBox) =>
                    setSideViewData((prev) => ({
                      ...prev,
                      referenceBox: newBox,
                    }))
                  }
                />
              ) : (
                <div className="text-gray-400">
                  Waiting for detection data...
                </div>
              )}
              {/* Instructions / Legend */}
              <div className="flex flex-wrap gap-6 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500"></div>
                  <span className="text-sm text-gray-600">
                    Product (Resizable)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500"></div>
                  <span className="text-sm text-gray-600">
                    Reference (Fixed Size)
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Dimensions (4 cols) */}
            <div className="lg:col-span-4">
              <DimensionsPanel
                dimensions={dimensions}
                onUpdateDimensions={setDimensions}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPage;
