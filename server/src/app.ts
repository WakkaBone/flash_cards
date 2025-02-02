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

const corsOptions = {
  origin: [process.env.CLIENT_ORIGIN, "http://192.168.50.195:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

app.use("/api/auth/", authApi);
app.use("/api/cards/", isAuth, cardsApi);

export default app;
