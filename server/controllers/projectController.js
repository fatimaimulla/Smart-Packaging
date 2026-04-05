import crypto from "crypto";
import Project from "../model/projectSchema.js";
import { optimizeBundleLayout } from "../utils/bundleOptimizer.js";
import {
  getBundleEligibilityIssues,
  isBundleEligibleProject,
  normalizeDimensions,
  normalizeFragility,
  parseWeightGrams,
  resolveProjectFragility,
  resolveProjectWeightGrams,
} from "../utils/projectMetadata.js";

const summarizeBundleResult = (bundleResult) => {
  if (!bundleResult) {
    return null;
  }

  return {
    dimensions: bundleResult.dimensions,
    selectedTemplateId: bundleResult.selectedTemplateId,
    totalWeightGrams: bundleResult.totalWeightGrams,
    overallFragility: bundleResult.overallFragility,
    layoutFamily: bundleResult.layoutFamily,
    layers: bundleResult.layers || [],
  };
};

const buildProjectSummary = (project) => ({
  id: project._id,
  sessionId: project.sessionId,
  projectType: project.projectType || "single",
  name: project.name,
  status: project.status,
  referenceObject: project.referenceObject,
  image1: project.image1,
  image2: project.image2,
  dimensions: normalizeDimensions(project.dimensions),
  fragility: resolveProjectFragility(project),
  productWeightGrams: resolveProjectWeightGrams(project),
  selectedTemplateId: project.selectedTemplateId,
  sourceItems: project.sourceItems || [],
  bundleResult: summarizeBundleResult(project.bundleResult),
  isBundleEligible: isBundleEligibleProject(project),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

const serializeProject = (project) => {
  const data = project.toObject ? project.toObject() : project;

  return {
    ...data,
    projectType: data.projectType || "single",
    dimensions: normalizeDimensions(data.dimensions),
    fragility: resolveProjectFragility(data),
    productWeightGrams: resolveProjectWeightGrams(data),
    sourceItems: data.sourceItems || [],
    bundleResult: data.bundleResult || null,
    isBundleEligible: isBundleEligibleProject(data),
  };
};

export const createProject = async (req, res) => {
  try {
    const { name } = req.body || {};
    const sessionId =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `session-${Date.now()}`;

    const project = await Project.create({
      sessionId,
      userId: req.user._id,
      name:
        typeof name === "string" && name.trim()
          ? name.trim()
          : `Project ${new Date().toLocaleDateString("en-IN")}`,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: buildProjectSummary(project),
    });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create project.",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: projects.map(buildProjectSummary),
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch projects.",
    });
  }
};

export const getProjectBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const project = await Project.findOne({
      sessionId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeProject(project),
    });
  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch project.",
    });
  }
};

export const updateProjectConfig = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      name,
      dimensions,
      fragility,
      selectedTemplateId,
      recommendation,
      report,
      status,
      projectType,
      productWeightGrams,
      sourceItems,
      bundleResult,
    } = req.body;

    const project = await Project.findOne({
      sessionId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (typeof name === "string" && name.trim()) {
      project.name = name.trim();
    }

    if (dimensions) {
      const normalized = normalizeDimensions(dimensions);
      project.dimensions = {
        l: normalized.l ?? project.dimensions?.l ?? null,
        w: normalized.w ?? project.dimensions?.w ?? null,
        h: normalized.h ?? project.dimensions?.h ?? null,
      };
    }

    if (fragility) {
      project.fragility = normalizeFragility(fragility) ?? project.fragility;
    }

    if (selectedTemplateId) {
      project.selectedTemplateId = selectedTemplateId;
    }

    if (projectType && ["single", "bundle"].includes(projectType)) {
      project.projectType = projectType;
    }

    if (typeof productWeightGrams !== "undefined") {
      project.productWeightGrams = parseWeightGrams(productWeightGrams);
    }

    if (Array.isArray(sourceItems)) {
      project.sourceItems = sourceItems;
    }

    if (typeof bundleResult !== "undefined") {
      project.bundleResult = bundleResult;
    }

    if (typeof recommendation !== "undefined") {
      project.recommendation = recommendation;

      const derivedWeight = parseWeightGrams(
        recommendation?.estimatedWeight ?? recommendation?.productWeight,
      );
      if (
        typeof productWeightGrams === "undefined" &&
        derivedWeight &&
        !project.productWeightGrams
      ) {
        project.productWeightGrams = derivedWeight;
      }

      const derivedFragility = normalizeFragility(
        recommendation?.fragilityLevel ?? recommendation?.fragility,
      );
      if (!project.fragility && derivedFragility) {
        project.fragility = derivedFragility;
      }
    }

    if (typeof report !== "undefined") {
      project.report = report;
    }

    if (status) {
      project.status = status;
    } else if (
      dimensions ||
      fragility ||
      selectedTemplateId ||
      projectType ||
      typeof productWeightGrams !== "undefined" ||
      Array.isArray(sourceItems) ||
      typeof bundleResult !== "undefined"
    ) {
      project.status = "configured";
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Update project config error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update project.",
    });
  }
};

