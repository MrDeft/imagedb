import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { upload } from "./multer.js";
import Image from "./models/Image.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// uploads papkasini brauzerga ochiq qilish
app.use("/uploads", express.static("uploads"));

// MongoDB ulash
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB ulandi"))
  .catch(err => console.log(err));

// Frontend formni server orqali ochish
app.use(express.static("public"));

// Test route
app.get("/test", (req, res) => res.send("Server ishlayapti"));

// Rasm upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  const data = await Image.create({
    title: req.body.title,
    imageUrl: `/uploads/${req.file.filename}`
  });
  res.json(data);
});

// Barcha rasmni ko‘rsatish
app.get("/images", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

// Serverni ishga tushirish
app.listen(5000, () => console.log("Server 5000-portda ishlayapti"));
