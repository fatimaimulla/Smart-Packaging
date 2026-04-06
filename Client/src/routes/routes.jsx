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
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import VerifyOtpPage from "@/pages/VerifyOtpPage";
import ProjectsDashboardPage from "@/pages/ProjectsDashboardPage";
import MultiProductBundlePage from "@/pages/MultiProductBundlePage";
import BundleLayerBreakdownPage from "@/pages/BundleLayerBreakdownPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import AboutPage from "@/pages/AboutPage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import PublicOnlyRoute from "@/auth/PublicOnlyRoute";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
    ],
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
    element: <ProtectedRoute />,
    children: [
      {
        path: "/projects",
        element: <ProjectsDashboardPage />,
      },
      {
        path: "/bundle-planner",
        element: <MultiProductBundlePage />,
      },
      {
        path: "/bundle-planner/:sessionId",
        element: <MultiProductBundlePage />,
      },
      {
        path: "/bundle-planner/:sessionId/layers",
        element: <BundleLayerBreakdownPage />,
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
        element: <DielineLibraryPage></DielineLibraryPage>,
      },
      {
        path: "/report",
        element: <ReportPage></ReportPage>,
      },
      {
        path: "/template-view",
        element: <TemplateViewPage></TemplateViewPage>,
      },
      {
        path: "/drop-simulation",
        element: <DropSimulationPage></DropSimulationPage>,
      },
    ],
  },
]);

export default AppRouter;
