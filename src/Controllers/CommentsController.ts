import { Request, Response } from "express";
import CommentModel from "../models/CommentModel.js";

class CommentController {
  addComment = async (req: Request, res: Response) => {
    try {
      const {
        articleId,
        rating,
        text,
      }: {
        articleId: string;
        rating: number;
        text: string;
      } = req.body;

      if (!rating) {
        return res.status(500).json({ message: "Укажите оценку!" });
      }

      const comment = await new CommentModel({
        from: req.userId,
        articleId,
        rating,
        text,
      });

      await comment.save();

      return res.json({ message: "Отзыв отправлен!" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Не удалось добавить отзыв. Попробуйте снова." });
    }
  };
}

export default CommentController;
