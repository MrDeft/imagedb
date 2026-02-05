import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { upload } from "./multer.js";
import Image from "./models/Image.js";

dotenv.config();

const app = express();

/* ===============================
   ASOSIY SOZLAMALAR
================================ */

app.use(cors());
app.use(express.json());

// __dirname ni ES module uchun olish
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads papkasini ochiq qilish
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// public papkadan frontend berish
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   MONGODB ULASH
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB muvaffaqiyatli ulandi"))
  .catch((err) => console.error("MongoDB xato:", err));

/* ===============================
   ROUTES
================================ */

// tekshiruv
app.get("/test", (req, res) => {
  res.send("Server ishlayapti");
});

// rasm yuklash
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Rasm yuborilmadi" });
    }

    const image = await Image.create({
      title: req.body.title || "Nomsiz rasm",
      imageUrl: `/uploads/${req.file.filename}`,
    });

    res.json(image);
  }catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message });
}

});

// barcha rasmlarni olish
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Maʼlumot olishda xato" });
  }
});

/* ===============================
   SERVERNI ISHGA TUSHIRISH
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
