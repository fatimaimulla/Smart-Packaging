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

const statusLabelMap = {
  uploaded: "Uploaded",
  measured: "Reviewed",
  configured: "Configured",
  completed: "Completed",
};

const getLastStep = (project) => {
  if (project.report) return "Report";
  if (project.selectedTemplateId) return "Dieline Editor";
  if (project.recommendation) return "Recommendation";
  if (project.dimensions?.l && project.dimensions?.w && project.dimensions?.h) {
    return "Review";
  }
  return "Upload";
};

const ActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      primary
        ? "bg-[#0D1B2A] text-white hover:bg-emerald-600"
        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
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

const ProjectCard = ({
  project,
  navigate,
  isMenuOpen,
  onToggleMenu,
  onRenameProject,
  onDeleteProject,
}) => {
  const quickState = {
    dimensions: project.dimensions,
    templateId: project.selectedTemplateId,
    fefcoCode: project.selectedTemplateId,
    source: "dashboard-card",
    from: "dashboard-card",
  };

  return (
    <article className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden rounded-[22px] bg-slate-100 h-44 mb-5">
        {project.image1 ? (
          <img
            src={project.image1}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            <FolderOpen size={36} />
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/review/${project.sessionId}`)}
          className="absolute inset-0 z-0"
          aria-label={`Open ${project.name} in review`}
        />

        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 shadow-sm backdrop-blur">
            {statusLabelMap[project.status] || project.status || "Saved"}
          </span>
        </div>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <span className="rounded-full bg-emerald-50/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
            {project.referenceObject || "Reference"}
          </span>
          <SettingsMenu
            project={project}
            isOpen={isMenuOpen}
            onToggle={onToggleMenu}
            onRename={onRenameProject}
            onDelete={onDeleteProject}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none">
          <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          <p className="mt-1 text-sm font-medium text-white/80">
            Last worked in {getLastStep(project)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#F4F7FF] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Dimensions
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700 leading-6">
              {formatDimensions(project.dimensions)}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F4F7FF] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Template
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {project.selectedTemplateId
                ? `FEFCO ${project.selectedTemplateId}`
                : "Not selected"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-slate-100">
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={ArrowRight}
            label="Review"
            primary
            onClick={() => navigate(`/review/${project.sessionId}`)}
          />
          <ActionButton
            icon={Layers3}
            label="Editor"
            onClick={() =>
              navigate("/dieline", {
                state: quickState,
              })
            }
          />
          <ActionButton
            icon={Activity}
            label="Drop Sim"
            onClick={() =>
              navigate("/drop-simulation", {
                state: quickState,
              })
            }
          />
          <ActionButton
            icon={FileText}
            label="Report"
            onClick={() =>
              navigate("/report", {
                state: {
                  sessionId: project.sessionId,
                  dimensions: project.dimensions,
                  aiData: {
                    ...project.recommendation,
                    fragility: project.fragility,
                    selectedTemplateId: project.selectedTemplateId,
                    fefcoCode: project.selectedTemplateId,
                  },
                },
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
    <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rename project</h2>
            <p className="text-sm text-slate-500 mt-1">
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
    <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-6">
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
            disabled={isDeleting || confirmText.trim().toLowerCase() !== "delete this project"}
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
  const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.image1 &&
          project.image2 &&
          project.dimensions?.l &&
          project.dimensions?.w &&
          project.dimensions?.h,
      ),
    [projects],
  );

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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">
                Your Projects
              </h1>
              <p className="text-gray-600">
                Reopen past uploads or jump directly into the next tool you need.
              </p>
            </div>
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-70"
            >
              <Plus size={18} />
              {isCreating ? "Creating..." : "New Project"}
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-3xl bg-white/80 p-12 text-center text-gray-500 shadow-sm">
              Loading your saved projects...
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="rounded-3xl bg-white/80 p-12 text-center shadow-sm">
              <FolderOpen className="mx-auto mb-4 text-blue-500" size={42} />
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2">
                No saved projects yet
              </h2>
              <p className="text-gray-500 mb-6">
                Projects will appear here only after both images, detections, and
                dimensions are saved successfully.
              </p>
              <button
                onClick={handleCreateProject}
                disabled={isCreating}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Start First Project
              </button>
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
