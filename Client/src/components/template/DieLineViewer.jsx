import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  MousePointer2,
  Move,
  Edit3,
  SlidersHorizontal,
  SquareDashedTopSolid,
} from "lucide-react";
import { clsx } from "clsx";
import Fefco0201Dieline from "../dieline/Fefco0201";

const DieLineViewer = ({ dimensions, settings }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.9);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState("pan"); // Default to pan for better UX

  // Dimensions & Settings
  const { l, w, h } = dimensions;
  const thickness = settings.thickness || 0.5;

  // Calculate Derived Dimensions for Display
  const innerL = (l - thickness * 2).toFixed(1);
  const innerW = (w - thickness * 2).toFixed(1);
  const innerH = (h - thickness * 2).toFixed(1);

  const outerL = (l + thickness).toFixed(1);
  const outerW = (w + thickness).toFixed(1);
  const outerH = (h + thickness).toFixed(1);

  // Reset view when dimensions change
  useEffect(() => {
    handleFit();
  }, []);

  

  // Zoom Handlers
  // const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 5));
  // const handleZoomOut = () => setScale((s) => Math.max(s * 0.8, 0.2));

  const handleZoomIn = () => {
    const oldScale = scale;
    const newScale = Math.min(scale * 1.2, 5);
    const ratio = newScale / oldScale;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setPosition((pos) => ({
        x: centerX - (centerX - pos.x) * ratio,
        y: centerY - (centerY - pos.y) * ratio,
      }));
    }

    setScale(newScale);
  };

  const handleZoomOut = () => {
    const oldScale = scale;
    const newScale = Math.max(scale * 0.8, 0.2);
    const ratio = newScale / oldScale;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setPosition((pos) => ({
        x: centerX - (centerX - pos.x) * ratio,
        y: centerY - (centerY - pos.y) * ratio,
      }));
    }

    setScale(newScale);
  };
  // const handleFit = () => {
  //   setScale(0.85);
  //   setPosition({ x: 0, y: 0 });
  // };

  const handleFit = () => {
    if (!containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    // Approximate dieline bounding size
    const dielineWidth = l + w + l + w + settings.glueFlap;
    const dielineHeight = h + settings.topFlap + settings.bottomFlap;

    // Calculate scale to fit with some padding (0.8 = 80% of available space)
    const scaleX = (clientWidth * 0.8) / dielineWidth;
    const scaleY = (clientHeight * 0.8) / dielineHeight;

    const fittedScale = Math.min(scaleX, scaleY);

    const finalScale = Math.max(fittedScale, 0.9);
    // Calculate center position
    const scaledDielineWidth = dielineWidth * fittedScale;
    const scaledDielineHeight = dielineHeight * fittedScale;

    const centerX = (clientWidth - scaledDielineWidth) / 2 +200;
    const centerY = (clientHeight - scaledDielineHeight) / 2+100;

    setScale(finalScale);
    setPosition({ x: centerX, y: centerY });
  };
  // Wheel Zoom Logic with center point zooming
  const handleWheel = (e) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom
    const delta = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(scale + delta, 0.2), 5);
    
    // Adjust position to zoom toward mouse cursor
    const scaleRatio = newScale / scale;
    
    setPosition((pos) => ({
      x: mouseX - (mouseX - pos.x) * scaleRatio,
      y: mouseY - (mouseY - pos.y) * scaleRatio,
    }));
    
    setScale(newScale);
  };

  // Pan Handlers
  const handleMouseDown = (e) => {
    // Allow panning if tool is 'pan' OR if middle mouse button is clicked
    if (activeTool === "pan" || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
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

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-[#F3F4F6]">
      {/* 1. Top-Left Legend & Info Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#4CBA33]"></div>
            <span className="text-xs font-medium text-gray-600">Bleed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#343CB7]"></div>
            <span className="text-xs font-medium text-gray-600">Trim</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t border-dashed border-red-500"></div>
            <span className="text-xs font-medium text-gray-600">Crease</span>
          </div>
        </div>

        {/* Dimensions Text */}
        <div className="space-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
              Manufacture dimensions
            </p>
            <p className="text-sm font-bold text-gray-800 font-mono">
              {l} × {w} × {h} mm
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Inner
              </p>
              <p className="text-xs font-bold text-gray-600 font-mono">
                {innerL} × {innerW} × {innerH}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Outer
              </p>
              <p className="text-xs font-bold text-gray-600 font-mono">
                {outerL} × {outerW} × {outerH}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SVG Viewer Container */}
      <div
        ref={containerRef}
        className={clsx(
          "flex-1 relative overflow-hidden select-none",
          activeTool === "pan"
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Dotted Pattern Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            willChange: "transform",
          }}
        >
          {/* Removing extra padding to allow better fit */}
          <div className="w-full h-full flex items-center justify-center p-10">
            <Fefco0201Dieline
              x={0}
              y={0}
              length={w}
              height={h}
              width={l}
              thickness={settings.thickness}
              glueFlap={settings.glueFlap}
              topFlap={settings.topFlap}
              bottomFlap={settings.bottomFlap}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-1.5 flex items-center gap-1">
          <button
            onClick={() => setActiveTool("select")}
            className={clsx(
              "p-2.5 rounded-lg transition-colors",
              activeTool === "select"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            )}
            title="Select Tool"
          >
            <MousePointer2 size={18} />
          </button>

          <button
            onClick={() => setActiveTool("pan")}
            className={clsx(
              "p-2.5 rounded-lg transition-colors",
              activeTool === "pan"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            )}
            title="Pan Tool"
          >
            <Move size={18} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <button
            onClick={handleZoomIn}
            className="p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors"
            title="Zoom In"
          >
            <PlusIcon />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors"
            title="Zoom Out"
          >
            <MinusIcon />
          </button>

          <button
            onClick={handleFit}
            className="p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors"
            title="Fit to Screen"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Icons
const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const MinusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default DieLineViewer;