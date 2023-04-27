import { Request, Response } from "express";
import FavouriteModel from "../models/FavouriteModel.js";

class FavouriteController {
  addArticleToFavourite = async (req: Request, res: Response) => {
    try {
      const { articleId }: { articleId: string } =
        req.body;

      if (!articleId) {
        return res.status(500).json({ message: "Ошибка" });
      }

      const favouriteArticle = await new FavouriteModel({ userId: req.userId, articleId });

      await favouriteArticle.save();

      return res.json({ message: "Статья добавлена в избранное" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getFavouriteArticles = async (req: Request, res: Response) => {
    try {
      const articles = await FavouriteModel.find({
        userId: req.userId,
      }).populate("articleId");

      if (articles.length === 0) {
        return res.status(404).json({
          message: "У вас нет статей, которые вы добавили в избранное",
        });
      }

      return res.json({ articles });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Не получилось получить ваши избранные статьи" });
    }
  };
}

export default FavouriteController;
