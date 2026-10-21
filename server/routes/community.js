import rateLimit from "express-rate-limit";
import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { CommunityPost } from "../models/CommunityPost.js";
import { verifyTurnstile } from "../services/turnstile.js";
import { communityPostSchema } from "../validation/schemas.js";
import { HttpError } from "../utils/httpError.js";

export const communityRouter = Router();

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." }
});

communityRouter.get("/", async (req, res, next) => {
  try {
    const kind = ["review", "blog"].includes(req.query.kind) ? req.query.kind : undefined;
    const posts = await CommunityPost.find({ status: "published", ...(kind ? { kind } : {}) })
      .sort({ createdAt: -1 })
      .limit(60);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=240").json({ posts });
  } catch (error) {
    next(error);
  }
});

communityRouter.post("/", submissionLimiter, validateBody(communityPostSchema), async (req, res, next) => {
  try {
    if (req.body.website) return res.status(202).json({ message: "Submission received for review." });
    let expectedHostname;
    try { expectedHostname = new URL(req.get("origin")).hostname; } catch { expectedHostname = undefined; }
    await verifyTurnstile(req.body.turnstileToken, {
      remoteIp: req.ip,
      expectedAction: "community",
      expectedHostname
    });

    const post = await CommunityPost.create({
      kind: req.body.kind,
      authorName: req.body.authorName,
      title: req.body.kind === "blog" ? req.body.title : "",
      body: req.body.body,
      rating: req.body.kind === "review" ? req.body.rating : undefined,
      status: req.body.kind === "review" ? "published" : "pending"
    });
    res.status(201).json({
      message: post.status === "published" ? "Your review is now live." : "Your blog is awaiting admin review.",
      post: post.status === "published" ? post : undefined,
      postId: post.id
    });
  } catch (error) {
    next(error);
  }
});
