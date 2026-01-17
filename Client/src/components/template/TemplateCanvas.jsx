import React, { forwardRef, useImperativeHandle } from "react";
import { useState, useRef } from "react";
import { MousePointer2, Move, Plus, Minus, Maximize } from "lucide-react";

const TemplateCanvas = ({ Dieline, dimensions }, ref) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState("move"); // "select" | "move"

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  console.log("From template canvas",dimensions)

  /* ------------------ PAN HANDLERS ------------------ */
  const onMouseDown = (e) => {
    if (tool !== "move") return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isPanning.current || tool !== "move") return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 bg-[#F9FAFB] overflow-hidden rounded-3xl">

      {/* ================= TOOLBAR (BOTTOM) ================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white rounded-xl shadow border border-gray-200 flex items-center gap-1 px-2 py-1">
        
        {/* Arrow (Select) */}
        <button
          onClick={() => setTool("select")}
          className={`p-2 rounded-lg ${
            tool === "select" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <MousePointer2 size={18} />
        </button>

        {/* Hand (Move) */}
        <button
          onClick={() => setTool("move")}
          className={`p-2 rounded-lg ${
            tool === "move" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <Move size={18} />
        </button>

        <button
          onClick={() => setScale((s) => Math.min(s + 0.15, 3))}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={() => setScale((s) => Math.max(s - 0.15, 0.3))}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Minus size={18} />
        </button>

        <button
          onClick={resetView}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* ================= CANVAS ================= */}
      <div
        className={`w-full h-full flex items-center justify-center ${
          tool === "move"
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* THIS wrapper is what moves */}
        <div
          style={{
            width: "900px",
            height: "650px",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <Dieline {...dimensions} />
        </div>
      </div>
    </div>
  );
};

export default TemplateCanvas;
