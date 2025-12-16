import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, PackageCheck, Settings2 } from "lucide-react";
import BoxPreview from "../components/recommendation/BoxPreview";
import PaddingEditor from "../components/recommendation/PaddingEditor";
import MaterialSelector from "../components/recommendation/MaterialSelector";
import Header from "../common/Header";
import Footer from "../common/Footer";

const RecommendationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get dimensions from previous step or use defaults
  const initialDimensions = location.state?.dimensions || {
    l: 120,
    w: 85,
    h: 40,
  };

  const [padding, setPadding] = useState(3); // Default 3mm padding
  const [material, setMaterial] = useState("3ply");
  const [fragility, setFragility] = useState("medium");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-3">
              Packaging Configuration
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Customize your box specifications. We've selected the optimal
              FEFCO standard based on your product's geometry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Preview */}
            <div className="h-full">
              <BoxPreview dimensions={initialDimensions} padding={padding} />
            </div>

            {/* RIGHT COLUMN: Controls */}
            <div className="flex flex-col gap-6">
              {/* Padding Editor */}
              <PaddingEditor padding={padding} setPadding={setPadding} />

              {/* Material Selector */}
              <MaterialSelector selected={material} onSelect={setMaterial} />

              {/* Fragility & Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                      Fragility Level
                    </label>
                    <div className="relative">
                      <select
                        value={fragility}
                        onChange={(e) => setFragility(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                      >
                        <option value="low">Low (Durable Product)</option>
                        <option value="medium">Medium (Standard)</option>
                        <option value="high">High (Fragile/Glass)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <Settings2 size={16} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/template")}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all px-8 py-3.5 font-bold text-lg flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Generate Die-line
                    <ArrowRight size={20} />
                  </button>
                </div>

                {/* Mini Summary */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <PackageCheck size={16} className="text-emerald-500" />
                    <span>Ready for production</span>
                  </div>
                  <span>
                    Est. Strength:{" "}
                    <strong className="text-gray-700">ECT 32</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecommendationPage;
