import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// In production, restrict CORS to the explicit allow-list in CORS_ORIGIN
// (comma-separated URLs).  In development, allow any origin for convenience.
const corsOrigin: string | boolean | string[] =
  process.env.NODE_ENV === "production" && process.env.CORS_ORIGIN
    ? // support multiple comma-separated origins
      process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).length === 1
      ? process.env.CORS_ORIGIN.trim()
      : process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : true;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser(process.env.SESSION_SECRET || "ctv_default_secret"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
