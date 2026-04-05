import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Boxes,
  Eye,
  EyeOff,
  Layers3,
  Loader2,
  Package2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/common/Header";
import BundlePackingViewer from "@/components/bundle/BundlePackingViewer";
import { getProjectRequest } from "@/api/projects";

const formatDimensions = (dimensions = {}) =>
  `${Number(dimensions?.l || 0).toFixed(1)} x ${Number(
    dimensions?.w || 0,
  ).toFixed(1)} x ${Number(dimensions?.h || 0).toFixed(1)} mm`;

const formatPosition = (position = {}) =>
  `(${Number(position?.x || 0).toFixed(1)}, ${Number(position?.y || 0).toFixed(
    1,
  )}, ${Number(position?.z || 0).toFixed(1)}) mm`;

const getFragilityTone = (fragility) => {
  switch (fragility) {
    case "high":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
};

const buildOrderedPlacements = (bundleResult) =>
  (bundleResult?.placements || []).map((placement, index) => ({
    ...placement,
    renderOrder: index + 1,
  }));

const BundleLayerBreakdownPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [foldProgress, setFoldProgress] = useState(0);
  const [renderStep, setRenderStep] = useState(0);
  const [selectedPlacementId, setSelectedPlacementId] = useState(null);
  const [hiddenItemIds, setHiddenItemIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadBundleProject = async () => {
      setIsLoading(true);

      try {
        const response = await getProjectRequest({ sessionId });
        const nextProject = response.data?.data;

        if (!isMounted || !nextProject) {
          return;
        }

        if (nextProject.projectType !== "bundle" || !nextProject.bundleResult) {
          toast.error("Layer breakdown is available for saved bundle projects only.");
          navigate("/bundle-planner", { replace: true });
          return;
        }

        const orderedPlacements = buildOrderedPlacements(nextProject.bundleResult);

        setProject(nextProject);
        setRenderStep(orderedPlacements.length);
        setSelectedPlacementId(orderedPlacements[0]?.itemId || null);
        setHiddenItemIds([]);
      } catch (error) {
        if (!isMounted) return;
        toast.error(error.response?.data?.message || "Unable to open layer breakdown.");
        navigate("/bundle-planner", { replace: true });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBundleProject();

    return () => {
      isMounted = false;
    };
  }, [navigate, sessionId]);

  const bundleResult = project?.bundleResult || null;

  const orderedPlacements = useMemo(
    () => buildOrderedPlacements(bundleResult),
    [bundleResult],
  );

  const visibleItemIds = useMemo(() => {
    const hiddenSet = new Set(hiddenItemIds);
    return orderedPlacements
      .filter((placement) => placement.renderOrder <= renderStep)
      .filter((placement) => !hiddenSet.has(placement.itemId))
      .map((placement) => placement.itemId);
  }, [hiddenItemIds, orderedPlacements, renderStep]);

  const placementLookup = useMemo(() => {
    const map = new Map();
    orderedPlacements.forEach((placement) => {
      map.set(placement.itemId, placement);
    });
    return map;
  }, [orderedPlacements]);

  const layersWithPlacements = useMemo(() => {
    return (bundleResult?.layers || []).map((layer) => ({
      ...layer,
      placements: orderedPlacements.filter(
        (placement) => placement.layerIndex === layer.index,
      ),
    }));
  }, [bundleResult?.layers, orderedPlacements]);

  const togglePlacementVisibility = (itemId) => {
    setHiddenItemIds((current) =>
      current.includes(itemId)
        ? current.filter((value) => value !== itemId)
        : [...current, itemId],
    );
  };

  const handleSelectPlacement = (placement) => {
    setSelectedPlacementId(placement.itemId);
    setRenderStep(Math.max(renderStep, placement.renderOrder));
    setHiddenItemIds((current) => current.filter((value) => value !== placement.itemId));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="px-4 pb-4 pt-[88px] md:px-6">
        {isLoading ? (
          <div className="flex min-h-[calc(100vh-110px)] items-center justify-center rounded-3xl bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading bundle layer breakdown...
              </p>
            </div>
          </div>
        ) : !bundleResult ? null : (
          <div className="grid min-h-[calc(100vh-110px)] gap-4 xl:grid-cols-[400px_minmax(0,1fr)]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/bundle-planner/${sessionId}`)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <ArrowLeft size={16} />
                  Back to Planner
                </button>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  FEFCO {bundleResult.selectedTemplateId}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Layer Breakdown
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-950">
                  {project?.name || "Bundle packing walkthrough"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reveal products in packing order, inspect the placement coordinates, then
                  close the FEFCO box around the arranged bundle.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Internal box
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatDimensions(bundleResult.dimensions)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Products
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {orderedPlacements.length} placements
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Packing progress</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Reveal products in the order they should be placed inside the box.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {renderStep}/{orderedPlacements.length}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={orderedPlacements.length}
                  step={1}
                  value={renderStep}
                  onChange={(event) => setRenderStep(Number(event.target.value))}
                  className="mt-4 w-full accent-blue-600"
                />

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRenderStep(0)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Hide All
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenderStep(orderedPlacements.length)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Show All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenderStep(orderedPlacements.length);
                      setHiddenItemIds([]);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Reset Visibility
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Box close control</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Keep the FEFCO open while reviewing placements, then close it to inspect the final packed state.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {Math.round(foldProgress * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(foldProgress * 100)}
                  onChange={(event) => setFoldProgress(Number(event.target.value) / 100)}
                  className="mt-4 w-full accent-emerald-600"
                />

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFoldProgress(0)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Open Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoldProgress(1)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Close Box
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFoldProgress(0);
                      setRenderStep(orderedPlacements.length);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    <RotateCcw size={14} />
                    Reset View
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Layers3 size={18} />
                Layer and placement walkthrough
              </div>

              <div className="mt-3 max-h-[calc(100vh-480px)] space-y-4 overflow-y-auto pr-1">
                {layersWithPlacements.map((layer) => (
                  <div
                    key={`layer-${layer.index}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Layer {layer.index + 1}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                          {layer.layoutType} • {formatDimensions(layer.dimensions)}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        {layer.itemCount} items
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {layer.placements.map((placement) => {
                        const isHidden = hiddenItemIds.includes(placement.itemId);
                        const isSelected = selectedPlacementId === placement.itemId;
                        const isAvailable = placement.renderOrder <= renderStep;

                        return (
                          <div
                            key={placement.itemId}
                            className={`w-full rounded-2xl border px-3 py-3 transition ${
                              isSelected
                                ? "border-blue-300 bg-blue-50"
                                : "border-transparent bg-white hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => handleSelectPlacement(placement)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">
                                    Step {placement.renderOrder}
                                  </span>
                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getFragilityTone(
                                      placement.fragility,
                                    )}`}
                                  >
                                    {placement.fragility}
                                  </span>
                                  {!isAvailable ? (
                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                                      Not shown yet
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-2 font-semibold text-slate-900">
                                  {placement.name} #{placement.quantityIndex}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Position: {formatPosition(placement.position)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Size: {formatDimensions(placement.paddedDimensions)}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => togglePlacementVisibility(placement.itemId)}
                                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300"
                                aria-label={
                                  isHidden ? "Show product in scene" : "Hide product in scene"
                                }
                              >
                                {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="flex h-full min-h-[540px] flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Package2 size={18} />
                      3D packing environment
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      The box opens flat at 0%, and the numbered product blocks follow the exact bundle placement order.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Visible: {visibleItemIds.length}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Layers: {bundleResult.layers?.length || 0}
                    </span>
                    {selectedPlacementId ? (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Selected: Step {placementLookup.get(selectedPlacementId)?.renderOrder}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex-1">
                  <BundlePackingViewer
                    fefcoCode={bundleResult.selectedTemplateId}
                    dimensions={bundleResult.dimensions}
                    placements={orderedPlacements}
                    foldProgress={foldProgress}
                    visibleItemIds={visibleItemIds}
                    selectedPlacementId={selectedPlacementId}
                  />
                </div>

                <div className="border-t border-slate-200 px-5 py-4">
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Boxes size={14} />
                      Click a step on the left to reveal and focus that product.
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Eye size={14} />
                      Use the eye button to hide or show any product without changing the packing order.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default BundleLayerBreakdownPage;
