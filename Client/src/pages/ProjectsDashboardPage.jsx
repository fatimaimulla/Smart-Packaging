import Header from "@/common/Header";
import {
  deleteProjectRequest,
  getProjectsRequest,
  updateProjectConfigRequest,
} from "@/api/projects";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  Clock3,
  ArrowRight,
  Layers3,
  Activity,
  FileText,
  Settings,
  PencilLine,
  Trash2,
  X,
  PackagePlus,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatDimensions = (dimensions) =>
  `${Number(dimensions?.l || 0).toFixed(1)} x ${Number(
    dimensions?.w || 0,
  ).toFixed(1)} x ${Number(dimensions?.h || 0).toFixed(1)} mm`;

const formatWeight = (weightGrams) =>
  weightGrams ? `${Math.round(Number(weightGrams))} g` : "Weight pending";

const statusLabelMap = {
  uploaded: "Uploaded",
  measured: "Reviewed",
  configured: "Configured",
  completed: "Completed",
};

const isBundleProject = (project) => project.projectType === "bundle";

const isVisibleProject = (project) => {
  if (isBundleProject(project)) {
    return Boolean(
      project.dimensions?.l &&
        project.dimensions?.w &&
        project.dimensions?.h &&
        project.sourceItems?.length,
    );
  }

  return Boolean(
    project.image1 &&
      project.image2 &&
      project.dimensions?.l &&
      project.dimensions?.w &&
      project.dimensions?.h,
  );
};

const getLastStep = (project) => {
  if (project.status === "completed") return "Report";
  if (isBundleProject(project)) return "Bundle Planner";
  if (project.selectedTemplateId) return "Dieline Editor";
  if (project.dimensions?.l && project.dimensions?.w && project.dimensions?.h) {
    return "Review";
  }
  return "Upload";
};

const buildReportState = (project) => ({
  sessionId: project.sessionId,
  dimensions: project.dimensions,
  aiData: {
    fragility: project.fragility,
    fragilityLevel: project.fragility,
    selectedTemplateId: project.selectedTemplateId,
    fefcoCode: project.selectedTemplateId,
    recommendedFefcoBox: project.selectedTemplateId
      ? `Fefco${project.selectedTemplateId}`
      : undefined,
    estimatedWeight: project.productWeightGrams
      ? String(project.productWeightGrams)
      : undefined,
    productWeightGrams: project.productWeightGrams,
  },
});

const buildEditorState = (project) => ({
  dimensions: project.dimensions,
  templateId: project.selectedTemplateId,
  fefcoCode: project.selectedTemplateId,
  sessionId: project.sessionId,
  projectType: project.projectType,
  source: "dashboard-card",
  from: "dashboard-card",
});

const buildDropSimulationState = (project) => ({
  source: isBundleProject(project) ? "dashboard-bundle" : "dashboard-card",
  from: "dashboard-card",
  lockSimulationInputs: isBundleProject(project),
  projectType: project.projectType,
  dimensions: project.dimensions,
  templateId: project.selectedTemplateId,
  fefcoCode: project.selectedTemplateId,
  weightGrams: project.productWeightGrams,
  estimatedWeight: project.productWeightGrams,
  fragility: project.fragility,
  fragilityLevel: project.fragility,
});

const ActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      primary
        ? "bg-[#0D1B2A] text-white hover:bg-emerald-600"
        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const SettingsMenu = ({
  project,
  onRename,
  onDelete,
  isOpen,
  onToggle,
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="rounded-xl bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
      aria-label={`Project settings for ${project.name}`}
    >
      <Settings size={18} />
    </button>

    {isOpen ? (
      <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onRename}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <PencilLine size={16} />
          Rename project
        </button>
        <div className="h-px bg-slate-200" />
        <button
          type="button"
          onClick={onDelete}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete project
        </button>
      </div>
    ) : null}
  </div>
);

