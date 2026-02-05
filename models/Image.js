import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: String,
  imageUrl: String
});

export default mongoose.model("Image", imageSchema);
