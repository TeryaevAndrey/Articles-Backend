import mongoose, { Schema } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, require: true },
    banner: { type: String },
    elements: { type: Array, require: true },
    tags: { type: Array },
    views: { type: Number },
    from: { type: Schema.Types.ObjectId, require: true, ref: "User" },
  },
  { timestamps: true }
);

const ArticleModel = mongoose.model("Article", ArticleSchema);

export default mongoose.models.Article || ArticleModel;
