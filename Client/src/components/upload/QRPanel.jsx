import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, ExternalLink, Link2Off } from "lucide-react";
import { useMemo } from "react";

const QRPanel = ({
  onSimulateMobile,
  sessionId,
  mobileConnected = false,
  onEndMobileSession,
}) => {
  const demoLink = useMemo(() => {
    if (!sessionId) return "";

    const origin = window.location.origin;
    return `${origin}/mobile-capture/${sessionId}`;
  }, [sessionId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-fit sticky top-24 border border-gray-100">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          mobileConnected
            ? "bg-emerald-50 text-emerald-600"
            : "bg-blue-50 text-blue-500"
        }`}
      >
        <Smartphone size={24} />
      </div>

      <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">
        {mobileConnected ? "Device connected" : "Use your phone"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        {mobileConnected
          ? "Complete the mobile capture flow to continue. Laptop upload is locked while this phone session is active."
          : "Scan to open mobile capture. We enforce alignment, tilt correction, and reference detection automatically."}
      </p>

      {mobileConnected ? (
        <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 mb-6 text-left">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Mobile session is active
          </div>
          <p className="text-sm text-emerald-800/80">
            The connected device can capture and upload images for this project.
            You can end the session from desktop if needed.
          </p>
        </div>
      ) : (
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 min-h-[184px] flex items-center justify-center">
          {sessionId ? (
            <QRCodeSVG value={demoLink} size={160} level="H" />
          ) : (
            <p className="text-sm font-medium text-gray-400">
              Preparing secure mobile link...
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        {mobileConnected ? (
          <button
            type="button"
            onClick={onEndMobileSession}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Link2Off size={16} />
            End Mobile Session
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={!sessionId}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => navigator.clipboard.writeText(demoLink)}
            >
              <Copy size={14} />
              Copy Link
            </button>

            <button
              type="button"
              onClick={onSimulateMobile}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-medium rounded-lg transition-colors"
            >
              <ExternalLink size={14} />
              Demo Mobile View
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRPanel;
