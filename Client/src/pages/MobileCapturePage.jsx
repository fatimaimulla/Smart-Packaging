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
import Footer from "@/common/Footer";
import Header from "@/common/Header";
import { io } from "socket.io-client";
const MobileCapturePage = () => {
  const { sessionId } = useParams();
  const socket = io(import.meta.env.VITE_API_BASE_URL);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);

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
      console.log(res)

      if (res.data.success) {
        socket.emit("mobile-upload-complete", sessionId);
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
      <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans flex flex-col safe-area-inset-top safe-area-inset-bottom">
        {/* Header */}
        <Header />
        <main className="pt-10 pb-10 px-6">
          <div className="px-6 pt-8">
            <h1 className="text-xl font-bold text-[#0D1B2A] mb-1">Review</h1>
            <p className="text-gray-500 mb-4 text-sm">
              Swipe to verify your images before uploading.
            </p>
          </div>
          <div className="flex justify-center gap-12 border-b border-gray-300 mt-6 mb-4">
            {["Top View", "Side View"].map((label, idx) => (
              <button
                key={label}
                onClick={() => window.reviewSwiper?.slideTo(idx)}
                className={`pb-2 text-sm font-semibold transition-all ${
                  activeIndex === idx
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Swiper */}
          <div className="flex-1">
            <Swiper
              spaceBetween={24}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              onSwiper={(swiper) => (window.reviewSwiper = swiper)}
              className="h-full"
            >
              {/* Top View */}
              <SwiperSlide>
                <div className="px-2">
                  <div className="relative w-full h-[70vh] rounded-xl overflow-hidden bg-black">
                    {/* Top gradient for readability */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />

                    {/* Floating controls */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex justify-end items-center">
                      <button
                        onClick={() => setStep("capture-top")}
                        className="text-emerald-400 text-sm font-semibold"
                      >
                        Retake
                      </button>
                    </div>

                    {/* Image */}
                    <img
                      src={topImage ? URL.createObjectURL(topImage) : ""}
                      alt="Top View"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </SwiperSlide>

              {/* Side View */}
              {/* <SwiperSlide>
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
                      className="w-full aspect-[3/4] object-cover  bg-gray-100"
                      alt="Side View"
                    />
                  </div>
                </div>
              </SwiperSlide> */}
              <SwiperSlide>
                <div className="px-2">
                  <div className="relative w-full h-[70vh] rounded-xl overflow-hidden bg-black">
                    {/* Top gradient for readability */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />

                    {/* Floating controls */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex justify-end items-center">
                      <button
                        onClick={() => setStep("capture-side")}
                        className="text-emerald-400 text-sm font-semibold"
                      >
                        Retake
                      </button>
                    </div>

                    {/* Image */}
                    <img
                      src={sideImage ? URL.createObjectURL(sideImage) : ""}
                      alt="Side View"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Confirm Button */}
          <div className="p-6 flex items-center justify-center">
            <button
              onClick={handleUpload}
              className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 font-semibold"
            >
              Confirm & Upload
            </button>
          </div>
        </main>

        <Footer />
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
