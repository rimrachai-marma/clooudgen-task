import app from "./src/app.js";
import connect_db from "./src/config/database.js";

(async () => {
  try {
    // Connect to database
    await connect_db();

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
