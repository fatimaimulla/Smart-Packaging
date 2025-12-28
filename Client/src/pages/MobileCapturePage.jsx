import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MobileCaptureModal from "../components/upload/MobileCaptureModal";
import { useDispatch, useSelector } from "react-redux";
import { setSideImage, setTopImage } from "@/redux/slice/mobileUploadSlice";
import { param } from "framer-motion/client";

const MobileCapturePage = () => {

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  // step: 1 = top view, 2 = side view
  const initialStep = location.state?.step ?? 1;

  const [step, setStep] = useState(initialStep);

  const handleCapture = (file) => {
    if (step === 1) {
      // Step 1 → Top View
      console.log("this is the first image");
      dispatch(setTopImage(file));
      setStep(2);
    } else {
      // Step 2 → Side View
      dispatch(setSideImage(file));
      console.log("this is the second image");


      // Go to review page with both images
      navigate(`/mobile-review/${params.sessionId}`);
      
    }
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <MobileCaptureModal
        isOpen={true}
        label={step === 1 ? "Top View" : "Side View"}
        onClose={() => {}}
        // onCapture={(file)=>console.log("captured",file)}
        onCapture={(file) => {
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
