import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cardsApi from "./api/cards";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

app.use("/api/cards/", cardsApi);

export default app;
