import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cardsApi from "./api/cards";
import authApi from "./api/auth";
import versionApi from "./api/version";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { isAuth } from "./middleware";
import { APIS } from "./constants";

config();

const app = express();

const corsOptions = {
  origin: [process.env.CLIENT_ORIGIN || "http://localhost:3001"],
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

app.use(`/api/${APIS.auth}/`, authApi);
app.use(`/api/${APIS.cards}/`, isAuth, cardsApi);
app.use(`/api/${APIS.version}/`, versionApi);

export default app;
