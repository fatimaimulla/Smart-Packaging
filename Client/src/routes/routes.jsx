import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import UploadPage from "../pages/UploadPage";
import ReviewPage from "../pages/ReviewPage";
import RecommendationPage from "../pages/RecommendationPage";
import DieLineGeneratorPage from "../pages/DieLineGeneratorPage";
import ReportPage from "../pages/ReportPage";
import MobileCapturePage from "../pages/MobileCapturePage";
import MobileReviewPage from "@/pages/MobileReviewPage";
import DielineLibraryPage from "@/pages/DielineLibraryPage";
import TemplateViewPage from "@/pages/TemplateViewPage";
import DropSimulationPage from "@/pages/DropSimulationPage";

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
    path: "/review/:sessionId",
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
    path: "/dieline-library",
    element:<DielineLibraryPage></DielineLibraryPage>

  },
  {
    path: "/report",
    element: <ReportPage></ReportPage>,
  },
  {
    path: "/mobile-capture/:sessionId",
    element: <MobileCapturePage></MobileCapturePage>,
  },
  {
    path: "/mobile-review/:sessionId",
    element: <MobileReviewPage></MobileReviewPage>,
  },
  {
    path: "/template-view",
    element: <TemplateViewPage></TemplateViewPage>,
  },
  {
    path: "/drop-simulation",
    element: <DropSimulationPage></DropSimulationPage>,
  },
]);

export default AppRouter;
