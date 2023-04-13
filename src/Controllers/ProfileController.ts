import UserModel from "../models/UserModel.js";
import { Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

class ProfileController {
  editProfile = async (req: Request, res: Response) => {
    try {
      const {
        email,
        userName,
        password,
        oldPassword,
      }: {
        email?: string;
        userName?: string;
        password?: string;
        oldPassword?: string;
      } = req.body;

      const avatar = req.file;

      const user = await UserModel.findOne({ _id: req.userId });

      let avatarFile = null;
      let matchedOldsPasswords: Promise<boolean> | boolean = false;
      let newHashedPassword: string = user.password;

      if (password) {
        newHashedPassword = await bcrypt.hash(password, 12);
      }

      if (oldPassword) {
        matchedOldsPasswords = await bcrypt.compare(oldPassword, user.password);
      } else {
        return res
          .status(404)
          .json({ message: "Введите старый пароль, чтобы его обновить" });
      }

      if (avatar) {
        avatarFile = await cloudinary.v2.uploader.upload(avatar.path, {
          folder: "articles-avatars",
        });
      }

      await UserModel.updateOne(
        { _id: req.userId },
        {
          avatar: avatar || user.avatar,
          email: email || user.email,
          userName: userName || user.userName,
          password: matchedOldsPasswords ? newHashedPassword : user.password,
        }
      );

      return res.json({ message: "Данные обновлены" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default ProfileController;
