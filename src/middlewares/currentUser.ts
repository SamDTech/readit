import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import AppError from "../utils/appError";
import { User } from "../entities/User";


const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
     let token: string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }



    if (!token!) {
      return next(
        new AppError(401, "You are not logged In! Please login to get access")
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const currentUser = await User.findOne({ username: decoded.username });

    if (!currentUser) {
      return next(
        new AppError(
          401,
          "the user belonging to the token does no longer exist"
        )
      );
    }

    res.locals.user = currentUser;

    next();
  }
);

export { protect };
