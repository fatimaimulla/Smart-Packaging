import express from "express";
import {
  createProject,
  deleteProject,
  getProjectBySessionId,
  getProjects,
  optimizeBundleProject,
  updateProjectConfig,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.route("/").post(createProject).get(getProjects);
projectRouter.route("/bundles/optimize").post(optimizeBundleProject);
projectRouter.route("/:sessionId").get(getProjectBySessionId);
projectRouter.route("/:sessionId/config").patch(updateProjectConfig);
projectRouter.route("/:sessionId").delete(deleteProject);

export default projectRouter;
