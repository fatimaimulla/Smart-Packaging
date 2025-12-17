import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { X, Camera } from "lucide-react";

const MobileCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [orientation, setOrientation] = useState({ beta: null, gamma: null });
  const [isAligned, setIsAligned] = useState(false);
  const [holdSteady, setHoldSteady] = useState(false);

  /* ==============================
     CAMERA SETUP
  ============================== */
  useEffect(() => {
    if (!isOpen) return;

    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  /* ==============================
     GYROSCOPE PERMISSION (iOS SAFE)
  ============================== */
  useEffect(() => {
    if (!isOpen) return;

    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        await DeviceOrientationEvent.requestPermission();
      }
    };

    requestPermission();
  }, [isOpen]);

  /* ==============================
     ORIENTATION LISTENER
  ============================== */
  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (event) => {
      setOrientation({
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, [isOpen]);

  /* ==============================
     ALIGNMENT CHECK (TOP VIEW)
     Parallel to surface
  ============================== */
  useEffect(() => {
    if (orientation.beta === null || orientation.gamma === null) return;

    const aligned =
      Math.abs(orientation.beta) < 5 && Math.abs(orientation.gamma) < 5;

    setIsAligned(aligned);

    if (aligned) {
      const timer = setTimeout(() => setHoldSteady(true), 500);
      return () => clearTimeout(timer);
    } else {
      setHoldSteady(false);
    }
  }, [orientation]);

  /* ==============================
     CAPTURE IMAGE
  ============================== */
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "mobile_capture.jpg", {
        type: "image/jpeg",
      });

      onCapture(file);
      onClose();
    }, "image/jpeg");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-black rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center p-4 text-white">
          <span className="font-semibold">Align & Capture</span>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Camera Preview */}
        <div className="relative aspect-[3/4] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Alignment Overlay */}
          <div className="absolute inset-6 border-2 border-white/30 rounded-xl pointer-events-none" />

          {/* Level Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/20 rounded-full">
            <div
              className="h-full bg-emerald-400 transition-all"
              style={{
                width: `${Math.max(
                  10,
                  100 - Math.abs(orientation.beta || 0) * 10
                )}%`,
              }}
            />
          </div>

          {/* Status Badge */}
          <div
            className={clsx(
              "absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold",
              isAligned
                ? "bg-emerald-500/90 text-black"
                : "bg-red-500/90 text-white"
            )}
          >
            {isAligned
              ? holdSteady
                ? "Perfect — Hold steady"
                : "Aligned — Stabilizing"
              : "Tilt phone to align"}
          </div>

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            disabled={!holdSteady}
            className={clsx(
              "absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all",
              holdSteady
                ? "bg-gradient-to-r from-blue-500 to-emerald-400 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-105"
                : "bg-gray-600 opacity-40 cursor-not-allowed"
            )}
          >
            <Camera size={28} className="text-white" />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default MobileCaptureModal;
