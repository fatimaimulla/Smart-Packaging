import React, { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useCropMath } from "../../hooks/useCropMath";
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

  //   const dRect = {
  //     x: (rect.width - w) / 2,
  //     y: (rect.height - h) / 2,
  //     width: w,
  //     height: h,
  //     scale,
  //   };

  //   setDisplayRect(dRect);
  //   setCropRect({ ...dRect });
  // }, [imgData]);

  // Inside the layout calculation useEffect
  useEffect(() => {
    if (!imgData || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Increase vertical padding to account for the footer height (~100px - 120px)
    const paddingX = 40;
    const paddingY = 120; // Increased to push image away from buttons

    const maxW = rect.width - paddingX * 2;
    const maxH = rect.height - paddingY * 2; // Use a symmetric padding or calculate footer height

    const scale = Math.min(maxW / imgData.width, maxH / imgData.height);

    const w = imgData.width * scale;
    const h = imgData.height * scale;

    const dRect = {
      // Center it in the remaining space
      x: (rect.width - w) / 2,
      y: (rect.height - h - 80) / 2, // Subtracting ~80px to shift it upwards from the footer
      width: w,
      height: h,
      scale,
    };

    setDisplayRect(dRect);
    setCropRect({ ...dRect });
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
  // const handleAccept = async () => {
  //   if (!cropRect || !displayRect || !imgData) return;

  //   const imageCrop = displayToImage(displayRect, cropRect);

  //   const canvas = document.createElement("canvas");
  //   canvas.width = imageCrop.width;
  //   canvas.height = imageCrop.height;
  //   const ctx = canvas.getContext("2d");

  //   ctx.drawImage(
  //     imgData.el,
  //     imageCrop.x,
  //     imageCrop.y,
  //     imageCrop.width,
  //     imageCrop.height,
  //     0,
  //     0,
  //     imageCrop.width,
  //     imageCrop.height
  //   );

  //   canvas.toBlob(
  //     (blob) => {
  //       const file = new File([blob], "cropped.jpg", {
  //         type: "image/jpeg",
  //       });
  //       onAccept(file);
  //     },
  //     "image/jpeg",
  //     0.95
  //   );
  // };
  // const handleAccept = async () => {
  //   if (!cropRect || !displayRect || !imgData) return;

  //   // Calculate the crop area relative to the displayed image
  //   const relativeCrop = {
  //     x: (cropRect.x - displayRect.x) / displayRect.scale,
  //     y: (cropRect.y - displayRect.y) / displayRect.scale,
  //     width: cropRect.width / displayRect.scale,
  //     height: cropRect.height / displayRect.scale,
  //   };

  //   const canvas = document.createElement("canvas");
  //   canvas.width = relativeCrop.width;
  //   canvas.height = relativeCrop.height;
  //   const ctx = canvas.getContext("2d");

  //   ctx.drawImage(
  //     imgData.el,
  //     relativeCrop.x,
  //     relativeCrop.y,
  //     relativeCrop.width,
  //     relativeCrop.height,
  //     0,
  //     0,
  //     relativeCrop.width,
  //     relativeCrop.height
  //   );

  //   canvas.toBlob(
  //     (blob) => {
  //       const file = new File([blob], "cropped.jpg", {
  //         type: "image/jpeg",
  //       });
  //       onAccept(file);
  //     },
  //     "image/jpeg",
  //     0.95
  //   );
  // };

  const handleAccept = async () => {
    if (!cropRect || !displayRect || !imgData) return;

    // Calculate the crop area relative to the displayed image
    const relativeCrop = {
      x: (cropRect.x - displayRect.x - viewportOffset.x) / displayRect.scale,
      y: (cropRect.y - displayRect.y - viewportOffset.y) / displayRect.scale,
      width: cropRect.width / displayRect.scale,
      height: cropRect.height / displayRect.scale,
    };

    // Ensure we're within bounds
    relativeCrop.x = Math.max(0, relativeCrop.x);
    relativeCrop.y = Math.max(0, relativeCrop.y);
    relativeCrop.width = Math.min(
      relativeCrop.width,
      imgData.width - relativeCrop.x
    );
    relativeCrop.height = Math.min(
      relativeCrop.height,
      imgData.height - relativeCrop.y
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(relativeCrop.width);
    canvas.height = Math.round(relativeCrop.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgData.el,
      Math.round(relativeCrop.x),
      Math.round(relativeCrop.y),
      Math.round(relativeCrop.width),
      Math.round(relativeCrop.height),
      0,
      0,
      Math.round(relativeCrop.width),
      Math.round(relativeCrop.height)
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
      className="fixed inset-0 bg-black overflow-hidden touch-none select-none"
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
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
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
            className="absolute border-2 border-white"
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
            <div className="absolute top-0 left-6 right-6 h-6" /> {/* top */}
            <div className="absolute bottom-0 left-6 right-6 h-6" />{" "}
            {/* bottom */}
            <div className="absolute left-0 top-6 bottom-6 w-6" /> {/* left */}
            <div className="absolute right-0 top-6 bottom-6 w-6" />{" "}
            {/* right */}
            {/* CORNER HANDLES */}
            <div className="absolute w-6 h-6 border-white border-4 top-0 left-0 -translate-x-1 -translate-y-1" />
            <div className="absolute w-6 h-6 border-white border-4 top-0 right-0 translate-x-1 -translate-y-1" />
            <div className="absolute w-6 h-6 border-white border-4 bottom-0 left-0 -translate-x-1 translate-y-1" />
            <div className="absolute w-6 h-6 border-white border-4 bottom-0 right-0 translate-x-1 translate-y-1" />
          </div>
        </>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 bg-black p-6 safe-area-inset-bottom">
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
