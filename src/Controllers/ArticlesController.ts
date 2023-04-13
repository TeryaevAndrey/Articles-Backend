import { Request, Response } from "express";
import ArticleModel from "../models/ArticleModel.js";

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
}

export default ArticlesController;
