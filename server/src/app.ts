import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import {
  authApi,
  cardsApi,
  categoriesApi,
  statisticsApi,
  usersApi,
  versionApi,
} from "./api";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { isAuth } from "./middleware";
import { APIS } from "./constants";
import { patchDbController } from "./controllers/patch-db-controller";

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

const apiPrefix = "api";

app.use(`/${apiPrefix}/${APIS.auth}/`, authApi);
app.use(`/${apiPrefix}/${APIS.cards}/`, isAuth, cardsApi);
app.use(`/${apiPrefix}/${APIS.statistics}/`, isAuth, statisticsApi);
app.use(`/${apiPrefix}/${APIS.categories}/`, isAuth, categoriesApi);
app.use(`/${apiPrefix}/${APIS.users}/`, isAuth, usersApi);
app.use(`/${apiPrefix}/${APIS.version}/`, versionApi);

app.patch(`/${apiPrefix}/patch`, isAuth, patchDbController);

export default app;
