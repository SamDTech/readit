import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { User } from "../entities/User";

const user = asyncHandler(
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
      return next( );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const currentUser = await User.findOne({ username: decoded.username });



    res.locals.user = currentUser;

    next();
  }
);

export { user };
