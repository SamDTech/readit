import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth";
import dotenv from "dotenv";
import trim from "./middlewares/trim";
import errorMiddleware from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
dotenv.config();

app.use(trim);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);

// global Error Handler
app.use(errorMiddleware);

app.listen(4000, async () => {
  console.log("app running on PORT 5000");

  try {
    await createConnection();
    console.log("DB CONNECTED");
  } catch (error) {
    console.log(error);
  }
});