export const optimizeBundleProject = async (req, res) => {
  try {
    const {
      name,
      sourceItems = [],
      optimizerMode = "hybrid-v1",
      bundleSessionId,
    } = req.body || {};

    if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one configured product for the bundle.",
      });
    }

    const normalizedSelections = sourceItems
      .map((item) => ({
        sessionId: String(item?.sessionId || "").trim(),
        quantity: Number(item?.quantity || 0),
      }))
      .filter((item) => item.sessionId && Number.isInteger(item.quantity) && item.quantity > 0);

    if (normalizedSelections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All selected products must have a quantity of at least 1.",
      });
    }

    const totalUnits = normalizedSelections.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    if (totalUnits > 20) {
      return res.status(400).json({
        success: false,
        message: "Bundle optimization supports at most 20 total units.",
      });
    }

    const sessionIds = normalizedSelections.map((item) => item.sessionId);
    const projects = await Project.find({
      userId: req.user._id,
      sessionId: { $in: sessionIds },
    });

    const projectMap = new Map(projects.map((project) => [project.sessionId, project]));
    const missingSessionIds = sessionIds.filter((sessionId) => !projectMap.has(sessionId));

    if (missingSessionIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: "One or more selected projects could not be found.",
      });
    }

    const ineligibleProject = normalizedSelections.find((selection) => {
      const project = projectMap.get(selection.sessionId);
      return getBundleEligibilityIssues(project).length > 0;
    });

    if (ineligibleProject) {
      const project = projectMap.get(ineligibleProject.sessionId);
      return res.status(400).json({
        success: false,
        message: getBundleEligibilityIssues(project)[0],
      });
    }

    const sourceSnapshots = normalizedSelections.map((selection) => {
      const project = projectMap.get(selection.sessionId);
      return {
        sessionId: project.sessionId,
        name: project.name,
        quantity: selection.quantity,
        image1: project.image1 || null,
        dimensions: normalizeDimensions(project.dimensions),
        fragility: resolveProjectFragility(project),
        productWeightGrams: resolveProjectWeightGrams(project),
      };
    });

    const bundleResult = optimizeBundleLayout(sourceSnapshots, optimizerMode);
    const trimmedName =
      typeof name === "string" && name.trim()
        ? name.trim()
        : `${sourceSnapshots[0]?.name || "Bundle"} Bundle`;

    let project = null;

    if (bundleSessionId) {
      project = await Project.findOne({
        sessionId: bundleSessionId,
        userId: req.user._id,
        projectType: "bundle",
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Bundle project not found.",
        });
      }
    } else {
      const sessionId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `bundle-${Date.now()}`;

      project = new Project({
        sessionId,
        userId: req.user._id,
        projectType: "bundle",
      });
    }

    project.projectType = "bundle";
    project.name = trimmedName;
    project.status = "configured";
    project.dimensions = bundleResult.dimensions;
    project.fragility = normalizeFragility(bundleResult.overallFragility);
    project.productWeightGrams = parseWeightGrams(bundleResult.totalWeightGrams);
    project.selectedTemplateId = bundleResult.selectedTemplateId;
    project.sourceItems = sourceSnapshots;
    project.bundleResult = bundleResult;
    project.recommendation = {
      productName: trimmedName,
      fragilityLevel: bundleResult.overallFragility,
      estimatedWeight: String(bundleResult.totalWeightGrams),
      recommendedFefcoBox: bundleResult.fefcoCode,
    };
    project.report = null;
    project.image1 = sourceSnapshots.find((item) => item.image1)?.image1 || null;
    project.image2 = null;
    project.referenceObject = null;
    project.topView = { product: [], referenceObject: [] };
    project.sideView = { product: [], referenceObject: [] };

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Bundle optimized successfully.",
      data: {
        project: buildProjectSummary(project),
        bundleResult,
      },
    });
  } catch (error) {
    console.error("Optimize bundle error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to optimize the selected bundle.",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const project = await Project.findOneAndDelete({
      sessionId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
};
