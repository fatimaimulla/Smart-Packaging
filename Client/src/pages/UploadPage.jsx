import { useNavigate } from "react-router-dom";
import QRPanel from "../components/upload/QRPanel";
import Footer from "../common/Footer";
import MobileCaptureModal from "../components/upload/MobileCaptureModel";
import { ArrowRight } from "lucide-react";
import ImagePreviewCard from "../components/upload/ImagePreviewCard";
import UploadZone from "../components/upload/UploadZone";
import ReferenceSelector from "../components/upload/ReferenceSelector";
import Header from "../common/Header";
import { useState } from "react";
import clsx from "clsx";

const UploadPage = () => {
  const navigate = useNavigate();
  const [referenceType, setReferenceType] = useState("coin");
  const [images, setImages] = useState([]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Mock function to handle file upload
  const handleUpload = (files) => {
    const newImages = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      type: images.length === 0 ? "Top View" : "Side View", // Simple auto-assign logic
      validation: {
        referenceDetected: Math.random() > 0.2, // Mock random validation
        tilt: Math.random() * 8, // Mock random tilt
      },
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 2));
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMobileCapture = () => {
    // Simulate receiving an image from mobile
    const mockFile = new File([""], "mobile_capture.jpg", {
      type: "image/jpeg",
    });
    handleUpload([mockFile]);
  };

  // Validation Logic
  const isComplete = images.length === 2;
  const allReferencesDetected = images.every(
    (img) => img.validation.referenceDetected
  );
  const fatalErrors = !allReferencesDetected;
  const canContinue = isComplete && !fatalErrors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Upload & Thumbnails */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Upload Instructions Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">
                    Upload Two Photos
                  </h1>
                  <p className="text-gray-600">
                    We need a top view and a side view to calculate dimensions
                    accurately. Ensure your reference object is clearly visible.
                  </p>
                </div>

                <ReferenceSelector
                  selected={referenceType}
                  onSelect={setReferenceType}
                />

                <UploadZone
                  onUpload={handleUpload}
                  disabled={images.length >= 2}
                />
              </div>

              {/* Thumbnails List */}
              {images.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-[#0D1B2A] ml-1">
                    Uploaded Images
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {images.map((img) => (
                      <ImagePreviewCard
                        key={img.id}
                        image={img}
                        onDelete={() => handleDelete(img.id)}
                        onReplace={() => {
                          handleDelete(img.id);
                          // Logic to open upload dialog would go here
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Status Bar */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/50 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex gap-3 text-sm font-medium">
                  <span
                    className={clsx(
                      "px-3 py-1 rounded-full",
                      isComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    Images: {images.length}/2
                  </span>
                  <span
                    className={clsx(
                      "px-3 py-1 rounded-full",
                      allReferencesDetected && images.length > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    Reference Check:{" "}
                    {images.length === 0
                      ? "Waiting"
                      : allReferencesDetected
                      ? "Passed"
                      : "Issues Found"}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/review")}
                  disabled={!canContinue}
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 font-semibold"
                >
                  Continue to Review
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: QR Panel */}
            <div className="lg:col-span-1">
              <QRPanel onSimulateMobile={() => setIsMobileModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Capture Simulation Modal */}
      <MobileCaptureModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onCapture={handleMobileCapture}
      />
    </div>
  );
};

export default UploadPage;
