import { Response, Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { getRepository } from "typeorm";

import { Sub } from "../entities/Sub";

import { protect } from "../middlewares/currentUser";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import { createSubDto } from "../dto/sub.dto";
import { User } from "../entities/User";
import { user } from "../middlewares/user";
import { Post } from "../entities/Post";

const createSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, name, description } = req.body;

    const user: User = res.locals.user;

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) {
      return next(new AppError(400, "Sub exists already"));
    }

    const newSub = Sub.create({ title, name, user, description });

    await newSub.save();

    res.status(201).json(newSub);
  }
);

const getSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const sub = await Sub.findOne({ name });

    if (!sub) {
      return next(new AppError(404, "sub not found"));
    }

    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });

    if (!posts) {
        return next(new AppError(404, "posts not available yet"));
    }

    sub.posts = posts;

    if (res.locals.user) {
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    }

    res.status(200).json(sub);
  }
);

const router = Router();

router.post("/", validationMiddleware(createSubDto), user, protect, createSub);
router.get("/:name", user, getSub);

export { router as subRouter };
