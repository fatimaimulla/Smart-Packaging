export const FRAGILITY_LEVELS = ["low", "medium", "high"];

export const normalizeFragility = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return FRAGILITY_LEVELS.includes(normalized) ? normalized : null;
};

export const parseWeightGrams = (value) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.round(parsed);
    }
  }

  return null;
};

export const normalizeDimensions = (dimensions = {}) => {
  const l = Number(dimensions?.l ?? dimensions?.length ?? 0);
  const w = Number(dimensions?.w ?? dimensions?.width ?? 0);
  const h = Number(dimensions?.h ?? dimensions?.height ?? 0);

  return {
    l: Number.isFinite(l) && l > 0 ? Number(l.toFixed(2)) : null,
    w: Number.isFinite(w) && w > 0 ? Number(w.toFixed(2)) : null,
    h: Number.isFinite(h) && h > 0 ? Number(h.toFixed(2)) : null,
  };
};

export const hasValidDimensions = (dimensions = {}) =>
  Boolean(dimensions?.l && dimensions?.w && dimensions?.h);

export const resolveProjectFragility = (project = {}) =>
  normalizeFragility(
    project?.recommendation?.fragilityLevel ??
      project?.recommendation?.fragility,
  ) ??
  normalizeFragility(
    project?.fragility,
  );

export const resolveProjectWeightGrams = (project = {}) =>
  parseWeightGrams(
    project?.productWeightGrams ??
      project?.recommendation?.estimatedWeight ??
      project?.recommendation?.productWeight,
  );

export const getBundleEligibilityIssues = (project = {}) => {
  const issues = [];

  if (project?.projectType === "bundle") {
    issues.push("Bundle projects cannot be re-imported.");
  }

  if (!hasValidDimensions(normalizeDimensions(project?.dimensions))) {
    issues.push("Dimensions are missing.");
  }

  if (!resolveProjectFragility(project)) {
    issues.push("Fragility is missing.");
  }

  if (!resolveProjectWeightGrams(project)) {
    issues.push("Weight is missing.");
  }

  return issues;
};

export const isBundleEligibleProject = (project = {}) =>
  getBundleEligibilityIssues(project).length === 0;
