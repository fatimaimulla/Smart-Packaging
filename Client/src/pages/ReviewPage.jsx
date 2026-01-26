import React, { useState, useEffect } from "react";

import ImageViewer from "../components/review/ImageViewer";
import DimensionsPanel from "../components/review/DimensionsPanel";
import { clsx } from "clsx";
import { Layers, Box } from "lucide-react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useSelector } from "react-redux";
import getImageId from "@/api/imageId";
import { useParams } from "react-router-dom";

const ReviewPage = () => {
  const params = useParams();
  const sessionId = params.sessionId;
  const TopViewDimentions = useSelector((state) => state.dimension.topView);
  const SideViewDimentions = useSelector((state) => state.dimension.SideView);

  const [topUrl, setTopUrl] = useState(null);
  const [sideUrl, setSideUrl] = useState(null);

  const [topViewData, setTopViewData] = useState(null);
  const [sideViewData, setSideViewData] = useState(null);

  const [activeView, setActiveView] = useState("top");
  const [dimensions, setDimensions] = useState({ l: 0, w: 0, h: 0 });

  // -----------------------------
  // Utils
  // -----------------------------
  const convertXYXYtoXYWH = ([x1, y1, x2, y2]) => ({
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
  });

  // -----------------------------
  // Fetch images
  // -----------------------------
  useEffect(() => {
    console.log(sessionId)
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

  // -----------------------------
  // Map Redux → Viewer State
  // -----------------------------
  useEffect(() => {
    if (!TopViewDimentions?.referenceObject?.length) return;
    if (!SideViewDimentions?.referenceObject?.length) return;

    try {
      // TOP VIEW
      const topProduct = TopViewDimentions.product?.[0];
      const topReference = TopViewDimentions.referenceObject;

      if (topProduct && topReference && topUrl) {
        setTopViewData({
          image: topUrl,
          productBox: convertXYXYtoXYWH(topProduct),
          referenceBox: convertXYXYtoXYWH(topReference),
        });
      }

      // SIDE VIEW
      const sideProduct = SideViewDimentions.product?.[0];
      const sideReference = SideViewDimentions.referenceObject;

      if (sideProduct && sideReference && sideUrl) {
        setSideViewData({
          image: sideUrl,
          productBox: convertXYXYtoXYWH(sideProduct),
          referenceBox: convertXYXYtoXYWH(sideReference),
        });
      }
    } catch (err) {
      console.error("Failed to map detection data:", err);
    }
  }, [TopViewDimentions, SideViewDimentions, topUrl, sideUrl]);

  // -----------------------------
  // Dimension calculation
  // -----------------------------
  useEffect(() => {
    if (!topViewData || !sideViewData) return;

    const REFERENCE_SIZE_MM = 25;

    const topRatio = REFERENCE_SIZE_MM / topViewData.referenceBox.w;
    const length = Math.round(topViewData.productBox.h * topRatio);
    const width = Math.round(topViewData.productBox.w * topRatio);

    const sideRatio = REFERENCE_SIZE_MM / sideViewData.referenceBox.w;
    const height = Math.round(sideViewData.productBox.w * sideRatio);

    setDimensions({ l: length, w: width, h: height });
  }, [topViewData, sideViewData]);

  // -----------------------------
  // Render
  // -----------------------------
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
            {/* LEFT PANEL */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Tabs */}
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

              {/* Legend */}
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

            {/* RIGHT PANEL */}
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
