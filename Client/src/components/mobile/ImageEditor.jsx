import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, RotateCcw } from "lucide-react";

const ImageEditor = ({ imageFile, onAccept, onRetake }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const imageUrl = React.useMemo(
    () => URL.createObjectURL(imageFile),
    [imageFile]
  );

  // --- SAME LOGIC DATA ---
  const [cropRect, setCropRect] = useState(null);
  const [dragging, setDragging] = useState(null);

  // initialize crop
  useEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width * 0.7;
    const height = (width * 4) / 3;

    setCropRect({
      x: (rect.width - width) / 2,
      y: (rect.height - height) / 2,
      width,
      height,
    });
  }, []);

  // --- DRAG LOGIC ---
  const startDrag = (e, type) => {
    e.stopPropagation();
    setDragging({ type, startX: e.clientX, startY: e.clientY, rect: cropRect });
  };

  const onMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;

    const r = dragging.rect;

    if (dragging.type === "move") {
      setCropRect({
        ...r,
        x: r.x + dx,
        y: r.y + dy,
      });
    }

    if (dragging.type === "br") {
      setCropRect({
        ...r,
        width: Math.max(80, r.width + dx),
        height: Math.max(80, r.height + dy),
      });
    }
  };

  const stopDrag = () => setDragging(null);

  // --- SAME OUTPUT LOGIC ---
  const handleAccept = async () => {
    const rect = cropRect;
    const img = imgRef.current;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const croppedAreaPixels = {
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      width: rect.width * scaleX,
      height: rect.height * scaleY,
    };

    const cropped = await getCroppedImg(imageUrl, croppedAreaPixels);
    onAccept(cropped);
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={onMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* IMAGE AREA */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="crop"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* DARK OVERLAY */}
        {cropRect && (
          <>
            <div className="absolute inset-0 bg-black/60" />

            {/* CUTOUT */}
            <div
              className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              style={{
                left: cropRect.x,
                top: cropRect.y,
                width: cropRect.width,
                height: cropRect.height,
              }}
            />

            {/* CROP BOX */}
            <div
              className="absolute border-2 border-white"
              style={{
                left: cropRect.x,
                top: cropRect.y,
                width: cropRect.width,
                height: cropRect.height,
              }}
              onMouseDown={(e) => startDrag(e, "move")}
            >
              {/* GRID */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="border border-white/40" />
                ))}
              </div>

              {/* HANDLE */}
              <div
                className="absolute w-6 h-6 border-4 border-white bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize"
                onMouseDown={(e) => startDrag(e, "br")}
              />
            </div>
          </>
        )}
      </div>

      {/* CONTROLS */}
      <div className="bg-black p-6 flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Retake
        </button>

        <button
          onClick={handleAccept}
          className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Accept
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;
