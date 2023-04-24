import { Request, Response } from "express";
import ArticleModel from "../models/ArticleModel.js";
import { cloudinary } from "../utils/cloudinary.js";

class ArticlesController {
  addArticle = async (req: Request, res: Response) => {
    try {
      const {
        title,
        banner,
        elements,
        tags,
      }: {
        title: string;
        banner: string | undefined;
        elements: [];
        tags: [];
      } = req.body;

      if (!title) {
        return res.status(500).json({ message: "Введите заголовок!" });
      }

      if (elements.length === 0) {
        return res.status(404).json({ message: "Добавьте элементы!" });
      }

      const article = await new ArticleModel({
        title,
        banner,
        elements,
        tags,
        views: 0,
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
        title,
        banner,
        elements,
        tags,
      }: {
        title: string;
        banner: string | undefined;
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
          title,
          banner,
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

  getMyArticles = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);

      const articles = await ArticleModel.find({ from: req.userId })
        .limit(limit)
        .skip(page > 1 ? limit * page : 0);

      const total = await ArticleModel.countDocuments();

      if (articles.length === 0) {
        return res.status(404).json({ message: "Не удалось ничего найти" });
      }

      return res.json({ articles, total });
    } catch (err) {
      return res.status(500).json({ message: "Не удалось ничего найти" });
    }
  };

  getArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.query;

      const article = await ArticleModel.findOne({ _id: articleId });

      if (!article) {
        return res.status(404).json({ message: "Не удалось найти статью" });
      }

      return res.json({ article });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка. Попробуйте перезагрузить страницу" });
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
