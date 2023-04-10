import { Schema, model, models } from "mongoose";
import { IUser } from "../types.js";

const UserSchema = new Schema<IUser>(
  {
    _id: { type: Schema.Types.ObjectId, require: true },
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

export default models.User || UserModel;
