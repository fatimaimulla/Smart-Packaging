import React, { useState } from "react";
import { ZoomIn, ZoomOut, RefreshCw, Grid, Maximize } from "lucide-react";
import { clsx } from "clsx";
import BoundingBox from "./BoundingBox";

const ImageViewer = ({
  view,
  imageUrl,
  productBox,
  referenceBox,
  onProductBoxChange,
  onReferenceBoxChange,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-1 relative overflow-hidden group h-[600px] border border-gray-100">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={clsx(
            "p-2 rounded-lg shadow-sm border transition-all",
            showGrid
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
          )}
          title="Toggle Grid"
        >
          <Grid size={18} />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={handleReset}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all"
          title="Reset View"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-full bg-gray-50 relative overflow-hidden rounded-xl cursor-grab active:cursor-grabbing">
        {/* Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#0D1B2A 1px, transparent 1px), linear-gradient(90deg, #0D1B2A 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        )}

        {/* Image Container with Zoom */}
        <div
          className="w-full h-full relative transition-transform duration-200 ease-out origin-center flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="relative shadow-2xl">
            <img
              src={imageUrl}
              alt={`${view} View`}
              className="max-w-none w-[600px] h-auto object-contain rounded-sm select-none pointer-events-none"
              draggable={false}
            />

            {/* Bounding Boxes Layer */}
            <div className="absolute inset-0">
              <BoundingBox
                box={productBox}
                onChange={onProductBoxChange}
                color="blue"
                label="Product"
                isResizable={true}
              />
              <BoundingBox
                box={referenceBox}
                onChange={onReferenceBoxChange}
                color="green"
                label="Reference"
                confidence={92}
                isResizable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-xs font-medium w-12 text-center text-gray-700">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Confidence Badge Overlay (Top Left of Image) */}
      <div className="absolute top-20 left-6 z-10 flex flex-col gap-2">
        <div className="bg-emerald-100/90 backdrop-blur-sm text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          High Confidence Detection
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
