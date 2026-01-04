import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setSessionId,
  setReferenceObject,
  setTopImage,
  setSideImage,
  clearTopImage,
  clearSideImage,
} from "@/redux/slice/mobileUploadSlice";
import ReferenceSheet from "@/components/mobile/ReferenceSheet";
import TiltCamera from "@/components/mobile/TiltCamera";
import ImageEditor from "@/components/mobile/ImageEditor";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import uploadFromSystemHandler from "@/api/uploadFromSystemHandler";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";


const MobileCapturePage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const { referenceObject, topImage, sideImage } = useSelector(
    (state) => state.mobileUpload
  );

  // Local Flow State
  // Steps: 'init', 'reference', 'capture-top', 'review-top', 'capture-side', 'review-side', 'final-review', 'uploading', 'success'
  const [step, setStep] = useState("init");
  const [tempImage, setTempImage] = useState(null); // Holds image before crop/accept

  // Initialize Session
  useEffect(() => {
    if (sessionId) {
      dispatch(setSessionId(sessionId));
      // Simulate connection delay
      setTimeout(() => setStep("reference"), 1000);
    }
  }, [sessionId, dispatch]);

  /* ==============================
     HANDLERS
  ============================== */

  // 1. Reference Selection
  const handleReferenceSelect = (id) => {
    dispatch(setReferenceObject(id));
  };

  const handleReferenceConfirm = () => {
    setStep("capture-top");
  };

  // 2. Capture Top
  const handleCaptureTop = (file) => {
    setTempImage(file);
    setStep("review-top");
  };

  const handleAcceptTop = (croppedFile) => {
    dispatch(setTopImage(croppedFile));
    setTempImage(null);
    setStep("capture-side");
  };

  const handleRetakeTop = () => {
    setTempImage(null);
    setStep("capture-top");
  };

  // 3. Capture Side
  const handleCaptureSide = (file) => {
    setTempImage(file);
    setStep("review-side");
  };

  const handleAcceptSide = (croppedFile) => {
    dispatch(setSideImage(croppedFile));
    setTempImage(null);
    setStep("final-review");
  };

  const handleRetakeSide = () => {
    setTempImage(null);
    setStep("capture-side");
  };

  // 4. Final Upload
  const handleUpload = async () => {
    setStep("uploading");
    try {
      // Use existing API handler
      const res = await uploadFromSystemHandler({
        topImage,
        sideImage,
        referenceType: referenceObject,
      });

      if (res.data.success) {
        setStep("success");
      } else {
        toast.error("Upload failed. Please try again.");
        setStep("final-review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
      setStep("final-review");
    }
  };

  /* ==============================
     RENDERERS
  ============================== */

  if (step === "init") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="font-medium">Connecting to session...</p>
      </div>
    );
  }

  if (step === "reference") {
    return (
      <div className="min-h-screen bg-black">
        {/* Background Camera Preview (Blurred) */}
        <TiltCamera
          label="Preview"
          referenceObject={referenceObject}
          onCapture={() => {}}
          onEditReference={() => {}}
        />
        <ReferenceSheet
          isOpen={true}
          selected={referenceObject}
          onSelect={handleReferenceSelect}
          onConfirm={handleReferenceConfirm}
        />
      </div>
    );
  }

  if (step === "capture-top") {
    return (
      <TiltCamera
        label="Top View"
        referenceObject={referenceObject}
        onCapture={handleCaptureTop}
        onEditReference={() => setStep("reference")}
      />
    );
  }

  if (step === "review-top") {
    return (
      <ImageEditor
        imageFile={tempImage}
        onAccept={handleAcceptTop}
        onRetake={handleRetakeTop}
      />
    );
  }

  if (step === "capture-side") {
    return (
      <TiltCamera
        label="Side View"
        referenceObject={referenceObject}
        onCapture={handleCaptureSide}
        onEditReference={() => setStep("reference")}
      />
    );
  }

  if (step === "review-side") {
    return (
      <ImageEditor
        imageFile={tempImage}
        onAccept={handleAcceptSide}
        onRetake={handleRetakeSide}
      />
    );
  }

  // if (step === "final-review") {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex flex-col p-6 safe-area-inset-top safe-area-inset-bottom">
  //       <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2 mt-8">Review</h1>
  //       <p className="text-gray-500 mb-8">
  //         Swipe to check your images before uploading.
  //       </p>

  //       {/* Carousel (Simplified for Mobile) */}
  //       <div className="flex-1 overflow-y-auto space-y-6">
  //         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
  //           <div className="flex justify-between items-center mb-2">
  //             <span className="font-bold text-gray-700">Top View</span>
  //             <button
  //               onClick={() => setStep("capture-top")}
  //               className="text-emerald-600 text-sm font-semibold"
  //             >
  //               Retake
  //             </button>
  //           </div>
  //           <img
  //             src={topImage ? URL.createObjectURL(topImage) : ""}
  //             className="w-full aspect-[3/4] object-cover rounded-xl bg-gray-100"
  //             alt="Top View"
  //           />
  //         </div>

  //         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
  //           <div className="flex justify-between items-center mb-2">
  //             <span className="font-bold text-gray-700">Side View</span>
  //             <button
  //               onClick={() => setStep("capture-side")}
  //               className="text-emerald-600 text-sm font-semibold"
  //             >
  //               Retake
  //             </button>
  //           </div>
  //           <img
  //             src={sideImage ? URL.createObjectURL(sideImage) : ""}
  //             className="w-full aspect-[3/4] object-cover rounded-xl bg-gray-100"
  //             alt="Side View"
  //           />
  //         </div>
  //       </div>

  //       <button
  //         onClick={handleUpload}
  //         className="w-full py-4 mt-4 bg-[#0D1B2A] text-white rounded-xl font-bold text-lg shadow-lg"
  //       >
  //         Confirm & Upload
  //       </button>
  //     </div>
  //   );
  // }

  if (step === "final-review") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col safe-area-inset-top safe-area-inset-bottom">
        {/* Header */}
        <div className="px-6 pt-8">
          <h1 className="text-2xl font-bold text-[#0D1B2A] mb-1">Review</h1>
          <p className="text-gray-500 mb-4">
            Swipe to verify your images before uploading.
          </p>
        </div>

        {/* Swiper */}
        <div className="flex-1">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            className="h-full"
          >
            {/* Top View */}
            <SwiperSlide>
              <div className="px-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">Top View</span>
                    <button
                      onClick={() => setStep("capture-top")}
                      className="text-emerald-600 text-sm font-semibold"
                    >
                      Retake
                    </button>
                  </div>
                  <img
                    src={topImage ? URL.createObjectURL(topImage) : ""}
                    className="w-full aspect-[3/4] object-cover rounded-xl bg-gray-100"
                    alt="Top View"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* Side View */}
            <SwiperSlide>
              <div className="px-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">Side View</span>
                    <button
                      onClick={() => setStep("capture-side")}
                      className="text-emerald-600 text-sm font-semibold"
                    >
                      Retake
                    </button>
                  </div>
                  <img
                    src={sideImage ? URL.createObjectURL(sideImage) : ""}
                    className="w-full aspect-[3/4] object-cover rounded-xl bg-gray-100"
                    alt="Side View"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Confirm Button */}
        <div className="p-6">
          <button
            onClick={handleUpload}
            className="w-full py-4 bg-[#0D1B2A] text-white rounded-xl font-bold text-lg shadow-lg"
          >
            Confirm & Upload
          </button>
        </div>
      </div>
    );
  }



  if (step === "uploading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-emerald-500 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-[#0D1B2A] mb-2">Uploading...</h2>
        <p className="text-gray-500">
          Syncing with your desktop session. Please wait.
        </p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">
          Upload Complete!
        </h2>
        <p className="text-emerald-700 mb-8">
          You can now continue on your desktop screen.
        </p>
        <button
          onClick={() => window.close()}
          className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-full shadow-sm border border-emerald-100"
        >
          Close Window
        </button>
      </div>
    );
  }

  return null;
};

export default MobileCapturePage;
