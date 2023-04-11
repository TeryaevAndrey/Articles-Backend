import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { IUser } from "../types.js";

class AuthController {
  reg = async (req: Request, res: Response) => {
    try {
      const {
        email,
        userName,
        password,
        passwordRepeat,
      }: {
        email: string;
        userName: string;
        password: string;
        passwordRepeat: string;
      } = req.body;

      const candidate: IUser | null = await UserModel.findOne({ email });

      if (candidate) {
        return res
          .status(500)
          .json({ message: "Такой пользователь уже существует" });
      }

      if (!password) {
        return res.status(500).json({ message: "Введите пароль!" });
      }

      if (password === passwordRepeat) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await new UserModel({
          avatar: "/img/avatar.png",
          email,
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
            email,
            userName,
          },
          token,
        });
      }

      return res.status(500).json({
        message: "Пароли не совпадают!",
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Ошибка сервера", err: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const {
        emailOrUserName,
        password,
      }: {
        emailOrUserName: string;
        password: string;
      } = req.body;

      const user: IUser | null = await UserModel.findOne({
        $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Не удалось найти пользователя" });
      }

      if (!password) {
        return res.status(500).json({ message: "Введите пароль" });
      }

      const isMatch = bcrypt.compare(password, user.password!);

      if (!isMatch) {
        return res.status(500).json({ message: "Неверный пароль!" });
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
          email: user.email,
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
