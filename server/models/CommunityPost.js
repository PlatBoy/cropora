import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["review", "blog"], required: true, index: true },
    authorName: { type: String, required: true, trim: true, maxlength: 80 },
    title: { type: String, trim: true, maxlength: 140, default: "" },
    body: { type: String, required: true, trim: true, maxlength: 1800 },
    rating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ["pending", "published", "rejected"], default: "pending", index: true },
    reviewedAt: Date
  },
  { timestamps: true }
);

communityPostSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
