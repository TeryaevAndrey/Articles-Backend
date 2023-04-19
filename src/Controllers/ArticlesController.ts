import { Request, Response } from "express";
import ArticleModel from "../models/ArticleModel.js";
import { cloudinary } from "../utils/cloudinary.js";

class ArticlesController {
  addArticle = async (req: Request, res: Response) => {
    try {
      const {
        elements,
        tags,
      }: {
        elements: [];
        tags: [];
      } = req.body;

      if (elements.length === 0) {
        return res.status(404).json({ message: "Добавьте элементы!" });
      }

      const article = await new ArticleModel({
        elements,
        tags,
        from: req.userId,
      });

      await article.save();

      return res.json({ message: "Статья добавлена!" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  editArticle = async (req: Request, res: Response) => {
    try {
      const {
        elements,
        tags,
      }: {
        id: string;
        elements: [];
        tags: [];
      } = req.body;
      const { articleId } = req.params;

      if (elements.length === 0) {
        return res.status(404).json({ message: "Добавьте элементы!" });
      }

      await ArticleModel.updateOne(
        { _id: articleId },
        {
          elements,
          tags,
        }
      );

      return res.json({ message: "Статья обновлена!" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getArticles = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);

      const articles = await ArticleModel.find()
        .limit(limit)
        .skip(limit * page);

      const total = await ArticleModel.countDocuments();

      if (articles.length === 0) {
        return res.status(404).json({ message: "Не удалось ничего найти" });
      }

      return res.json({ articles, total });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

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
}

export default ArticlesController;
