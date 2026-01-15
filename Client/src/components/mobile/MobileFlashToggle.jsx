import React, { useEffect, useState } from "react";
import { Zap, ZapOff } from "lucide-react";
import { clsx } from "clsx";

const MobileFlashToggle = ({ videoTrack }) => {
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // 1. Check Capabilities on Mount/Track Change
  useEffect(() => {
    if (!videoTrack) {
      setIsTorchSupported(false);
      return;
    }

    // Check if browser supports getCapabilities and if torch is available
    // Note: iOS Safari does not support imageCapture/torch constraints as of 2024
    if (typeof videoTrack.getCapabilities === "function") {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.torch) {
        setIsTorchSupported(true);
      } else {
        setIsTorchSupported(false);
      }
    } else {
      setIsTorchSupported(false);
    }
  }, [videoTrack]);

  // 2. Cleanup on Unmount
  useEffect(() => {
    return () => {
      // Ensure torch is turned off when component unmounts (navigation, capture complete, etc.)
      if (videoTrack && flashOn && videoTrack.readyState === "live") {
        videoTrack
          .applyConstraints({
            advanced: [{ torch: false }],
          })
          .catch((err) => {
            // Ignore errors during cleanup (track might already be stopped)
            console.warn("Could not turn off flash during cleanup", err);
          });
      }
    };
  }, [videoTrack, flashOn]);

  // 3. Toggle Logic
  const toggleFlash = async () => {
    if (!videoTrack || !isTorchSupported) return;

    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: !flashOn }],
      });
      setFlashOn(!flashOn);
    } catch (err) {
      console.error("Error toggling flash:", err);
      // In case of error, we might want to revert state or check actual settings
      // For now, we assume the UI state should stay in sync with the attempt
    }
  };

  if (!isTorchSupported) return null;

  return (
    <button
      onClick={toggleFlash}
      className={clsx(
        "flex flex-col items-center bg-white/90 backdrop-blur-md rounded-full py-3 px-2 shadow-lg active:scale-95 transition-transform w-12",
        flashOn ? "text-yellow-600" : "text-gray-800"
      )}
    >
      <div
        className={clsx(
          "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors",
          flashOn ? "bg-yellow-100" : "bg-gray-100"
        )}
      >
        {flashOn ? <Zap size={16} fill="currentColor" /> : <ZapOff size={16} />}
      </div>
      <span
        className="text-[10px] font-bold vertical-lr uppercase tracking-widest"
        style={{ writingMode: "vertical-lr" }}
      >
        {flashOn ? "ON" : "OFF"}
      </span>
    </button>
  );
};

export default MobileFlashToggle;
