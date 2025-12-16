import React from "react";
import { motion } from "framer-motion";
import { Upload, ScanLine, Download } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Upload,
    title: "Upload Photos",
    description:
      "Simply take a few photos of your product from different angles. No special equipment needed.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    icon: ScanLine,
    title: "AI Measures",
    description:
      "Our Smart Vision AI analyzes the geometry and calculates precise dimensions instantly.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    icon: Download,
    title: "Download Die-line",
    description:
      "Get a production-ready DXF or PDF die-line file optimized for minimal material waste.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
];

const Steps = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From physical product to digital packaging design in three simple
            steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 border border-gray-50 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-2`}
              >
                <step.icon
                  className={`w-8 h-8 ${step.color}`}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                    {step.id}
                  </span>
                  <h3 className="text-xl font-bold text-[#0D1B2A]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
