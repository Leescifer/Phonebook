import dotenv from "dotenv";
import app from "./app.ts";
import { connectDB } from "./src/config/mongo.db.ts";
import { initDB } from "./src/config/mysql.db.ts";

console.log("Starting server initialization...");

dotenv.config();

console.log("Enviroment loaded, NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await initDB();

    const server = app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });

    (globalThis as typeof globalThis & { __server?: any }).__server = server;
  } catch (error) {
    console.error(" Server startup failed:", error);
    process.exit(1);
  }
};

const init = async (): Promise<void> => {
  console.log("Initializing server...");
  await startServer();
};

if (process.env.NODE_ENV !== "test") {
  init().catch((_error) => {
    console.error("Unhandled error during initialization:", _error);
    process.exit(1);
  });
}

export { app };
