import React, { useState, useEffect } from "react";

import ImageViewer from "../components/review/ImageViewer";
import DimensionsPanel from "../components/review/DimensionsPanel";
import { clsx } from "clsx";
import { Layers, Box } from "lucide-react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useSelector } from "react-redux";
import getImageId from "@/api/imageId";

const ReviewPage = ({ coordinates }) => {
  const Id = useSelector((state) => state.mobileUpload.imageId);
  const [topUrl, setTopUrl] = useState(null);
  const [sideUrl, setSideUrl] = useState(null);
  useEffect(() => {
    if (!Id) return;
    console.log(Id);

    const fetchImages = async () => {
      try {
        const res = await getImageId({ sessionId: Id });
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
  }, [Id]);

  const DummyData_TopView = {
    reference_object: [
      29.809776306152344, 379.90496826171875, 297.4126892089844,
      645.424560546875,
    ],
    products: [
      [
        362.8848876953125, 247.4058074951172, 647.9251708984375,
        692.9661865234375,
      ],
    ],
  };

  const DummyData_SideView = {
    reference_object: [
      605.0848388671875, 1744.1463623046875, 1053.12841796875,
      2194.981689453125,
    ],
    products: [
      [
        1372.510498046875, 1660.1568603515625, 2490.907470703125,
        2771.56884765625,
      ],
    ],
  };

  const convertXYXYtoXYWH = ([x1, y1, x2, y2]) => ({
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
  });

  const [activeView, setActiveView] = useState("top"); // 'top' | 'side'

  // Mock Data State
  // In a real app, these coords would come from the ML backend
  const [topViewData, setTopViewData] = useState({
    image:
      "https://res.cloudinary.com/daapqn6vz/image/upload/v1764744687/user_uploads/qnmzzymyve5j12b20rfo.jpg",
    productBox: convertXYXYtoXYWH(DummyData_TopView.products[0]),
    referenceBox: convertXYXYtoXYWH(DummyData_TopView.reference_object), // e.g., 80px = 25mm (Coin)
  });

  const [sideViewData, setSideViewData] = useState({
    image: "/Test1.jpg",
    productBox: convertXYXYtoXYWH(DummyData_SideView.products[0]),
    referenceBox: convertXYXYtoXYWH(DummyData_SideView.reference_object),
  });

  const [dimensions, setDimensions] = useState({ l: 0, w: 0, h: 0 });

  // Mock Calculation Logic
  // 1. Determine pixel-to-mm ratio from reference box (assuming reference is 25mm coin)
  // 2. Apply ratio to product box dimensions
  useEffect(() => {
    const REFERENCE_SIZE_MM = 25; // Diameter of a coin approx

    // Calculate Top View Dims (Length & Width)
    const topRatio = REFERENCE_SIZE_MM / topViewData.referenceBox.w;
    const length = Math.round(topViewData.productBox.h * topRatio);
    const width = Math.round(topViewData.productBox.w * topRatio);

    // Calculate Side View Dims (Height)
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
                      : "text-gray-500 hover:text-gray-700"
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
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Box size={16} />
                  Side View
                </button>
              </div>

              {/* Image Viewer */}
              {activeView === "top" ? (
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
              ) : (
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
