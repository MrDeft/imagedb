import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",  // rasm shu papkaga tushadi
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 1730000000000.jpg
  }
});

export const upload = multer({ storage });
