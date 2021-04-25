import { Response, Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { createPostDto } from "../dto/post.dto";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { protect } from "../middlewares/currentUser";
import validationMiddleware from "../middlewares/validationMiddleware";

const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body, sub } = req.body;

    const user = req.currentUser;

    // TODO: FIND SUBS
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = Post.create({ title, body, user, sub: subRecord });

    await post.save();

    res.status(201).json(post);
  }
);

const router = Router();

router.post("/", validationMiddleware(createPostDto), protect, createPost);

export { router as postRouter };
