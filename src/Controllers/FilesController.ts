import { Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary.js";
import { extractPublicId } from "cloudinary-build-url";

class FilesController {
  imgProcessing = async (req: Request, res: Response) => {
    try {
      const img = req.file;

      if (!img) {
        return res.status(500).json({ message: "Ошибка. Повторите попытку" });
      }

      const result = await cloudinary.v2.uploader.upload(img.path, {
        folder: `articles-posts-author:${req.userId}`,
      });

      return res.json({ img: result.secure_url });
    } catch (err) {
      return res.status(500).json({
        message: "Не удалось обработать изображение. Повторите попытку",
      });
    }
  };

  deleteImg = async (req: Request, res: Response) => {
    try {
      const { imgUrl } = req.params;
      const publicId = extractPublicId(imgUrl);

      await cloudinary.v2.uploader.destroy(publicId);

      return res.json({ message: "Изображение удалено" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default FilesController;
