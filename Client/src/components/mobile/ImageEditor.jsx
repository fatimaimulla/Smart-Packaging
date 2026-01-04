import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Check, X, RotateCcw } from "lucide-react";

const ImageEditor = ({ imageFile, onAccept, onRetake }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imageUrl = React.useMemo(() => URL.createObjectURL(imageFile), [imageFile]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper to create the cropped image
  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onAccept(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-gray-900">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      {/* Controls */}
      <div className="bg-black p-6 safe-area-inset-bottom">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onRetake}
            className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Retake
          </button>
          <button
            onClick={createCroppedImage}
            className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Check size={18} strokeWidth={3} />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Utility for Cropping ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
        // preserve name
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        resolve(file);
    }, "image/jpeg", 0.95);
  });
}

export default ImageEditor;
