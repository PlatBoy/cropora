import bcrypt from "bcryptjs";
import { Router } from "express";
import { requireAuth, signToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { User } from "../models/User.js";
import { Analysis } from "../models/Analysis.js";
import { DiseaseReport } from "../models/DiseaseReport.js";
import { InsuranceApplication } from "../models/InsuranceApplication.js";
import { LoanApplication } from "../models/LoanApplication.js";
import { MarketOrder } from "../models/MarketOrder.js";
import { activeFarmSchema, farmSchema, loginSchema, passwordChangeSchema, registerSchema } from "../validation/schemas.js";
import { HttpError } from "../utils/httpError.js";

export const authRouter = Router();

async function ensureFarmerFarm(user) {
  if (user.role !== "farmer") return;

  let changed = false;
  let createdLegacyFarm = false;
  if (!user.farms.length) {
    user.farms.push({ name: user.farmName || "My farm" });
    createdLegacyFarm = true;
    changed = true;
  }

  const activeFarm = user.farms.find((farm) => farm._id.toString() === user.activeFarmId) || user.farms[0];
  if (activeFarm) {
    if (user.activeFarmId !== activeFarm._id.toString() || user.farmName !== activeFarm.name) changed = true;
    user.activeFarmId = activeFarm._id.toString();
    user.farmName = activeFarm.name;
  }
  if (changed) await user.save();
  if (createdLegacyFarm) {
    const farm = user.farms[0];
    const legacyRecords = { user: user._id, $or: [{ farmId: { $exists: false } }, { farmId: "" }] };
    await Promise.all([
      Analysis.updateMany(legacyRecords, { $set: { farmId: farm._id.toString(), farmName: farm.name } }),
      DiseaseReport.updateMany(legacyRecords, { $set: { farmId: farm._id.toString(), farmName: farm.name } }),
      InsuranceApplication.updateMany(legacyRecords, { $set: { farmId: farm._id.toString(), farmName: farm.name } }),
      LoanApplication.updateMany(legacyRecords, { $set: { farmId: farm._id.toString(), farmName: farm.name } }),
      MarketOrder.updateMany(legacyRecords, { $set: { farmId: farm._id.toString(), farmName: farm.name } })
    ]);
  }
}

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) throw new HttpError(409, "Email is already registered");

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      farmName: req.body.farmName || "My farm",
      farms: [{ name: req.body.farmName || "My farm" }],
      phone: req.body.phone,
      role: "farmer"
    });
    user.activeFarmId = user.farms[0]._id.toString();
    await user.save();

    res.status(201).json({ token: signToken(user), user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
    if (!user || !user.isActive) throw new HttpError(401, "Invalid email or password");

    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) throw new HttpError(401, "Invalid email or password");

    await ensureFarmerFarm(user);

    res.json({ token: signToken(user), user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    await ensureFarmerFarm(req.user);
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/farms", requireAuth, validateBody(farmSchema), async (req, res, next) => {
  try {
    if (req.user.role !== "farmer") throw new HttpError(403, "Only farmer accounts can add farms");
    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(404, "User not found");

    user.farms.push(req.body);
    const farm = user.farms[user.farms.length - 1];
    user.activeFarmId = farm._id.toString();
    user.farmName = farm.name;
    await user.save();

    res.status(201).json({ user: user.toJSON(), farm: user.toJSON().farms.at(-1) });
  } catch (error) {
    next(error);
  }
});

authRouter.patch("/active-farm", requireAuth, validateBody(activeFarmSchema), async (req, res, next) => {
  try {
    if (req.user.role !== "farmer") throw new HttpError(403, "Only farmer accounts can switch farms");
    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(404, "User not found");

    const farm = user.farms.id(req.body.farmId);
    if (!farm) throw new HttpError(404, "Farm not found");

    user.activeFarmId = farm._id.toString();
    user.farmName = farm.name;
    await user.save();

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

authRouter.patch("/password", requireAuth, validateBody(passwordChangeSchema), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+passwordHash");
    if (!user) throw new HttpError(404, "User not found");

    const valid = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
    if (!valid) throw new HttpError(401, "Current password is incorrect");

    user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});
