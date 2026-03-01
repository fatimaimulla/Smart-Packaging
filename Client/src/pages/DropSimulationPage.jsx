import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Play, RotateCcw } from "lucide-react";

import Header from "@/common/Header";
import Footer from "@/common/Footer";
import DropSimulationViewer from "@/components/simulation/DropSimulationViewer";
import { TEMPLATE_CONFIG } from "@/constants/template";
import {
  DEFAULT_DROP_SIMULATION,
  DROP_FEFCO_OPTIONS,
  DROP_FRAGILITY_OPTIONS,
  DROP_ORIENTATION_OPTIONS,
  DROP_PADDING_OPTIONS,
  estimateDropOutcome,
  normalizeFragility,
  parseWeightToGrams,
} from "@/utils/dropSimulation";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseFefcoCode = (value) => {
  const match = String(value || "").match(/(0201|0203|0301|0401|0427)/);
  return match ? match[1] : DEFAULT_DROP_SIMULATION.fefcoCode;
};

const safeDimension = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, 40, 1200);
};

const getInitialState = (state) => {
  const incomingCode = parseFefcoCode(
    state?.fefcoCode || state?.templateId || state?.recommendedFefcoBox,
  );
  const templateDefaults = TEMPLATE_CONFIG[incomingCode]?.defaultDimensions;

  const incomingDims = state?.dimensions || {};
  const fallbackDims = templateDefaults || DEFAULT_DROP_SIMULATION.dimensions;
  const dimensions = {
    l: safeDimension(incomingDims.l ?? incomingDims.length, fallbackDims.l),
    w: safeDimension(incomingDims.w ?? incomingDims.width, fallbackDims.w),
    h: safeDimension(incomingDims.h ?? incomingDims.height, fallbackDims.h),
  };

  const weightGrams = parseWeightToGrams(
    state?.weightGrams ?? state?.estimatedWeight,
    DEFAULT_DROP_SIMULATION.weightGrams,
  );

  return {
    fefcoCode: incomingCode,
    dimensions,
    weightGrams,
    fragility: normalizeFragility(state?.fragility ?? state?.fragilityLevel),
    dropHeightCm: clamp(Number(state?.dropHeightCm) || DEFAULT_DROP_SIMULATION.dropHeightCm, 20, 300),
    orientation: state?.orientation || DEFAULT_DROP_SIMULATION.orientation,
    padding: state?.padding || DEFAULT_DROP_SIMULATION.padding,
    thickness: clamp(Number(state?.thickness) || DEFAULT_DROP_SIMULATION.thickness, 0.5, 6),
    material: state?.material || DEFAULT_DROP_SIMULATION.material,
  };
};

