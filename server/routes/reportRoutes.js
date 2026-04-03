import express from "express";
import { estimatePackagingCost } from "../controllers/reportController.js";
const reportRouter = express.Router();
reportRouter.route("/cost").post(estimatePackagingCost);

export default reportRouter;
