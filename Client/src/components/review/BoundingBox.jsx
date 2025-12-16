import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Move } from "lucide-react";

const BoundingBox = ({
  box,
  imageSize,
  onChange,
  color = "blue",
  isResizable = true,
  label,
  confidence,
}) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Colors
  const colors = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500/10",
      handle: "bg-blue-500",
      text: "bg-blue-500",
    },
    green: {
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      handle: "bg-emerald-500",
      text: "bg-emerald-500",
    },
  };
  const theme = colors[color];

  // Handle Drag Move
  const handleDrag = (event, info) => {
    const newX = box.x + info.delta.x;
    const newY = box.y + info.delta.y;

    // Simple boundary check (can be improved)
    onChange({
      ...box,
      x: newX,
      y: newY,
    });
  };

  // Handle Resize (Simplified for this demo)
  // In a production app, we'd attach global mouse listeners on mousedown of handles
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = { ...box };

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newBox = { ...startBox };

      if (direction.includes("e")) newBox.w = Math.max(20, startBox.w + deltaX);
      if (direction.includes("s")) newBox.h = Math.max(20, startBox.h + deltaY);
      // Implementing 'n' and 'w' resizing requires adjusting x/y which is more complex for this demo
      // sticking to bottom-right resizing for simplicity/stability in this context

      onChange(newBox);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onDrag={handleDrag}
      className={clsx(
        "absolute cursor-move group",
        isDragging ? "z-50" : "z-10"
      )}
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
      }}
    >
      {/* Box Outline & Fill */}
      <div
        className={clsx(
          "w-full h-full border-2 transition-colors duration-200 relative",
          theme.border,
          theme.bg,
          (isDragging || isResizing) && "opacity-80"
        )}
      >
        {/* Label Badge */}
        <div
          className={clsx(
            "absolute -top-7 left-0 px-2 py-0.5 text-xs font-bold text-white rounded-t-md flex items-center gap-2 whitespace-nowrap shadow-sm",
            theme.text
          )}
        >
          <span>{label}</span>
          {confidence && (
            <span className="opacity-80 font-normal">({confidence}%)</span>
          )}
        </div>

        {/* Resize Handles (Only if resizable) */}
        {isResizable && (
          <>
            {/* Corner Handle (SE) */}
            <div
              onPointerDown={(e) => handleResizeStart(e, "se")}
              className={clsx(
                "absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white cursor-se-resize shadow-sm z-20 transition-transform hover:scale-125",
                theme.handle
              )}
            />
            {/* Edge Handle (E) */}
            <div
              onPointerDown={(e) => handleResizeStart(e, "e")}
              className={clsx(
                "absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-6 rounded-full border border-white cursor-e-resize shadow-sm",
                theme.handle
              )}
            />
            {/* Edge Handle (S) */}
            <div
              onPointerDown={(e) => handleResizeStart(e, "s")}
              className={clsx(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded-full border border-white cursor-s-resize shadow-sm",
                theme.handle
              )}
            />
          </>
        )}

        {/* Move Icon (Center, visible on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
            <Move
              size={16}
              className={
                color === "blue" ? "text-blue-600" : "text-emerald-600"
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BoundingBox;
