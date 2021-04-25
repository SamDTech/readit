import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";
import validationMiddleware from "../middlewares/validationMiddleware";
import AppError from "../utils/appError";
import CreateUserDto from "../dto/register.dto";
import bcrypt from "bcryptjs";

import LoginUserDto from "../dto/login.dto";
import createSendToken from "../utils/generateToken";
import { protect } from "../middlewares/currentUser";

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

    createSendToken(user, 201, res);
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

    // generate Token

    createSendToken(user, 200, res);
  }
);

const me = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(req.currentUser);
  }
);

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
  });
});

router.post("/register", validationMiddleware(CreateUserDto), register);
router.post("/login", validationMiddleware(LoginUserDto), login);
router.get("/me", protect, me);
router.get("/logout", protect, logout);
export { router as authRouter };
