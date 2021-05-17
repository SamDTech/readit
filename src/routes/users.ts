import asyncHandler from "express-async-handler";
import { Request, Router, Response } from "express";

import { user } from "../middlewares/user";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

const getUserSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { username: req.params.username },
    select: ["username", "createdAt"],
  });

  const posts = await Post.find({
    where: { user },
    relations: ["votes", "comments", "sub"],
  });

  const comments = await Comment.find({
    where: { user },
    relations: ["post"],
  });

  if (res.locals.user) {
    posts.forEach((post) => post.setUserVote(res.locals.user));
    comments.forEach((comment) => comment.setUserVote(res.locals.user));
  }

  let submissions: any = [];
  posts.forEach((post) => submissions.push({ type: "Post", ...post.toJSON() }));
  comments.forEach((comment) =>
    submissions.push({ type: "Comment", ...comment.toJSON() })
  );

  submissions.sort((a: any, b: any) => {
    if (b.createdAt > a.createdAt) return 1;

    if (b.createdAt < a.createdAt) return -1;

    return 0;
  });

  res.status(200).json({ user, submissions });
});

const router = Router();

router.get("/:username", user, getUserSubmissions);

export { router as userRouter };
