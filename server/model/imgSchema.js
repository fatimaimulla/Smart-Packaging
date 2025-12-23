import mongoose, { Schema } from "mongoose";

const imgSchema = new Schema({
  referenceObject: {
    type: String,
    enum: ["coin", "ATM card", "2x2 box"],
    required: true,
  },
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
});

const Img = mongoose.model("Img", imgSchema);
export default Img;
