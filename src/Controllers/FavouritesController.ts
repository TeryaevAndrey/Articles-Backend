import { Request, Response } from "express";
import FavouriteModel from "../models/FavouriteModel.js";

class FavouriteController {
  addArticleToFavourite = async (req: Request, res: Response) => {
    try {
      const { articleId }: { articleId: string } = req.body;

      if (!articleId) {
        return res.status(500).json({ message: "Ошибка" });
      }

      const favourite = await new FavouriteModel({
        userId: req.userId,
        articleId,
      });

      await favourite.save();

      return res.json({
        message: "Статья добавлена в избранное",
        favourite,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  deleteArticleFromFavourite = async (req: Request, res: Response) => {
    try {
      const {
        _id,
      }: {
        _id: string;
      } = req.body;

      await FavouriteModel.deleteOne({ _id });

      return res.json({ message: "Удалено с избранных" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка. Попробуйте перезагрузить страницу" });
    }
  };

  getFavouriteArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.params;

      const favourite = await FavouriteModel.findOne({
        userId: req.userId,
        articleId,
      });

      if (!favourite) {
        return res.status(404).json({
          message: "У вас нет этой статьи в избранном",
        });
      }

      return res.json({ favourite });
    } catch (err) {
      return res.status(500).json({
        message: "Не получилось получить ваши избранные статьи",
      });
    }
  };
}

export default FavouriteController;
