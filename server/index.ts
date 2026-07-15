import dotenv from "dotenv";
import app from "./app.ts";
import { connectDB } from "./src/config/mongo.db.ts";
import { initDB } from "./src/config/mysql.db.ts";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await initDB();

    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error);
    process.exit(1);
  }
};

const init = async (): Promise<void> => {
  console.log("Initializing server...");
  startServer();
  try {
  } catch (error) {
    console.error("Error during server initialization:", error);
    process.exit(1);
  }
};

init().catch((_error) => {
  console.error("Unhandled error during initialization:", _error);
  process.exit(1);
});
