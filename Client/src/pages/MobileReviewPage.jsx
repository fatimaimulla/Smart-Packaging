import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReferenceSelector from "@/components/upload/ReferenceSelector";
import Footer from "@/common/Footer";
import Header from "@/common/Header";
import { clearSideImage, clearTopImage } from "@/redux/slice/mobileUploadSlice";

const MobileReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [referenceType, setReferenceType] = useState("coin");

  

  const topImage = useSelector((state) => state.mobileUpload.topImage);
  const sideImage = useSelector((state) => state.mobileUpload.sideImage);

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!topImage || !sideImage) {
  //     navigate("/upload");
  //   }
  // }, [topImage, sideImage, navigate]);

  // ✅ Create preview URLs safely

  const topPreview = topImage ? URL.createObjectURL(topImage) : null;
  const sidePreview = sideImage ? URL.createObjectURL(sideImage) : null;

  // ✅ Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (topPreview) URL.revokeObjectURL(topPreview);
      if (sidePreview) URL.revokeObjectURL(sidePreview);
    };
  }, [topPreview, sidePreview]);

  /* ==============================
     RETAKE HANDLERS
  ============================== */
  const retakeTop = () => {
    dispatch(clearTopImage());
    navigate(`/mobile-capture/${params.sessionId}`, { state: { step: 1 } });
  };

  const retakeSide = () => {
    dispatch(clearSideImage());
    navigate(`/mobile-capture/${params.sessionId}`, { state: { step: 2 } });
  };

  /* ==============================
     SUBMIT TO BACKEND
  ============================== */
  const handleSubmit = async () => {
    console.log("submitted");
  };

  // if (!topImage || !sideImage) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">
            Review Captured Images
          </h1>

          {/* Images Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16">
            <div className="space-y-2 ">
              <p className=" font-semibold text-gray-700">Top View</p>
              {topPreview && (
                <img
                  src={topPreview}
                  className="rounded-lg border"
                  alt="Top View"
                />
              )}
              <button
                onClick={retakeTop}
                className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 font-semibold"
              >
                Retake Top View
              </button>
            </div>

            <div className="space-y-2">
              <p className=" font-semibold text-gray-700">Side View</p>
              {sidePreview && (
                <img
                  src={sidePreview}
                  className="rounded-lg border"
                  alt="Side View"
                />
              )}
              <button
                onClick={retakeSide}
                className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 font-semibold"
              >
                Retake Side View
              </button>
            </div>
          </div>

          {/* Reference Selector */}
          <div className="m-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Select Reference Object
            </h3>
            <ReferenceSelector
              selected={referenceType}
              onSelect={(val) => setReferenceType(val)}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="text-lg w-1/2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-12 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? "Uploading..." : "Confirm & Upload"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MobileReviewPage;
