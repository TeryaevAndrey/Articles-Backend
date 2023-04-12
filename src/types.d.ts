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
