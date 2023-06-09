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

  getAllFavouritesArticles = async (req: Request, res: Response) => {
    try {
      const favourites = await FavouriteModel.find({ userId: req.userId });

      const total = await FavouriteModel.find({
        userId: req.userId,
      }).countDocuments();

      if (total === 0) {
        return res
          .status(200)
          .json({ message: "У вас нет статей в избранном" });
      }

      return res.json({ favourites, total });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getFavouritesArticles = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);

      const favourite = await FavouriteModel.find({ userId: req.userId })
        .populate("articleId")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(page > 1 ? limit * page - limit : 0);

      const total = await FavouriteModel.find({
        userId: req.userId,
      }).countDocuments();

      if (total === 0) {
        return res
          .status(200)
          .json({ message: "У вас нет статей в избранном" });
      }

      return res.json({ favourite, total });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Не удалось найти ваши статьи в избранном" });
    }
  };
}

export default FavouriteController;
