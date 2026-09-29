import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { FarmTask } from "../models/FarmTask.js";
import { farmTaskSchema, farmTaskStatusSchema } from "../validation/schemas.js";
import { HttpError } from "../utils/httpError.js";

export const tasksRouter = Router();

function getFarm(req) {
  const farmId = req.body?.farmId || req.query.farmId || req.user.activeFarmId || "";
  const farm = farmId ? req.user.farms?.id?.(farmId) : null;
  if (!farm) throw new HttpError(404, "Farm not found");
  return farm;
}

function ensureFarmer(req) {
  if (req.user.role !== "farmer") throw new HttpError(403, "Only farmer accounts can manage farm tasks");
}

tasksRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    ensureFarmer(req);
    const farm = getFarm(req);
    const tasks = await FarmTask.find({ user: req.user._id, farmId: farm._id.toString() })
      .sort({ status: 1, dueDate: 1, createdAt: -1 })
      .limit(100);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

tasksRouter.post("/", requireAuth, validateBody(farmTaskSchema), async (req, res, next) => {
  try {
    ensureFarmer(req);
    const farm = getFarm(req);
    const task = await FarmTask.create({
      user: req.user._id,
      farmId: farm._id.toString(),
      farmName: farm.name,
      title: req.body.title,
      crop: req.body.crop,
      category: req.body.category,
      dueDate: req.body.dueDate,
      notes: req.body.notes
    });
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

tasksRouter.patch("/:id/status", requireAuth, validateBody(farmTaskStatusSchema), async (req, res, next) => {
  try {
    ensureFarmer(req);
    const farm = getFarm(req);
    const task = await FarmTask.findOne({ _id: req.params.id, user: req.user._id, farmId: farm._id.toString() });
    if (!task) throw new HttpError(404, "Task not found");
    task.status = req.body.status;
    task.completedAt = req.body.status === "completed" ? new Date() : undefined;
    await task.save();
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    ensureFarmer(req);
    const farm = getFarm(req);
    const task = await FarmTask.findOneAndDelete({ _id: req.params.id, user: req.user._id, farmId: farm._id.toString() });
    if (!task) throw new HttpError(404, "Task not found");
    res.json({ message: "Task removed" });
  } catch (error) {
    next(error);
  }
});
