import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/mongo.db.ts";
import { mysqlPool } from "./src/config/mysql.db.ts";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const SERVER_PORT = process.env.PORT;

const startServer = () => {
  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
