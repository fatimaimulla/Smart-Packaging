import React, { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import MobileFlashToggle from "./MobileFlashToggle";

const TiltCamera = ({ label, referenceObject, onCapture, onEditReference }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [tiltStatus, setTiltStatus] = useState("red"); // red, amber, green
  const [isSteady, setIsSteady] = useState(false);
  const steadyTimerRef = useRef(null);

  // 1. Camera Setup
  useEffect(() => {
    let localStream;
    const startCamera = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
        setStream(localStream);
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startCamera();
    return () => {
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 2. Sensor Setup (DeviceOrientation)
  useEffect(() => {
    const handleOrientation = (e) => {
      // Normalize beta (front/back tilt) and gamma (left/right tilt)
      // This is a simplified normalization for portrait mode
      const beta = e.beta || 0;
      const gamma = e.gamma || 0;
      setOrientation({ beta, gamma });
    };

    // Request permission for iOS 13+
    const reqPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        try {
          await DeviceOrientationEvent.requestPermission();
        } catch (e) {
          console.error(e);
        }
      }
    };
    reqPermission();

    window.addEventListener("deviceorientation", handleOrientation);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // 3. Tilt Logic & Debounce
  useEffect(() => {
    const { beta, gamma } = orientation;
    const maxTilt = Math.max(Math.abs(beta), Math.abs(gamma));

    let status = "red";
    if (maxTilt <= 7) status = "green";
    else if (maxTilt <= 12) status = "amber";

    setTiltStatus(status);

    if (status === "green") {
      if (!steadyTimerRef.current) {
        steadyTimerRef.current = setTimeout(() => {
          setIsSteady(true);
          // Haptic feedback if available
          if (navigator.vibrate) navigator.vibrate(50);
        }, 400); // 400ms debounce
      }
    } else {
      if (steadyTimerRef.current) {
        clearTimeout(steadyTimerRef.current);
        steadyTimerRef.current = null;
      }
      setIsSteady(false);
    }
  }, [orientation]);

  // 4. Capture Handler
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Flash effect
          const flash = document.getElementById("camera-flash");
          if (flash) {
            flash.style.opacity = "1";
            setTimeout(() => (flash.style.opacity = "0"), 100);
          }

          const file = new File(
            [blob],
            `${label.toLowerCase().replace(" ", "_")}.jpg`,
            { type: "image/jpeg" }
          );
          onCapture(file);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // Visual Helpers
  const getStatusColor = () => {
    if (tiltStatus === "green") return "border-emerald-400 bg-emerald-400/10";
    if (tiltStatus === "amber") return "border-yellow-400 bg-yellow-400/10";
    return "border-red-400 bg-red-400/10";
  };

  const getStatusText = () => {
    if (tiltStatus === "green") return isSteady ? "Perfect" : "Hold Steady...";
    if (tiltStatus === "amber") return "Almost there";
    return "Align Device";
  };
  const getDirectionText = () => {
    const { beta, gamma } = orientation;

    if (tiltStatus === "green") {
      return isSteady ? "PERFECT" : "HOLD STEADY";
    }

    if (Math.abs(gamma) > Math.abs(beta)) {
      return gamma > 0 ? "TILT RIGHT" : "TILT LEFT";
    } else {
      return beta > 0 ? "TILT DOWN" : "TILT UP";
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Flash Overlay */}
      <div
        id="camera-flash"
        className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100 z-50"
      ></div>

      {/* Camera Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* UI Layer */}
      <div className="relative z-10 flex flex-col h-full p-6 safe-area-inset-top safe-area-inset-bottom">
        {/* Top Bar: Label & Reference Pill */}
        <div className="flex justify-between items-start pt-4">
          <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span className="text-white font-bold text-sm tracking-wider uppercase">
              {label}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <MobileFlashToggle videoTrack={stream?.getVideoTracks()[0]} />

            {/* Reference Pill */}
            <button
              onClick={onEditReference}
              className="flex flex-col items-center bg-white/90 backdrop-blur-md rounded-full py-3 px-2 shadow-lg active:scale-95 transition-transform w-12"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-800">
                {/* Icon based on selection */}
                <Edit2 size={14} />
              </div>
              <span
                className="text-[10px] font-bold text-gray-800 vertical-lr uppercase tracking-widest"
                style={{ writingMode: "vertical-lr" }}
              >
                {referenceObject || "REF"}
              </span>
            </button>
          </div>
        </div>

        {/* Tilt Guidance Overlay */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none gap-6">
          {/* Circular Guide */}
          <div
            className={clsx(
              "w-64 h-64 rounded-full border-2 flex items-center justify-center transition-all duration-300",
              tiltStatus === "green"
                ? "border-emerald-400"
                : tiltStatus === "amber"
                ? "border-yellow-400"
                : "border-red-400"
            )}
          >
            {/* Crosshair */}
            <div className="relative w-6 h-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/70" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
            </div>
          </div>

          {/* Direction Text */}
          <div className="text-center">
            <p
              className={clsx(
                "text-lg font-bold tracking-widest",
                tiltStatus === "green" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {getDirectionText()}
            </p>

            {/* Pitch / Roll */}
            <p className="text-xs text-white/60 mt-1">
              Pitch: {Math.round(orientation.beta)}° | Roll:{" "}
              {Math.round(orientation.gamma)}°
            </p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center gap-6 pb-8">
          {/* Status Text */}
          <div
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-bold transition-colors",
              tiltStatus === "green"
                ? "bg-emerald-500 text-white"
                : "bg-black/50 text-white/80 backdrop-blur-sm"
            )}
          >
            {getStatusText()}
          </div>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            disabled={!isSteady}
            className={clsx(
              "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300",
              isSteady
                ? "border-white bg-white/20 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                : "border-gray-500 bg-transparent opacity-50"
            )}
            aria-label="Capture Photo"
          >
            <div
              className={clsx(
                "w-16 h-16 rounded-full transition-all duration-300",
                isSteady ? "bg-white" : "bg-gray-400"
              )}
            />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default TiltCamera;
