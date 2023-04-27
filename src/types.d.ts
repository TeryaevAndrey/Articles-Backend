import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

interface IUser {
  _id: ObjectId;
  avatar: string;
  email: string;
  userName: string;
  password?: string;
}

interface IComment {
  _id: ObjectId;
  from: ObjectId;
  articleId: ObjectId;
  rating: number;
  text?: string;
}

interface IFavourite {
  _id: ObjectId,
  userId: ObjectId, 
  articleId: ObjectId
}