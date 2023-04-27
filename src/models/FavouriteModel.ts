import mongoose, { Schema, model } from "mongoose";
import { IFavourite } from "../types.js";

const FavouriteSchema = new Schema<IFavourite>({
  userId: { type: String, require: true },
  articleId: { type: String, require: true, ref: "Article" },
});

const FavouriteModel = model("Favourite", FavouriteSchema);

export default mongoose.models.Favourite || FavouriteModel;
