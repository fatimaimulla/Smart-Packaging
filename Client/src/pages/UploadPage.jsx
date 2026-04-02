import { useNavigate } from "react-router-dom";
import QRPanel from "../components/upload/QRPanel";
import Footer from "../common/Footer";
import MobileCaptureModal from "../components/upload/MobileCaptureModal";
import { ArrowRight } from "lucide-react";
import ImagePreviewCard from "../components/upload/ImagePreviewCard";
import UploadZone from "../components/upload/UploadZone";
import ReferenceSelector from "../components/upload/ReferenceSelector";
import Header from "../common/Header";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { toast } from "sonner";
import uploadFromSystemHandler from "@/api/uploadFromSystemHandler.js";
import { imageProcessing } from "@/api/imageProcessing";
import { updateSideDimension } from "@/api/updateSideDimension";
import { updateTopDimension } from "@/api/updateTopDimension";
import wake from "@/api/wakeServer";
import {
  setAiResponse,
  setCurrentProjectSessionId,
} from "@/redux/slice/imageSlice";
import { createProjectRequest } from "@/api/projects";

const UploadPage = () =>
{
 useEffect(() => {
   wake();
 }, []);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [referenceType, setReferenceType] = useState("coin");
  const [captureSessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `capture-${Date.now()}`,
  );
  const [projectName, setProjectName] = useState("");
  const [images, setImages] = useState([]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const processImage = async (imageId, file,type) => {
    try {
      const res = await imageProcessing({ croppedImage: file });

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,

                processing: false,

                success: res.data.success,

                apiResult: res.data,
              }
            : img,
        ),
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, processing: false, success: false }
            : img,
        ),
      );

      toast.error(error.response?.data?.message || error.message);
    } 
  };

  // Mock function to handle file upload
const handleUpload = (files) => {
  let tempImages = [...images]; // ✅ moved OUTSIDE map

  const newImages = Array.from(files).map((file, index) => {
    const id = Date.now() + index;

    const hasTopView = tempImages.some((img) => img.type === "Top View");

    const type = hasTopView ? "Side View" : "Top View";

    const newImage = {
      id,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      type,

      // backend-driven state
      processing: true,
      success: false,
      apiResult: null,
    };

    // ✅ THIS is the key line
    tempImages.push(newImage);

    return newImage;
  });

  setImages((prev) => {
    const updated = [...prev, ...newImages].slice(0, 2);

    newImages.forEach((img) => {
      processImage(img.id, img.file,img.type);
    });

    return updated;
  });
};



  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

    

  const uploadToBackend = async () =>
  {
     setIsSubmitting(true);
   
    console.log("Helloo")

    if (!projectName.trim()) {
      toast.error("Please add a project name before continuing.");
      setIsSubmitting(false);
      return;
    }
      
    if (images.length !== 2)
    {
        console.log("2nd step--------->");
        toast.error("Please upload 2 images");
        setIsSubmitting(false);
        return;
      }
    

    const topImage = images.find((img) => img.type === "Top View");
    const sideImage = images.find((img) => img.type === "Side View");
    console.log("2nd step--------->");
    

      if (!topImage?.file || !sideImage?.file) {
        toast.error("Both Top View and Side View are required");
        setIsSubmitting(false);
        return;
      }

      if (
        !topImage.apiResult?.reference_object?.length ||
        !topImage.apiResult?.products?.length ||
        !sideImage.apiResult?.reference_object?.length ||
        !sideImage.apiResult?.products?.length
      ) {
        toast.error(
          "We can only save the project once both product and reference object are detected.",
        );
        setIsSubmitting(false);
        return;
      }

    try {
      console.log("3rd step------------->");
      const projectRes = await createProjectRequest({
        name: projectName.trim(),
      });
      const projectSessionId = projectRes.data.data.sessionId;
      dispatch(setCurrentProjectSessionId(projectSessionId));

      const res = await uploadFromSystemHandler({
        topImage: topImage.file,
        sideImage: sideImage.file,
        referenceType: referenceType,
        sessionId: projectSessionId,
      });
      console.log("this is from current chutiya", res);
      if (res.data.success) {
        await updateTopDimension({
          topView: topImage.apiResult,
          sessionId: projectSessionId,
        });
        await updateSideDimension({
          sideView: sideImage.apiResult,
          sessionId: projectSessionId,
        });
        dispatch(setAiResponse({ sessionId: null, data: {} }));
        toast.success(res.data.message);
        navigate(`/review/${projectSessionId}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Network error. Please try again.",
      );
    } finally {
      setIsSubmitting(false); // ⭐ STOP LOADER (safety)
    }
    };


    
  // const handleMobileCapture = () => {
  //   // Simulate receiving an image from mobile
  //   const mockFile = new File([""], "mobile_capture.jpg", {
  //     type: "image/jpeg",
  //   });
  //   handleUpload([mockFile]);
  // };

  const handleMobileCapture = (file) => {
    handleUpload([file]);
  };

  // Validation Logic

  const isComplete = images.length === 2;
  const allProcessed = images.every((img) => img.processing === false);
  const allSuccess = images.every((img) => img.success === true);
  const canContinue1 =
    isComplete &&
    allProcessed &&
    allSuccess &&
    !!projectName.trim();


  let statusText = "Waiting";
  let allReferencesDetected = false;

  if (images.length === 2) {
    const topOk = images[0].success === true;
    const sideOk = images[1].success === true;

    allReferencesDetected = topOk && sideOk;

    if (allReferencesDetected) {
      statusText = "Top View Done • Side View Done";
    } else {
      statusText = `${topOk ? "Top View Done" : "Top View Error"} • ${
        sideOk ? "Side View Done" : "Side View Error"
      }`;
    }
  }

  const fatalErrors = !allReferencesDetected;


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

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#0D1B2A]">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Example: Shampoo Bottle March Batch"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
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
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    Images: {images.length}/2
                  </span>
                  <span
                    className={clsx(
                      "px-3 py-1 rounded-full",
                      allReferencesDetected && images.length > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    Reference Check:{" "}
                    {images.length === 1 || images.length === 0
                      ? "Waiting"
                      : statusText}
                  </span>
                </div>

                <button
                  onClick={uploadToBackend}
                  disabled={!canContinue1 ||isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Review
                      <ArrowRight size={18} />
                    </>
                  )}
                 
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: QR Panel */}
            <div className="lg:col-span-1">
              <QRPanel
                sessionId={captureSessionId}
                onSimulateMobile={() => setIsMobileModalOpen(true)}
              />
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
