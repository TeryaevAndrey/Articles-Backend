import mongoose, { Schema, model } from "mongoose";
import { IComment } from "../types.js";

const CommentSchema = new Schema<IComment>({
  from: { type: Schema.Types.ObjectId, require: true, ref: "User" },
  articleId: { type: Schema.Types.ObjectId, require: true },
  rating: { type: Number, require: true },
  text: { type: String },
});

const UserModel = model("Comment", CommentSchema);

export default mongoose.models.Comment || UserModel;
