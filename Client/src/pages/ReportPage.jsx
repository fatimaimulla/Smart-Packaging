import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Download, Share2, Plus, FileArchive } from "lucide-react";
import OverviewCard from "../components/report/OverviewCard";
import CostCard from "../components/report/CostCard";
import ImpactCard from "../components/report/ImpactCard";
import Header from "../common/Header";
import Footer from "../common/Footer";

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock Data (In a real app, this would come from previous steps or API)
  // We try to read from location state, otherwise default
  const defaults = {
    fefco: "FEFCO 0201",
    material: "3-Ply Corrugated",
    thickness: 3,
    dimensions: { l: 120, w: 85, h: 40 },
    internalDimensions: { l: 126, w: 91, h: 46 }, // +6mm padding logic
    area: 0.42,
    cost: 0.38,
    waste: 12,
    co2: 16,
    standardCo2: 39,
    recyclability: 9.5,
  };

  const data = { ...defaults, ...location.state };
  const savings = Math.round(
    ((data.standardCo2 - data.co2) / data.standardCo2) * 100
  );

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
            <p className="text-gray-600 max-w-2xl mx-auto">
              A detailed breakdown of your packaging specifications, estimated
              costs, and environmental savings.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16">
            {/* Column 1: Overview */}
            <OverviewCard data={data} />

            {/* Column 2: Cost Analysis */}
            <CostCard data={data} />

            {/* Column 3: Environmental Impact */}
            <ImpactCard data={{ ...data, savings }} />
          </div>

          {/* Final Actions */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;
