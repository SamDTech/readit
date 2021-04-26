import { Response, Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { createPostDto } from "../dto/post.dto";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { protect } from "../middlewares/currentUser";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";

const createPost = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { title, body, sub } = req.body;

    const user = req.currentUser;

    // TODO: FIND SUBS
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = Post.create({ title, body, user, sub: subRecord });

    await post.save();

    res.status(201).json(post);
  }
);

const getPosts = asyncHandler(async (_: Request, res: Response) => {
  const posts = await Post.find({
    order: { createdAt: "DESC" },
  });

  res.status(200).json(posts);
});

const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOne(
      { identifier, slug },
      { relations: ["sub"] }
    );

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    res.status(200).json(post);
  }
);

const router = Router();

router.post("/", validationMiddleware(createPostDto), protect, createPost);

router.get("/", getPosts);

router.get("/:identifier/:slug", getPost);

export { router as postRouter };
