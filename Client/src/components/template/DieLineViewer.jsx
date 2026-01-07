import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize, Move, Download } from "lucide-react";
import { clsx } from "clsx";
import Fefco0201Dieline from "../dieline/Fefco0201";

const DieLineViewer = ({ dimensions, settings }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Dimensions & Settings
  const { l, w, h } = dimensions;
  const { glueFlap, topFlap, bottomFlap } = settings;

  // Calculate Drawing Points (Parametric FEFCO 0201)
  // We assume a standard layout: GlueTab - L - W - L - W
  const totalWidth = glueFlap + l + w + l + w;
  const totalHeight = topFlap + h + bottomFlap;

  // Center the drawing initially
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      // Fit to screen logic roughly
      const scaleX = (clientWidth - 100) / totalWidth;
      const scaleY = (clientHeight - 100) / totalHeight;
      const newScale = Math.min(scaleX, scaleY, 1.5); // Cap max scale

      setScale(newScale);
      setPosition({
        x: (clientWidth - totalWidth * newScale) / 2,
        y: (clientHeight - totalHeight * newScale) / 2,
      });
    }
  }, [dimensions, settings]);

  // Zoom Handlers
  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale((s) => Math.max(s * 0.8, 0.1));
  const handleFit = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const scaleX = (clientWidth - 100) / totalWidth;
      const scaleY = (clientHeight - 100) / totalHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
      setPosition({
        x: (clientWidth - totalWidth * newScale) / 2,
        y: (clientHeight - totalHeight * newScale) / 2,
      });
    }
  };

  // Pan Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // SVG Path Generation
  // Y coordinates: 0 (top edge of top flap), topFlap (top fold), topFlap+h (bottom fold), totalHeight (bottom edge)
  const y1 = 0;
  const y2 = topFlap;
  const y3 = topFlap + h;
  const y4 = totalHeight;

  // X coordinates
  const x0 = 0;
  const x1 = glueFlap;
  const x2 = glueFlap + l;
  const x3 = glueFlap + l + w;
  const x4 = glueFlap + l + w + l;
  const x5 = glueFlap + l + w + l + w;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative flex flex-col gap-6 h-full border border-gray-100">
      <div className="flex justify-between items-center z-10">
        <h2 className="text-3xl font-semibold text-[#0D1B2A]">
          Die-line Preview
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
            FEFCO 0201
          </span>
        </div>
      </div>

      {/* SVG Viewer Container */}
      <div
        ref={containerRef}
        className={clsx(
          "flex-1 border border-gray-200 rounded-xl bg-gray-50 relative overflow-hidden cursor-grab active:cursor-grabbing min-h-[400px]",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0D1B2A 1px, transparent 1px), linear-gradient(90deg, #0D1B2A 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* The Parametric Die-Line */}
        <Fefco0201Dieline
          x={x0}
          y={y1}
          length={l}
          height={h}
          width={w}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-3">
        <button
          onClick={handleFit}
          className="bg-white shadow-md rounded-full p-3 hover:scale-110 transition text-gray-600 hover:text-blue-600 border border-gray-100"
          title="Fit to Screen"
        >
          <Maximize size={20} />
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-white shadow-md rounded-full p-3 hover:scale-110 transition text-gray-600 hover:text-blue-600 border border-gray-100"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white shadow-md rounded-full p-3 hover:scale-110 transition text-gray-600 hover:text-blue-600 border border-gray-100"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm text-gray-500 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#A2D68E]"></div>
          <span>Bleed Line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#343CB7]"></div>
          <span>Trim Line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500"></div>
          <span>Crease Line</span>
        </div>
      </div>
    </div>
  );
};

export default DieLineViewer;
