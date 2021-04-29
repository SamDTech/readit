import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { User } from "../entities/User";

const user = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {


    // console.log(req.cookies.token)

  const token = req.cookies.token;


    console.log(token)

    if (!token) {
      return next();
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const currentUser = await User.findOne({ username: decoded.username });



    res.locals.user = currentUser;

    next();
  }
);

export { user };
