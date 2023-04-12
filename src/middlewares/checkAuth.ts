import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Нет авторизации" });
      }

      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as JwtPayload;

      req.userId = await decoded.userId;

      return next();
    }
  } catch (err) {
    res.status(500).json({
      message: "Ошибка. Нет авторизации. Попробуйте перезагрузить страницу.",
    });
  }
};

export default checkAuth;
