import { useCallback } from "react";

/**
 * Rect in pixels
 * x, y → top-left
 */
export const useCropMath = () => {
  /**
   * Convert crop rectangle from DISPLAY space → IMAGE space
   */
  const displayToImage = useCallback((displayRect, cropDisplay) => {
    const { x: dx, y: dy, scale } = displayRect;

    return {
      x: Math.round((cropDisplay.x - dx) / scale),
      y: Math.round((cropDisplay.y - dy) / scale),
      width: Math.round(cropDisplay.width / scale),
      height: Math.round(cropDisplay.height / scale),
    };
  }, []);

  /**
   * Convert crop rectangle from IMAGE space → DISPLAY space
   */
  const imageToDisplay = useCallback((displayRect, cropImage) => {
    const { x: dx, y: dy, scale } = displayRect;

    return {
      x: dx + cropImage.x * scale,
      y: dy + cropImage.y * scale,
      width: cropImage.width * scale,
      height: cropImage.height * scale,
    };
  }, []);

  /**
   * Clamp crop rectangle so it never leaves image bounds
   */
  const clampToImage = useCallback((crop, displayRect) => {
    const x = Math.max(
      displayRect.x,
      Math.min(crop.x, displayRect.x + displayRect.width - crop.width)
    );

    const y = Math.max(
      displayRect.y,
      Math.min(crop.y, displayRect.y + displayRect.height - crop.height)
    );

    return { ...crop, x, y };
  }, []);

  return { displayToImage, imageToDisplay, clampToImage };
};
