import { v2 as cloudinary } from "cloudinary";
import Project from "../model/projectSchema.js";

const findOwnedProject = async ({ sessionId, userId }) =>
  Project.findOne({
    sessionId,
    userId,
  });

const findProjectForWrite = async ({ sessionId, user }) => {
  if (!sessionId) return null;

  if (user?._id) {
    return findOwnedProject({ sessionId, userId: user._id });
  }

  return Project.findOne({ sessionId });
};

export const imgUpload = async (req, res) => {
  try {
    const { referenceObject, sessionId, projectName } = req.body;
    const img1 = req.files?.img1?.[0];
    const img2 = req.files?.img2?.[0];

    if (!img1 || !img2 || !referenceObject || !sessionId) {
      return res.status(400).json({
        message: "Please provide both images, a reference object, and a project session.",
        success: false,
      });
    }

    const project = await Project.findOne({ sessionId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project session not found.",
      });
    }

    const base64Image1 = `data:${img1.mimetype};base64,${img1.buffer.toString(
      "base64",
    )}`;
    const base64Image2 = `data:${img2.mimetype};base64,${img2.buffer.toString(
      "base64",
    )}`;

    const [upload1, upload2] = await Promise.all([
      cloudinary.uploader.upload(base64Image1, {
        access_mode: "public",
        type: "upload",
      }),
      cloudinary.uploader.upload(base64Image2, {
        access_mode: "public",
        type: "upload",
      }),
    ]);

    project.referenceObject = referenceObject;
    if (typeof projectName === "string" && projectName.trim()) {
      project.name = projectName.trim();
    }
    project.image1 = upload1.secure_url;
    project.image2 = upload2.secure_url;
    project.status = "uploaded";
    await project.save();

    return res.status(200).json({
      message: "Image uploaded successfully.",
      success: true,
      sessionId: project.sessionId,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to upload images.",
    });
  }
};

export const getImage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const project = await findProjectForWrite({
      sessionId,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        referenceObject: project.referenceObject,
        topImageUrl: project.image1,
        sideImageUrl: project.image2,
      },
    });
  } catch (error) {
    console.error("Get project image error:", error);
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
        message: "Project not found",
      });
    }

    const project = await findProjectForWrite({
      sessionId,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.topView = {
      product: topView?.products || [],
      referenceObject: topView?.reference_object || [],
    };
    project.status = "measured";
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Dimensions updated successfully",
      data: project.topView,
    });
  } catch (error) {
    console.error("Update top dimension error:", error);
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
        message: "Project not found",
      });
    }

    const project = await findProjectForWrite({
      sessionId,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.sideView = {
      product: sideView?.products || [],
      referenceObject: sideView?.reference_object || [],
    };
    project.status = "measured";
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Dimensions updated successfully",
      data: project.sideView,
    });
  } catch (error) {
    console.error("Update side dimension error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDimensions = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = await findOwnedProject({
      sessionId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        topView: project.topView,
        sideView: project.sideView,
      },
    });
  } catch (error) {
    console.error("Get dimensions error:", error);
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
        message: "Project not found",
      });
    }

    const project = await findOwnedProject({
      sessionId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project.sideView,
    });
  } catch (error) {
    console.error("Get side dimension error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
