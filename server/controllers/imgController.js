import { v2 as cloudinary } from "cloudinary";
import Img from "../model/imgSchema.js";

export const imgUpload = async (req, res) => {
  try {
    const { referenceObject, sessionId } = req.body;
    const img1 = req.files?.img1?.[0];
    const img2 = req.files?.img2?.[0];
    if (!img1 || !img2 || !referenceObject) {
      return res.status(400).json({
        message: "Please Provide the proper Inputs.",
        succcess: false,
      });
    }

    const base64Image1 = `data:${img1.mimetype};base64,${img1.buffer.toString(
      "base64",
    )}`;

    const base64Image2 = `data:${img2.mimetype};base64,${img2.buffer.toString(
      "base64",
    )}`;

    const upload1 = await cloudinary.uploader.upload(base64Image1, {
      access_mode: "public",
      type: "upload",
    });
    const upload2 = await cloudinary.uploader.upload(base64Image2, {
      access_mode: "public",
      type: "upload",
    });

    const session = await Img.create({
      sessionId: sessionId,
      referenceObject: referenceObject,
      image1: upload1.secure_url,
      image2: upload2.secure_url,
    });

    return res.status(200).json({
      message: "Image uploaded successfully.",
      success: true,
      sessionId: session._id,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getImage = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Img.findOne({ sessionId: sessionId }).sort({
      createdAt: -1,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        referenceObject: session.referenceObject,
        topImageUrl: session.image1,
        sideImageUrl: session.image2,
      },
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDimensionTop = async (req, res) => {
  try {
    const { sessionId, topView } = req.body;

    if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = await Img.findOne({ sessionId: sessionId }).sort({
      createdAt: -1,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (topView) {
      session.topView = {
        product: topView.products || [],
        referenceObject: topView.reference_object || [],
      };
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Dimensions updated successfully",
      data: session.topView,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDimensionSide = async (req, res) => {
  try {
    const { sessionId, sideView } = req.body;

    if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = await Img.findOne({ sessionId: sessionId }).sort({
      createdAt: -1,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (sideView) {
      session.sideView = {
        product: sideView.products || [],
        referenceObject: sideView.reference_object || [],
      };
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Dimensions updated successfully",
      data: session.sideView,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTopDimension = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = await Img.findOne({ sessionId: sessionId }).sort({
      createdAt: -1,
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: session.topView,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getSideDimension = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = await Img.findOne({ sessionId: sessionId }).sort({
      createdAt: -1,
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: session.sideView,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
