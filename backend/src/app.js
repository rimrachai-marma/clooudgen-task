import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes/index.js";
import { routeNotFound, errorHandler } from "./middlewares/errorHandler.js";

//App Config
const app = express();

//Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || true,
    credentials: process.env.CORS_CREDENTIALS === "true",
  })
);
// Trust proxy (important for rate limiting behind load balancer)
app.set("trust proxy", 1);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // for dev purpose
  app.use((req, res, next) => {
    const delay = 1000; // delay in milliseconds
    setTimeout(() => {
      next();
    }, delay);
  });
}

app.use("/", routes);

app.use(routeNotFound);
app.use(errorHandler);

export default app;
