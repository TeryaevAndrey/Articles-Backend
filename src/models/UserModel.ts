import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../types.js";

const UserSchema = new Schema<IUser>(
  {
    avatar: { type: String, require: false },
    email: { type: String, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export default mongoose.models.User || UserModel;
