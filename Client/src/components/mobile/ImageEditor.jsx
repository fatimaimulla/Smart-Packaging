import React, { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useCropMath } from "../../hooks/useCropMath"
import { useTouchHandlers } from "../../hooks/useTouchHandlers";

const ImageEditor = ({ imageFile, onAccept, onRetake }) => {
  const containerRef = useRef(null);

  const imageUrl = React.useMemo(
    () => URL.createObjectURL(imageFile),
    [imageFile]
  );

  const [imgData, setImgData] = useState(null);
  const [displayRect, setDisplayRect] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });

  const { displayToImage } = useCropMath();

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () =>
      setImgData({
        el: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.src = imageUrl;
  }, [imageUrl]);

  // Layout calculation
  // useEffect(() => {
  //   if (!imgData || !containerRef.current) return;

  //   const rect = containerRef.current.getBoundingClientRect();
  //   const padding = 40;
  //   const maxW = rect.width - padding * 2;
  //   const maxH = rect.height - 160;

  //   const scale = Math.min(maxW / imgData.width, maxH / imgData.height);

  //   const w = imgData.width * scale;
  //   const h = imgData.height * scale;

  //   const TOP_OFFSET = 24; // space from header

  //   const dRect = {
  //     x: (rect.width - w) / 2,
  //     y: (rect.height - h) / 2 + TOP_OFFSET,
  //     width: w,
  //     height: h,
  //     scale,
  //   };

  //   setDisplayRect(dRect);
  //   setCropRect({
  //     x: dRect.x + 8,
  //     y: dRect.y + 8,
  //     width: dRect.width - 16,
  //     height: dRect.height - 16,
  //   });
  // }, [imgData]);

  // ... inside Layout calculation useEffect
  useEffect(() => {
    if (!imgData || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // 1. Calculate available space
    // Subtract footer height (~120px) and a bit of top padding for status bars
    const footerHeight = 140;
    const topPadding = 40;
    const availableWidth = rect.width - 40; // horizontal padding
    const availableHeight = rect.height - footerHeight - topPadding;

    // 2. Calculate Scale
    const scale = Math.min(
      availableWidth / imgData.width,
      availableHeight / imgData.height
    );

    const w = imgData.width * scale;
    const h = imgData.height * scale;

    // 3. Center the image in the remaining space
    const dRect = {
      x: (rect.width - w) / 2,
      y: topPadding + (availableHeight - h) / 2, // Centers image between top and footer
      width: w,
      height: h,
      scale,
    };

    setDisplayRect(dRect);

    // 4. Reset Crop Rect to match the Image exactly (with a small inset)
    setCropRect({
      x: dRect.x + 10,
      y: dRect.y + 10,
      width: dRect.width - 20,
      height: dRect.height - 20,
    });
  }, [imgData]);

  // Touch / pointer logic
  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchHandlers({
      cropRect: cropRect || { x: 0, y: 0, width: 0, height: 0 },
      displayRect: displayRect || { x: 0, y: 0, width: 0, height: 0 },
      viewportOffset,
      aspectRatio: null,
      minSize: 64,
      onUpdate: setCropRect,
    });

  // Export (same logic as before)
  const handleAccept = async () => {
    if (!cropRect || !displayRect || !imgData) return;

    const imageCrop = displayToImage(displayRect, cropRect);

    const canvas = document.createElement("canvas");
    canvas.width = imageCrop.width;
    canvas.height = imageCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgData.el,
      imageCrop.x,
      imageCrop.y,
      imageCrop.width,
      imageCrop.height,
      0,
      0,
      imageCrop.width,
      imageCrop.height
    );

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "cropped.jpg", {
          type: "image/jpeg",
        });
        onAccept(file);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden select-none pt-safe"
      onPointerDown={handleTouchStart}
      onPointerMove={handleTouchMove}
      onPointerUp={handleTouchEnd}
      onPointerCancel={handleTouchEnd}
    >
      {/* IMAGE */}
      {displayRect && (
        <img
          src={imageUrl}
          alt="Crop"
          className="absolute pointer-events-none"
          style={{
            left: displayRect.x + viewportOffset.x,
            top: displayRect.y + viewportOffset.y,
            width: displayRect.width,
            height: displayRect.height,
          }}
        />
      )}

      {/* OVERLAY */}
      {cropRect && (
        <>
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div
            className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
            style={{
              left: cropRect.x + viewportOffset.x,
              top: cropRect.y + viewportOffset.y,
              width: cropRect.width,
              height: cropRect.height,
            }}
          />

          {/* CROP BOX */}
          {/* <div
            className="absolute border-2 border-white"
            style={{
              left: cropRect.x + viewportOffset.x,
              top: cropRect.y + viewportOffset.y,
              width: cropRect.width,
              height: cropRect.height,
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-white/40" />
              ))}
            </div>

            {["tl", "tr", "bl", "br"].map((p) => (
              <div
                key={p}
                className={`absolute w-6 h-6 border-white border-4 ${
                  p === "tl" && "top-0 left-0 -translate-x-1 -translate-y-1"
                } ${
                  p === "tr" && "top-0 right-0 translate-x-1 -translate-y-1"
                } ${
                  p === "bl" && "bottom-0 left-0 -translate-x-1 translate-y-1"
                } ${
                  p === "br" && "bottom-0 right-0 translate-x-1 translate-y-1"
                }`}
              />
            ))}
          </div> */}
          {/* CROP BOX */}
          <div
            className="absolute border-2 border-white pointer-events-auto"
            style={{
              left: cropRect.x + viewportOffset.x,
              top: cropRect.y + viewportOffset.y,
              width: cropRect.width,
              height: cropRect.height,
            }}
          >
            {/* GRID */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-white/40" />
              ))}
            </div>
            {/* SIDE HIT ZONES (IMPORTANT) */}
            <div className="absolute top-0 left-6 right-6 h-6 pointer-events-auto bg-transparent" />{" "}
            {/* top */}
            <div className="absolute bottom-0 left-6 right-6 h-6 pointer-events-auto bg-transparent" />{" "}
            {/* bottom */}
            <div className="absolute left-0 top-6 bottom-6 w-6 pointer-events-auto bg-transparent" />{" "}
            {/* left */}
            <div className="absolute right-0 top-6 bottom-6 w-6 pointer-events-auto bg-transparent" />{" "}
            {/* right */}
            {/* CORNER HANDLES */}
            <div className="absolute w-6 h-6 border-white border-4 top-0 left-0 -translate-x-1 -translate-y-1 pointer-events-auto" />
            <div className="absolute w-6 h-6 border-white border-4 top-0 right-0 translate-x-1 -translate-y-1 pointer-events-auto" />
            <div className="absolute w-6 h-6 border-white border-4 bottom-0 left-0 -translate-x-1 translate-y-1 pointer-events-auto" />
            <div className="absolute w-6 h-6 border-white border-4 bottom-0 right-0 translate-x-1 translate-y-1 pointer-events-auto" />
          </div>
        </>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 bg-black p-6 pb-safe">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onRetake}
            className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Retake
          </button>

          <button
            onClick={handleAccept}
            className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Check size={18} strokeWidth={3} />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
