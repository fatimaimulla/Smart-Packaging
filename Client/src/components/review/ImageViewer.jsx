import React, { useState, useRef } from "react";
import { ZoomIn, ZoomOut, RefreshCw, Grid } from "lucide-react";
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

  const imgRef = useRef(null);
  const [imgMeta, setImgMeta] = useState(null); // { naturalW, naturalH, renderW, renderH }

  const handleZoomIn = () => setZoom((p) => Math.min(p + 0.25, 2.5));
  const handleZoomOut = () => setZoom((p) => Math.max(p - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  const scaleBox = (box) => {
    if (!imgMeta) return box;

    const scaleX = imgMeta.renderW / imgMeta.naturalW;
    const scaleY = imgMeta.renderH / imgMeta.naturalH;

    return {
      x: box.x * scaleX,
      y: box.y * scaleY,
      w: box.w * scaleX,
      h: box.h * scaleY,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-1 relative overflow-hidden h-[600px] border">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={clsx(
            "p-2 rounded-lg border shadow-sm",
            showGrid
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-white border-gray-200 text-gray-500"
          )}
        >
          <Grid size={18} />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleReset}
          className="p-2 bg-white border rounded-lg shadow-sm"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Canvas */}
      <div className="w-full h-full relative overflow-hidden bg-gray-50 rounded-xl">
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#0D1B2A 1px, transparent 1px), linear-gradient(90deg, #0D1B2A 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        )}

        <div
          className="w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="relative">
            <img
              ref={imgRef}
              src={imageUrl}
              alt={`${view} View`}
              className="w-[600px] h-auto object-contain select-none"
              draggable={false}
              onLoad={() => {
                const img = imgRef.current;
                setImgMeta({
                  naturalW: img.naturalWidth,
                  naturalH: img.naturalHeight,
                  renderW: img.clientWidth,
                  renderH: img.clientHeight,
                });
              }}
            />

            {/* Bounding Boxes */}
            <div className="absolute inset-0">
              {imgMeta && (
                <>
                  <BoundingBox
                    box={scaleBox(productBox)}
                    onChange={() => {}}
                    color="blue"
                    label="Product"
                    isResizable={true}
                  />

                  <BoundingBox
                    box={scaleBox(referenceBox)}
                    onChange={() => {}}
                    color="green"
                    label="Reference"
                    
                    isDragable={false}
                    isResizable={false}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2 bg-white/90 p-1.5 rounded-lg border shadow-sm">
        <button onClick={handleZoomOut}>
          <ZoomOut size={18} />
        </button>
        <span className="text-xs w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={handleZoomIn}>
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
