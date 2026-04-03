import express from "express";
import upload from "../middleware/multer.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getImage,
  getSideDimension,
  getDimensions,
  imgUpload,
  updateDimensionSide,
  updateDimensionTop,
} from "../controllers/imgController.js";

const imgRouter = express.Router();

imgRouter
  .route("/upload")
  .post(upload.fields([{ name: "img1" }, { name: "img2" }]), imgUpload);

imgRouter.route("/image/:sessionId").get(requireAuth, getImage);

imgRouter.route("/updatetop").post(updateDimensionTop);
imgRouter.route("/updateside").post(updateDimensionSide);
imgRouter.route("/getdimensions/:sessionId").get(requireAuth, getDimensions);
imgRouter.route("/getside/:sessionId").get(requireAuth, getSideDimension);

export default imgRouter;
