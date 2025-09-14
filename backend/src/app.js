import express from "express";
import morgan from "morgan";
import cors from "cors";

import { routeNotFound, errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";

//App Config
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// Routes
app.get("/", (req, res) => res.json({ message: "✅ Server is healthy" }));
app.use("/api/users", userRoutes);

app.use(routeNotFound);
app.use(errorHandler);

export default app;
