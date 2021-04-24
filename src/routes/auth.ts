import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import CreateUserDto from "../dto/register.dto";
import bcrypt from "bcryptjs";
import LoginUserDto from "../dto/login.dto";

const router = Router();

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser || usernameUser) {
      return next(new AppError(400, "email or password already exist"));
    }

    const user = User.create({ email, password, username });

    await user.save();

    res.status(201).json(user);
  }
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return next(new AppError(401, "Invalid login credential"));
    }

    return res.status(200).json(user);
  }
);

router.post("/register", validationMiddleware(CreateUserDto), register);

router.post('/login', validationMiddleware(LoginUserDto), login)

export { router as authRouter };
