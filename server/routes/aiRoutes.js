import express from "express";
import { productAnalyze } from "../controllers/aiControllers.js";
const aiRouter = express.Router();

aiRouter.route("/generatebox").get(productAnalyze);

export default aiRouter;