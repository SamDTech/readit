import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth";
import dotenv from "dotenv";
import trim from "./middlewares/trim";
import errorMiddleware from "./middlewares/errorHandler";
import { postRouter } from "./routes/posts";
import { subRouter } from "./routes/subs";
import { miscRouter } from "./routes/misc";

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: process.env.ORIGIN, optionsSuccessStatus: 200 }));

app.use(cookieParser());

app.use(trim);

const PORT = process.env.PORT || 4000;

app.get("/", (_, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/subs", subRouter);
app.use('/api/misc', miscRouter)

// global Error Handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`app running on PORT ${PORT}`);

  try {
    await createConnection();
    console.log("DB CONNECTED");
  } catch (error) {
    console.log(error);
  }
});
