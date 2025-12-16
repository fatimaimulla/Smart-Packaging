import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, RotateCcw, Check, Zap, Smartphone } from "lucide-react";
import { clsx } from "clsx";

const MobileCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const [step, setStep] = useState("capture"); // capture, review
  const [tilt, setTilt] = useState(0);
  const [isAligned, setIsAligned] = useState(false);

  // Simulate gyroscope tilt
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const newTilt = Math.random() * 8;
      setTilt(newTilt);
      setIsAligned(newTilt < 5);
    }, 500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCapture = () => {
    setStep("review");
  };

  const handleConfirm = () => {
    onCapture();
    onClose();
    setStep("capture");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      >
        <div className="relative w-full max-w-sm h-[80vh] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Phone Notch/Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-black z-20 flex justify-center">
            <div className="w-32 h-6 bg-gray-900 rounded-b-xl"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-10 right-6 z-20 text-white/80 hover:text-white bg-black/20 backdrop-blur-md p-2 rounded-full"
          >
            <X size={24} />
          </button>

          {step === "capture" ? (
            <>
              {/* Camera Viewport (Simulated) */}
              <div className="flex-1 relative bg-gray-900 overflow-hidden">
                {/* Simulated Camera Feed Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-50"></div>

                {/* 3D Grid Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.1,
                  }}
                ></div>

                {/* Alignment Box */}
                <div
                  className={clsx(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 rounded-lg transition-colors duration-300 flex items-center justify-center",
                    isAligned
                      ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                      : "border-white/50"
                  )}
                >
                  <div className="w-4 h-4 text-white/50">+</div>

                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current"></div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-20 left-0 right-0 flex flex-col items-center gap-2">
                  <div
                    className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-colors",
                      isAligned
                        ? "bg-emerald-500/80 text-white"
                        : "bg-red-500/80 text-white"
                    )}
                  >
                    {isAligned
                      ? "Perfect Alignment"
                      : `Tilt: ${tilt.toFixed(1)}°`}
                  </div>
                  <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs text-white/90 font-medium flex items-center gap-1">
                    <Smartphone size={10} /> Top View Detected
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="h-32 bg-black/90 flex items-center justify-around px-8 pb-4">
                <button className="p-3 rounded-full bg-gray-800 text-white/50 hover:text-white hover:bg-gray-700 transition">
                  <Zap size={20} />
                </button>

                <button
                  onClick={handleCapture}
                  disabled={!isAligned}
                  className={clsx(
                    "w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300",
                    isAligned
                      ? "bg-white hover:scale-105 cursor-pointer"
                      : "bg-transparent opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-14 h-14 bg-white rounded-full border-2 border-black"></div>
                </button>

                <button className="p-3 rounded-full bg-gray-800 text-white/50 hover:text-white hover:bg-gray-700 transition">
                  <RotateCcw size={20} />
                </button>
              </div>
            </>
          ) : (
            /* Review Step */
            <div className="flex-1 bg-black flex flex-col p-6">
              <h3 className="text-white text-xl font-bold mt-12 mb-4 text-center">
                Review Photo
              </h3>
              <div className="flex-1 bg-gray-800 rounded-2xl mb-6 relative overflow-hidden border border-gray-700">
                {/* Placeholder for captured image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  [Captured Image Preview]
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <span className="bg-emerald-500/90 text-white text-xs px-2 py-1 rounded-md">
                    Reference Detected
                  </span>
                  <span className="bg-emerald-500/90 text-white text-xs px-2 py-1 rounded-md">
                    Sharpness OK
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setStep("capture")}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition"
                >
                  Retake
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Use Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileCaptureModal;
