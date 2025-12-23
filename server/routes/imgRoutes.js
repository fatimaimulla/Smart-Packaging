import express from "express";
import upload from "../middleware/multer.js";
import { imgUpload } from "../controllers/imgController.js";

const imgRouter = express.Router();

imgRouter
  .route("/upload")
  .post(upload.fields([{ name: "img1" }, { name: "img2" }]), imgUpload);

export default imgRouter;
