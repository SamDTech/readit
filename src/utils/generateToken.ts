import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import CreateUserDto from "../dto/register.dto";
import { User } from "../entities/User";

const signToken = (username: string) => {
  return jwt.sign(
    {
      username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// a function to send jwt and response
const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.username);
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: true,
    token,
    user,
  });
};

export default createSendToken;
