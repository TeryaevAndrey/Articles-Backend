import mongoose, { Schema } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: {type: String, require: true},
    elements: { type: Array, require: true },
    tags: { type: Array },
    from: { type: Schema.Types.ObjectId, require: true, ref: "User" },
  },
  { timestamps: true }
);

const ArticleModel = mongoose.model("Article", ArticleSchema);

export default mongoose.models.Article || ArticleModel;