const BundleMedia = ({ project }) => {
  const images = (project.sourceItems || [])
    .map((item) => item.image1)
    .filter(Boolean)
    .slice(0, 3);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900/90 text-slate-200">
        <div className="text-center">
          <Boxes className="mx-auto mb-3" size={34} />
          <p className="text-sm font-semibold">Bundle Preview</p>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={project.name}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className={`grid h-full w-full gap-1 bg-slate-900 ${images.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}>
      {images.map((image, index) => (
        <div
          key={`${project.sessionId}-image-${index}`}
          className={index === 0 && images.length === 3 ? "row-span-2" : ""}
        >
          <img
            src={image}
            alt={`${project.name} item ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-2xl bg-[#F4F7FF] p-3">
    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
      {value}
    </p>
  </div>
);

const ProjectCard = ({
  project,
  navigate,
  isMenuOpen,
  onToggleMenu,
  onRenameProject,
  onDeleteProject,
}) => {
  const bundle = isBundleProject(project);
  const primaryActionLabel = bundle ? "Planner" : "Review";
  const badgeLabel = bundle
    ? `Bundle • ${project.sourceItems?.length || 0} SKUs`
    : statusLabelMap[project.status] || project.status || "Saved";
  const metaChipLabel = bundle
    ? `Weight ${formatWeight(project.productWeightGrams)}`
    : project.referenceObject || "Reference";
  const secondaryMetric = bundle
    ? `${project.sourceItems?.length || 0} products • ${formatWeight(
        project.productWeightGrams,
      )}`
    : project.selectedTemplateId
      ? `FEFCO ${project.selectedTemplateId}`
      : "Not selected";

  const openPrimaryAction = () => {
    if (bundle) {
      navigate(`/bundle-planner/${project.sessionId}`);
      return;
    }

    navigate(`/review/${project.sessionId}`);
  };

  return (
    <article className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative mb-5 h-44 overflow-hidden rounded-[22px] bg-slate-100">
        {bundle ? (
          <BundleMedia project={project} />
        ) : project.image1 ? (
          <img
            src={project.image1}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <FolderOpen size={36} />
          </div>
        )}

        <button
          type="button"
          onClick={openPrimaryAction}
          className="absolute inset-0 z-0"
          aria-label={`Open ${project.name}`}
        />

        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur ${
              bundle
                ? "bg-[#0D1B2A]/90 text-white"
                : "bg-white/92 text-blue-600"
            }`}
          >
            {badgeLabel}
          </span>
        </div>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <span className="rounded-full bg-emerald-50/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
            {metaChipLabel}
          </span>
          <SettingsMenu
            project={project}
            isOpen={isMenuOpen}
            onToggle={onToggleMenu}
            onRename={onRenameProject}
            onDelete={onDeleteProject}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          <p className="mt-1 text-sm font-medium text-white/80">
            Last worked in {getLastStep(project)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Dimensions"
            value={formatDimensions(project.dimensions)}
          />
          <MetricCard
            label={bundle ? "Bundle Load" : "Template"}
            value={secondaryMetric}
          />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={14} />
            Updated {formatDate(project.updatedAt)}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-500">Project ID</span>
            <span className="font-bold tracking-wide text-blue-600">
              {project.sessionId.slice(0, 8)}
            </span>
          </div>
          {bundle ? (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500">Fragility</span>
              <span className="font-semibold capitalize text-slate-700">
                {project.fragility || "unknown"}
              </span>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={bundle ? PackagePlus : ArrowRight}
            label={primaryActionLabel}
            primary
            onClick={openPrimaryAction}
          />
          <ActionButton
            icon={Layers3}
            label="Editor"
            onClick={() =>
              navigate("/dieline", {
                state: buildEditorState(project),
              })
            }
          />
          <ActionButton
            icon={Activity}
            label="Drop Sim"
            onClick={() =>
              navigate("/drop-simulation", {
                state: buildDropSimulationState(project),
              })
            }
          />
          <ActionButton
            icon={FileText}
            label="Report"
            onClick={() =>
              navigate("/report", {
                state: buildReportState(project),
              })
            }
          />
        </div>
      </div>
    </article>
  );
};

const RenameProjectModal = ({
  project,
  value,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rename project</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the project title so it is easier to recognize later.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold outline-none focus:border-blue-500"
          placeholder="Project name"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSaving || !value.trim()}
            className="rounded-xl bg-[#0D1B2A] px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteProjectModal = ({
  project,
  confirmText,
  isDeleting,
  onChange,
  onClose,
  onDelete,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[30px] bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Delete this project
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              This action cannot be undone. To confirm deletion, type{" "}
              <span className="font-semibold text-slate-700">
                delete this project
              </span>{" "}
              below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">{project.name}</p>
          <p className="mt-1 text-xs text-red-600">
            Project ID {project.sessionId.slice(0, 8)}
          </p>
        </div>

        <input
          type="text"
          value={confirmText}
          onChange={(event) => onChange(event.target.value)}
          className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-red-400"
          placeholder="Type: delete this project"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={
              isDeleting ||
              confirmText.trim().toLowerCase() !== "delete this project"
            }
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectsDashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState("all");
  const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleBaseProjects = useMemo(
    () => projects.filter((project) => isVisibleProject(project)),
    [projects],
  );

  const projectCounts = useMemo(() => {
    const products = visibleBaseProjects.filter(
      (project) => !isBundleProject(project),
    ).length;
    const bundles = visibleBaseProjects.filter((project) =>
      isBundleProject(project),
    ).length;

    return {
      all: visibleBaseProjects.length,
      products,
      bundles,
    };
  }, [visibleBaseProjects]);

  const visibleProjects = useMemo(() => {
    if (viewMode === "products") {
      return visibleBaseProjects.filter((project) => !isBundleProject(project));
    }

    if (viewMode === "bundles") {
      return visibleBaseProjects.filter((project) => isBundleProject(project));
    }

    return visibleBaseProjects;
  }, [viewMode, visibleBaseProjects]);

  const loadProjects = async () => {
    try {
      const res = await getProjectsRequest();
      setProjects(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    setIsCreating(true);

    try {
      navigate("/upload");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenRename = (project) => {
    setOpenMenuSessionId(null);
    setRenameTarget(project);
    setRenameValue(project.name || "");
  };

  const handleRenameProject = async () => {
    if (!renameTarget || !renameValue.trim()) {
      return;
    }

    setIsRenaming(true);

    try {
      await updateProjectConfigRequest({
        sessionId: renameTarget.sessionId,
        name: renameValue.trim(),
      });
      toast.success("Project renamed.");
      setRenameTarget(null);
      setRenameValue("");
      await loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to rename project.");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProjectRequest({ sessionId: deleteTarget.sessionId });
      toast.success("Project deleted.");
      setDeleteTarget(null);
      setDeleteConfirmText("");
      await loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF]">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#0D1B2A]">
                Your Projects
              </h1>
              <p className="text-gray-600">
                Reopen measured products, continue dieline work, or build a new combined shipping bundle.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/bundle-planner")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <PackagePlus size={18} />
                Bundle Planner
              </button>
              <button
                type="button"
                onClick={handleCreateProject}
                disabled={isCreating}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-70"
              >
                <Plus size={18} />
                {isCreating ? "Creating..." : "New Project"}
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Switch between products and bundles
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Keep saved single-product projects and combined bundle jobs separated when needed.
              </p>
            </div>

            <div className="inline-flex rounded-full bg-slate-100 p-1">
              {[
                { id: "all", label: `All (${projectCounts.all})` },
                { id: "products", label: `Projects (${projectCounts.products})` },
                { id: "bundles", label: `Bundles (${projectCounts.bundles})` },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setViewMode(option.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === option.id
                      ? "bg-white text-[#0D1B2A] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-3xl bg-white/80 p-12 text-center text-gray-500 shadow-sm">
              Loading your saved projects...
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="rounded-3xl bg-white/80 p-12 text-center shadow-sm">
              <FolderOpen className="mx-auto mb-4 text-blue-500" size={42} />
              <h2 className="mb-2 text-2xl font-bold text-[#0D1B2A]">
                {viewMode === "bundles"
                  ? "No saved bundles yet"
                  : viewMode === "products"
                    ? "No saved product projects yet"
                    : "No saved projects yet"}
              </h2>
              <p className="mb-6 text-gray-500">
                {viewMode === "bundles"
                  ? "Saved bundle plans appear here after you combine configured products into a shared shipping box."
                  : viewMode === "products"
                    ? "Measured single-product projects appear here after dimensions are saved."
                    : "Projects appear here after dimensions are saved. Once products are configured, you can also combine them into a shared bundle planner project."}
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCreateProject}
                  disabled={isCreating}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Start First Project
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/bundle-planner")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <PackagePlus size={18} />
                  Open Bundle Planner
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.sessionId}
                  project={project}
                  navigate={navigate}
                  isMenuOpen={openMenuSessionId === project.sessionId}
                  onToggleMenu={() =>
                    setOpenMenuSessionId((current) =>
                      current === project.sessionId ? null : project.sessionId,
                    )
                  }
                  onRenameProject={() => handleOpenRename(project)}
                  onDeleteProject={() => {
                    setOpenMenuSessionId(null);
                    setDeleteTarget(project);
                    setDeleteConfirmText("");
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <RenameProjectModal
        project={renameTarget}
        value={renameValue}
        isSaving={isRenaming}
        onChange={setRenameValue}
        onClose={() => {
          setRenameTarget(null);
          setRenameValue("");
        }}
        onSubmit={handleRenameProject}
      />

      <DeleteProjectModal
        project={deleteTarget}
        confirmText={deleteConfirmText}
        isDeleting={isDeleting}
        onChange={setDeleteConfirmText}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteConfirmText("");
        }}
        onDelete={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectsDashboardPage;
