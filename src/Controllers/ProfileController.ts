import UserModel from "../models/UserModel.js";
import { Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

class ProfileController {
  editProfile = async (req: Request, res: Response) => {
    try {
      const {
        userName,
        password,
        oldPassword,
      }: {
        userName: string;
        password: string;
        oldPassword: string;
      } = req.body;

      const avatar = req.file;

      const user = await UserModel.findOne({ _id: req.userId });

      let avatarPath: string = user.avatar;
      let matchedOldsPasswords: Promise<boolean> | boolean = false;
      let newHashedPassword: string = user.password;

      if (avatar) {
        const result = await cloudinary.v2.uploader.upload(avatar.path, {
          folder: "articles-avatars",
        });

        avatarPath = result.secure_url;
      }

      if (password) {
        newHashedPassword = await bcrypt.hash(password, 12);
      }

      if (oldPassword) {
        matchedOldsPasswords = await bcrypt.compare(oldPassword, user.password);
      }

      if (password && !oldPassword) {
        return res
          .status(404)
          .json({ message: "Введите старый пароль, чтобы обновить" });
      }

      if (password && oldPassword) {
        if (matchedOldsPasswords === false) {
          return res.status(500).json({ message: "Пароли не совпадают!" });
        }
      }

      await UserModel.updateOne(
        { _id: req.userId },
        {
          avatar: avatarPath || user.avatar,
          userName: userName || user.userName,
          password: matchedOldsPasswords ? newHashedPassword : user.password,
        }
      );

      return res.json({ message: "Данные обновлены" });
    } catch (err: any) {
      return res.status(500).json({ message: "Ошибка сервера", err: err });
    }
  };

  getMyData = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ _id: req.userId }).select(
        "-password"
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Не удалось найти пользователя" });
      }

      return res.json({ user: user });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Не удалось получить ваши данные. Перезагрузите страницу",
        });
    }
  };
}

export default ProfileController;
