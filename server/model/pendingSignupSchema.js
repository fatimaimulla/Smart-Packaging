import mongoose, { Schema } from "mongoose";

const pendingSignupSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "SmartPack User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    resendCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);

export default PendingSignup;