const DropSimulationPage = () => {
  const { state } = useLocation();
  const initial = useMemo(() => getInitialState(state), [state]);

  const [fefcoCode, setFefcoCode] = useState(initial.fefcoCode);
  const [dimensions, setDimensions] = useState(initial.dimensions);
  const [weightGrams, setWeightGrams] = useState(initial.weightGrams);
  const [fragility, setFragility] = useState(initial.fragility);
  const [dropHeightCm, setDropHeightCm] = useState(initial.dropHeightCm);
  const [orientation, setOrientation] = useState(initial.orientation);
  const [padding, setPadding] = useState(initial.padding);
  const [thickness, setThickness] = useState(initial.thickness);
  const [material, setMaterial] = useState(initial.material);
  const [playSignal, setPlaySignal] = useState(0);

  const handleSelectFefco = (code) => {
    const defaults = TEMPLATE_CONFIG[code]?.defaultDimensions || DEFAULT_DROP_SIMULATION.dimensions;
    setFefcoCode(code);
    setDimensions({ ...defaults });
  };

  const outcome = useMemo(
    () =>
      estimateDropOutcome({
        weightGrams,
        dropHeightCm,
        fragility,
        padding,
        orientation,
        thickness,
        material,
      }),
    [weightGrams, dropHeightCm, fragility, padding, orientation, thickness, material],
  );

  const runSimulation = () => setPlaySignal((v) => v + 1);

  const resetToTemplateDefaults = () => {
    const defaults = TEMPLATE_CONFIG[fefcoCode]?.defaultDimensions || DEFAULT_DROP_SIMULATION.dimensions;
    setDimensions(defaults);
    setWeightGrams(DEFAULT_DROP_SIMULATION.weightGrams);
    setFragility(DEFAULT_DROP_SIMULATION.fragility);
    setDropHeightCm(DEFAULT_DROP_SIMULATION.dropHeightCm);
    setOrientation(DEFAULT_DROP_SIMULATION.orientation);
    setPadding(DEFAULT_DROP_SIMULATION.padding);
    setThickness(DEFAULT_DROP_SIMULATION.thickness);
    setMaterial(DEFAULT_DROP_SIMULATION.material);
    setPlaySignal(0);
  };

  const riskColorClass =
    outcome.riskScore > 75
      ? "bg-red-500"
      : outcome.riskScore > 45
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-10 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">Drop Simulation</h1>
              <p className="text-xs text-slate-500">
                Educational simulator for comparing scenarios. Not an engineering validation tool.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-700 mb-2">Step-by-step workflow</p>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Select FEFCO box and dimensions.</li>
                <li>Enter product weight and fragility.</li>
                <li>Choose drop mode: flat, side, or edge.</li>
                <li>Toggle padding and run the test.</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">FEFCO Model</label>
              <div className="grid grid-cols-2 gap-2">
                {DROP_FEFCO_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectFefco(option.id)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                      fefcoCode === option.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Dimensions (mm)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={40}
                  max={1200}
                  value={dimensions.l}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      l: safeDimension(e.target.value, prev.l),
                    }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm"
                  placeholder="L"
                />
                <input
                  type="number"
                  min={40}
                  max={1200}
                  value={dimensions.w}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      w: safeDimension(e.target.value, prev.w),
                    }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm"
                  placeholder="W"
                />
                <input
                  type="number"
                  min={40}
                  max={1200}
                  value={dimensions.h}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      h: safeDimension(e.target.value, prev.h),
                    }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm"
                  placeholder="H"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Product Weight (g)</label>
                <input
                  type="number"
                  min={10}
                  max={50000}
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(clamp(Number(e.target.value) || 10, 10, 50000))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Fragility</label>
                <select
                  value={fragility}
                  onChange={(e) => setFragility(normalizeFragility(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {DROP_FRAGILITY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-800">Drop Height</label>
                <span className="text-xs font-semibold text-slate-600">{dropHeightCm} cm</span>
              </div>
              <input
                type="range"
                min={20}
                max={300}
                step={5}
                value={dropHeightCm}
                onChange={(e) => setDropHeightCm(clamp(Number(e.target.value), 20, 300))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Drop Orientation</label>
              <div className="grid grid-cols-3 gap-2">
                {DROP_ORIENTATION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setOrientation(option.id)}
                    className={`px-2 py-2 rounded-lg border text-xs font-semibold transition ${
                      orientation === option.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Padding</label>
              <div className="grid grid-cols-2 gap-2">
                {DROP_PADDING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPadding(option.id)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                      padding === option.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Thickness (mm)</label>
                <input
                  type="number"
                  min={0.5}
                  max={6}
                  step={0.1}
                  value={thickness}
                  onChange={(e) => setThickness(clamp(Number(e.target.value) || 0.5, 0.5, 6))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Material</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option>White card board</option>
                  <option>Kraft paper</option>
                  <option>Corrugated Board</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={runSimulation}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
              >
                <Play size={16} />
                Run Drop Test
              </button>
              <button
                type="button"
                onClick={resetToTemplateDefaults}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-sm"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </section>

          <section className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:p-5">
            <div className="h-[440px] rounded-xl overflow-hidden border border-slate-300">
              <DropSimulationViewer
                fefcoCode={fefcoCode}
                dimensions={dimensions}
                weightGrams={weightGrams}
                dropHeightCm={dropHeightCm}
                orientation={orientation}
                padding={padding}
                playSignal={playSignal}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Impact Velocity</p>
                <p className="text-lg font-bold text-slate-900">{outcome.impactVelocity.toFixed(2)} m/s</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Impact Energy</p>
                <p className="text-lg font-bold text-slate-900">{outcome.impactEnergy.toFixed(2)} J</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Peak Acceleration</p>
                <p className="text-lg font-bold text-slate-900">{outcome.peakG.toFixed(1)} g</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Impact Force</p>
                <p className="text-lg font-bold text-slate-900">{outcome.impactForceN.toFixed(0)} N</p>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-800">Estimated Risk</p>
                <p className="text-sm font-bold text-slate-900">
                  {outcome.riskBand} ({outcome.riskScore}%)
                </p>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full ${riskColorClass}`} style={{ width: `${outcome.riskScore}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Scenario survivability estimate: <span className="font-semibold">{outcome.survivability}%</span>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DropSimulationPage;
