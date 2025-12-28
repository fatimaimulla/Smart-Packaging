import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileCaptureModal from "../components/upload/MobileCaptureModal";

const MobileCapturePage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // step: 1 = top view, 2 = side view
  const [step, setStep] = useState(1);
  const [topImage, setTopImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);

  const handleCapture = (file) => {
    if (step === 1) {
      // Step 1 → Top View
      setTopImage(file);
      setStep(2);
    } else {
      // Step 2 → Side View
      setSideImage(file);

      // Go to review page with both images
      navigate("/mobile-review", {
        state: {
          sessionId,
          topImage,
          sideImage: file,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <MobileCaptureModal
        isOpen={true}
        label={step === 1 ? "Top View" : "Side View"}
        onClose={() => {}}
        // onCapture={(file)=>console.log("captured",file)}
        onCapture={(file)=>{
          handleCapture(file);
          alert(
            `Image captured!\n\nName: ${file.name}\nSize: ${file.size}\nType: ${file.type}`
          );
        }}
      />
    </div>
  );
};

export default MobileCapturePage;
