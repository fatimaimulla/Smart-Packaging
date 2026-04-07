import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Loader2,
  PackagePlus,
  Package2,
  Search,
  ShieldAlert,
  Sparkles,
  Scale,
  FileText,
  Activity,
  PencilLine,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/common/Header";
import Footer from "@/common/Footer";
import {
  getProjectRequest,
  getProjectsRequest,
  optimizeBundleRequest,
} from "@/api/projects";

const FRAGILITY_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
};

const formatDimensions = (dimensions = {}) =>
  `${Number(dimensions?.l || 0).toFixed(1)} x ${Number(
    dimensions?.w || 0,
  ).toFixed(1)} x ${Number(dimensions?.h || 0).toFixed(1)} mm`;

const formatWeight = (weightGrams) =>
  weightGrams ? `${Math.round(Number(weightGrams))} g` : "Not available";

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

const getEligibilityReason = (project) => {
  if (!project) return "Project unavailable.";
  if (project.projectType === "bundle") return "Bundle projects cannot be imported.";
  if (!project.dimensions?.l || !project.dimensions?.w || !project.dimensions?.h) {
    return "Dimensions are missing.";
  }
  if (!project.fragility) return "Fragility is missing.";
  if (!project.productWeightGrams) return "Weight is missing.";
  return "";
};

const isDashboardVisibleSingleProject = (project) =>
  Boolean(
    project &&
      project.projectType !== "bundle" &&
      project.image1 &&
      project.image2 &&
      project.dimensions?.l &&
      project.dimensions?.w &&
      project.dimensions?.h,
  );

const buildSelectionState = (sourceItems = []) =>
  sourceItems.reduce((accumulator, item) => {
    accumulator[item.sessionId] = {
      selected: true,
      quantity: Math.max(1, Number(item.quantity) || 1),
    };
    return accumulator;
  }, {});

