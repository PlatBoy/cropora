import mongoose from "mongoose";

const farmTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    farmId: { type: String, trim: true, required: true, index: true },
    farmName: { type: String, trim: true, maxlength: 160, required: true },
    title: { type: String, trim: true, maxlength: 160, required: true },
    crop: { type: String, trim: true, maxlength: 120, default: "" },
    category: {
      type: String,
      enum: ["sowing", "irrigation", "fertilizer", "scouting", "harvest", "other"],
      default: "other"
    },
    dueDate: { type: Date, required: true, index: true },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: ["planned", "completed"], default: "planned", index: true },
    actualCost: { type: Number, min: 0, max: 100000000, default: 0 },
    harvestQuantity: { type: Number, min: 0, max: 100000000, default: 0 },
    harvestUnit: { type: String, enum: ["kg", "quintal", "tonne"], default: "quintal" },
    saleProceeds: { type: Number, min: 0, max: 1000000000, default: 0 },
    completedAt: Date
  },
  { timestamps: true }
);

farmTaskSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const FarmTask = mongoose.model("FarmTask", farmTaskSchema);
