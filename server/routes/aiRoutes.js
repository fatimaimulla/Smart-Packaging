import express from "express";
import { productAnalyze } from "../controllers/aiControllers.js";
const aiRouter = express.Router();

aiRouter.route("/generatebox").post(productAnalyze);

export default aiRouter;