const SourceCard = ({
  project,
  selected,
  quantity,
  disabled,
  reason,
  onToggle,
  onAdjustQuantity,
}) => (
  <article
    className={`rounded-[24px] border p-4 transition ${
      disabled
        ? "border-slate-200 bg-slate-50/80 opacity-70"
        : selected
          ? "border-blue-300 bg-white shadow-md"
          : "border-white/80 bg-white/80"
    }`}
  >
    <div className="flex gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`mt-1 h-5 w-5 rounded border transition ${
          selected
            ? "border-blue-600 bg-blue-600"
            : "border-slate-300 bg-white"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={`Select ${project.name}`}
      >
        {selected ? <div className="m-auto mt-1 h-2 w-2 rounded-full bg-white" /> : null}
      </button>

      <div className="flex-1">
        <div className="flex items-start gap-3">
          <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
            {project.image1 ? (
              <img
                src={project.image1}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Boxes size={24} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-slate-900">
                {project.name}
              </h3>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getFragilityTone(
                  project.fragility,
                )}`}
              >
                {project.fragility || "Unknown"}
              </span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-600">
              {formatDimensions(project.dimensions)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Weight: {formatWeight(project.productWeightGrams)}
            </p>
          </div>
        </div>

        {selected ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quantity
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAdjustQuantity(-1)}
                className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:border-slate-300"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onAdjustQuantity(1)}
                className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:border-slate-300"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ) : null}

        {disabled && reason ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            {reason}
          </div>
        ) : null}
      </div>
    </div>
  </article>
);

const SelectedBundleProductCard = ({ item }) => (
  <article className="rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
        {item.project?.image1 ? (
          <img
            src={item.project.image1}
            alt={item.project?.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Boxes size={24} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-bold text-slate-900">
            {item.project?.name}
          </h3>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getFragilityTone(
              item.project?.fragility,
            )}`}
          >
            {item.project?.fragility || "Unknown"}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-slate-600">
          {formatDimensions(item.project?.dimensions)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Quantity x{item.quantity}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {formatWeight(Number(item.project?.productWeightGrams || 0) * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  </article>
);

const MultiProductBundlePage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingBundle, setIsLoadingBundle] = useState(Boolean(sessionId));
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [bundleName, setBundleName] = useState("");
  const [selectionState, setSelectionState] = useState({});
  const [isEditingProducts, setIsEditingProducts] = useState(!sessionId);
  const [activeBundleProject, setActiveBundleProject] = useState(null);
  const [bundleResult, setBundleResult] = useState(null);
  const bundleRecommendation = activeBundleProject?.recommendation || null;

  const loadProjects = async () => {
    try {
      const response = await getProjectsRequest();
      setProjects(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load projects.");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setActiveBundleProject(null);
      setBundleResult(null);
      setBundleName("");
      setSelectionState({});
      setIsEditingProducts(true);
      setIsLoadingBundle(false);
      return;
    }

    let isMounted = true;

    const loadBundleProject = async () => {
      setIsLoadingBundle(true);

      try {
        const response = await getProjectRequest({ sessionId });
        const project = response.data?.data;

        if (!isMounted || !project) {
          return;
        }

        if (project.projectType !== "bundle") {
          toast.error("Only bundle projects can be opened in this planner.");
          navigate("/bundle-planner", { replace: true });
          return;
        }

        setActiveBundleProject(project);
        setBundleResult(project.bundleResult || null);
        setBundleName(project.name || "");
        setSelectionState(buildSelectionState(project.sourceItems || []));
        setIsEditingProducts(false);
      } catch (error) {
        if (!isMounted) return;
        toast.error(error.response?.data?.message || "Unable to open the saved bundle.");
      } finally {
        if (isMounted) {
          setIsLoadingBundle(false);
        }
      }
    };

    loadBundleProject();

    return () => {
      isMounted = false;
    };
  }, [navigate, sessionId]);

  const sourceLookup = useMemo(() => {
    const map = new Map();

    projects.forEach((project) => {
      map.set(project.sessionId, project);
    });

    (activeBundleProject?.sourceItems || []).forEach((item) => {
      if (!map.has(item.sessionId)) {
        map.set(item.sessionId, {
          ...item,
          sessionId: item.sessionId,
          projectType: "single",
          image1: item.image1 || null,
          productWeightGrams: item.productWeightGrams,
        });
      }
    });

    return map;
  }, [activeBundleProject?.sourceItems, projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return projects
      .filter((project) => isDashboardVisibleSingleProject(project))
      .filter((project) => {
        if (!normalizedQuery) return true;
        return (
          project.name?.toLowerCase().includes(normalizedQuery) ||
          project.selectedTemplateId?.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((left, right) => {
        const leftDisabled = Boolean(getEligibilityReason(left));
        const rightDisabled = Boolean(getEligibilityReason(right));
        if (leftDisabled !== rightDisabled) {
          return leftDisabled ? 1 : -1;
        }
        return new Date(right.updatedAt) - new Date(left.updatedAt);
      });
  }, [projects, searchValue]);

  const selectedItems = useMemo(
    () =>
      Object.entries(selectionState)
        .filter(([, value]) => value?.selected && value.quantity > 0)
        .map(([selectedSessionId, value]) => ({
          sessionId: selectedSessionId,
          quantity: value.quantity,
          project: sourceLookup.get(selectedSessionId),
        }))
        .filter((item) => item.project),
    [selectionState, sourceLookup],
  );

  const savedSelectionState = useMemo(
    () => buildSelectionState(activeBundleProject?.sourceItems || []),
    [activeBundleProject?.sourceItems],
  );

  const selectedUnitCount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );

  const totalWeightGrams = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + Number(item.project?.productWeightGrams || 0) * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const highestFragility = useMemo(
    () =>
      selectedItems.reduce((current, item) => {
        const nextFragility = item.project?.fragility || "low";
        return FRAGILITY_ORDER[nextFragility] > FRAGILITY_ORDER[current]
          ? nextFragility
          : current;
      }, "low"),
    [selectedItems],
  );

  const toggleSelection = (selectedSessionId) => {
    const project = sourceLookup.get(selectedSessionId);
    if (getEligibilityReason(project)) {
      return;
    }

    setSelectionState((current) => {
      const previous = current[selectedSessionId];
      const nextSelected = !previous?.selected;
      return {
        ...current,
        [selectedSessionId]: {
          selected: nextSelected,
          quantity: previous?.quantity || 1,
        },
      };
    });
  };

  const adjustQuantity = (selectedSessionId, delta) => {
    setSelectionState((current) => {
      const previous = current[selectedSessionId] || { selected: true, quantity: 1 };
      const selectedWithoutCurrent = Object.entries(current).reduce((sum, [key, value]) => {
        if (key === selectedSessionId || !value?.selected) return sum;
        return sum + value.quantity;
      }, 0);
      const maxAllowed = Math.max(1, 20 - selectedWithoutCurrent);
      const nextQuantity = Math.min(
        maxAllowed,
        Math.max(1, previous.quantity + delta),
      );

      return {
        ...current,
        [selectedSessionId]: {
          selected: true,
          quantity: nextQuantity,
        },
      };
    });
  };

  const handleOptimizeBundle = async () => {
    if (selectedItems.length === 0) {
      toast.error("Select at least one configured product first.");
      return;
    }

    if (selectedUnitCount > 20) {
      toast.error("You can optimize up to 20 total units in one bundle.");
      return;
    }

    setIsOptimizing(true);

    try {
      const response = await optimizeBundleRequest({
        name: bundleName.trim(),
        sourceItems: selectedItems.map((item) => ({
          sessionId: item.sessionId,
          quantity: item.quantity,
        })),
        optimizerMode: "hybrid-v1",
        bundleSessionId: activeBundleProject?.sessionId,
      });

      const resultProject = response.data?.data?.project || null;
      const resultBundle = response.data?.data?.bundleResult || null;

      setActiveBundleProject(resultProject);
      setBundleResult(resultBundle);
      setIsEditingProducts(false);

      if (resultProject?.name) {
        setBundleName(resultProject.name);
      }

      if (resultProject?.sessionId) {
        navigate(`/bundle-planner/${resultProject.sessionId}`, { replace: true });
      }

      toast.success("Combined FEFCO bundle saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to optimize this bundle.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const openBundleEditor = () => {
    if (!bundleResult || !activeBundleProject?.sessionId) return;

    navigate("/dieline", {
      state: {
        dimensions: bundleResult.dimensions,
        templateId: bundleResult.selectedTemplateId,
        sessionId: activeBundleProject.sessionId,
        projectType: "bundle",
      },
    });
  };

  const openBundleDropSim = () => {
    if (!bundleResult || !activeBundleProject?.sessionId) return;

    navigate("/drop-simulation", {
      state: {
        source: "bundle-planner",
        lockSimulationInputs: true,
        projectType: "bundle",
        fefcoCode: bundleResult.selectedTemplateId,
        dimensions: bundleResult.dimensions,
        weightGrams: bundleResult.totalWeightGrams,
        fragilityLevel: bundleResult.overallFragility,
      },
    });
  };

  const openBundleReport = () => {
    if (!bundleResult || !activeBundleProject?.sessionId) return;

    navigate("/report", {
      state: {
        sessionId: activeBundleProject.sessionId,
        dimensions: bundleResult.dimensions,
        aiData: {
          estimatedWeight: bundleResult.totalWeightGrams,
          fragilityLevel: bundleResult.overallFragility,
          recommendedFefcoBox: bundleResult.fefcoCode,
          selectedTemplateId: bundleResult.selectedTemplateId,
          productWeightGrams: bundleResult.totalWeightGrams,
        },
      },
    });
  };

  const openBundleLayers = () => {
    if (!bundleResult || !activeBundleProject?.sessionId) return;
    navigate(`/bundle-planner/${activeBundleProject.sessionId}/layers`);
  };

  const startEditingProducts = () => {
    setIsEditingProducts(true);
  };

  const cancelEditingProducts = () => {
    setSelectionState(savedSelectionState);
    setSearchValue("");
    setIsEditingProducts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF]">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm">
                <PackagePlus size={14} />
                Multi-Product FEFCO Planner
              </div>
              <h1 className="mt-4 text-4xl font-bold text-[#0D1B2A]">
                Build a shared shipping box from configured products
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Import measured dashboard products, assign quantities, and let the
                optimizer search for a safe combined layout with the smallest valid
                FEFCO box.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowRight size={16} />
              Back to Dashboard
            </button>
          </div>

          {isLoadingBundle ? (
            <div className="rounded-[28px] border border-white/70 bg-white/90 px-6 py-16 text-center shadow-lg">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading your saved bundle...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
              <section className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-lg">
                {sessionId && !isEditingProducts ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Selected Products
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Review the saved bundle contents before refining the box.
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedItems.length} items
                      </span>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Package2 size={18} />
                            Refine saved bundle
                          </div>
                          
                        </div>
                        <button
                          type="button"
                          onClick={startEditingProducts}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-slate-50"
                        >
                          Add More Products
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4 max-h-[860px] overflow-y-auto pr-1">
                      {selectedItems.length === 0 ? (
                        <div className="rounded-3xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                          No products are currently attached to this saved bundle.
                        </div>
                      ) : (
                        selectedItems.map((item) => (
                          <SelectedBundleProductCard
                            key={item.sessionId}
                            item={item}
                          />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {sessionId ? "Edit Bundle Products" : "Import Products"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Configured single-product projects only.
                        </p>
                        {sessionId ? (
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            Update the selection here, then run the optimizer again to save the refined bundle.
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {filteredProjects.length} items
                        </span>
                        {sessionId ? (
                          <button
                            type="button"
                            onClick={cancelEditingProducts}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="relative mt-5">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                      />
                    </div>

                    <div className="mt-5 space-y-4 max-h-[860px] overflow-y-auto pr-1">
                      {isLoadingProjects ? (
                        <div className="rounded-3xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                          Loading configured projects...
                        </div>
                      ) : filteredProjects.length === 0 ? (
                        <div className="rounded-3xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                          No configured products matched your search.
                        </div>
                      ) : (
                        filteredProjects.map((project) => {
                          const reason = getEligibilityReason(project);
                          const selection = selectionState[project.sessionId] || {
                            selected: false,
                            quantity: 1,
                          };

                          return (
                            <SourceCard
                              key={project.sessionId}
                              project={project}
                              selected={selection.selected}
                              quantity={selection.quantity}
                              disabled={Boolean(reason)}
                              reason={reason}
                              onToggle={() => toggleSelection(project.sessionId)}
                              onAdjustQuantity={(delta) =>
                                adjustQuantity(project.sessionId, delta)
                              }
                            />
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </section>

              <section className="rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-lg">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.7fr)]">
                  <div className="space-y-6">
                    <div className="rounded-[26px] bg-[#0D1B2A] p-6 text-white">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                            Bundle Setup
                          </p>
                          <h2 className="mt-2 text-2xl font-bold">
                            {activeBundleProject?.sessionId
                              ? "Refine saved bundle"
                              : "Create a new shared box"}
                          </h2>
                        </div>

                        <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/80">
                          {selectedUnitCount <= 6
                            ? "Exact optimizer"
                            : "Hybrid heuristic"}
                        </span>
                      </div>

                      <div className="mt-6">
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                          Bundle name
                        </label>
                        <input
                          type="text"
                          value={bundleName}
                          onChange={(event) => setBundleName(event.target.value)}
                          placeholder="Example: Bottle + Refill Combo"
                          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/45 focus:border-white/25"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleOptimizeBundle}
                        disabled={isOptimizing || selectedItems.length === 0}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-[#0D1B2A] transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isOptimizing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Finding best combined FEFCO...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Find Best Combined FEFCO
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[24px] bg-[#F4F7FF] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Selected SKUs
                        </p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                          {selectedItems.length}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-[#F4F7FF] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Total Units
                        </p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                          {selectedUnitCount}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-[#F4F7FF] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Total Weight
                        </p>
                        <p className="mt-3 text-2xl font-bold text-slate-900">
                          {formatWeight(totalWeightGrams)}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-[#F4F7FF] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Highest Fragility
                        </p>
                        <p className="mt-3 text-2xl font-bold capitalize text-slate-900">
                          {highestFragility}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-slate-100 bg-slate-50/80 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Boxes size={18} />
                        Imported products
                      </div>

                      {selectedItems.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                          Select one or more configured products from the left to start building the bundle.
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {selectedItems.map((item) => (
                            <div
                              key={item.sessionId}
                              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                            >
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {item.project?.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDimensions(item.project?.dimensions)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">
                                  x{item.quantity}
                                </p>
                                <p className="mt-1 text-xs capitalize text-slate-500">
                                  {item.project?.fragility}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                        Up to 20 total units per optimization. Products missing dimensions, fragility, or weight stay visible but cannot be imported until their configuration is complete.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Optimization Result
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            AI-guided recommendation using bundle contents, dimensions, weight, and fragility.
                          </p>
                        </div>
                        {bundleResult ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Saved
                          </span>
                        ) : null}
                      </div>

                      {!bundleResult ? (
                        <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                          <ShieldAlert className="mx-auto h-8 w-8 text-slate-300" />
                          <p className="mt-4 text-sm font-medium text-slate-600">
                            The optimizer result will appear here once you run the combined FEFCO search.
                          </p>
                        </div>
                      ) : (
                        <>
                          {bundleRecommendation ? (
                            <div className="mt-5 rounded-[24px] border border-violet-100 bg-violet-50/70 p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-violet-900">
                                <Sparkles size={16} />
                                AI Bundle Recommendation
                              </div>
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white px-4 py-3">
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Bundle
                                  </p>
                                  <p className="mt-2 text-lg font-bold text-slate-900">
                                    {bundleRecommendation.productName}
                                  </p>
                                </div>
                                <div className="rounded-2xl bg-white px-4 py-3">
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    AI FEFCO
                                  </p>
                                  <p className="mt-2 text-lg font-bold text-blue-700">
                                    {bundleRecommendation.recommendedFefcoBox}
                                  </p>
                                </div>
                              </div>
                              {bundleRecommendation.reason ? (
                                <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                                  {bundleRecommendation.reason}
                                </p>
                              ) : null}
                            </div>
                          ) : null}

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-[#F4F7FF] p-4">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Chosen FEFCO
                              </p>
                              <p className="mt-3 text-2xl font-bold text-slate-900">
                                FEFCO {bundleRecommendation?.selectedTemplateId || bundleResult.selectedTemplateId}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-[#F4F7FF] p-4">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Layout Family
                              </p>
                              <p className="mt-3 text-lg font-bold capitalize text-slate-900">
                                {bundleResult.layoutFamily.replace(/-/g, " ")}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-[#F4F7FF] p-4 sm:col-span-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Internal Box Dimensions
                              </p>
                              <p className="mt-3 text-2xl font-bold text-slate-900">
                                {formatDimensions(bundleResult.dimensions)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <button
                              type="button"
                              onClick={openBundleEditor}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                            >
                              <PencilLine size={16} />
                              Editor
                            </button>
                            <button
                              type="button"
                              onClick={openBundleDropSim}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Activity size={16} />
                              Drop Sim
                            </button>
                            <button
                              type="button"
                              onClick={openBundleReport}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <FileText size={16} />
                              Report
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={openBundleLayers}
                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100"
                          >
                            <Boxes size={16} />
                            Layer Breakdown
                          </button>
                        </>
                      )}
                    </div>

                    {bundleResult ? (
                      <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Scale size={18} />
                          Guided packing view
                        </div>

                        <div className="mt-4 rounded-[22px] bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900">
                            Open the full-screen layer walkthrough
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            View each layer on the left, reveal products in packing order,
                            inspect coordinates, and close the FEFCO box around the arranged
                            bundle inside the 3D scene.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {bundleResult.layers?.length || 0} layers
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {bundleResult.placements?.length || 0} placements
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              Interactive 3D
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={openBundleLayers}
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                          >
                            <ArrowRight size={16} />
                            Open Layer Breakdown
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MultiProductBundlePage;
