import { Router } from "express";
import { getAgricultureNews } from "../services/agricultureNews.js";

export const newsRouter = Router();

newsRouter.get("/", async (_req, res, next) => {
  try {
    const result = await getAgricultureNews();
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(result);
  } catch (error) {
    next(error);
  }
});
