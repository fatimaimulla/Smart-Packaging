import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema(
  {
    product: {
      type: [[Number]],
      default: [],
    },
    referenceObject: {
      type: [[Number]],
      default: [],
    },
  },
  { _id: false },
);

const dimensionSchema = new Schema(
  {
    l: { type: Number, default: null },
    w: { type: Number, default: null },
    h: { type: Number, default: null },
  },
  { _id: false },
);

const sourceItemSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "Untitled Product",
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    image1: {
      type: String,
      default: null,
    },
    dimensions: {
      type: dimensionSchema,
      default: () => ({}),
    },
    fragility: {
      type: String,
      enum: ["low", "medium", "high", null],
      default: null,
    },
    productWeightGrams: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectType: {
      type: String,
      enum: ["single", "bundle"],
      default: "single",
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "Untitled Project",
    },
    status: {
      type: String,
      enum: ["draft", "uploaded", "measured", "configured", "completed"],
      default: "draft",
    },
    referenceObject: {
      type: String,
      enum: ["coin", "ATM card", "2x2 box"],
      default: null,
    },
    image1: {
      type: String,
      default: null,
    },
    image2: {
      type: String,
      default: null,
    },
    topView: {
      type: viewSchema,
      default: () => ({}),
    },
    sideView: {
      type: viewSchema,
      default: () => ({}),
    },
    dimensions: {
      type: dimensionSchema,
      default: () => ({}),
    },
    fragility: {
      type: String,
      enum: ["low", "medium", "high", null],
      default: null,
    },
    productWeightGrams: {
      type: Number,
      default: null,
    },
    selectedTemplateId: {
      type: String,
      default: null,
    },
    sourceItems: {
      type: [sourceItemSchema],
      default: [],
    },
    bundleResult: {
      type: Schema.Types.Mixed,
      default: null,
    },
    recommendation: {
      type: Schema.Types.Mixed,
      default: null,
    },
    report: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
