import { useRef, useCallback, useEffect } from "react";
import { useCropMath } from "./useCropMath";

export const useTouchHandlers = ({
  cropRect,
  displayRect,
  viewportOffset,
  aspectRatio,
  minSize,
  onUpdate,
  onInteractionEnd,
}) => {
  const stateRef = useRef({
    isDragging: false,
    activeHandle: null,
    startPos: { x: 0, y: 0 },
    initialRect: { ...cropRect },
  });

  useEffect(() => {
    return () => {
      stateRef.current.isDragging = false;
    };
  }, []);
  const { clampToImage } = useCropMath();


  // const getHandle = (x, y) => {
  //   const threshold = 30;

  //   const cx = cropRect.x + viewportOffset.x;
  //   const cy = cropRect.y + viewportOffset.y;
  //   const { width, height } = cropRect;

  //   // corners
  //   if (Math.abs(x - cx) < threshold && Math.abs(y - cy) < threshold)
  //     return "tl";
  //   if (Math.abs(x - (cx + width)) < threshold && Math.abs(y - cy) < threshold)
  //     return "tr";
  //   if (Math.abs(x - cx) < threshold && Math.abs(y - (cy + height)) < threshold)
  //     return "bl";
  //   if (
  //     Math.abs(x - (cx + width)) < threshold &&
  //     Math.abs(y - (cy + height)) < threshold
  //   )
  //     return "br";

  //   // move
  //   if (x > cx && x < cx + width && y > cy && y < cy + height) return "move";

  //   return null;
  // };

  const getHandle = (x, y) => {
    const threshold = 30;

    const cx = cropRect.x + viewportOffset.x;
    const cy = cropRect.y + viewportOffset.y;
    const { width, height } = cropRect;

    // corners
    if (Math.abs(x - cx) < threshold && Math.abs(y - cy) < threshold)
      return "tl";
    if (Math.abs(x - (cx + width)) < threshold && Math.abs(y - cy) < threshold)
      return "tr";
    if (Math.abs(x - cx) < threshold && Math.abs(y - (cy + height)) < threshold)
      return "bl";
    if (
      Math.abs(x - (cx + width)) < threshold &&
      Math.abs(y - (cy + height)) < threshold
    )
      return "br";

    // edges
    if (Math.abs(y - cy) < threshold && x > cx && x < cx + width) return "t";
    if (Math.abs(y - (cy + height)) < threshold && x > cx && x < cx + width)
      return "b";
    if (Math.abs(x - cx) < threshold && y > cy && y < cy + height) return "l";
    if (Math.abs(x - (cx + width)) < threshold && y > cy && y < cy + height)
      return "r";

    // move
    if (x > cx && x < cx + width && y > cy && y < cy + height) return "move";

    return null;
  };

  const handleTouchStart = useCallback(
    (e) => {
      const point = e.touches ? e.touches[0] : e;

      const handle = getHandle(point.clientX, point.clientY);
      if (!handle) return;

      stateRef.current = {
        isDragging: true,
        activeHandle: handle,
        startPos: { x: point.clientX, y: point.clientY },
        initialRect: { ...cropRect },
      };
    },
    [cropRect]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!stateRef.current.isDragging) return;

      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - stateRef.current.startPos.x;
      const dy = point.clientY - stateRef.current.startPos.y;

      const initialRect = stateRef.current.initialRect; // ✅ REQUIRED

      const next = { ...stateRef.current.initialRect };
      const handle = stateRef.current.activeHandle;

      if (handle === "move") {
        next.x = Math.max(
          displayRect.x,
          Math.min(
            stateRef.current.initialRect.x + dx,
            displayRect.x + displayRect.width - next.width
          )
        );

        next.y = Math.max(
          displayRect.y,
          Math.min(
            stateRef.current.initialRect.y + dy,
            displayRect.y + displayRect.height - next.height
          )
        );
      } else {
        // if (handle.includes("l")) {
        //   next.x += dx;
        //   next.width -= dx;
        // }
        // if (handle.includes("r")) {
        //   next.width += dx;
        // }
        // if (handle.includes("t")) {
        //   next.y += dy;
        //   next.height -= dy;
        // }
        // if (handle.includes("b")) {
        //   next.height += dy;
        // }
        // LEFT
        if (handle.includes("l")) {
          const newX = Math.min(
            initialRect.x + initialRect.width - minSize,
            Math.max(displayRect.x, initialRect.x + dx)
          );
          next.width = initialRect.width + (initialRect.x - newX);
          next.x = newX;
        }

        // RIGHT
        if (handle.includes("r")) {
          const maxWidth = displayRect.x + displayRect.width - initialRect.x;
          next.width = Math.min(
            maxWidth,
            Math.max(minSize, initialRect.width + dx)
          );
        }

        // TOP
        if (handle.includes("t")) {
          const newY = Math.min(
            initialRect.y + initialRect.height - minSize,
            Math.max(displayRect.y, initialRect.y + dy)
          );
          next.height = initialRect.height + (initialRect.y - newY);
          next.y = newY;
        }

        // BOTTOM
        if (handle.includes("b")) {
          const maxHeight = displayRect.y + displayRect.height - initialRect.y;
          next.height = Math.min(
            maxHeight,
            Math.max(minSize, initialRect.height + dy)
          );
        }

        next.width = Math.max(minSize, next.width);
        next.height = Math.max(minSize, next.height);

        if (aspectRatio) {
          next.height = next.width / aspectRatio;
        }
      }

      // onUpdate(next);
      // const clamped = clampToImage(next, displayRect);
      // onUpdate(clamped);
      if (handle === "move") {
        onUpdate(clampToImage(next, displayRect));
      } else {
        onUpdate(next);
      }

    },
    [displayRect, minSize, aspectRatio, onUpdate]
  );

  const handleTouchEnd = useCallback(() => {
    stateRef.current.isDragging = false;
    stateRef.current.activeHandle = null;
    onInteractionEnd?.();
  }, [onInteractionEnd]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
