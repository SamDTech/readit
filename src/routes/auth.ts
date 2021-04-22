import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import CreateUserDto from '../dto/user.dto';

const router = Router();

const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body;

  const emailUser = await User.findOne({ email });
  const usernameUser = await User.findOne({ username });

  if (emailUser || usernameUser) {
    return next(new AppError(400, "email or password already exist"))
  }

  const user = User.create({ email, password, username });

  const errors = await validate(user);
  if (errors.length > 0) return res.status(500).json({ errors });

  await user.save();

  res.status(201).json(user);
});

router.post("/register", validationMiddleware(CreateUserDto), register);

export { router as authRouter };
