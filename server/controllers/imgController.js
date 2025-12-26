import { v2 as cloudinary } from "cloudinary";
import Img from "../model/imgSchema.js";

export const imgUpload = async (req, res) => {
  try {
    const { referenceObject } = req.body;
    const img1 = req.files?.img1?.[0];
    const img2 = req.files?.img2?.[0];
    if (!img1 || !img2 || !referenceObject) {
      return res.status(400).json({
        message: "Please Provide the proper Inputs.",
        succcess: false,
      });
    }

    const base64Image1 = `data:${
      img1.mimetype
    };base64,${img1.buffer.toString("base64")}`;

    const base64Image2 = `data:${
      img2.mimetype
    };base64,${img2.buffer.toString("base64")}`;

    const upload1 = await cloudinary.uploader.upload(base64Image1);
    const upload2 = await cloudinary.uploader.upload(base64Image2);

    await Img.create({
      referenceObject: referenceObject,
      image1: upload1.secure_url,
      image2: upload2.secure_url,
    });

    return res
      .status(200)
      .json({ message: "Image uploaded successfully.", success: true });
  } catch (error) {
    console.log(error);
  }
};
