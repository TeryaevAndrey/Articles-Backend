import multer from "multer";
import path from "path";

const multerUploads = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Файл должен быть следующих форматов: (jpg, jpeg, png)"));
      return;
    }

    cb(null, true);
  },
});

export { multerUploads };
