import express from "express";
import upload from "../middleware/multer.js";
import {
  getImage,
  getSideDimension,
  getTopDimension,
  imgUpload,
  updateDimensionSide,
  updateDimensionTop,
} from "../controllers/imgController.js";

const imgRouter = express.Router();

imgRouter
  .route("/upload")
  .post(upload.fields([{ name: "img1" }, { name: "img2" }]), imgUpload);

imgRouter.route("/image/:sessionId").get(getImage);

imgRouter.route("/updatetop").post(updateDimensionTop);
imgRouter.route("/updateside").post(updateDimensionSide);
imgRouter.route("/gettop/:sessionId").get(getTopDimension);
imgRouter.route("/getside/:sessionId").get(getSideDimension);

export default imgRouter;
