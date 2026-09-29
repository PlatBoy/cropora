import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, trim: true, maxlength: 160, default: "" },
    landArea: { type: String, trim: true, maxlength: 40, default: "" },
    landUnit: { type: String, enum: ["acre", "hectare", "bigha"], default: "acre" },
    primaryCrop: { type: String, trim: true, maxlength: 120, default: "" }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["farmer", "admin"], default: "farmer", index: true },
    farmName: { type: String, trim: true, maxlength: 160, default: "" },
    farms: { type: [farmSchema], default: [] },
    activeFarmId: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, maxlength: 40, default: "" },
    walletBalance: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
    ret.farms = (ret.farms || []).map((farm) => ({
      ...farm,
      id: farm._id?.toString?.() || farm.id,
      _id: undefined
    }));
    return ret;
  }
});

export const User = mongoose.model("User", userSchema);
