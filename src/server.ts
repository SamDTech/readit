import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import { User } from "./entities/User";
import { authRouter } from "./routes/auth";
import trim from "./middlewares/trim";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use(trim)

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);

app.listen(4000, async () => {
  console.log("app running on PORT 5000");

  try {
    await createConnection();
    console.log("DB CONNECTED");
  } catch (error) {
    console.log(error);
  }
});
