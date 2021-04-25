import { NextFunction, Request, Response } from "express";

export default (req: Request, _: Response, next: NextFunction) => {
  const body = Object.keys(req.body);

  const exeptions = ["password"];

  body.forEach((key: string): void => {
    if (!exeptions.includes(key) && typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  });

  next();
};
