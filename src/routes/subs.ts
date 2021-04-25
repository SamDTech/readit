import { Response, Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { getRepository } from "typeorm";

import { Sub } from "../entities/Sub";

import { protect } from "../middlewares/currentUser";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import { createSubDto } from "../dto/sub.dto";

const createSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, name, description } = req.body;

    const user = req.currentUser;

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

const router = Router();

router.post("/", validationMiddleware(createSubDto), protect, createSub);

export { router as subRouter };
