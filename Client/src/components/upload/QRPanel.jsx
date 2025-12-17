import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const QRPanel = ({ onSimulateMobile }) => {
const sessionId = "session-123";
const demoLink = `https://smart-packaging.vercel.app/upload/mobile-capture/${sessionId}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-fit sticky top-24 border border-gray-100">
      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
        <Smartphone size={24} />
      </div>

      <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">Use your phone</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Scan to open mobile capture. We enforce alignment, tilt correction, and
        reference detection automatically.
      </p>

      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6">
        <QRCodeSVG value={demoLink} size={160} level="H" />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
          onClick={() => navigator.clipboard.writeText(demoLink)}
        >
          <Copy size={14} />
          Copy Link
        </button>

        <button
          onClick={onSimulateMobile}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-medium rounded-lg transition-colors"
        >
          <ExternalLink size={14} />
          Demo Mobile View
        </button>
      </div>
    </div>
  );
};

export default QRPanel;
