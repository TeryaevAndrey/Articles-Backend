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

      return res.json({ message: "Комментарий отправлен!" });
    } catch (err) {
      return res.status(500).json({
        message: "Не удалось добавить Комментарий. Попробуйте снова.",
      });
    }
  };

  getComments = async (req: Request, res: Response) => {
    try {
      const { articleId }: { articleId: string } = req.body;

      const comments = await CommentModel.find({ articleId }).populate(
        "from",
        "-password"
      );

      if (!comments) {
        return res.status(404).json({ message: "Список комментариев пуст" });
      }

      return res.json({ comments });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка. Попробуйте перезагрузить страницу" });
    }
  };
}

export default CommentController;
