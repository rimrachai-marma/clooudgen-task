import app from "./src/app.js";
import connect_db from "./src/config/database.js";
import { logger } from "./src/utilities/logger.js";
import redisService from "./src/services/redis/index.js";

(async () => {
  try {
    // Connect to database
    await connect_db();

    // Initialize Redis services
    await redisService.initialize().catch((error) => {
      logger.error("Failed to initialize Redis:", error);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully");
      await redisService.shutdown();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received, shutting down gracefully");
      await redisService.shutdown();
      process.exit(0);
    });

    // Start server after successful DB connection
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(
        `Server running on PORT \x1b[1m${PORT}\x1b[0m\n  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m\t\x1b[36mhttp://localhost:${PORT}\x1b[0m`
      )
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
})();
