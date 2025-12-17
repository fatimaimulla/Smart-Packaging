import MobileCaptureModal from "../components/upload/MobileCaptureModal";
import { useParams } from "react-router-dom";

const MobileCapturePage = () => {
  const { sessionId } = useParams();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <MobileCaptureModal
        isOpen={true}
        onClose={() => {}}
        onCapture={(file) => {
          console.log("Captured image for session:", sessionId, file);
        }}
      />
    </div>
  );
};

export default MobileCapturePage;
