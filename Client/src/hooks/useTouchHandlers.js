import { useRef, useCallback, useEffect } from "react";

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
        if (handle.includes("l")) {
          next.x += dx;
          next.width -= dx;
        }
        if (handle.includes("r")) {
          next.width += dx;
        }
        if (handle.includes("t")) {
          next.y += dy;
          next.height -= dy;
        }
        if (handle.includes("b")) {
          next.height += dy;
        }

        next.width = Math.max(minSize, next.width);
        next.height = Math.max(minSize, next.height);

        if (aspectRatio) {
          next.height = next.width / aspectRatio;
        }
      }

      onUpdate(next);
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
