import asyncHandler from "express-async-handler";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import AppError from "../utils/appError";
import { User } from "../entities/User";

const protect = asyncHandler(
  async (_: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = res.locals.user;

    if (!user)
      return next(
        new AppError(
          404,
          "the user belonging to the token does no longer exist"
        )
      );
    return next();
  }
);

export { protect };
