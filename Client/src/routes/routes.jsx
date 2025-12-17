import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import UploadPage from "../pages/UploadPage";
import ReviewPage from "../pages/ReviewPage";
import RecommendationPage from "../pages/RecommendationPage";
import DieLineGeneratorPage from "../pages/DieLineGeneratorPage";
import ReportPage from "../pages/ReportPage";
import MobileCapturePage from "../pages/MobileCapturePage";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/upload",
    element: <UploadPage></UploadPage>,
  },
  {
    path: "/review",
    element: <ReviewPage></ReviewPage>,
  },
  {
    path: "/recommendation",
    element: <RecommendationPage></RecommendationPage>,
  },
  {
    path: "/dieline",
    element: <DieLineGeneratorPage></DieLineGeneratorPage>,
  },
  {
    path: "/report",
    element: <ReportPage></ReportPage>,
  },
  {
    path: "/upload/mobile-capture/:sessionId",
    element: <MobileCapturePage></MobileCapturePage>,
  },
]);

export default AppRouter;