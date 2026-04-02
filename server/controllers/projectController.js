import crypto from "crypto";
import Project from "../model/projectSchema.js";

const buildProjectSummary = (project) => ({
  id: project._id,
  sessionId: project.sessionId,
  name: project.name,
  status: project.status,
  referenceObject: project.referenceObject,
  image1: project.image1,
  image2: project.image2,
  dimensions: project.dimensions,
  fragility: project.fragility,
  selectedTemplateId: project.selectedTemplateId,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

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
      data: project,
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
      project.dimensions = {
        l: dimensions.l ?? project.dimensions?.l ?? null,
        w: dimensions.w ?? project.dimensions?.w ?? null,
        h: dimensions.h ?? project.dimensions?.h ?? null,
      };
    }

    if (fragility) {
      project.fragility = fragility;
    }

    if (selectedTemplateId) {
      project.selectedTemplateId = selectedTemplateId;
    }

    if (typeof recommendation !== "undefined") {
      project.recommendation = recommendation;
    }

    if (typeof report !== "undefined") {
      project.report = report;
    }

    if (status) {
      project.status = status;
    } else if (dimensions || fragility || selectedTemplateId) {
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
