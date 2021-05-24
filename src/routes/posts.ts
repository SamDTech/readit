import { Response, Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { createPostDto } from "../dto/post.dto";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { protect } from "../middlewares/currentUser";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import { Comment } from "../entities/Comment";
import { user } from "../middlewares/user";

const createPost = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { title, body, sub } = req.body;

    const user = res.locals.user;

    // TODO: FIND SUBS
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = Post.create({ title, body, user, sub: subRecord });

    await post.save();

    res.status(201).json(post);
  }
);

const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postPerPage: number = (req.query.count || 8) as number;

  const posts = await Post.find({
    order: { createdAt: "DESC" },
    relations: ["comments", "votes", "sub"],
    skip: currentPage * postPerPage,
    take: postPerPage,
  });

  console.log(res.locals.user);

  if (res.locals.user) posts.forEach((p) => p.setUserVote(res.locals.user));

  res.status(200).json(posts);
});

const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    console.log("IDENTIFIER", identifier);

    console.log("SLUG", slug);

    const post = await Post.findOne(
      { slug, identifier },
      { relations: ["sub", "votes", "comments"] }
    );

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    res.status(200).json(post);
  }
);

const commentsOnPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;
    const user = res.locals.user;

    const post = await Post.findOne({ identifier, slug });

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    const comment = Comment.create({ body, user, post });

    await comment.save();

    res.status(201).json(comment);
  }
);

const getPostComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOne({ identifier, slug });

    if (!post) {
      return next(new AppError(404, "Post not Found"));
    }

    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });

    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }

    res.status(200).json(comments);
  }
);

const router = Router();

router.post(
  "/",
  validationMiddleware(createPostDto),
  user,
  protect,
  createPost
);

router.get("/", user, getPosts);

router.get("/:identifier/:slug", user, getPost);
router.get("/:identifier/:slug/comments", user, getPostComments);
router.post("/:identifier/:slug/comments", user, protect, commentsOnPost);

export { router as postRouter };
