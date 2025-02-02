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
  origin: "http://localhost:3000", //TODO make conditional
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

app.use("/api/auth/", authApi);
app.use("/api/cards/", isAuth, cardsApi); //TODO add middleware to check auth cookie

export default app;
