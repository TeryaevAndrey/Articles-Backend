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
      const tag = req.query.tag;

      if (!tag) {
        const articles = await ArticleModel.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page > 1 ? limit * page - limit : 0);

        const total = await ArticleModel.countDocuments();

        if (articles.length === 0) {
          return res.status(404).json({ message: "Не удалось ничего найти" });
        }

        return res.json({ articles, total });
      } else {
        const articles = await ArticleModel.find({
          tags: { $elemMatch: { $eq: tag } },
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page > 1 ? limit * page - limit : 0);

        const total = await ArticleModel.find({
          tags: { $elemMatch: { $eq: tag } },
        }).countDocuments();

        if (articles.length === 0) {
          return res.status(404).json({ message: "Не удалось ничего найти" });
        }

        return res.json({ articles, total });
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  getMyArticles = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);

      const articles = await ArticleModel.find({ from: req.userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(page > 1 ? limit * page - limit : 0);

      const total = await ArticleModel.find({
        from: req.userId,
      }).countDocuments();

      if (articles.length === 0) {
        return res.status(404).json({ message: "Не удалось ничего найти" });
      }

      return res.json({ articles, total });
    } catch (err) {
      return res.status(500).json({ message: "Не удалось ничего найти" });
    }
  };

  getArticlesBySearch = async (req: Request, res: Response) => {
    try {
      const limit: number = Number(req.query.limit);
      const page: number = Number(req.query.page);
      const searchValue = req.query.q;
      const tag = req.query.tag;

      if (tag) {
        const articles = await ArticleModel.find({
          title: { $regex: searchValue, $options: "i" },
          tags: { $elemMatch: { $eq: tag } },
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page > 1 ? limit * page - limit : 0);

        if (!articles) {
          return res.status(404).json({ message: "Не удалось найти статьи" });
        }

        const total = await ArticleModel.find({
          title: { $regex: searchValue, $options: "i" },
          tags: { $elemMatch: { $eq: tag } },
        }).countDocuments();

        return res.json({ articles, total });
      } else {
        const articles = await ArticleModel.find({
          title: { $regex: searchValue, $options: "i" },
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page > 1 ? limit * page - limit : 0);

        if (!articles) {
          return res.status(404).json({ message: "Не удалось найти статьи" });
        }

        const total = await ArticleModel.find({
          title: { $regex: searchValue, $options: "i" },
        }).countDocuments();

        return res.json({ articles, total });
      }
    } catch (err) {
      return res.status(500).json({ message: "Ошибка. Попробуйте еще раз" });
    }
  };

  getArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.params;

      const article = await ArticleModel.findOne({ _id: articleId }).populate(
        "from",
        "-password"
      );

      if (!article) {
        return res.status(404).json({ message: "Не удалось найти статью" });
      }

      await ArticleModel.updateOne(
        { _id: articleId },
        { views: article.views + 1 }
      );

      return res.json({ article });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка. Попробуйте перезагрузить страницу" });
    }
  };

  deleteArticle = async (req: Request, res: Response) => {
    try {
      const { articleId } = req.params;

      const article = await ArticleModel.findOneAndDelete({ _id: articleId });

      if (!article) {
        return res
          .status(404)
          .json({ message: "Такого Id статьи не существует" });
      }

      return res.json({ message: "Статья удалена" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка сервера. Попробуйте снова" });
    }
  };

  getPopularTags = async (req: Request, res: Response) => {
    try {
      const tags = await ArticleModel.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags" } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]);

      return res.json({ tags });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Не получилось получить популярные темы" });
    }
  };
}

export default ArticlesController;
