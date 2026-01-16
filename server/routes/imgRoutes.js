import express from "express";
import upload from "../middleware/multer.js";
import { getImage, imgUpload } from "../controllers/imgController.js";

const imgRouter = express.Router();

imgRouter
  .route("/upload")
  .post(upload.fields([{ name: "img1" }, { name: "img2" }]), imgUpload);

imgRouter.route("/image/:id").get(getImage);

export default imgRouter;
