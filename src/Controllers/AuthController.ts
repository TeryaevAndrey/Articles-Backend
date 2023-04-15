import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { IUser } from "../types.js";

class AuthController {
  reg = async (req: Request, res: Response) => {
    try {
      const {
        userName,
        password,
        passwordRepeat,
      }: {
        userName: string;
        password: string;
        passwordRepeat: string;
      } = req.body;

      const candidate: IUser | null = await UserModel.findOne({ userName });

      if (candidate) {
        return res
          .status(500)
          .json({ message: "Такой пользователь уже существует" });
      }

      if (!userName) {
        return res.status(500).json({ message: "Введите имя пользователя!" });
      }

      if (!password) {
        return res.status(500).json({ message: "Введите пароль!" });
      }

      if (password === passwordRepeat) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await new UserModel({
          avatar: "/img/avatar.png",
          userName,
          password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign(
          { userId: user._id },
          process.env.SECRET_KEY as string,
          {
            expiresIn: "7d",
          }
        );

        return res.status(201).json({
          message: "Пользователь создан успешно!",
          userInfo: {
            userId: user._id,
            userName,
          },
          token,
        });
      }

      return res.status(500).json({
        message: "Пароли не совпадают!",
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const {
        userName,
        password,
      }: {
        userName: string;
        password: string;
      } = req.body;

      const user = await UserModel.findOne({
        userName,
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Не удалось найти пользователя" });
      }

      if (!password) {
        return res.status(500).json({ message: "Введите пароль" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль!" });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        message: "Вход выполнен успешно!",
        userInfo: {
          avatar: user.avatar,
          userName: user.userName,
        },
        token,
      });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default AuthController;
