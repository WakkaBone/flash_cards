import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cardsApi from "./api/cards";
import authApi from "./api/auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { isAuth } from "./middleware";

config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

app.use("/api/auth/", authApi);
app.use("/api/cards/", isAuth, cardsApi);

export default app;
