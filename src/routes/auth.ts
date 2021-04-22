import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entities/User";

const router = Router();

const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const emailUser = await User.findOne({ email });
  const usernameUser = await User.findOne({ username });

  if (emailUser || usernameUser) {
    return res.status(400).json({ message: "email or username already exist" });
  }

  const user = User.create({ email, password, username });

  const errors = await validate(user);
  if (errors.length > 0) return res.status(500).json({ errors });

  await user.save();

  res.status(201).json(user);
});

router.post("/register", register);

export { router as authRouter };
