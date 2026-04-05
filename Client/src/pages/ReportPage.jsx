import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import OverviewCard from "../components/report/OverviewCard";
import CostCard from "../components/report/CostCard";
import ImpactCard from "../components/report/ImpactCard";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getReport } from "@/api/getReport";
import { getProjectRequest, updateProjectConfigRequest } from "@/api/projects";
import { toast } from "sonner";

const ReportPage = () => {
  const location = useLocation();
  const [reportData, setReportData] = useState(
    location.state?.reportData || null,
  );
  const [isLoading, setIsLoading] = useState(!location.state?.reportData);
  const [errorMessage, setErrorMessage] = useState("");

  const sessionId = location.state?.sessionId;
  const routeDimensions = location.state?.dimensions;
  const routeAiData = location.state?.aiData;

  useEffect(() => {
    if (location.state?.reportData) {
      setReportData(location.state.reportData);
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    let isMounted = true;

    const fetchReport = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        let dimensions = routeDimensions;
        let aiData = routeAiData;

        if (sessionId) {
          const projectResponse = await getProjectRequest({ sessionId });
          const project = projectResponse.data?.data;

          if (project) {
            dimensions = project.dimensions || dimensions;
            aiData = {
              ...(project.recommendation || {}),
              ...(aiData || {}),
              productWeightGrams:
                aiData?.productWeightGrams || project.productWeightGrams,
              fragility:
                aiData?.fragility ||
                project.fragility ||
                project.recommendation?.fragilityLevel,
              selectedTemplateId:
                aiData?.selectedTemplateId || project.selectedTemplateId,
              fefcoCode: aiData?.fefcoCode || project.selectedTemplateId,
            };

            const hasWeight =
              aiData?.productWeightGrams ??
              aiData?.estimatedWeight ??
              aiData?.productWeight ??
              null;

            if (!hasWeight && project.report) {
              setReportData(project.report);
              return;
            }
          }
        }

        const hasDimensions =
          dimensions &&
          (dimensions.l ?? dimensions.length) &&
          (dimensions.w ?? dimensions.width) &&
          (dimensions.h ?? dimensions.height);

        if (!hasDimensions || !aiData) {
          throw new Error("Missing project data required to generate report.");
        }

        const response = await getReport({ dimensions, aiData });
        const generatedReport = response.data?.data;

        if (!generatedReport) {
          throw new Error("Report data was not returned by the server.");
        }

        if (sessionId) {
          updateProjectConfigRequest({
            sessionId,
            report: generatedReport,
            status: "completed",
          }).catch((saveError) => {
            console.error("Failed to save generated report:", saveError);
          });
        }

        if (isMounted) {
          setReportData(generatedReport);
        }
      } catch (error) {
        console.error("Failed to load report:", error);
        if (isMounted) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Unable to load the report right now.";
          setErrorMessage(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [location.state, routeAiData, routeDimensions, sessionId]);

  // Mock Data (In a real app, this would come from previous steps or API)
  // We try to read from location state, otherwise default
  const data = useMemo(
    () => ({
      fefco: reportData?.fefcoCode,
      material: reportData?.ply ? `${reportData.ply}-Ply Corrugated` : "",
      thickness: reportData?.plythickness,
      dimensions: {
        l: reportData?.length,
        w: reportData?.width,
        h: reportData?.height,
      },
      internalDimensions: {
        l: Number(reportData?.length || 0) + 6,
        w: Number(reportData?.width || 0) + 6,
        h: Number(reportData?.height || 0) + 6,
      },
      area: reportData?.finalArea,
      cost: reportData?.estimatedCostPerBox,
      waste: reportData?.wasteRatio,
      co2: (Number(reportData?.environment?.carbonFootprint) * 1000).toFixed(0),
      standardCo2: (
        Number(reportData?.environment?.standardFootprint) * 1000
      ).toFixed(0),
      recyclability: reportData?.environment?.recyclabilityScore,
      optimalFit: reportData?.optimalFit,
      costBreakdown: reportData?.costBreakdown,
    }),
    [reportData],
  );

  // const data = { ...defaults, ...location.state };
  // const savings = Math.round(
  //   ((data.standardCo2 - data.co2) / data.standardCo2) * 100,
  // );

  const savings = reportData?.environment?.reduction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">
              Project Summary & Impact Report
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
              <Info size={14} />
              Estimated values  may vary based on location, material rates, and
              market conditions
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A detailed breakdown of your packaging specifications, estimated
              costs, and environmental savings.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-white/70 bg-white/80 px-6 py-20 shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-600">
                Generating your latest report...
              </p>
            </div>
          ) : null}

          {!isLoading && errorMessage ? (
            <div className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Unable to load report</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          ) : null}

          {/* Main Grid */}
          {!isLoading && reportData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16">
            {/* Column 1: Overview */}
            <OverviewCard data={data} />

            {/* Column 2: Cost Analysis */}
            <CostCard data={data} />

            {/* Column 3: Environmental Impact */}
            <ImpactCard data={{ ...data, savings }} />
            </div>
          ) : null}

          {/* Final Actions */}
          {/* <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            <button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-4 font-bold text-lg flex items-center justify-center gap-2">
              <Download size={20} />
              Download Full Report
            </button>

            <button className="w-full md:w-auto border border-gray-400 rounded-full px-8 py-4 text-gray-700 hover:bg-white hover:border-gray-500 transition-all font-semibold flex items-center justify-center gap-2">
              <FileArchive size={20} />
              Download Assets (ZIP)
            </button>

            <button className="w-full md:w-auto border border-blue-200 bg-blue-50/50 rounded-full px-8 py-4 text-blue-700 hover:bg-blue-100 transition-all font-semibold flex items-center justify-center gap-2">
              <Share2 size={20} />
              Share Project
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full md:w-auto text-gray-500 hover:text-gray-800 font-medium px-6 py-4 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Start New Project
            </button>
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;
